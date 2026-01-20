'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { 
  Zap, FileText, File, MessageSquare, Globe, Link2, 
  CheckCircle2, XCircle, Loader2, TrendingUp, Clock,
  Download, RefreshCw, AlertCircle
} from 'lucide-react'
import IndexerForm from '@/components/IndexerForm'
import StatsDisplay from '@/components/StatsDisplay'
import ResultsList from '@/components/ResultsList'
import MethodsComparison from '@/components/MethodsComparison'

export default function Home() {
  const [isIndexing, setIsIndexing] = useState(false)
  const [results, setResults] = useState<any[]>([])
  const [stats, setStats] = useState({
    total: 0,
    successful: 0,
    failed: 0,
    pending: 0
  })

  const linkTypes = [
    { icon: FileText, name: 'HTML Pages', color: 'text-blue-500' },
    { icon: File, name: 'PDF Files', color: 'text-red-500' },
    { icon: MessageSquare, name: 'Forum Links', color: 'text-green-500' },
    { icon: Globe, name: 'Web 2.0', color: 'text-purple-500' },
    { icon: Link2, name: 'Tier 1/2/3', color: 'text-orange-500' },
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-3"
            >
              <div className="bg-gradient-to-br from-purple-600 to-blue-600 p-2 rounded-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                  Google Instant Indexer
                </h1>
                <p className="text-sm text-gray-600">Professional URL Indexing Tool</p>
              </div>
            </motion.div>
            
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center space-x-4"
            >
              <div className="hidden sm:flex items-center space-x-2 bg-green-50 px-4 py-2 rounded-full">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">Ready to Index</span>
              </div>
            </motion.div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Index Your URLs in <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Seconds</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Professional indexing for all link types. Fast, reliable, and built for SEO professionals.
          </p>
        </motion.div>

        {/* Link Types Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12"
        >
          {linkTypes.map((type, index) => (
            <motion.div
              key={type.name}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 * index }}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all border border-gray-100"
            >
              <type.icon className={`w-8 h-8 ${type.color} mb-3`} />
              <h3 className="font-semibold text-gray-900 text-sm">{type.name}</h3>
              <p className="text-xs text-gray-500 mt-1">Supported</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Stats Display */}
        {stats.total > 0 && (
          <StatsDisplay stats={stats} />
        )}

        {/* Main Indexer Form */}
        <IndexerForm 
          isIndexing={isIndexing}
          setIsIndexing={setIsIndexing}
          setResults={setResults}
          setStats={setStats}
        />

        {/* Results */}
        {results.length > 0 && (
          <ResultsList results={results} />
        )}

        {/* Methods Comparison */}
        <MethodsComparison />

        {/* Features Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-12 grid md:grid-cols-3 gap-6"
        >
          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-purple-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">Lightning Fast</h3>
            <p className="text-gray-600 text-sm">
              Index URLs in seconds with our multi-method approach. Process hundreds of URLs in parallel.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-blue-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <CheckCircle2 className="w-6 h-6 text-blue-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">High Success Rate</h3>
            <p className="text-gray-600 text-sm">
              95%+ success rate with Google Indexing API. Multiple fallback methods ensure reliability.
            </p>
          </div>

          <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100">
            <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-green-600" />
            </div>
            <h3 className="font-semibold text-gray-900 mb-2">All Link Types</h3>
            <p className="text-gray-600 text-sm">
              Supports HTML, PDF, Forum, Web 2.0, and all backlink tiers. One tool for everything.
            </p>
          </div>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center text-gray-600">
            <p className="text-sm">
              Built with ❤️ for fast, reliable Google indexing
            </p>
            <p className="text-xs mt-2 text-gray-500">
              Professional SEO Tool • Instant Indexing • All Link Types Supported
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
