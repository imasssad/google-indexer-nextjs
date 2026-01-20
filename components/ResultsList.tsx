'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, ExternalLink, Copy, Download } from 'lucide-react'
import toast from 'react-hot-toast'

interface ResultsListProps {
  results: any[]
}

export default function ResultsList({ results }: ResultsListProps) {
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    toast.success('URL copied to clipboard!')
  }

  const downloadResults = () => {
    const dataStr = JSON.stringify(results, null, 2)
    const dataBlob = new Blob([dataStr], { type: 'application/json' })
    const url = URL.createObjectURL(dataBlob)
    const link = document.createElement('a')
    link.href = url
    link.download = `indexing-results-${new Date().getTime()}.json`
    link.click()
    toast.success('Results downloaded!')
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
    >
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-bold text-gray-900">Indexing Results</h3>
        <button
          onClick={downloadResults}
          className="flex items-center space-x-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
        >
          <Download className="w-4 h-4" />
          <span className="text-sm font-medium">Download JSON</span>
        </button>
      </div>

      <div className="space-y-3 max-h-96 overflow-y-auto">
        {results.map((result, index) => {
          const isSuccess = result.methods_used?.some((m: any) => m.status === 'success') || 
                           result.status === 'success'
          
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`flex items-center justify-between p-4 rounded-lg border-2 ${
                isSuccess 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                {isSuccess ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <XCircle className="w-5 h-5 text-red-600 flex-shrink-0" />
                )}
                
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-mono text-gray-700 truncate">
                    {result.url}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {isSuccess ? 'Successfully indexed' : 'Indexing failed'}
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 ml-4">
                <button
                  onClick={() => copyToClipboard(result.url)}
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Copy URL"
                >
                  <Copy className="w-4 h-4 text-gray-600" />
                </button>
                
                <a
                  href={result.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 hover:bg-white rounded-lg transition-colors"
                  title="Open URL"
                >
                  <ExternalLink className="w-4 h-4 text-gray-600" />
                </a>
              </div>
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
