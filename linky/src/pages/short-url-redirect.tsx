import { useEffect, useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { supabase } from "../lib/supabase"

export default function ShortUrlRedirect() {
  const { code } = useParams<{ code: string }>()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const redirectToUrl = async () => {
      if (!code) {
        navigate("/")
        return
      }

      try {
        // Get the URL from the database
        const { data: url, error } = await supabase
          .from("urls")
          .select("id, original_url, clicks")
          .eq("short_code", code)
          .single()

        if (error || !url) {
          setError("URL not found")
          setTimeout(() => navigate("/"), 3000)
          return
        }

        // Increment the click count
        await supabase
          .from("urls")
          .update({ clicks: (url.clicks || 0) + 1 })
          .eq("id", url.id)

        // Redirect to the original URL
        window.location.href = url.original_url
      } catch (error) {
        console.error("Error in URL redirect:", error)
        setError("An error occurred")
        setTimeout(() => navigate("/"), 3000)
      } finally {
        setLoading(false)
      }
    }

    redirectToUrl()
  }, [code, navigate])

  if (loading) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mx-auto mb-4"></div>
          <p className="text-lg">Redirecting...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-gray-900 via-gray-950 to-black text-white flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Error</h1>
          <p className="text-lg mb-4">{error}</p>
          <p>Redirecting to home page...</p>
        </div>
      </div>
    )
  }

  return null
}
