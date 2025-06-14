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

interface UrlShortenerFormProps {
  onSuccess?: (newUrl: {
    id: string;
    user_id: string;
    original_url: string;
    short_code: string;
    title: string;
    clicks: number;
    created_at: string;
  }) => void;
  theme?: 'light' | 'dark';
  requireTitle?: boolean;
  buttonVariant?: 'default' | 'purple' | 'outline';
}

const UrlShortenerForm = ({
  onSuccess,
  theme = 'light',
  requireTitle = false,
  buttonVariant = 'purple'
}: UrlShortenerFormProps) => {
  const [url, setUrl] = useState("")
  const [title, setTitle] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [shortUrl, setShortUrl] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const { toast } = useToast()
  const { user } = useAuth()

  // Theme classes
  const inputClasses = theme === 'dark'
    ? "bg-gray-800/50 border-gray-700 text-gray-200 focus:border-purple-500 focus:ring-purple-500"
    : "bg-gray-50 border-gray-300 text-gray-900 focus:border-purple-500 focus:ring-purple-500"

  const resultClasses = theme === 'dark'
    ? "bg-gray-800/50 border-gray-700"
    : "bg-gray-100 border-gray-300"

  const linkColor = theme === 'dark' ? "text-purple-400 hover:text-purple-300" : "text-purple-900 hover:opacity-80"

  const buttonClasses = {
    default: "",
    purple: theme === 'dark'
      ? "bg-purple-900 hover:opacity-80 text-white"
      : "bg-purple-900 hover:opacity-80 text-white",
    outline: theme === 'dark'
      ? "border-gray-700 text-gray-200 hover:bg-gray-700"
      : "border-gray-300 text-gray-700 hover:bg-gray-200"
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (requireTitle && !title) {
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
      let shortCode = generateShortCode(4)
      let isUnique = false

      while (!isUnique) {
        const { data } = await supabase.from("urls").select("short_code").eq("short_code", shortCode).single()
        if (!data) isUnique = true
        else shortCode = generateShortCode(4)
      }

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

      if (error) throw error

      const baseUrl = window.location.origin
      setShortUrl(`${baseUrl}/${shortCode}`)

      toast({
        title: "Success!",
        description: "Your URL has been shortened",
      })

      if (onSuccess && data) onSuccess(data)

      

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
              placeholder={requireTitle ? "Link title (eg. My Website)" : "Link title (optional)"}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={`${inputClasses} h-12 w-full`}
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
                className={`${inputClasses} pl-10 h-12 w-full`}
              />
            </div>
            <Button
              type="submit"
              className={`${buttonClasses[buttonVariant]} h-12 px-6 w-full sm:w-auto`}
              disabled={isLoading}
            >
              {isLoading ? "Shortening..." : "Shorten link"}
            </Button>
          </div>
        </div>
      </form>

      {shortUrl && (
        <div className={`mt-4 p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between ${resultClasses}`}>
          <div className="mb-3 sm:mb-0 truncate max-w-full sm:max-w-[70%]">
            <p className="text-sm text-gray-400">Your shortened URL:</p>
            <a
              href={shortUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkColor} truncate block`}
            >
              {shortUrl}
            </a>
          </div>
          <Button
            type="button"
            variant="outline"
            className={buttonClasses.outline}
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
export default UrlShortenerForm