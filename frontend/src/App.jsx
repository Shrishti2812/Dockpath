
import { useState } from 'react'
import { createLearningPath } from './services/learningPathApi'

const stages = [
  {
    number: '01',
    label: 'START HERE',
    card: 'border-[#D5DFF1] bg-[#EEF2FA]',
    numberStyle: 'bg-[#263B65] text-white',
    badge: 'bg-[#DCE5F5] text-[#334D8C]',
  },
  {
    number: '02',
    label: 'BUILD UNDERSTANDING',
    card: 'border-[#D5DFF1] bg-[#E9EEF9]',
    numberStyle: 'bg-[#4969A8] text-white',
    badge: 'bg-[#D8E2F5] text-[#334D8C]',
  },
  {
    number: '03',
    label: 'GO DEEPER',
    card: 'border-[#C9D5ED] bg-[#E4EAF7]',
    numberStyle: 'bg-[#334D8C] text-white',
    badge: 'bg-[#D4DEF2] text-[#263B65]',
  },
]

function App() {
  const [documentationUrl, setDocumentationUrl] = useState('https://react.dev/learn')
  const [learningGoal, setLearningGoal] = useState('')
  const [learningPath, setLearningPath] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(event) {
    event.preventDefault()

    setError('')
    setLearningPath([])
    setIsLoading(true)

    try {
      const path = await createLearningPath({
        documentationUrl,
        learningGoal,
      })

      setLearningPath(path)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#F4F5F8] text-slate-800">

      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-14 max-w-[1440px] items-center justify-between px-5 lg:px-10">

          <a href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#263B65] text-lg font-bold text-white">
              d
            </span>

            <span className="text-lg font-bold tracking-tight text-slate-900">
              dock<span className="text-[#4969A8]">path</span>
            </span>
          </a>

          <p className="hidden text-sm text-slate-500 sm:block">
            Navigate documentation with purpose.
          </p>

          <span className="rounded-full border border-[#DCE5F5] bg-[#EEF2FA] px-3 py-1 text-xs font-semibold text-[#334D8C]">
            AI documentation guide
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-5 pb-6 pt-5 lg:px-10">

        {/* Introduction */}
        <section className="mb-5 max-w-3xl">
          <p className="mb-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#4969A8]">
            Less searching. More learning.
          </p>

          <h1 className="max-w-2xl text-2xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-3xl">
            Stop getting lost in documentation.
            <span className="text-[#334D8C]">
              {' '}Start learning with a plan.
            </span>
          </h1>

          <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-600">
            Official documentation can contain dozens of pages and hundreds
            of sections. Dockpath understands what you're trying to learn,
            finds relevant sections, and arranges them into a simple
            three-step reading path — so you know exactly where to start
            and what to read next.
          </p>
        </section>

        {/* Input Form */}
        <section className="mb-5 rounded-xl border border-[#D5DFF1] bg-[#E9EEF9] p-4 sm:p-5">

          <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-lg font-semibold text-[#263B65]">
                Build your learning path
              </h2>

              <p className="mt-0.5 text-xs text-slate-600">
                Tell us where you're learning from and what you want to understand.
              </p>
            </div>

            <span className="rounded-full bg-white/80 px-3 py-1 text-[11px] font-semibold text-[#334D8C]">
              Two simple inputs
            </span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="grid gap-3 md:grid-cols-2">

              {/* Documentation URL */}
              <div>
                <label
                  htmlFor="documentationUrl"
                  className="mb-1.5 block text-xs font-semibold text-[#263B65]"
                >
                  01. Documentation website
                </label>

                <input
                  id="documentationUrl"
                  type="url"
                  value={documentationUrl}
                  onChange={event => setDocumentationUrl(event.target.value)}
                  placeholder="https://react.dev/learn"
                  required
                  className="w-full rounded-lg border border-[#D5DCE9] bg-white px-3 py-2.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-[#4969A8] focus:ring-2 focus:ring-[#DCE5F5]"
                />

                <p className="mt-1.5 text-[11px] text-slate-500">
                  Paste a page from the official documentation.
                </p>
              </div>

              {/* Learning Goal */}
              <div>
                <label
                  htmlFor="learningGoal"
                  className="mb-1.5 block text-xs font-semibold text-[#263B65]"
                >
                  02. Your learning goal
                </label>

                <textarea
                  id="learningGoal"
                  value={learningGoal}
                  onChange={event => setLearningGoal(event.target.value)}
                  placeholder="For example: I want to understand React hooks, how state works, and how to use effects in a project."
                  maxLength={1000}
                  rows={2}
                  required
                  className="w-full resize-y rounded-lg border border-[#D5DCE9] bg-white px-3 py-2.5 text-sm leading-5 outline-none transition placeholder:text-slate-400 focus:border-[#4969A8] focus:ring-2 focus:ring-[#DCE5F5]"
                />

                <div className="mt-1 flex justify-end">
                  <span className="text-[11px] text-slate-500">
                    {learningGoal.length}/1000
                  </span>
                </div>
              </div>
            </div>

            {/* Submit */}
            <div className="mt-3 flex flex-col-reverse items-start justify-between gap-3 border-t border-[#D5DFF1] pt-3 sm:flex-row sm:items-center">
              <p className="max-w-lg text-[11px] leading-5 text-slate-500">
                Your reading path includes links to the original documentation sections.
              </p>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full shrink-0 items-center justify-center gap-2 rounded-lg bg-[#263B65] px-5 py-2.5 text-xs font-semibold text-white shadow-sm transition hover:bg-[#1C2D4D] disabled:cursor-wait disabled:opacity-60 sm:w-auto"
              >
                {isLoading ? (
                  <>
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Finding your reading path...
                  </>
                ) : (
                  <>
                    Create my learning path
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Learning Roadmap */}
        <section
          className="min-w-0 rounded-xl border border-slate-200 bg-white p-4 sm:p-5"
          aria-live="polite"
        >

          {/* Results Heading */}
          <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 pb-3">
            <div>
              <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.15em] text-[#4969A8]">
                Your personalised route
              </p>

              <h2 className="text-lg font-semibold text-slate-900">
                {learningPath.length
                  ? 'Your learning journey'
                  : 'Where should you start?'}
              </h2>

              <p className="mt-0.5 text-xs text-slate-500">
                {learningPath.length
                  ? 'Follow these topics in order.'
                  : 'Your documentation, organised around your goal.'}
              </p>
            </div>

            {learningPath.length > 0 && (
              <span className="rounded-full bg-[#EEF2FA] px-3 py-1 text-[11px] font-semibold text-[#334D8C]">
                {learningPath.length} reading steps
              </span>
            )}
          </div>

          {/* Error */}
          {error && (
            <div
              role="alert"
              className="mb-4 rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700"
            >
              {error}
            </div>
          )}

          {/* Loading */}
          {isLoading && (
            <div className="space-y-3 py-3">
              <div className="flex items-center gap-3">
                <span className="h-3 w-3 animate-pulse rounded-full bg-[#4969A8]" />

                <div>
                  <p className="text-sm font-semibold text-slate-800">
                    Exploring your documentation
                  </p>

                  <p className="mt-0.5 text-xs text-slate-500">
                    Finding relevant pages and arranging the topics...
                  </p>
                </div>
              </div>

              <div className="grid gap-3 lg:grid-cols-3">
                {[1, 2, 3].map(item => (
                  <div
                    key={item}
                    className="animate-pulse rounded-lg border border-slate-100 p-4"
                  >
                    <div className="h-8 w-8 rounded-full bg-slate-200" />
                    <div className="mt-3 h-3 w-20 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-4/5 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                    <div className="mt-2 h-3 w-3/4 rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Roadmap Cards */}
          {!isLoading && learningPath.length > 0 && (
            <div>

              {/* Progress Line */}
              <div className="mb-3 hidden items-center px-5 lg:flex">
                {learningPath.map((step, index) => (
                  <div
                    key={`${step.url}-${step.heading}-progress`}
                    className="flex flex-1 items-center last:flex-none"
                  >
                    <span className="h-2.5 w-2.5 shrink-0 rounded-full bg-[#4969A8] ring-4 ring-[#EEF2FA]" />

                    {index !== learningPath.length - 1 && (
                      <div className="h-0.5 flex-1 bg-[#DCE5F5]" />
                    )}
                  </div>
                ))}
              </div>

              <div className="grid items-stretch gap-3 lg:grid-cols-3">
                {learningPath.map((step, index) => {
                  const stage = stages[index] || stages[2]

                  return (
                    <article
                      key={`${step.url}-${step.heading}`}
                      className={`flex min-w-0 flex-col rounded-xl border p-4 transition-shadow hover:shadow-md ${stage.card}`}
                    >

                      {/* Step Number and Label */}
                      <div className="mb-3 flex items-center justify-between gap-2">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${stage.numberStyle}`}
                        >
                          {stage.number}
                        </span>

                        <span
                          className={`rounded-full px-2.5 py-1 text-[10px] font-bold tracking-wider ${stage.badge}`}
                        >
                          {stage.label}
                        </span>
                      </div>

                      {/* Topic */}
                      <h3 className="text-sm font-bold leading-snug text-slate-900">
                        {step.heading}
                      </h3>

                      {/* Explanation */}
                      <div className="mt-3 flex-1">
                        <p className="mb-1 text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          Why this topic?
                        </p>

                        <p className="text-xs leading-5 text-slate-600">
                          {step.whyRead}
                        </p>
                      </div>

                      {/* Focus */}
                      <details className="mt-3 border-t border-[#D5DFF1] pt-3">
                        <summary className="cursor-pointer list-none text-xs font-semibold text-slate-700 transition hover:text-[#4969A8]">
                          <span className="flex items-center justify-between gap-2">
                            What to focus on
                            <span className="text-[#4969A8]">+</span>
                          </span>
                        </summary>

                        <p className="mt-2 rounded-lg bg-white/70 p-3 text-xs leading-5 text-slate-600">
                          {step.focus}
                        </p>
                      </details>

                      {/* Documentation Link */}
                      <a
                        href={step.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-3 flex items-center justify-between gap-2 rounded-lg bg-[#263B65] px-3 py-2.5 text-xs font-semibold text-white transition hover:bg-[#1C2D4D]"
                      >
                        <span>Read documentation</span>
                        <span aria-hidden="true">↗</span>
                      </a>
                    </article>
                  )
                })}
              </div>

              {/* Footer Note */}
              <div className="mt-4 flex items-start gap-2 rounded-lg bg-[#F4F5F8] px-3 py-2.5">
                <span className="text-[#4969A8]">ⓘ</span>

                <p className="text-[11px] leading-5 text-slate-500">
                  Follow the steps from left to right. Each link opens
                  the corresponding section in the original documentation.
                </p>
              </div>
            </div>
          )}

          {/* Empty State */}
          {!isLoading && learningPath.length === 0 && !error && (
            <div className="flex flex-col items-center justify-center px-4 py-6 text-center">

              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-xl bg-[#EEF2FA] text-[#334D8C]">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  className="h-6 w-6"
                >
                  <path
                    d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M4 5.5V21m5-13h7m-7 4h7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>

              <h3 className="text-base font-semibold text-slate-900">
                A clearer way to learn from documentation
              </h3>

              <p className="mt-1.5 max-w-md text-xs leading-5 text-slate-500">
                Instead of browsing page after page, get three relevant
                topics arranged in a sensible learning order. Each step
                explains why it matters and takes you to its original source.
              </p>

              <div className="mt-4 grid w-full max-w-sm grid-cols-3 gap-2 text-center">
                {[
                  ['01', 'Find topics'],
                  ['02', 'Set an order'],
                  ['03', 'Read & learn'],
                ].map(([number, label]) => (
                  <div
                    key={number}
                    className="rounded-lg bg-[#EEF2FA] px-2 py-2.5"
                  >
                    <span className="block text-xs font-bold text-[#334D8C]">
                      {number}
                    </span>

                    <span className="mt-1 block text-[11px] font-medium text-slate-600">
                      {label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>

        {/* Footer */}
        <footer className="mt-5 flex flex-col justify-between gap-2 border-t border-slate-200 pt-3 text-[11px] text-slate-400 sm:flex-row">
          <span>© 2026 Dockpath</span>
          <span>Find the right sections. Learn in the right order.</span>
        </footer>
      </div>
    </main>
  )
}

export default App

