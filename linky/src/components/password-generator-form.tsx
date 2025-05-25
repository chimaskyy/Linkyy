"use client"

import { useState } from "react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Copy, RefreshCw, Save, Eye, EyeOff } from "lucide-react"
import { useToast } from "../hooks/use-toast"
import { useAuth } from "../contexts/auth-context"
import { supabase } from "../lib/supabase"
import {
    generatePassword,
    encryptPassword,
    calculatePasswordStrength,
    defaultPasswordOptions,
    type PasswordOptions,
} from "../lib/password-utils"

export function PasswordGeneratorForm() {
    const { toast } = useToast()
    const { user } = useAuth()
    const [passwordTag, setPasswordTag] = useState("")
    const [password, setPassword] = useState("")
    const [showPassword, setShowPassword] = useState(false)
    const [options, setOptions] = useState<PasswordOptions>(defaultPasswordOptions)
    const [loading, setLoading] = useState(false)

    const handleGeneratePassword = () => {
        const newPassword = generatePassword(options)
        setPassword(newPassword)
    }

    const handleCopyPassword = () => {
        navigator.clipboard.writeText(password)
        toast({
            title: "Password copied",
            description: "Password has been copied to clipboard",
        })
    }

    const handleSavePassword = async () => {
        if (!user) {
            toast({
                title: "Authentication required",
                description: "Please log in to save passwords",
                variant: "destructive",
            })
            return
        }

        if (!password) {
            toast({
                title: "No password generated",
                description: "Please generate a password first",
                variant: "destructive",
            })
            return
        }

        if (!passwordTag) {
            toast({
                title: "Tag required",
                description: "Please provide a tag for this password",
                variant: "destructive",
            })
            return
        }

        setLoading(true)

        try {
            const encryptedPwd = encryptPassword(password, user.id)

            const { error } = await supabase.from("passwords").insert({
                user_id: user.id,
                tag: passwordTag,
                encrypted_password: encryptedPwd,
                options: options,
            })

            if (error) throw error

            toast({
                title: "Password saved",
                description: "Your password has been saved successfully",
            })

            // Reset form
            setPasswordTag("")
            setPassword("")
        } catch (error) {
            console.error("Error saving password:", error)
            toast({
                title: "Error",
                description: "Failed to save password",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = password ? calculatePasswordStrength(password) : 0

    const getStrengthColor = () => {
        if (passwordStrength < 30) return "bg-red-500"
        if (passwordStrength < 60) return "bg-yellow-500"
        if (passwordStrength < 80) return "bg-blue-500"
        return "bg-green-500"
    }

    return (
        <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="passwordLength">Password Length: {options.length}</Label>
                    <input
                        id="passwordLength"
                        type="range"
                        min="4"
                        max="32"
                        value={options.length}
                        onChange={(e) => setOptions({ ...options, length: Number.parseInt(e.target.value) })}
                        className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
                    />
                </div>

                <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="uppercase"
                            checked={options.includeUppercase}
                            onChange={(e) => setOptions({ ...options, includeUppercase: e.target.checked })}
                            className="rounded bg-gray-700 border-gray-600"
                        />
                        <Label htmlFor="uppercase">Uppercase (A-Z)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="lowercase"
                            checked={options.includeLowercase}
                            onChange={(e) => setOptions({ ...options, includeLowercase: e.target.checked })}
                            className="rounded bg-gray-700 border-gray-600"
                        />
                        <Label htmlFor="lowercase">Lowercase (a-z)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="numbers"
                            checked={options.includeNumbers}
                            onChange={(e) => setOptions({ ...options, includeNumbers: e.target.checked })}
                            className="rounded bg-gray-700 border-gray-600"
                        />
                        <Label htmlFor="numbers">Numbers (0-9)</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                        <input
                            type="checkbox"
                            id="symbols"
                            checked={options.includeSymbols}
                            onChange={(e) => setOptions({ ...options, includeSymbols: e.target.checked })}
                            className="rounded bg-gray-700 border-gray-600"
                        />
                        <Label htmlFor="symbols">Symbols (!@#$%)</Label>
                    </div>
                </div>
            </div>

            <Button onClick={handleGeneratePassword} className="w-full bg-purple-600 hover:bg-purple-700">
                <RefreshCw className="mr-2 h-4 w-4" />
                Generate Password
            </Button>

            {password && (
                <>
                    <div className="relative">
                        <Input
                            value={password}
                            readOnly
                            type={showPassword ? "text" : "password"}
                            className="pr-10 font-mono bg-gray-800 border-gray-700"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    <div className="space-y-1">
                        <div className="flex justify-between text-xs">
                            <span>Strength</span>
                            <span>{passwordStrength}%</span>
                        </div>
                        <div className="w-full bg-gray-700 rounded-full h-2">
                            <div className={`h-2 rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                        </div>
                    </div>

                    <div className="flex space-x-2">
                        <Button onClick={handleCopyPassword} variant="outline" className="flex-1 border-gray-700 hover:bg-gray-800">
                            <Copy className="mr-2 h-4 w-4" />
                            Copy
                        </Button>

                        <Button
                            onClick={handleSavePassword}
                            variant="outline"
                            className="flex-1 border-gray-700 hover:bg-gray-800"
                            disabled={loading || !user}
                        >
                            <Save className="mr-2 h-4 w-4" />
                            Save
                        </Button>
                    </div>

                    {user && (
                        <div>
                            <Label htmlFor="passwordTag">Password Tag/Name</Label>
                            <Input
                                id="passwordTag"
                                placeholder="e.g., Gmail, Netflix, Bank"
                                value={passwordTag}
                                onChange={(e) => setPasswordTag(e.target.value)}
                                className="bg-gray-800 border-gray-700"
                            />
                        </div>
                    )}
                </>
            )}
        </div>
    )
}
