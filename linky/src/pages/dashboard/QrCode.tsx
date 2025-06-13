"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Download, Trash2, Search, QrCode, Copy, Check } from 'lucide-react'
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { formatDate } from "../../lib/utils"
import DashboardLayout from "../../components/dashboard-layout"
import { Link } from "react-router-dom"

interface QRCodeData {
    id: string
    user_id: string
    tag: string
    url: string
    qr_data: string
    size: number
    foreground_color: string
    background_color: string
    downloads: number
    created_at: string
}

const QRCodesPage = () => {
    const { toast } = useToast()
    const { user } = useAuth()
    const [qrCodes, setQrCodes] = useState<QRCodeData[]>([])
    const [loading, setLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [copiedId, setCopiedId] = useState<string | null>(null)

    useEffect(() => {
        const fetchQRCodes = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from("qr_codes")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) throw error

                setQrCodes(data || [])
            } catch (error) {
                console.error("Error fetching QR codes:", error)
                toast({
                    title: "Error",
                    description: "Failed to load QR codes",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchQRCodes()
    }, [user, toast])

    const deleteQRCode = async (id: string) => {
        if (!user) return

        try {
            const { error } = await supabase.from("qr_codes").delete().eq("id", id).eq("user_id", user.id)

            if (error) throw error

            setQrCodes((prev) => prev.filter((qr) => qr.id !== id))
            toast({
                title: "QR code deleted",
                description: "QR code has been deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting QR code:", error)
            toast({
                title: "Error",
                description: "Failed to delete QR code",
                variant: "destructive",
            })
        }
    }

    const downloadQRCode = async (qrCode: QRCodeData) => {
        const link = document.createElement("a")
        link.download = `${qrCode.tag}-qr-code.png`
        link.href = qrCode.qr_data
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Update download count
        try {
            const { error } = await supabase
                .from("qr_codes")
                .update({ downloads: qrCode.downloads + 1 })
                .eq("id", qrCode.id)

            if (!error) {
                setQrCodes((prev) =>
                    prev.map((qr) => (qr.id === qrCode.id ? { ...qr, downloads: qr.downloads + 1 } : qr))
                )
            }
        } catch (error) {
            console.error("Error updating download count:", error)
        }

        toast({
            title: "Downloaded!",
            description: "QR code has been downloaded as PNG",
        })
    }

    const copyUrl = (url: string, id: string) => {
        navigator.clipboard.writeText(url)
        setCopiedId(id)
        setTimeout(() => setCopiedId(null), 2000)
        toast({
            title: "Copied!",
            description: "URL copied to clipboard",
        })
    }

    const filteredQRCodes = qrCodes.filter(
        (qr) =>
            qr.tag.toLowerCase().includes(searchTerm.toLowerCase()) ||
            qr.url.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <div className="flex justify-between items-center">
                    <h1 className="text-2xl font-bold">My QR Codes</h1>
                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                        <Link to="/qr-code-generator">Generate New QR Code</Link>
                    </Button>
                </div>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <QrCode className="h-5 w-5" />
                            QR Code Management
                        </CardTitle>
                        <CardDescription>Manage all your generated QR codes</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="mb-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <Input
                                    placeholder="Search QR codes by tag or URL..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-10 bg-gray-800/50 border-gray-700 text-white"
                                />
                            </div>
                        </div>

                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredQRCodes.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {filteredQRCodes.map((qrCode) => (
                                    <Card key={qrCode.id} className="bg-gray-800/50 border-gray-700">
                                        <CardHeader className="pb-2">
                                            <div className="flex justify-between items-start">
                                                <CardTitle className="text-lg truncate">{qrCode.tag}</CardTitle>
                                                <Button
                                                    variant="ghost"
                                                    size="sm"
                                                    onClick={() => deleteQRCode(qrCode.id)}
                                                    className="text-gray-400 hover:text-red-400 hover:bg-transparent"
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </CardHeader>
                                        <CardContent className="space-y-4">
                                            <div className="flex justify-center">
                                                <img
                                                    src={qrCode.qr_data || "/placeholder.svg"}
                                                    alt={`QR code for ${qrCode.tag}`}
                                                    className="w-32 h-32 border border-gray-600 rounded"
                                                />
                                            </div>
                                            <div className="space-y-2 text-sm">
                                                <p className="text-gray-400 truncate">
                                                    <strong>URL:</strong> {qrCode.url}
                                                </p>
                                                <p className="text-gray-400">
                                                    <strong>Size:</strong> {qrCode.size}px
                                                </p>
                                                <p className="text-gray-400">
                                                    <strong>Downloads:</strong> {qrCode.downloads}
                                                </p>
                                                <p className="text-gray-400">
                                                    <strong>Created:</strong> {formatDate(qrCode.created_at)}
                                                </p>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    onClick={() => downloadQRCode(qrCode)}
                                                    size="sm"
                                                    className="flex-1 bg-purple-900 hover:opacity-90 text-white"
                                                    aria-label={`Download QR code for ${qrCode.tag}`}
                                                >
                                                    <Download className="h-4 w-4 mr-1" />
                                                    Download
                                                </Button>
                                                <Button
                                                    onClick={() => copyUrl(qrCode.url, qrCode.id)}
                                                    variant="outline"
                                                    size="sm"
                                                    aria-label={`Copy URL for ${qrCode.tag}`}
                                                    disabled={copiedId === qrCode.id}
                                                    className="border-gray-600 text-gray-300 hover:bg-gray-700"
                                                >
                                                    {copiedId === qrCode.id ? (
                                                        <Check className="h-4 w-4" />
                                                    ) : (
                                                        <Copy className="h-4 w-4" />
                                                    )}
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : (
                            <Card className="bg-gray-800/50 border-gray-700">
                                <CardContent className="pt-6 text-center">
                                    <QrCode className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-400 mb-4">
                                        {searchTerm ? "No QR codes found matching your search." : "You haven't generated any QR codes yet."}
                                    </p>
                                    <Button asChild className="bg-purple-600 hover:bg-purple-700">
                                        <Link to="/qr-code-generator">Generate Your First QR Code</Link>
                                    </Button>
                                </CardContent>
                            </Card>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}

export default QRCodesPage;