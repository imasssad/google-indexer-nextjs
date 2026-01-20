'use client'

import { motion } from 'framer-motion'
import { CheckCircle2, XCircle, Clock, TrendingUp } from 'lucide-react'

interface StatsDisplayProps {
  stats: {
    total: number
    successful: number
    failed: number
    pending: number
  }
}

export default function StatsDisplay({ stats }: StatsDisplayProps) {
  const successRate = stats.total > 0 
    ? ((stats.successful / stats.total) * 100).toFixed(1)
    : '0'

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8"
    >
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-gray-600">Total URLs</p>
          <TrendingUp className="w-5 h-5 text-gray-400" />
        </div>
        <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
        <p className="text-xs text-gray-500 mt-1">Processed</p>
      </div>

      <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl p-6 shadow-sm border border-green-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-green-700">Successful</p>
          <CheckCircle2 className="w-5 h-5 text-green-500" />
        </div>
        <p className="text-3xl font-bold text-green-700">{stats.successful}</p>
        <p className="text-xs text-green-600 mt-1">{successRate}% success rate</p>
      </div>

      <div className="bg-gradient-to-br from-red-50 to-rose-50 rounded-xl p-6 shadow-sm border border-red-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-red-700">Failed</p>
          <XCircle className="w-5 h-5 text-red-500" />
        </div>
        <p className="text-3xl font-bold text-red-700">{stats.failed}</p>
        <p className="text-xs text-red-600 mt-1">
          {stats.total > 0 ? ((stats.failed / stats.total) * 100).toFixed(1) : '0'}% failed
        </p>
      </div>

      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl p-6 shadow-sm border border-blue-200">
        <div className="flex items-center justify-between mb-2">
          <p className="text-sm font-medium text-blue-700">Pending</p>
          <Clock className="w-5 h-5 text-blue-500" />
        </div>
        <p className="text-3xl font-bold text-blue-700">{stats.pending}</p>
        <p className="text-xs text-blue-600 mt-1">In queue</p>
      </div>
    </motion.div>
  )
}
