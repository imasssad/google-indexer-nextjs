'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Calendar, CheckCircle, XCircle, ExternalLink, RefreshCw, ChevronLeft, ChevronRight, Home } from 'lucide-react'
import Link from 'next/link'

interface IndexHistory {
  id: number
  url: string
  status: 'success' | 'failed'
  methods_used: any[]
  timestamp: string
  created_at: string
}

interface Stats {
  total: number
  successful: number
  failed: number
  successRate: string
  last7Days: {
    total: number
    successful: number
    failed: number
  }
}

export default function DashboardPage() {
  const [history, setHistory] = useState<IndexHistory[]>([])
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  const fetchData = async () => {
    setLoading(true)
    try {
      const historyRes = await fetch('/api/history?limit=1000')
      const historyData = await historyRes.json()
      setHistory(historyData.history || [])

      const statsRes = await fetch('/api/history?stats=true')
      const statsData = await statsRes.json()
      setStats(statsData)
    } catch (error) {
      console.error('Error fetching data:', error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getMethodBadge = (method: any) => {
    if (method.method?.includes('IndexNow')) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">IndexNow</span>
    }
    if (method.method?.includes('Google')) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">Google API</span>
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs font-medium rounded-full">{method.method}</span>
  }

  // Pagination
  const totalPages = Math.ceil(history.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentHistory = history.slice(startIndex, endIndex)

  const goToPage = (page: number) => {
    setCurrentPage(Math.max(1, Math.min(page, totalPages)))
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header with Back Button */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                Indexing Dashboard
              </h1>
              <p className="text-gray-600">Monitor all indexed URLs and their status</p>
            </div>
            <Link href="/">
              <button className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-md border border-gray-200">
                <Home className="w-4 h-4" />
                Back to Home
              </button>
            </Link>
          </div>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8"
          >
            <div className="bg-gradient-to-br from-gray-50 to-white rounded-xl shadow-md p-6 border-l-4 border-gray-400">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-1">Total Indexed</p>
              <p className="text-4xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-white rounded-xl shadow-md p-6 border-l-4 border-green-500">
              <p className="text-xs font-semibold text-green-600 uppercase tracking-wide mb-1">Successful</p>
              <p className="text-4xl font-bold text-green-600">{stats.successful}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-white rounded-xl shadow-md p-6 border-l-4 border-red-500">
              <p className="text-xs font-semibold text-red-600 uppercase tracking-wide mb-1">Failed</p>
              <p className="text-4xl font-bold text-red-600">{stats.failed}</p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-white rounded-xl shadow-md p-6 border-l-4 border-purple-500">
              <p className="text-xs font-semibold text-purple-600 uppercase tracking-wide mb-1">Success Rate</p>
              <p className="text-4xl font-bold text-purple-600">{stats.successRate}%</p>
            </div>
          </motion.div>
        )}

        {/* Header with Pagination Info */}
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Indexing History</h2>
            <p className="text-sm text-gray-500 mt-1">
              Showing {startIndex + 1}-{Math.min(endIndex, history.length)} of {history.length} entries
            </p>
          </div>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 shadow-md"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>

        {/* History Table */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden"
        >
          {loading ? (
            <div className="p-16 text-center">
              <RefreshCw className="w-16 h-16 animate-spin mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600 text-lg">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-16 text-center">
              <XCircle className="w-16 h-16 mx-auto text-gray-400 mb-4" />
              <p className="text-gray-600 text-lg">No indexing history yet</p>
              <p className="text-gray-500 text-sm mt-2">Start indexing URLs to see them here!</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        URL
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Methods
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                        Date
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    <AnimatePresence mode="wait">
                      {currentHistory.map((item, index) => (
                        <motion.tr
                          key={item.id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ delay: index * 0.03 }}
                          className="hover:bg-purple-50 transition-colors"
                        >
                          <td className="px-6 py-4 max-w-md">
                            <a
                              href={item.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 text-sm group"
                            >
                              <span className="truncate">{item.url}</span>
                              <ExternalLink className="w-3 h-3 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />
                            </a>
                          </td>
                          <td className="px-6 py-4">
                            {item.status === 'success' ? (
                              <div className="flex items-center gap-2">
                                <CheckCircle className="w-5 h-5 text-green-500" />
                                <span className="text-sm font-semibold text-green-600">Success</span>
                              </div>
                            ) : (
                              <div className="flex items-center gap-2">
                                <XCircle className="w-5 h-5 text-red-500" />
                                <span className="text-sm font-semibold text-red-600">Failed</span>
                              </div>
                            )}
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {item.methods_used.map((method, i) => (
                                <div key={i}>{getMethodBadge(method)}</div>
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4 text-gray-400" />
                              {formatDate(item.created_at)}
                            </div>
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => goToPage(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>

                    <div className="flex items-center gap-1">
                      {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                        let pageNum: number
                        if (totalPages <= 5) {
                          pageNum = i + 1
                        } else if (currentPage <= 3) {
                          pageNum = i + 1
                        } else if (currentPage >= totalPages - 2) {
                          pageNum = totalPages - 4 + i
                        } else {
                          pageNum = currentPage - 2 + i
                        }

                        return (
                          <button
                            key={pageNum}
                            onClick={() => goToPage(pageNum)}
                            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                              currentPage === pageNum
                                ? 'bg-purple-600 text-white'
                                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                            }`}
                          >
                            {pageNum}
                          </button>
                        )
                      })}
                    </div>

                    <button
                      onClick={() => goToPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg bg-white border border-gray-300 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>

                  <div className="text-sm text-gray-600">
                    Page {currentPage} of {totalPages}
                  </div>
                </div>
              )}
            </>
          )}
        </motion.div>

        {/* Last 7 Days Stats */}
        {stats && stats.last7Days && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mt-8 bg-white rounded-xl shadow-lg border border-gray-200 p-6"
          >
            <h3 className="text-xl font-bold text-gray-900 mb-4">📊 Last 7 Days Performance</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-gray-600 mb-1">Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.last7Days.total}</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <p className="text-sm text-green-600 mb-1">Successful</p>
                <p className="text-3xl font-bold text-green-600">{stats.last7Days.successful}</p>
              </div>
              <div className="text-center p-4 bg-red-50 rounded-lg">
                <p className="text-sm text-red-600 mb-1">Failed</p>
                <p className="text-3xl font-bold text-red-600">{stats.last7Days.failed}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
