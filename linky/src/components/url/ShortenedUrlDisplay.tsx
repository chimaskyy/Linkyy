// components/ShortenedUrlDisplay.tsx
import { Button } from "../../components/ui/button"
import { Copy, Check, List } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface ShortenedUrlDisplayProps {
    shortUrl: string
    theme?: 'light' | 'dark'
    buttonVariant?: 'default' | 'purple' | 'outline'
}

export const ShortenedUrlDisplay = ({
    shortUrl,
    theme = 'light',
    buttonVariant = 'outline'
}: ShortenedUrlDisplayProps) => {
    const [copied, setCopied] = useState(false)
    const { toast } = useToast()
    const navigate = useNavigate()

    const buttonClasses = {
        default: "",
        purple: theme === 'dark'
            ? "bg-purple-900 hover:opacity-80 text-white"
            : "bg-purple-900 hover:opacity-80 text-white",
        outline: theme === 'dark'
            ? "border-gray-700 text-gray-200 hover:bg-gray-700"
            : "border-gray-300 text-gray-700 hover:bg-gray-200"
    }

    const linkColor = theme === 'dark' ? "text-purple-400 hover:text-purple-300" : "text-blue-400 hover:text-blue-300"
    const resultClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700"
        : "bg-gray-100 border-gray-300"

    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortUrl)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
        toast({
            title: "Copied!",
            description: "URL copied to clipboard",
        })
    }

    const viewAllUrls = () => {
        navigate('/urls')
    }

    return (
        <div
            className={`mt-4 p-4 rounded-lg border flex flex-col sm:flex-row items-center justify-between ${resultClasses}`}
            aria-live="polite"
            aria-atomic="true"
        >
            <div className="mb-3 sm:mb-0 truncate max-w-full sm:max-w-[70%]">
                <p className="text-sm text-gray-400">Your shortened URL:</p>
                <a
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`${linkColor} truncate block`}
                    aria-label={`Shortened URL: ${shortUrl}`}
                >
                    {shortUrl}
                </a>
            </div>
            <div className="flex gap-2">
                <Button
                    type="button"
                    variant="outline"
                    className={buttonClasses[buttonVariant]}
                    onClick={copyToClipboard}
                    aria-label={copied ? "URL copied to clipboard" : "Copy URL to clipboard"}
                >
                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                    {copied ? "Copied" : "Copy"}
                </Button>
                <Button
                    type="button"
                    variant="outline"
                    className={buttonClasses[buttonVariant]}
                    onClick={viewAllUrls}
                    aria-label="View all your shortened URLs"
                >
                    <List className="h-4 w-4 mr-2" />
                    View All
                </Button>
            </div>
        </div>
    )
}