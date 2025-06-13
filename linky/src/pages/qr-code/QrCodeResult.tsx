import { Card, CardContent } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Download, Save } from 'lucide-react'
import { useAuth } from "../../contexts/auth-context"
import { useNavigate } from "react-router-dom"
import toast from "react-hot-toast"

interface QRCodeResultProps {
    theme: 'light' | 'dark'
    generatedQR: any
    onDownload: () => void
    onReset: () => void
    onSave?: () => Promise<void>
}

export const QRCodeResult = ({
    theme,
    generatedQR,
    onDownload,
    onReset,
    onSave
}: QRCodeResultProps) => {
    const { user } = useAuth()
    const navigate = useNavigate()
    const cardClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700"
        : "bg-gray-50 border-gray-200"

    const textClasses = theme === 'dark' ? 'text-gray-200' : 'text-gray-900'
    const secondaryTextClasses = theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
    const buttonVariant = theme === 'dark' ? 'outline' : 'default'

    const handleSave = async () => {
        if (!user) {
            toast.error("Please sign in to save and manage your QR codes")
            navigate("/login")
            return
        }

        if (onSave) {
            try {
                await onSave()
                toast.success("QR code saved successfully")
                navigate("/qr-codes")
            } catch (error) {
                toast.error("Failed to save QR code")
            }
        } else {
            navigate("/qr-codes")
        }
    }

    return (
        <Card className={cardClasses}>
            <CardContent className="p-6">
                <div className={`text-center space-y-4 ${textClasses}`}>
                    <h3 className="text-lg font-semibold">Generated QR Code</h3>
                    <div className="flex justify-center">
                        <img
                            src={generatedQR.qr_data || "/placeholder.svg"}
                            alt={`QR code for ${generatedQR.tag}`}
                            className="border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div className="space-y-2">
                        <p className={`text-sm ${secondaryTextClasses}`}>
                            <strong>Tag:</strong> {generatedQR.tag}
                        </p>
                        <p className={`text-sm break-all ${secondaryTextClasses}`}>
                            <strong>URL:</strong> {generatedQR.url}
                        </p>
                    </div>
                    <div className="flex flex-wrap gap-2 justify-center">
                        <Button
                            onClick={onDownload}
                            className="bg-purple-900 hover:opacity-80 text-white"
                        >
                            <Download className="h-4 w-4 mr-2" />
                            Download PNG
                        </Button>
                        <Button
                            onClick={handleSave}
                            variant={buttonVariant}
                            className={theme === 'dark' ? "border-gray-600 hover:bg-gray-700" : ""}
                        >
                            <Save className="h-4 w-4 mr-2" />
                            Save QR Code
                        </Button>
                        <Button
                            onClick={onReset}
                            variant={buttonVariant}
                            className={theme === 'dark' ? "border-gray-600 hover:bg-gray-700" : ""}
                        >
                            Generate Another
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}