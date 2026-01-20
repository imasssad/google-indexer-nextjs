'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { Loader2, Send, Upload } from 'lucide-react'
import axios from 'axios'
import toast from 'react-hot-toast'

interface IndexerFormProps {
  isIndexing: boolean
  setIsIndexing: (value: boolean) => void
  setResults: (results: any[]) => void
  setStats: (stats: any) => void
}

export default function IndexerForm({ 
  isIndexing, 
  setIsIndexing, 
  setResults, 
  setStats 
}: IndexerFormProps) {
  const [urls, setUrls] = useState('')
  const [useGoogleApi, setUseGoogleApi] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    const urlList = urls.split('\n').filter(url => url.trim())
    
    if (urlList.length === 0) {
      toast.error('Please enter at least one URL')
      return
    }

    setIsIndexing(true)
    
    try {
      toast.loading(`Indexing ${urlList.length} URLs...`, { id: 'indexing' })
      
      // Call Next.js API route (same domain, no CORS issues!)
      const response = await axios.post('/api/index', {
        urls: urlList,
        use_google_api: useGoogleApi
      })

      // Update results
      setResults(response.data.results || [])
      setStats({
        total: response.data.total || 0,
        successful: response.data.successful || 0,
        failed: response.data.failed || 0,
        pending: 0
      })
      
      toast.success(`Indexed ${response.data.successful}/${response.data.total} URLs!`, {
        id: 'indexing'
      })
      
      setIsIndexing(false)
      
    } catch (error: any) {
      console.error('Indexing error:', error)
      toast.error(error.response?.data?.message || 'Failed to index URLs', {
        id: 'indexing'
      })
      setIsIndexing(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="bg-white rounded-2xl shadow-lg border border-gray-200 p-8 mb-8"
    >
      <h3 className="text-2xl font-bold text-gray-900 mb-6">Index Your URLs</h3>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="urls" className="block text-sm font-medium text-gray-700 mb-2">
            Enter URLs (one per line)
          </label>
          <textarea
            id="urls"
            value={urls}
            onChange={(e) => setUrls(e.target.value)}
            placeholder="https://example.com/page1.html
https://example.com/document.pdf
https://forum.example.com/thread/123
https://medium.com/@user/post
https://tier1-backlink.com/link"
            className="w-full h-64 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all font-mono text-sm resize-none text-gray-900 placeholder-gray-400"
            disabled={isIndexing}
          />
          <p className="mt-2 text-sm text-gray-500">
            Supports: HTML pages, PDFs, Forum links, Web 2.0, Tier 1/2/3 backlinks
          </p>
        </div>

        <div className="flex items-center space-x-3 bg-blue-50 p-4 rounded-lg">
          <input
            type="checkbox"
            id="useGoogleApi"
            checked={useGoogleApi}
            onChange={(e) => setUseGoogleApi(e.target.checked)}
            className="w-4 h-4 text-purple-600 rounded focus:ring-purple-500"
            disabled={isIndexing}
          />
          <label htmlFor="useGoogleApi" className="text-sm text-gray-700">
            <span className="font-medium">Use Google Indexing API</span>
            <span className="text-gray-500 ml-2">(Faster but requires setup)</span>
          </label>
        </div>

        <div className="flex space-x-4">
          <button
            type="submit"
            disabled={isIndexing}
            className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold py-4 px-6 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg"
          >
            {isIndexing ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                <span>Indexing...</span>
              </>
            ) : (
              <>
                <Send className="w-5 h-5" />
                <span>Start Indexing</span>
              </>
            )}
          </button>
          
          {!isIndexing && (
            <button
              type="button"
              onClick={() => setUrls('')}
              className="px-6 py-4 border-2 border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-all"
            >
              Clear
            </button>
          )}
        </div>
      </form>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-purple-50 rounded-lg p-4">
          <p className="text-xs text-purple-600 font-medium mb-1">SPEED</p>
          <p className="text-2xl font-bold text-purple-700">2-10 min</p>
          <p className="text-xs text-purple-600 mt-1">Average indexing time</p>
        </div>
        
        <div className="bg-blue-50 rounded-lg p-4">
          <p className="text-xs text-blue-600 font-medium mb-1">SUCCESS RATE</p>
          <p className="text-2xl font-bold text-blue-700">95%+</p>
          <p className="text-xs text-blue-600 mt-1">With Google API</p>
        </div>
        
        <div className="bg-green-50 rounded-lg p-4">
          <p className="text-xs text-green-600 font-medium mb-1">CAPACITY</p>
          <p className="text-2xl font-bold text-green-700">Unlimited</p>
          <p className="text-xs text-green-600 mt-1">URLs per batch</p>
        </div>
      </div>
    </motion.div>
  )
}
