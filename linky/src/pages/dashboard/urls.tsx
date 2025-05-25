"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Copy, ExternalLink, Trash2, Search, Clock } from "lucide-react"
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
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchUrls = async () => {
            if (!user) return

            try {
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
        const url = `${window.location.origin}/s/${shortCode}`
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

    const filteredUrls = urls.filter(
        (url) =>
            url.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
            url.short_code.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-xl">Create New Short URL</CardTitle>
                        <CardDescription>Shorten and track your links</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <UrlShortenerForm />
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-xl">My URLs</CardTitle>
                            <CardDescription>All my shortened links</CardDescription>
                        </div>
                        {/* <div className="relative w-64">
                            <Search className="absolute left-2 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                            <Input
                                placeholder="Search URLs..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-8 bg-gray-800 border-gray-700"
                            />
                        </div> */}
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredUrls.length > 0 ? (
                            <div className="space-y-4">
                                {filteredUrls.map((url) => (
                                    <div key={url.id} className="p-4 bg-gray-800/50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium text-lg">{url.title || "Untitled Link"}</h3>
                                            <div className="flex items-center text-xs text-gray-400">
                                                <Clock className="h-3 w-3 mr-1" />
                                                <span>{formatDate(url.created_at)}</span>
                                            </div>
                                        </div>

                                        <div className="mb-3 text-sm text-gray-400 break-all">{url.original_url}</div>

                                        <div className="flex flex-wrap justify-between items-center gap-2">
                                            <div className="flex items-center">
                                                <span className="text-purple-400 mr-2">
                                                    {window.location.origin}/s/{url.short_code}
                                                </span>
                                                <div className="flex space-x-1">
                                                    <button
                                                        onClick={() => copyShortUrl(url.short_code)}
                                                        className="text-gray-400 hover:text-white p-1"
                                                        aria-label="Copy short URL"
                                                    >
                                                        <Copy className="h-4 w-4" />
                                                    </button>
                                                    <a
                                                        href={`/s/${url.short_code}`}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        className="text-gray-400 hover:text-white p-1"
                                                    >
                                                        <ExternalLink className="h-4 w-4" />
                                                    </a>
                                                </div>
                                            </div>

                                            <div className="flex items-center gap-4">
                                                <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded text-xs">
                                                    {url.clicks} clicks
                                                </span>
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => deleteUrl(url.id)}
                                                    className="border-gray-700 hover:bg-gray-700 hover:text-white"
                                                >
                                                    <Trash2 className="h-4 w-4 mr-1" />
                                                    Delete
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">No URLs found</p>
                                {searchTerm ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchTerm("")}
                                        className="border-gray-700 hover:bg-gray-700"
                                    >
                                        Clear search
                                    </Button>
                                ) : (
                                    <p className="text-sm text-gray-500">Create your first short URL above</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
