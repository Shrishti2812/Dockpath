
import { useState } from 'react'
import { createLearningPath } from './services/learningPathApi'

function App() {
  const [documentationUrl, setDocumentationUrl] = useState('https://react.dev/learn')
  const [learningGoal, setLearningGoal] = useState('')
  const [learningPath, setLearningPath] = useState([])
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [expandedStep, setExpandedStep] = useState(0)

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    setLearningPath([])
    setExpandedStep(0)
    setIsLoading(true)

    try {
      const path = await createLearningPath({ documentationUrl, learningGoal })
      setLearningPath(path)
    } catch (requestError) {
      setError(requestError.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f9f6] text-slate-800">

      {/* Navigation */}
      <header className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex h-[68px] max-w-[1440px] items-center justify-between px-6 lg:px-12">
          <a href="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-800 text-lg font-bold text-white">
              d
            </span>
            <span className="text-xl font-bold tracking-tight text-slate-900">
              dock<span className="text-emerald-700">path</span>
            </span>
          </a>

          <p className="hidden text-sm text-slate-500 sm:block">
            Navigate documentation with purpose.
          </p>

          <span className="rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
            Your AI documentation guide
          </span>
        </div>
      </header>

      <div className="mx-auto max-w-[1440px] px-6 pb-8 pt-9 lg:px-12">

        {/* Introduction */}
        <section className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-bold uppercase tracking-[0.18em] text-emerald-700">
            Less searching. More learning.
          </p>

          <h1 className="max-w-2xl text-3xl font-semibold leading-tight tracking-tight text-slate-900 sm:text-4xl">
            Stop getting lost in documentation.
            <span className="text-emerald-800"> Start learning with a plan.</span>
          </h1>

          <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
            Official documentation can contain dozens of pages and hundreds of sections.
            Dockpath understands what you're trying to learn, finds the relevant sections,
            and arranges them into a simple three-step reading path — so you know
            exactly where to start and what to read next.
          </p>
        </section>

        {/* Main workspace */}
        <div className="grid items-start gap-7 lg:grid-cols-[minmax(360px,0.9fr)_minmax(0,1.2fr)]">

          {/* Input */}
          <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <div className="mb-6">
              <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-6 w-6">
                  <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" strokeLinejoin="round" />
                  <path d="M4 5.5V21m5-13h7m-7 4h7" strokeLinecap="round" />
                </svg>
              </div>

              <h2 className="text-xl font-semibold text-slate-900">
                Build your learning path
              </h2>
              <p className="mt-2 text-sm leading-6 text-slate-500">
                Give Dockpath a starting page and tell it what you want to understand.
                We'll take care of finding the relevant reading material.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">

              <div>
                <label htmlFor="documentationUrl" className="mb-2 block text-sm font-semibold text-slate-800">
                  01. Documentation website
                </label>

                <input
                  id="documentationUrl"
                  type="url"
                  value={documentationUrl}
                  onChange={event => setDocumentationUrl(event.target.value)}
                  placeholder="https://react.dev/learn"
                  required
                  className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <p className="mt-2 text-xs leading-5 text-slate-400">
                  Paste a page from the official documentation. This is where your reading journey begins.
                </p>
              </div>

              <div>
                <label htmlFor="learningGoal" className="mb-2 block text-sm font-semibold text-slate-800">
                  02. Your learning goal
                </label>

                <textarea
                  id="learningGoal"
                  value={learningGoal}
                  onChange={event => setLearningGoal(event.target.value)}
                  placeholder="For example: I want to understand React hooks, how state works, and how to use effects in a project."
                  maxLength={1000}
                  rows={5}
                  required
                  className="w-full resize-y rounded-xl border border-slate-300 bg-white px-4 py-3.5 text-sm leading-6 outline-none transition placeholder:text-slate-400 focus:border-emerald-600 focus:ring-2 focus:ring-emerald-100"
                />

                <div className="mt-2 flex items-center justify-between">
                  <p className="text-xs text-slate-400">
                    Be as specific as you like.
                  </p>
                  <span className="text-xs text-slate-400">
                    {learningGoal.length}/1000
                  </span>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-emerald-800 px-5 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-emerald-900 disabled:cursor-wait disabled:opacity-60"
              >
                {isLoading ? (
                  <>
                    <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                    Finding your reading path...
                  </>
                ) : (
                  <>
                    Create my learning path
                    <span aria-hidden="true">→</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-5 flex gap-3 rounded-xl bg-[#f5f8f4] p-4">
              <span className="mt-0.5 text-emerald-700">✦</span>
              <p className="text-xs leading-5 text-slate-600">
                No generic tutorials. Your reading path is built from the
                documentation you provide, with links to the original sections.
              </p>
            </div>
          </section>

          {/* Results */}
          <section
            className="min-w-0 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7"
            aria-live="polite"
          >
            <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 pb-5">
              <div>
                <p className="mb-1.5 text-xs font-bold uppercase tracking-[0.16em] text-emerald-700">
                  Your personalised route
                </p>
                <h2 className="text-xl font-semibold text-slate-900">
                  {learningPath.length ? 'Your learning journey' : 'Where should you start?'}
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  {learningPath.length
                    ? 'Follow these topics in order.'
                    : 'Your documentation, organised around your goal.'}
                </p>
              </div>

              {learningPath.length > 0 && (
                <span className="rounded-full bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-800">
                  3 reading steps
                </span>
              )}
            </div>

            {/* Error */}
            {error && (
              <div role="alert" className="mb-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Loading */}
            {isLoading && (
              <div className="space-y-4 py-5">
                <div className="flex items-center gap-3">
                  <span className="h-3 w-3 animate-pulse rounded-full bg-emerald-700" />
                  <div>
                    <p className="text-sm font-semibold text-slate-800">
                      Exploring your documentation
                    </p>
                    <p className="mt-1 text-xs text-slate-500">
                      Finding relevant pages and arranging the topics...
                    </p>
                  </div>
                </div>

                {[1, 2, 3].map(item => (
                  <div key={item} className="animate-pulse rounded-xl border border-slate-100 p-5">
                    <div className="h-3 w-24 rounded bg-slate-200" />
                    <div className="mt-3 h-4 w-3/5 rounded bg-slate-200" />
                    <div className="mt-3 h-3 w-full rounded bg-slate-100" />
                  </div>
                ))}
              </div>
            )}

            {/* Learning path */}
            {!isLoading && learningPath.length > 0 && (
              <ol className="space-y-3">
                {learningPath.map((step, index) => {
                  const isExpanded = expandedStep === index

                  return (
                    <li
                      key={`${step.url}-${step.heading}`}
                      className={`overflow-hidden rounded-xl border transition ${
                        isExpanded
                          ? 'border-emerald-200 bg-emerald-50/30'
                          : 'border-slate-200 bg-white hover:border-emerald-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setExpandedStep(isExpanded ? -1 : index)}
                        aria-expanded={isExpanded}
                        className="flex w-full items-center gap-4 p-4 text-left sm:p-5"
                      >
                        <span className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-sm font-bold ${
                          isExpanded
                            ? 'bg-emerald-800 text-white'
                            : 'bg-emerald-50 text-emerald-800'
                        }`}>
                          0{index + 1}
                        </span>

                        <span className="min-w-0 flex-1">
                          <span className="mb-1 block text-[11px] font-bold uppercase tracking-wider text-emerald-700">
                            {index === 0 ? 'Start here' : index === 1 ? 'Build understanding' : 'Go deeper'}
                          </span>
                          <span className="block text-sm font-semibold leading-5 text-slate-900 sm:text-base">
                            {step.heading}
                          </span>
                        </span>

                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={`h-4 w-4 shrink-0 text-slate-400 transition-transform ${isExpanded ? 'rotate-180' : ''}`}>
                          <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                      </button>

                      {isExpanded && (
                        <div className="border-t border-emerald-100 px-4 pb-5 pt-4 sm:pl-[4.75rem]">
                          <p className="text-sm leading-6 text-slate-600">
                            {step.whyRead}
                          </p>

                          <div className="mt-4 rounded-lg bg-emerald-50 p-4">
                            <p className="mb-1.5 text-xs font-bold uppercase tracking-wider text-emerald-800">
                              What to focus on
                            </p>
                            <p className="text-sm leading-6 text-slate-700">
                              {step.focus}
                            </p>
                          </div>

                          <a
                            href={step.url}
                            target="_blank"
                            rel="noreferrer"
                            className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-emerald-800 hover:text-emerald-950"
                          >
                            Read this documentation section
                            <span aria-hidden="true">↗</span>
                          </a>
                        </div>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}

            {/* Empty state */}
            {!isLoading && learningPath.length === 0 && !error && (
              <div className="flex min-h-[300px] flex-col items-center justify-center px-5 py-8 text-center">
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
                    <path d="M4 5.5A2.5 2.5 0 0 1 6.5 3H20v16H6.5A2.5 2.5 0 0 0 4 21z" strokeLinejoin="round" />
                    <path d="M4 5.5V21m5-13h7m-7 4h7" strokeLinecap="round" />
                  </svg>
                </div>

                <h3 className="text-lg font-semibold text-slate-900">
                  A clearer way to learn from documentation
                </h3>

                <p className="mt-2 max-w-md text-sm leading-6 text-slate-500">
                  Instead of browsing page after page, get three relevant
                  topics arranged in a sensible learning order. Each step
                  explains why it matters and takes you to its original source.
                </p>

                <div className="mt-6 grid w-full max-w-md grid-cols-3 gap-2 text-center">
                  {[
                    ['01', 'Find topics'],
                    ['02', 'Set an order'],
                    ['03', 'Read & learn'],
                  ].map(([number, label]) => (
                    <div key={number} className="rounded-xl bg-[#f5f8f4] px-2 py-3">
                      <span className="block text-xs font-bold text-emerald-800">{number}</span>
                      <span className="mt-1 block text-xs font-medium text-slate-600">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </section>
        </div>

        {/* Footer */}
        <footer className="mt-9 flex flex-col justify-between gap-2 border-t border-slate-200 pt-5 text-xs text-slate-400 sm:flex-row">
          <span>© 2026 Dockpath</span>
          <span>Find the right sections. Learn in the right order.</span>
        </footer>
      </div>
    </main>
  )
}

export default App
