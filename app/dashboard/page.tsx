'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Calendar, CheckCircle, XCircle, ExternalLink, RefreshCw } from 'lucide-react'

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

  const fetchData = async () => {
    setLoading(true)
    try {
      // Fetch history
      const historyRes = await fetch('/api/history?limit=100')
      const historyData = await historyRes.json()
      setHistory(historyData.history || [])

      // Fetch stats
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
    return date.toLocaleString()
  }

  const getMethodBadge = (method: any) => {
    if (method.method?.includes('IndexNow')) {
      return <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">IndexNow</span>
    }
    if (method.method?.includes('Google')) {
      return <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">Google API</span>
    }
    return <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">{method.method}</span>
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-pink-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Indexing Dashboard</h1>
          <p className="text-gray-600">Monitor all indexed URLs and their status</p>
        </motion.div>

        {/* Stats Cards */}
        {stats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8"
          >
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <p className="text-sm text-gray-600 mb-2">Total Indexed</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-green-200">
              <p className="text-sm text-gray-600 mb-2">Successful</p>
              <p className="text-3xl font-bold text-green-600">{stats.successful}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-red-200">
              <p className="text-sm text-gray-600 mb-2">Failed</p>
              <p className="text-3xl font-bold text-red-600">{stats.failed}</p>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 border border-purple-200">
              <p className="text-sm text-gray-600 mb-2">Success Rate</p>
              <p className="text-3xl font-bold text-purple-600">{stats.successRate}%</p>
            </div>
          </motion.div>
        )}

        {/* Refresh Button */}
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-900">Recent History</h2>
          <button
            onClick={fetchData}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
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
            <div className="p-12 text-center">
              <RefreshCw className="w-12 h-12 animate-spin mx-auto text-purple-600 mb-4" />
              <p className="text-gray-600">Loading history...</p>
            </div>
          ) : history.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-gray-600">No indexing history yet. Start indexing URLs!</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      URL
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Methods
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {history.map((item, index) => (
                    <motion.tr
                      key={item.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-gray-50"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <a
                            href={item.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline flex items-center gap-1 text-sm max-w-md truncate"
                          >
                            {item.url}
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {item.status === 'success' ? (
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-green-600" />
                            <span className="text-sm font-medium text-green-600">Success</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <XCircle className="w-5 h-5 text-red-600" />
                            <span className="text-sm font-medium text-red-600">Failed</span>
                          </div>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {item.methods_used.map((method, i) => (
                            <div key={i}>
                              {getMethodBadge(method)}
                            </div>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                          <Calendar className="w-4 h-4" />
                          {formatDate(item.created_at)}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Last 7 Days</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.last7Days.total}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Successful</p>
                <p className="text-2xl font-bold text-green-600">{stats.last7Days.successful}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Failed</p>
                <p className="text-2xl font-bold text-red-600">{stats.last7Days.failed}</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
