import { useState } from "react"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import QRCode from "qrcode"
import { QRCodeFormFields } from "./QrCodeFormField"
import { QRCodeResult } from "./QrCodeResult"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export interface QRCodeData {
    id: string
    tag: string
    url: string
    qr_data: string
    size: number
    foreground_color: string
    background_color: string
}

interface QRCodeGeneratorFormProps {
    theme?: 'light' | 'dark'
}

const QRCodeGeneratorForm = ({ theme = 'light' }: QRCodeGeneratorFormProps) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false)
    const [url, setUrl] = useState("")
    const [tag, setTag] = useState("")
    const [size, setSize] = useState(200)
    const [foregroundColor, setForegroundColor] = useState("#000000")
    const [backgroundColor, setBackgroundColor] = useState("#FFFFFF")
    const [generatedQR, setGeneratedQR] = useState<QRCodeData | null>(null)

    const generateQRCode = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!url.trim()) {
            toast.error("Please enter a URL")
            return
        }

        if (!tag.trim()) {
            toast.error("Please enter a tag name")
            return
        }

        try {
            new URL(url)
        } catch {
            toast.error("Please enter a valid URL")
            return
        }

        setLoading(true)

        try {
            const qrDataURL = await QRCode.toDataURL(url, {
                width: size,
                margin: 2,
                color: {
                    dark: foregroundColor,
                    light: backgroundColor,
                },
            })

            if (user) {
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
                toast.success("QR Code Generated!")
            } else {
                setGeneratedQR({
                    id: "temp",
                    tag: tag.trim(),
                    url: url.trim(),
                    qr_data: qrDataURL,
                    size,
                    foreground_color: foregroundColor,
                    background_color: backgroundColor,
                })
                toast.success("QR Code Generated!")
            }
        } catch (error) {
            console.error("Error generating QR code:", error)
            toast.error("Failed to generate QR code")
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

        if (user && generatedQR.id !== "temp") {
            const downloads = (generatedQR as QRCodeData & { downloads?: number }).downloads ?? 0
            supabase
                .from("qr_codes")
                .update({ downloads: downloads + 1 })
                .eq("id", generatedQR.id)
                .then(() => { })
        }

        toast.success("QR code has been downloaded as PNG")
    }

    const handleSaveQRCode = async () => {
        if (!user || !generatedQR) return

        try {
            await supabase.from('qr_codes').insert({
                user_id: user.id,
                url: generatedQR.url,
                tag: generatedQR.tag,
                qr_data: generatedQR.qr_data,
                size: generatedQR.size,
                foreground_color: generatedQR.foreground_color,
                background_color: generatedQR.background_color
            })
            
            navigate("/qr-codes")
        } catch {
            toast.error("Failed to save QR code")
        }
    }

    const resetForm = () => {
        setUrl("")
        setTag("")
        setGeneratedQR(null)
    }

    const isFormValid = !!url.trim() && !!tag.trim()

    return (
        <div className={`space-y-6 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <QRCodeFormFields
                theme={theme}
                url={url}
                setUrl={setUrl}
                tag={tag}
                setTag={setTag}
                size={size}
                setSize={setSize}
                foregroundColor={foregroundColor}
                setForegroundColor={setForegroundColor}
                backgroundColor={backgroundColor}
                setBackgroundColor={setBackgroundColor}
                onSubmit={generateQRCode}
                loading={loading}
                isFormValid={isFormValid}
            />

            {generatedQR && (
                <QRCodeResult
                    theme={theme}
                    generatedQR={generatedQR}
                    onDownload={downloadQRCode}
                    onReset={resetForm}
                    onSave={user ? handleSaveQRCode : undefined}
                />
            )}
        </div>
    )
}

export default QRCodeGeneratorForm