"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Link2, Copy, Check } from "lucide-react"
import { isValidUrl } from "../lib/utils"
import { useToast } from "../hooks/use-toast"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/auth-context"
import { generateShortCode } from "../lib/utils"

export function UrlShortenerForm() {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if(!title) {
      toast({
        title: "Error",
        description: "Please enter a title for your link",
        variant: "destructive",
      })
      return
    }
    if (!url) {
      toast({
        title: "Error",
        description: "Please enter a URL",
        variant: "destructive",
      })
      return
    }

    if (!isValidUrl(url)) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL including http:// or https://",
        variant: "destructive",
      })
      return
    }

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to shorten URLs",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)

    try {
      // Generate a unique short code
      let shortCode = generateShortCode(4)
      let isUnique = false

      while (!isUnique) {
        const { data } = await supabase.from("urls").select("short_code").eq("short_code", shortCode).single()

        if (!data) {
          isUnique = true
        } else {
          shortCode = generateShortCode(4)
        }
      }

      // Insert the new URL
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } = await supabase
        .from("urls")
        .insert({
          user_id: user.id,
          original_url: url,
          short_code: shortCode,
          title: title || "Untitled Link",
        })
        .select()
        .single()

      if (error) {
        throw error
      }

      const baseUrl = window.location.origin
      setShortUrl(`${baseUrl}/${shortCode}`)

      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      })
    } catch (error) {
      console.error("Error shortening URL:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to shorten URL",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const copyToClipboard = () => {
    if (shortUrl) {
      navigator.clipboard.writeText(shortUrl)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
      toast({
        title: "Copied!",
        description: "URL copied to clipboard",
      })
    }
  }

  return (
    <div className="w-full">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Input
              type="text"
              placeholder="Link title (eg. My Website)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="bg-gray-800/50 border-gray-700 text-gray-500 h-12 w-full focus:border-purple-500 focus:ring-purple-500"
            />
          </div>
          <div className="flex flex-col sm:flex-row items-center">
            <div className="relative flex-grow mb-3 sm:mb-0 w-full">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">
                <Link2 className="h-5 w-5" />
              </div>
              <Input
                type="text"
                placeholder="Paste your link"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                className="pl-10 bg-gray-800/50 border-gray-700 text-gray-500 h-12 w-full focus:border-purple-500 focus:ring-purple-500"
              />
            </div>
            <Button
              type="submit"
              className="bg-purple-600 hover:bg-purple-700 text-white h-12 px-6 w-full sm:w-auto"
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten link"}
            </Button>
          </div>
        </div>
      </form>

      {shortUrl && (
        <div className="mt-4 p-4 bg-gray-800/50 rounded-lg border border-gray-700 flex flex-col sm:flex-row items-center justify-between">
          <div className="mb-3 sm:mb-0 truncate max-w-full sm:max-w-[70%]">
            <p className="text-sm text-gray-400">Your shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-400 hover:text-purple-300 truncate block"
            >
              {shortUrl}
            </a>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-gray-700 text-gray-200 hover:bg-gray-700"
            onClick={copyToClipboard}
          >
            {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
            {copied ? "Copied" : "Copy"}
          </Button>
        </div>
      )}
    </div>
  )
}
