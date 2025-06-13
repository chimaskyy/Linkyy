// components/UrlShortenerForm.tsx
import { useState } from "react"
import { isValidUrl } from "../../lib/utils"
import toast from "react-hot-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { generateShortCode } from "../../lib/utils"
import { UrlInputForm } from "./UrlInputForm"
import { ShortenedUrlDisplay } from "./ShortenedUrlDisplay"
import { useNavigate } from "react-router-dom"

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

    const { user } = useAuth()
    const navigate = useNavigate()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        // First validate input fields
        if (requireTitle && !title) {
            toast.error("Please enter a title for your link")
            return
        }

        if (!url) {
            toast.error("Please enter a URL")
            return
        }

        if (!isValidUrl(url)) {
            toast.error("Please enter a valid URL")
            return
        }

        // Only check auth after fields are validated
        if (!user) {
            toast.error("Please log in to shorten and track URLs")
            navigate('/login')
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

            toast.success("Your URL has been shortened")

            if (onSuccess && data) onSuccess(data)

            setUrl("")
            setTitle("")

            // Removed automatic navigation to '/urls'
            // navigate('/urls') 

        } catch (error) {
            console.error("Error shortening URL:", error)
            toast.error(error instanceof Error ? error.message : "Failed to shorten URL")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="w-full">
            <UrlInputForm
                url={url}
                title={title}
                isLoading={isLoading}
                theme={theme}
                requireTitle={requireTitle}
                buttonVariant={buttonVariant}
                onUrlChange={setUrl}
                onTitleChange={setTitle}
                onSubmit={handleSubmit}
            />

            {shortUrl && (
                <ShortenedUrlDisplay
                    shortUrl={shortUrl}
                    theme={theme}
                    buttonVariant={buttonVariant}
                />
            )}
        </div>
    )
}

export default UrlShortenerForm