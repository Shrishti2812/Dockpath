const dns = require("node:dns/promises");
const net = require("node:net");
const cheerio = require("cheerio");

const maxPageBytes = 2 * 1024 * 1024;
const maxPages = 5;
const maxCombinedChars = 30000;
class ServiceError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function isPublicAddress(address) {
  const version = net.isIP(address);

  if (version === 4) {
    const octets = address.split(".").map(Number);
    const value = octets.reduce((total, octet) => total * 256 + octet, 0);
    const blockedRanges = [
      ["0.0.0.0", 8],
      ["10.0.0.0", 8],
      ["100.64.0.0", 10],
      ["127.0.0.0", 8],
      ["169.254.0.0", 16],
      ["172.16.0.0", 12],
      ["192.0.0.0", 24],
      ["192.0.2.0", 24],
      ["192.168.0.0", 16],
      ["198.18.0.0", 15],
      ["198.51.100.0", 24],
      ["203.0.113.0", 24],
      ["224.0.0.0", 4],
      ["240.0.0.0", 4],
    ];

    return !blockedRanges.some(([network, prefix]) => {
      const base = network.split(".").map(Number)
        .reduce((total, octet) => total * 256 + octet, 0);
      const mask = (0xffffffff << (32 - prefix)) >>> 0;
      return (value & mask) === (base & mask);
    });
  }

  if (version === 6) {
    const normalized = address.toLowerCase();
    const firstHextet = Number.parseInt(normalized.split(":")[0], 16);

    return firstHextet >= 0x2000 &&
      firstHextet <= 0x3fff &&
      !normalized.startsWith("2001:db8:") &&
      !normalized.startsWith("2001:0db8:");
  }

  return false;
}

async function validatePublicUrl(value) {
  let url;

  try {
    url = new URL(value);
  } catch {
    throw new ServiceError(400, "documentationUrl must be a valid URL.");
  }

  if (!["http:", "https:"].includes(url.protocol) || url.username || url.password) {
    throw new ServiceError(400, "documentationUrl must be a public HTTP or HTTPS URL.");
  }

  const hostname = url.hostname.toLowerCase();
  if (
    hostname === "localhost" ||
    hostname.endsWith(".localhost") ||
    hostname.endsWith(".local") ||
    hostname.endsWith(".internal")
  ) {
    throw new ServiceError(400, "documentationUrl must point to a public website.");
  }

  const addressHost = hostname.startsWith("[") && hostname.endsWith("]")
    ? hostname.slice(1, -1)
    : hostname;
  let addresses;

  try {
    addresses = net.isIP(addressHost)
      ? [{ address: addressHost }]
      : await dns.lookup(addressHost, { all: true });
  } catch {
    throw new ServiceError(400, "documentationUrl hostname could not be resolved.");
  }

  if (!addresses.length || addresses.some(({ address }) => !isPublicAddress(address))) {
    throw new ServiceError(400, "documentationUrl must point to a public website.");
  }

  return url;
}

async function readPage(url) {
  for (let redirects = 0; redirects <= 5; redirects += 1) {
    let response;

    try {
      response = await fetch(url, {
        headers: { "User-Agent": "DocPath-Prototype/1.0" },
        redirect: "manual",
        signal: AbortSignal.timeout(10000),
      });
    } catch {
      throw new ServiceError(502, "Unable to fetch documentation page.");
    }

    if ([301, 302, 303, 307, 308].includes(response.status)) {
      const location = response.headers.get("location");
      if (!location || redirects === 5) {
        throw new ServiceError(502, "Documentation page redirected too many times.");
      }

      url = await validatePublicUrl(new URL(location, url).toString());
      continue;
    }

    if (!response.ok) {
      throw new ServiceError(
        502,
        `Documentation site returned status ${response.status}.`,
      );
    }

    const contentLength = Number(response.headers.get("content-length"));
    if (contentLength > maxPageBytes) {
      throw new ServiceError(413, "Documentation page is too large.");
    }

    const chunks = [];
    let totalBytes = 0;

    for await (const chunk of response.body) {
      totalBytes += chunk.length;
      if (totalBytes > maxPageBytes) {
        throw new ServiceError(413, "Documentation page is too large.");
      }
      chunks.push(chunk);
    }

return {
  html: Buffer.concat(chunks).toString("utf8"),
  finalUrl: url,
};
  }

  throw new ServiceError(502, "Unable to fetch documentation page.");
}


async function fetchAndExtract(value) {
  const validatedUrl = await validatePublicUrl(value);
  const { html, finalUrl } = await readPage(validatedUrl);
  const $ = cheerio.load(html);

  // Collect links BEFORE removing navigation and header elements.
  const links = $("a[href]")
    .map((_, element) => {
      const href = $(element).attr("href");

      if (!href) return null;

      try {
        const linkUrl = new URL(href, finalUrl);

        // Only collect HTTP/HTTPS links from the same website.
        if (
          !["http:", "https:"].includes(linkUrl.protocol) ||
          linkUrl.hostname !== finalUrl.hostname
        ) {
          return null;
        }

        // Ignore links pointing to page sections.
        linkUrl.hash = "";

        return {
          text:
            $(element).text().trim() ||
            $(element).attr("aria-label") ||
            $(element).attr("title") ||
            "",
          url: linkUrl.toString(),
        };
      } catch {
        return null;
      }
    })
    .get()
    .filter(Boolean);

  // Remove duplicate links.
  const uniqueLinks = [
    ...new Map(links.map(link => [link.url, link])).values(),
  ];

  // Remove irrelevant HTML elements before extracting content.
  $("script, style, nav, footer, header").remove();

  const headings = $("h1, h2, h3")
    .map((_, element) => $(element).text().trim())
    .get();

  const content = $("main").text().replace(/\s+/g, " ").trim();

  if (!content) {
    throw new ServiceError(
      422,
      "No main documentation content could be extracted."
    );
  }

  return {
    url: finalUrl.toString(),
    headings,
    content,
    links: uniqueLinks,
  };
}

function selectRelevantLinks(links, learningGoal, rootUrl) {
  const stopWords = new Set([
    "want", "learn", "understand", "know",
    "about", "from", "with", "that", "this",
    "the", "and", "for", "how", "can",
    "into", "using", "use",
  ]);

  const keywords = learningGoal
    .toLowerCase()
    .split(/[^a-z0-9]+/)
    .filter(word => word.length > 2 && !stopWords.has(word));

  const root = new URL(rootUrl);

  return links
    .filter(link => {
      const linkUrl = new URL(link.url);

      return (
        linkUrl.hostname === root.hostname &&
        linkUrl.href !== root.href
      );
    })
    .map(link => {
      const text = link.text.toLowerCase();
      const path = new URL(link.url).pathname.toLowerCase();

      const score = keywords.reduce((total, word) => {
        return (
          total +
          (text.includes(word) ? 2 : 0) +
          (path.includes(word) ? 3 : 0)
        );
      }, 0);

      return { ...link, score };
    })
    .filter(link => link.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, maxPages - 1);
}

async function fetchDocumentation(value, learningGoal) {
  const mainPage = await fetchAndExtract(value);

  const pages = [
    {
      url: mainPage.url,
      headings: mainPage.headings,
content: mainPage.content.slice(0, maxCombinedChars),
    },
  ];

  const visitedUrls = new Set([mainPage.url]);

  const selectedLinks = selectRelevantLinks(
    mainPage.links,
    learningGoal,
    mainPage.url,
  );

let totalChars = Math.min(
  mainPage.content.length,
  maxCombinedChars,
);
  for (const link of selectedLinks) {
    if (pages.length >= maxPages) break;

    try {
      const validatedUrl = await validatePublicUrl(link.url);
      const normalizedUrl = validatedUrl.toString();

      if (visitedUrls.has(normalizedUrl)) continue;

      visitedUrls.add(normalizedUrl);

      const page = await fetchAndExtract(normalizedUrl);

      const remainingChars = maxCombinedChars - totalChars;

      if (remainingChars <= 0) break;

      const pageContent = page.content.slice(0, remainingChars);

      pages.push({
        url: page.url,
        headings: page.headings,
        content: pageContent,
      });

      totalChars += pageContent.length;
 } catch (error) {
  // A child page failing should not stop the other pages.
  continue;
}
  }
console.log(
  "Fetched documentation pages:",
  pages.map(page => ({
    url: page.url,
    headings: page.headings,
    contentLength: page.content.length,
  }))
);
  return {
    pages,
    headings: pages.flatMap(page => page.headings),
    content: pages
      .map(page => page.content)
      .join("\n\n")
      .slice(0, maxCombinedChars),
  };
}
module.exports = { fetchAndExtract,fetchDocumentation };
