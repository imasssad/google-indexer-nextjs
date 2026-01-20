'use client'

import { motion } from 'framer-motion'
import { Zap, TrendingUp, Clock, CheckCircle2 } from 'lucide-react'

export default function MethodsComparison() {
  const methods = [
    {
      name: 'Google Indexing API',
      speed: 'Instant',
      speedIcon: 3,
      reliability: 'Very High',
      reliabilityIcon: 5,
      limit: '200/day',
      bestFor: 'Priority pages',
      color: 'purple'
    },
    {
      name: 'IndexNow API',
      speed: 'Fast',
      speedIcon: 2,
      reliability: 'High',
      reliabilityIcon: 4,
      limit: '10,000/day',
      bestFor: 'Bulk updates',
      color: 'blue'
    },
    {
      name: 'Sitemap Ping',
      speed: 'Moderate',
      speedIcon: 1,
      reliability: 'Very High',
      reliabilityIcon: 5,
      limit: 'Unlimited',
      bestFor: 'Regular crawls',
      color: 'green'
    },
    {
      name: 'External Pings',
      speed: 'Moderate',
      speedIcon: 1,
      reliability: 'Medium',
      reliabilityIcon: 3,
      limit: 'Unlimited',
      bestFor: 'Extra coverage',
      color: 'orange'
    }
  ]

  const getColorClasses = (color: string) => {
    const colors: any = {
      purple: 'from-purple-500 to-purple-600',
      blue: 'from-blue-500 to-blue-600',
      green: 'from-green-500 to-green-600',
      orange: 'from-orange-500 to-orange-600'
    }
    return colors[color] || colors.purple
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.5 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mt-12"
    >
      <div className="text-center mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Indexing Methods Comparison</h3>
        <p className="text-gray-600">Choose the best method for your needs</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {methods.map((method, index) => (
          <motion.div
            key={method.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="relative bg-gradient-to-br from-gray-50 to-white rounded-xl p-6 border-2 border-gray-200 hover:border-gray-300 transition-all"
          >
            {/* Header */}
            <div className={`bg-gradient-to-r ${getColorClasses(method.color)} text-white rounded-lg p-3 mb-4`}>
              <h4 className="font-bold text-sm">{method.name}</h4>
            </div>

            {/* Speed */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Speed</span>
                <Zap className="w-4 h-4 text-yellow-500" />
              </div>
              <div className="flex space-x-1">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < method.speedIcon ? 'bg-yellow-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-700 mt-1">{method.speed}</p>
            </div>

            {/* Reliability */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-gray-600">Reliability</span>
                <CheckCircle2 className="w-4 h-4 text-green-500" />
              </div>
              <div className="flex space-x-1">
                {[...Array(5)].map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 flex-1 rounded ${
                      i < method.reliabilityIcon ? 'bg-green-400' : 'bg-gray-200'
                    }`}
                  />
                ))}
              </div>
              <p className="text-xs text-gray-700 mt-1">{method.reliability}</p>
            </div>

            {/* Limit */}
            <div className="mb-4">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs font-medium text-gray-600">Daily Limit</span>
                <TrendingUp className="w-4 h-4 text-blue-500" />
              </div>
              <p className="text-sm font-bold text-gray-900">{method.limit}</p>
            </div>

            {/* Best For */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-600 mb-1">Best for:</p>
              <p className="text-sm font-semibold text-gray-900">{method.bestFor}</p>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Pro Tip */}
      <div className="mt-8 bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-6 border border-purple-200">
        <div className="flex items-start space-x-3">
          <div className="bg-purple-100 rounded-full p-2">
            <Zap className="w-5 h-5 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-1">Pro Tip</h4>
            <p className="text-sm text-gray-700">
              For maximum speed and reliability, use <strong>Google Indexing API</strong> for priority pages 
              (Tier 1), then use <strong>Sitemap Ping</strong> for bulk indexing (Tier 2 & 3). 
              This hybrid approach gives you the best of both worlds!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  )
}
