"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent } from "../components/ui/card"
import { useToast } from "../hooks/use-toast"
import { supabase } from "../lib/supabase"
import { useAuth } from "../contexts/auth-context"
import { Download, Copy, Check, QrCode } from 'lucide-react'
import QRCode from "qrcode"

interface QRCodeData {
    id: string
    tag: string
    url: string
    qr_data: string
    size: number
    foreground_color: string
    background_color: string
}

const QRCodeGeneratorForm = () => {
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [tag, setTag] = useState("")
    const [size, setSize] = useState(200)
    const [foregroundColor, setForegroundColor] = useState("#000000")
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
    const [generatedQR, setGeneratedQR] = useState<QRCodeData | null>(null)
    const [copied, setCopied] = useState(false)

    const generateQRCode = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url.trim()) {
            toast({
                title: "Error",
                description: "Please enter a URL",
                variant: "destructive",
            })
            return
        }

        if (!tag.trim()) {
            toast({
                title: "Error",
                description: "Please enter a tag name",
                variant: "destructive",
            })
            return
        }

        // Validate URL
        try {
            new URL(url)
        } catch {
            toast({
                title: "Error",
                description: "Please enter a valid URL",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            // Generate QR code
            const qrDataURL = await QRCode.toDataURL(url, {
                width: size,
                margin: 2,
                color: {
                    dark: foregroundColor,
                    light: backgroundColor,
                },
            })

            if (user) {
                // Save to database if user is logged in
                const { data, error } = await supabase
                    .from("qr_codes")
                    .insert({
                        user_id: user.id,
                        tag: tag.trim(),
                        url: url.trim(),
                        qr_data: qrDataURL,
                        size,
                        foreground_color: foregroundColor,
                        background_color: backgroundColor,
                    })
                    .select()
                    .single()

                if (error) throw error

                setGeneratedQR(data)
                toast({
                    title: "QR Code Generated!",
                    description: "Your QR code has been created and saved",
                })
            } else {
                // For non-logged in users, just show the QR code
                setGeneratedQR({
                    id: "temp",
                    tag: tag.trim(),
                    url: url.trim(),
                    qr_data: qrDataURL,
                    size,
                    foreground_color: foregroundColor,
                    background_color: backgroundColor,
                })
                toast({
                    title: "QR Code Generated!",
                    description: "Sign in to save your QR codes",
                })
            }
        } catch (error) {
            console.error("Error generating QR code:", error)
            toast({
                title: "Error",
                description: "Failed to generate QR code",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const downloadQRCode = () => {
        if (!generatedQR) return

        const link = document.createElement("a")
        link.download = `${generatedQR.tag}-qr-code.png`
        link.href = generatedQR.qr_data
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)

        // Update download count if user is logged in
        if (user && generatedQR.id !== "temp") {
            supabase
                .from("qr_codes")
                .update({ downloads: (generatedQR as any).downloads + 1 || 1 })
                .eq("id", generatedQR.id)
                .then(() => { })
        }

        toast({
            title: "Downloaded!",
            description: "QR code has been downloaded as PNG",
        })
    }

    const copyUrl = () => {
        if (generatedQR) {
            navigator.clipboard.writeText(generatedQR.url)
            setCopied(true)
            setTimeout(() => setCopied(false), 2000)
            toast({
                title: "Copied!",
                description: "URL copied to clipboard",
            })
        }
    }

    const resetForm = () => {
        setUrl("")
        setTag("")
        setGeneratedQR(null)
        setCopied(false)
    }

    return (
        <div className="space-y-6">
            <form onSubmit={generateQRCode} className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="qr-url" className="text-gray-900">
                        Enter URL to generate QR code
                    </Label>
                    <Input
                        id="qr-url"
                        type="url"
                        placeholder="https://example.com"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="qr-tag" className="text-gray-900">
                        Tag name (for identification)
                    </Label>
                    <Input
                        id="qr-tag"
                        type="text"
                        placeholder="My Website QR"
                        value={tag}
                        onChange={(e) => setTag(e.target.value)}
                        className="bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500"
                        required
                    />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="space-y-2">
                        <Label htmlFor="qr-size" className="text-gray-900">
                            Size (px)
                        </Label>
                        <Input
                            id="qr-size"
                            type="number"
                            min="100"
                            max="500"
                            value={size}
                            onChange={(e) => setSize(Number(e.target.value))}
                            className="bg-gray-50 border-gray-300 text-gray-900"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="qr-fg-color" className="text-gray-900">
                            Foreground Color
                        </Label>
                        <Input
                            id="qr-fg-color"
                            type="color"
                            value={foregroundColor}
                            onChange={(e) => setForegroundColor(e.target.value)}
                            className="bg-gray-50 border-gray-300 h-10"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="qr-bg-color" className="text-gray-900">
                            Background Color
                        </Label>
                        <Input
                            id="qr-bg-color"
                            type="color"
                            value={backgroundColor}
                            onChange={(e) => setBackgroundColor(e.target.value)}
                            className="bg-gray-50 border-gray-300 h-10"
                        />
                    </div>
                </div>

                <Button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white h-12"
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white mr-2"></div>
                            Generating...
                        </>
                    ) : (
                        <>
                            <QrCode className="h-4 w-4 mr-2" />
                            Generate QR Code
                        </>
                    )}
                </Button>
            </form>

            {generatedQR && (
                <Card className="bg-gray-50 border-gray-200">
                    <CardContent className="p-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold text-gray-900">Generated QR Code</h3>
                            <div className="flex justify-center">
                                <img
                                    src={generatedQR.qr_data || "/placeholder.svg"}
                                    alt={`QR code for ${generatedQR.tag}`}
                                    className="border border-gray-300 rounded-lg"
                                />
                            </div>
                            <div className="space-y-2">
                                <p className="text-sm text-gray-600">
                                    <strong>Tag:</strong> {generatedQR.tag}
                                </p>
                                <p className="text-sm text-gray-600 break-all">
                                    <strong>URL:</strong> {generatedQR.url}
                                </p>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-2 justify-center">
                                <Button onClick={downloadQRCode} className="bg-green-600 hover:bg-green-700 text-white">
                                    <Download className="h-4 w-4 mr-2" />
                                    Download PNG
                                </Button>
                                <Button onClick={copyUrl} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                    {copied ? <Check className="h-4 w-4 mr-2" /> : <Copy className="h-4 w-4 mr-2" />}
                                    {copied ? "Copied!" : "Copy URL"}
                                </Button>
                                <Button onClick={resetForm} variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-100">
                                    Generate Another
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            )}
        </div>
    )
}

export default QRCodeGeneratorForm
