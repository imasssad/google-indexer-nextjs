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

  const extractUrlsFromHtml = (htmlContent: string): string[] => {
    const urls: string[] = []
    // Extract URLs from href attributes
    const hrefRegex = /href=["']([^"']+)["']/gi
    let match
    while ((match = hrefRegex.exec(htmlContent)) !== null) {
      const url = match[1]
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.push(url)
      }
    }
    // Extract URLs from src attributes
    const srcRegex = /src=["']([^"']+)["']/gi
    while ((match = srcRegex.exec(htmlContent)) !== null) {
      const url = match[1]
      if (url.startsWith('http://') || url.startsWith('https://')) {
        urls.push(url)
      }
    }
    // Remove duplicates
    return Array.from(new Set(urls))
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const fileType = file.type
    const fileName = file.name.toLowerCase()

    // Check if file is supported
    const isTxt = fileType === 'text/plain' || fileName.endsWith('.txt')
    const isHtml = fileType === 'text/html' || fileName.endsWith('.html') || fileName.endsWith('.htm')
    const isPdf = fileType === 'application/pdf' || fileName.endsWith('.pdf')

    if (!isTxt && !isHtml && !isPdf) {
      toast.error('Please upload a .txt, .html, or .pdf file')
      return
    }

    try {
      if (isTxt) {
        // Handle .txt file (contains list of URLs)
        const reader = new FileReader()
        reader.onload = (event) => {
          const content = event.target?.result as string
          setUrls(content)
          toast.success(`Loaded ${content.split('\n').filter(url => url.trim()).length} URLs from file`)
        }
        reader.onerror = () => {
          toast.error('Failed to read file')
        }
        reader.readAsText(file)
      } else if (isHtml) {
        // Handle HTML file - extract URLs from HTML content
        const reader = new FileReader()
        reader.onload = (event) => {
          const htmlContent = event.target?.result as string
          const extractedUrls = extractUrlsFromHtml(htmlContent)

          if (extractedUrls.length === 0) {
            toast.error('No URLs found in HTML file')
            return
          }

          const urlsText = extractedUrls.join('\n')
          setUrls((prev) => (prev ? prev + '\n' + urlsText : urlsText))
          toast.success(`Extracted ${extractedUrls.length} URLs from HTML file`)
        }
        reader.onerror = () => {
          toast.error('Failed to read HTML file')
        }
        reader.readAsText(file)
      } else if (isPdf) {
        // Handle PDF file - send to backend for text extraction
        const formData = new FormData()
        formData.append('file', file)

        toast.loading('Extracting URLs from PDF...', { id: 'pdf-extract' })

        try {
          const response = await axios.post('/api/extract-urls', formData, {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          })

          const extractedUrls = response.data.urls || []

          if (extractedUrls.length === 0) {
            toast.error('No URLs found in PDF file', { id: 'pdf-extract' })
            return
          }

          const urlsText = extractedUrls.join('\n')
          setUrls((prev) => (prev ? prev + '\n' + urlsText : urlsText))
          toast.success(`Extracted ${extractedUrls.length} URLs from PDF`, { id: 'pdf-extract' })
        } catch (error: any) {
          console.error('PDF extraction error:', error)
          toast.error(error.response?.data?.error || 'Failed to extract URLs from PDF', { id: 'pdf-extract' })
        }
      }
    } catch (error: any) {
      console.error('File processing error:', error)
      toast.error('Failed to process file')
    }
  }

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
          <div className="flex items-center justify-between mb-2">
            <label htmlFor="urls" className="block text-sm font-medium text-gray-700">
              Enter URLs (one per line)
            </label>
            <label className="cursor-pointer">
              <input
                type="file"
                accept=".txt,.html,.htm,.pdf,text/plain,text/html,application/pdf"
                onChange={handleFileUpload}
                disabled={isIndexing}
                className="hidden"
              />
              <span className="flex items-center gap-2 px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors">
                <Upload className="w-4 h-4" />
                Upload File
              </span>
            </label>
          </div>
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
          <p className="mt-1 text-xs text-gray-400">
            Upload: .txt file (list of URLs) | .html/.pdf files (to index directly)
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
