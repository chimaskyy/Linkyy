"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Copy, ExternalLink, Trash2, Clock } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { formatDate } from "../../lib/utils"
import { UrlShortenerForm } from "../../components/url-shortener-form"
import DashboardLayout from "../../components/dashboard-layout"

interface Url {
    id: string
    user_id: string
    original_url: string
    short_code: string
    title: string
    clicks: number
    created_at: string
}

export default function UrlsPage() {
    const { toast } = useToast()
    const { user } = useAuth()
    const [urls, setUrls] = useState<Url[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUrls = async () => {
            if (!user) return

            try {
                setLoading(true)
                const { data, error } = await supabase
                    .from("urls")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) throw error

                setUrls(data || [])
            } catch (error) {
                console.error("Error fetching URLs:", error)
                toast({
                    title: "Error",
                    description: "Failed to load URLs",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchUrls()
    }, [user, toast])

    const copyShortUrl = (shortCode: string) => {
        const url = `${window.location.origin}/${shortCode}`
        navigator.clipboard.writeText(url)
        toast({
            title: "URL copied",
            description: "Short URL has been copied to clipboard",
        })
    }

    const deleteUrl = async (id: string) => {
        if (!user) return

        try {
            const { error } = await supabase.from("urls").delete().eq("id", id).eq("user_id", user.id)

            if (error) throw error

            setUrls((prev) => prev.filter((url) => url.id !== id))
            toast({
                title: "URL deleted",
                description: "URL has been deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting URL:", error)
            toast({
                title: "Error",
                description: "Failed to delete URL",
                variant: "destructive",
            })
        }
    }

    const handleUrlCreated = (newUrl: Url) => {
        setUrls((prev) => [newUrl, ...prev])
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl">Create New Short URL</CardTitle>
                        <CardDescription>Shorten and track your links</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UrlShortenerForm onSuccess={handleUrlCreated} />
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl">My URLs</CardTitle>
                        <CardDescription>All my shortened links</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8" aria-live="polite" aria-busy={loading}>
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500" />
                            </div>
                        ) : urls.length > 0 ? (
                            <ul className="space-y-4">
                                {urls.map((url) => (
                                    <li key={url.id} className="p-4 bg-gray-800/50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium text-lg">
                                                {url.title || "Untitled Link"}
                                            </h3>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                                <span>{formatDate(url.created_at)}</span>
                                            </div>
                                        </div>

                                        <p className="mb-3 text-sm text-gray-400 break-all">
                                            {url.original_url}
                                        </p>

                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <div className="flex items-center">
                                                <span className="text-purple-400 mr-2">
                                                    {window.location.origin}/s/{url.short_code}
                                                </span>
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => copyShortUrl(url.short_code)}
                                                        className="text-gray-400 hover:text-white p-1"
                                                        aria-label={`Copy short URL for ${url.title}`}
                                                    >
                                                        <Copy className="h-4 w-4" aria-hidden="true" />
                                                    </button>
                                                    <a
                                                        href={`/${url.short_code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-white p-1"
                                                        aria-label={`Open ${url.title} in new tab`}
                                                    >
                                                        <ExternalLink className="h-4 w-4" aria-hidden="true" />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs">
                                                    {url.clicks} {url.clicks === 1 ? "click" : "clicks"}
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteUrl(url.id)}
                                                    className="border-gray-700 hover:bg-gray-700 hover:text-white"
                                                    aria-label={`Delete ${url.title}`}
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" aria-hidden="true" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        ) : (
                            <div className="text-center py-8" aria-live="polite">
                                <p className="text-gray-400 mb-4">No URLs found</p>
                                <p className="text-sm text-gray-500">Create your first short URL above</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}