import { useMemo, useState } from 'react'
import axios from 'axios'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

const apiUrl = '/_/backend/api/query'
const exampleQuestions = [
  'show all users from Delhi',
  'show all plans with price greater than 1000',
  'count how many users are in each city',
  'show all payments with status success',
]

function getChartConfig(results) {
  if (!Array.isArray(results) || results.length === 0) {
    return null
  }

  const sampleRow = results[0]
  const columns = Object.keys(sampleRow)

  const labelKey = columns.find((key) => typeof sampleRow[key] === 'string')
  const valueKey = columns.find((key) => typeof sampleRow[key] === 'number')

  if (!labelKey || !valueKey) {
    return null
  }

  return {
    labelKey,
    valueKey,
    data: results.slice(0, 10),
  }
}

function App() {
  const [question, setQuestion] = useState(exampleQuestions[0])
  const [queryState, setQueryState] = useState({
    loading: false,
    error: '',
    response: null,
  })

  const chartConfig = useMemo(
    () => getChartConfig(queryState.response?.data?.results ?? []),
    [queryState.response],
  )

  async function handleSubmit(event) {
    event.preventDefault()

    if (!question.trim()) {
      setQueryState((current) => ({
        ...current,
        error: 'Please enter a question before submitting.',
      }))
      return
    }

    setQueryState({
      loading: true,
      error: '',
      response: null,
    })

    try {
      const { data } = await axios.post(apiUrl, {
        question: question.trim(),
      })

      setQueryState({
        loading: false,
        error: '',
        response: data,
      })
    } catch (error) {
      const message =
        error.response?.data?.message ||
        error.message ||
        'Something went wrong while calling the backend.'

      setQueryState({
        loading: false,
        error: message,
        response: error.response?.data || null,
      })
    }
  }

  const results = queryState.response?.data?.results ?? []
  const resultColumns = results[0] ? Object.keys(results[0]) : []
  const sql = queryState.response?.data?.sql
  const insights = queryState.response?.data?.insights
  const validation = queryState.response?.data?.validation
  const chartType = queryState.response?.data?.chartType

  const hasResultsOrLoading = queryState.response || queryState.loading || queryState.error

  const renderForm = (isCentered) => (
    <form
      onSubmit={handleSubmit}
      className={`rounded-3xl border border-zinc-800/70 bg-zinc-950/70 backdrop-blur transition-all duration-500 ${
        isCentered 
          ? 'w-full max-w-3xl p-8 md:p-12 shadow-2xl shadow-green-900/10' 
          : 'min-w-0 p-6 shadow-xl shadow-green-900/5'
      }`}
    >
      <div className={isCentered ? 'text-center' : ''}>
        <h2 className={`${isCentered ? 'text-3xl md:text-4xl' : 'text-xl'} font-semibold text-white tracking-tight`}>
          Ask The Dataset
        </h2>
        <p className="mt-3 text-sm leading-6 text-zinc-400">
          Use one of the example questions or type your own query request in natural language.
        </p>
      </div>

      <div className={`mt-6 flex flex-wrap gap-2 ${isCentered ? 'justify-center' : ''}`}>
        {exampleQuestions.map((example) => (
          <button
            key={example}
            type="button"
            onClick={() => setQuestion(example)}
            className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-2 text-left text-xs text-zinc-300 transition hover:border-green-500 hover:text-green-400 hover:bg-green-500/10"
          >
            {example}
          </button>
        ))}
      </div>

      <div className="mt-8 relative">
        <label className={`block text-sm font-medium text-zinc-300 ${isCentered ? 'text-left' : ''}`} htmlFor="question">
          Question
        </label>
        <textarea
          id="question"
          value={question}
          onChange={(event) => setQuestion(event.target.value)}
          rows={isCentered ? "4" : "6"}
          className="mt-2 w-full rounded-2xl border border-zinc-800 bg-zinc-900/80 px-4 py-3 text-sm text-zinc-100 outline-none ring-0 placeholder:text-zinc-600 focus:border-green-500 focus:ring-1 focus:ring-green-500 transition-all shadow-sm"
          placeholder="Example: show all users from Delhi"
        />
      </div>

      <div className={`mt-4 ${isCentered ? 'flex justify-center' : ''}`}>
        <button
          type="submit"
          disabled={queryState.loading}
          className={`inline-flex items-center justify-center rounded-xl bg-green-500 px-8 py-3 text-sm font-medium text-zinc-950 transition hover:bg-green-400 disabled:cursor-not-allowed disabled:bg-zinc-800 disabled:text-zinc-500 shadow-sm ${isCentered ? 'w-full md:w-auto text-base' : ''}`}
        >
          {queryState.loading ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-zinc-950" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Running query...
            </>
          ) : 'Send Query'}
        </button>
      </div>

      {queryState.error ? (
        <div className="mt-6 rounded-2xl border border-pink-500/30 bg-pink-500/10 px-4 py-3 text-sm text-pink-300">
          {queryState.error}
        </div>
      ) : null}

      {validation && !isCentered ? (
        <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4 text-sm text-zinc-300">
          <p>
            <span className="font-medium text-white">Validation:</span>{' '}
            <span className={validation.isValid ? "text-green-400" : "text-pink-400"}>
              {validation.isValid ? 'Valid SQL' : 'Invalid SQL'}
            </span>
          </p>
          <p className="mt-2">
            <span className="font-medium text-white">Chart Type:</span> {chartType || 'table'}
          </p>
        </div>
      ) : null}
    </form>
  )

  const LoadingSpinner = () => (
    <div className="flex h-full min-h-[200px] w-full items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-zinc-800 border-t-green-500"></div>
    </div>
  )

  return (
    <main className={`mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 py-8 text-zinc-100 md:px-8 font-sans ${!hasResultsOrLoading ? 'justify-center items-center' : 'gap-6'}`}>
      
      {!hasResultsOrLoading ? (
        renderForm(true)
      ) : (
        <>
          <section className="grid gap-6 lg:grid-cols-[0.85fr_1.15fr] w-full">
            {renderForm(false)}

            <div className="min-w-0 rounded-3xl border border-zinc-800/70 bg-zinc-950/70 p-6 backdrop-blur shadow-xl shadow-pink-900/5 flex flex-col">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-xl font-semibold text-white">Result Rows</h2>
                  {!queryState.loading && (
                    <p className="mt-1 text-sm text-zinc-400">
                      Showing {results.length} row{results.length === 1 ? '' : 's'} from the latest query.
                    </p>
                  )}
                </div>
              </div>

              {queryState.loading ? (
                <LoadingSpinner />
              ) : results.length > 0 ? (
                <div className="mt-5 overflow-hidden rounded-2xl border border-zinc-800 flex-1">
                  <div className="max-h-[28rem] overflow-auto">
                    <table className="min-w-full divide-y divide-zinc-800 text-left text-sm">
                      <thead className="sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
                        <tr>
                          {resultColumns.map((column) => (
                            <th key={column} className="px-4 py-3 font-medium text-zinc-300">
                              {column}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-zinc-800 bg-zinc-950/40">
                        {results.map((row, rowIndex) => (
                          <tr key={rowIndex} className="hover:bg-zinc-900/60 transition-colors">
                            {resultColumns.map((column) => (
                              <td key={`${rowIndex}-${column}`} className="px-4 py-3 text-zinc-200 whitespace-nowrap">
                                {row[column] === null || row[column] === undefined ? 'null' : String(row[column])}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : (
                <div className="mt-5 flex flex-1 items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 py-12 text-center text-sm leading-6 text-zinc-400">
                  No rows to display.
                </div>
              )}
            </div>
          </section>

          <section className="grid gap-6 xl:grid-cols-[0.9fr_1.1fr] w-full">
            <div className="min-w-0 rounded-3xl border border-zinc-800/70 bg-zinc-950/70 p-6 backdrop-blur shadow-xl shadow-green-900/5 flex flex-col">
              <h2 className="text-xl font-semibold text-white">Generated SQL</h2>
              
              {queryState.loading ? (
                <LoadingSpinner />
              ) : (
                <>
                  <div className="mt-4 rounded-2xl border border-zinc-800 bg-zinc-950 px-4 py-4 text-sm text-green-400 overflow-x-auto">
                    <code className="block whitespace-pre-wrap break-words font-mono min-w-max">
                      {sql || '-- No SQL generated yet.'}
                    </code>
                  </div>

                  <div className="mt-6 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-4">
                    <h3 className="text-sm font-medium uppercase tracking-[0.2em] text-zinc-500">
                      Insights
                    </h3>
                    <p className="mt-3 text-sm leading-6 text-zinc-300">
                      {insights?.summary || 'No insights available.'}
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="min-w-0 rounded-3xl border border-zinc-800/70 bg-zinc-950/70 p-6 backdrop-blur shadow-xl shadow-pink-900/5 flex flex-col">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Live Query Chart</h2>
                  {!queryState.loading && (
                    <p className="mt-1 text-sm text-zinc-400">
                      Recharts renders a bar chart automatically when the response includes one text
                      column and one numeric column.
                    </p>
                  )}
                </div>
              </div>

              {queryState.loading ? (
                <LoadingSpinner />
              ) : (
                <div className="h-80 w-full min-w-0">
                  {chartConfig ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartConfig.data}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" />
                        <XAxis dataKey={chartConfig.labelKey} stroke="#a1a1aa" />
                        <YAxis stroke="#a1a1aa" />
                        <Tooltip
                          contentStyle={{
                            backgroundColor: '#09090b',
                            border: '1px solid #27272a',
                            borderRadius: '12px',
                            color: '#f4f4f5',
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.5)',
                          }}
                        />
                        <Bar dataKey={chartConfig.valueKey} fill="#ec4899" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <div className="flex h-full items-center justify-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/50 px-6 text-center text-sm leading-6 text-zinc-400">
                      No chart data available for this query.
                    </div>
                  )}
                </div>
              )}
            </div>
          </section>
        </>
      )}
    </main>
  )
}

export default App
