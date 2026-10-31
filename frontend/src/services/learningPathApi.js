export async function createLearningPath({ documentationUrl, learningGoal }) {
  let response

  try {
    response = await fetch('/api/learning-path', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ documentationUrl, learningGoal }),
    })
  } catch {
    throw new Error('Could not reach Dockpath. Check that the backend is running.')
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
