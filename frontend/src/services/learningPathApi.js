
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || '').trim().replace(/\/+$/, '')

export async function createLearningPath({ documentationUrl, learningGoal }) {
  let response

  if (import.meta.env.PROD && !API_BASE_URL) {
    throw new Error('Backend URL is missing. Set VITE_API_BASE_URL in the frontend deployment settings.')
  }

  try {
    response = await fetch(`${API_BASE_URL}/api/learning-path`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentationUrl, learningGoal }),
    })
  } catch {
    throw new Error('Could not reach the backend. Check its URL and CORS configuration.')
  }

  const result = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(result?.error || 'The learning path could not be created.')
  }

  const path = Array.isArray(result) ? result : result?.learningPath
  if (!Array.isArray(path) || path.length !== 3) {
    throw new Error('The server returned an unexpected learning path.')
  }

  return path
}
