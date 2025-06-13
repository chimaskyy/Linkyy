// components/qr-code-form-fields.tsx
"use client"

import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { QrCode } from 'lucide-react'

interface QRCodeFormFieldsProps {
    theme: 'light' | 'dark'
    url: string
    setUrl: (value: string) => void
    tag: string
    setTag: (value: string) => void
    size: number
    setSize: (value: number) => void
    foregroundColor: string
    setForegroundColor: (value: string) => void
    backgroundColor: string
    setBackgroundColor: (value: string) => void
    onSubmit: (e: React.FormEvent) => void
    loading: boolean
    isFormValid: boolean
}

export const QRCodeFormFields = ({
    theme,
    url,
    setUrl,
    tag,
    setTag,
    size,
    setSize,
    foregroundColor,
    setForegroundColor,
    backgroundColor,
    setBackgroundColor,
    onSubmit,
    loading,
    isFormValid
}: QRCodeFormFieldsProps) => {
    const inputClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700 text-gray-200 placeholder-gray-400 focus:border-purple-500 focus:ring-purple-500"
        : "bg-gray-50 border-gray-300 text-gray-900 placeholder-gray-500 focus:border-purple-500 focus:ring-purple-500"

    return (
        <form onSubmit={onSubmit} className="space-y-4">
            <div className="space-y-2">
                <Label htmlFor="qr-url">
                    Enter URL to generate QR code
                </Label>
                <Input
                    id="qr-url"
                    type="url"
                    placeholder="https://example.com"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    className={inputClasses}
                    required
                />
            </div>

            <div className="space-y-2">
                <Label htmlFor="qr-tag">
                    Tag name (for identification)
                </Label>
                <Input
                    id="qr-tag"
                    type="text"
                    placeholder="My Website QR"
                    value={tag}
                    onChange={(e) => setTag(e.target.value)}
                    className={inputClasses}
                    required
                />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="qr-size">
                        Size (px)
                    </Label>
                    <Input
                        id="qr-size"
                        type="number"
                        min="100"
                        max="500"
                        value={size}
                        onChange={(e) => setSize(Number(e.target.value))}
                        className={inputClasses}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="qr-fg-color">
                        Foreground Color
                    </Label>
                    <Input
                        id="qr-fg-color"
                        type="color"
                        value={foregroundColor}
                        onChange={(e) => setForegroundColor(e.target.value)}
                        className={`${inputClasses} h-10 p-1`}
                    />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="qr-bg-color">
                        Background Color
                    </Label>
                    <Input
                        id="qr-bg-color"
                        type="color"
                        value={backgroundColor}
                        onChange={(e) => setBackgroundColor(e.target.value)}
                        className={`${inputClasses} h-10 p-1`}
                    />
                </div>
            </div>

            <Button
                type="submit"
                className="w-full bg-purple-900 hover:bg-opacity-80 text-white h-12"
                disabled={loading || !isFormValid}
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
    )
}