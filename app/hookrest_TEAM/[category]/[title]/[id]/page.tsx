"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Code, Copy, Check, ArrowLeft, Calendar, Tag } from "lucide-react"
import Link from "next/link"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism"
import { useToast } from "@/hooks/use-toast"

interface CodeData {
  title: string
  category: string
  code: string
  description: string
  createdAt: string
}

export default function CodeViewPage() {
  const params = useParams()
  const [codeData, setCodeData] = useState<CodeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const response = await fetch(`/api/code/${params.id}`)
        if (response.ok) {
          const data = await response.json()
          setCodeData(data)
        } else {
          toast({
            title: "Error",
            description: "Code not found",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to load code",
          variant: "destructive",
        })
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      fetchCode()
    }
  }, [params.id, toast])

  const copyCode = async () => {
    if (codeData) {
      try {
        await navigator.clipboard.writeText(codeData.code)
        setCopied(true)
        toast({
          title: "Copied!",
          description: "Code copied to clipboard",
        })
        setTimeout(() => setCopied(false), 2000)
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to copy code",
          variant: "destructive",
        })
      }
    }
  }

  const getLanguageFromCategory = (category: string) => {
    const languageMap: { [key: string]: string } = {
      javascript: "javascript",
      typescript: "typescript",
      python: "python",
      java: "java",
      cpp: "cpp",
      html: "html",
      css: "css",
      react: "jsx",
      nodejs: "javascript",
      php: "php",
    }
    return languageMap[category] || "text"
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Code className="w-12 h-12 text-blue-400 mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Loading code...</p>
        </div>
      </div>
    )
  }

  if (!codeData) {
    return (
      <div className="min-h-screen bg-gray-950 text-white flex items-center justify-center">
        <div className="text-center">
          <Code className="w-12 h-12 text-red-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-2">Code Not Found</h1>
          <p className="text-gray-400 mb-4">The requested code snippet could not be found.</p>
          <Link href="/">
            <Button className="bg-blue-600 hover:bg-blue-700">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Home
            </Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Link href="/">
            <Button variant="ghost" className="text-gray-400 hover:text-white">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Home
            </Button>
          </Link>
        </div>

        <div className="max-w-6xl mx-auto">
          <Card className="bg-gray-900 border-gray-800 mb-6">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div>
                  <CardTitle className="text-2xl text-white mb-2">{codeData.title}</CardTitle>
                  {codeData.description && (
                    <CardDescription className="text-gray-400 text-base">{codeData.description}</CardDescription>
                  )}
                </div>
                <Button onClick={copyCode} className="bg-blue-600 hover:bg-blue-700">
                  {copied ? <Check className="w-4 h-4 mr-2" /> : <Copy className="w-4 h-4 mr-2" />}
                  {copied ? "Copied!" : "Copy Code"}
                </Button>
              </div>
              <div className="flex items-center gap-4 text-sm text-gray-400 mt-4">
                <div className="flex items-center gap-1">
                  <Tag className="w-4 h-4" />
                  <span className="capitalize">{codeData.category}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(codeData.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardHeader>
          </Card>

          <Card className="bg-gray-900 border-gray-800">
            <CardContent className="p-0">
              <div className="relative">
                <SyntaxHighlighter
                  language={getLanguageFromCategory(codeData.category)}
                  style={vscDarkPlus}
                  customStyle={{
                    margin: 0,
                    borderRadius: "0.5rem",
                    fontSize: "14px",
                    lineHeight: "1.5",
                  }}
                  showLineNumbers={true}
                  wrapLines={true}
                >
                  {codeData.code}
                </SyntaxHighlighter>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
