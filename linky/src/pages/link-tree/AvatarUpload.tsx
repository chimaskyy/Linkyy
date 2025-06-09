import type React from "react"

import { useState } from "react"
import { Button } from "../../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "../../components/ui/card"
import { Upload, X, User } from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"

interface AvatarUploadProps {
    avatarUrl: string | null
    onAvatarChange: (url: string | null) => void
    username: string
}

export function AvatarUpload({ avatarUrl, onAvatarChange, username }: AvatarUploadProps) {
    const [uploading, setUploading] = useState(false)
    const { toast } = useToast()
    const { user } = useAuth()

    const uploadAvatar = async (event: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true)

            if (!event.target.files || event.target.files.length === 0) {
                throw new Error("You must select an image to upload.")
            }

            const file = event.target.files[0]
            const fileExt = file.name.split(".").pop()
            const filePath = `avatars/${user?.id}-${Math.random()}.${fileExt}`

            // Upload file to Supabase Storage
            const { error: uploadError } = await supabase.storage.from("avatars").upload(filePath, file)

            if (uploadError) {
                throw uploadError
            }

            // Get public URL
            const { data } = supabase.storage.from("avatars").getPublicUrl(filePath)

            onAvatarChange(data.publicUrl)

            toast({
                title: "Success",
                description: "Avatar uploaded successfully",
            })
        } catch (error) {
            console.error("Error uploading avatar:", error)
            toast({
                title: "Error",
                description: error instanceof Error ? error.message : "Failed to upload avatar",
                variant: "destructive",
            })
        } finally {
            setUploading(false)
        }
    }

    const removeAvatar = () => {
        onAvatarChange(null)
        toast({
            title: "Avatar removed",
            description: "Your avatar has been removed",
        })
    }

    return (
        <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
            <CardHeader className="items-center">
                <CardTitle className="text-xl">Profile Picture</CardTitle>
                <CardDescription className="text-sm">Upload an avatar for your link tree</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="flex flex-col items-center space-y-4">
                    <div className="relative">
                        {avatarUrl ? (
                            <img
                                src={avatarUrl || "/placeholder.svg"}
                                alt="Avatar"
                                className="w-24 h-24 rounded-full object-cover border-2 border-gray-700"
                            />
                        ) : (
                            <div className="w-24 h-24 rounded-full bg-purple-600 flex items-center justify-center text-white text-2xl font-bold border-2 border-gray-700">
                                {username ? username.charAt(0).toUpperCase() : <User className="h-8 w-8" />}
                            </div>
                        )}

                        {avatarUrl && (
                            <Button
                                variant="destructive"
                                size="sm"
                                className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0"
                                onClick={removeAvatar}
                            >
                                <X className="h-3 w-3" />
                            </Button>
                        )}
                    </div>

                    <div className="flex flex-col items-center space-y-2">
                        <label htmlFor="avatar-upload">
                            <Button
                                variant="outline"
                                className="border-gray-700  text-gray-200 hover:bg-gray-800 cursor-pointer"
                                disabled={uploading}
                                asChild
                            >
                                <span>
                                    <Upload className="h-4 w-4 ml-10" />
                                    {uploading ? "Uploading..." : "Upload Avatar"}
                                </span>
                            </Button>
                        </label>
                        <input
                            id="avatar-upload"
                            type="file"
                            accept="image/*"
                            onChange={uploadAvatar}
                            disabled={uploading}
                            className="hidden"
                        />
                        {/* <p className="text-xs text-gray-400 text-center">Recommended: Square image, at least 200x200px</p> */}
                    </div>
                </div>
            </CardContent>
        </Card>
    )
}
