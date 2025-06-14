// components/password-result.tsx
"use client"

import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Button } from "../../components/ui/button"
import { Copy, Save, Eye, EyeOff } from "lucide-react"
import type { User } from "@supabase/supabase-js"

interface PasswordResultProps {
    theme: 'light' | 'dark'
    password: string
    passwordStrength: number
    showPassword: boolean
    setShowPassword: (show: boolean) => void
    onCopy: () => void
    onSave: () => void
    loading: boolean
    user: User | null
    passwordTag: string
    setPasswordTag: (tag: string) => void
}

export const PasswordResult = ({
    theme,
    password,
    passwordStrength,
    showPassword,
    setShowPassword,
    onCopy,
    onSave,
    loading,
    user,
    passwordTag,
    setPasswordTag
}: PasswordResultProps) => {
    const inputClasses = theme === 'dark'
        ? "bg-gray-800/50 border-gray-700 text-gray-200"
        : "bg-gray-50 border-gray-300 text-gray-900"

    const labelClasses = theme === 'dark' ? 'text-gray-200' : 'text-gray-700'
    const buttonVariant = theme === 'dark' ? 'outline' : 'default'
    const strengthBarBg = theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'

    const getStrengthColor = () => {
        if (passwordStrength < 30) return "bg-red-500"
        if (passwordStrength < 60) return "bg-yellow-500"
        if (passwordStrength < 80) return "bg-purple-500"
        return "bg-green-500"
    }

    return (
        <>
            <div className="relative">
                <Input
                    value={password}
                    readOnly
                    type={showPassword ? "text" : "password"}
                    className={`pr-10 font-mono ${inputClasses}`}
                />
                <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className={`absolute right-2 top-1/2 -translate-y-1/2 ${theme === 'dark' ? 'text-gray-400 hover:text-white' : 'text-gray-400 hover:text-gray-900'}`}
                >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
            </div>

            <div className="space-y-1">
                <div className={`flex justify-between text-xs ${theme === 'dark' ? 'text-gray-300' : 'text-gray-600'}`}>
                    <span>Strength</span>
                    <span>{passwordStrength}%</span>
                </div>
                <div className={`w-full rounded-full h-2 ${strengthBarBg}`}>
                    <div className={`h-2 rounded-full ${getStrengthColor()}`} style={{ width: `${passwordStrength}%` }}></div>
                </div>
            </div>

            <div className="flex space-x-2">
                <Button
                    onClick={onCopy}
                    variant={buttonVariant}
                    className={`flex-1 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
                >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy
                </Button>

                <Button
                    onClick={onSave}
                    variant={buttonVariant}
                    className={`flex-1 ${theme === 'dark' ? 'border-gray-700 hover:bg-gray-800' : 'border-gray-300 hover:bg-gray-100'}`}
                    disabled={loading || !user}
                >
                    <Save className="mr-2 h-4 w-4" />
                    Save
                </Button>
            </div>

            {user && (
                <div>
                    <Label htmlFor="passwordTag" className={labelClasses}>
                        Password Tag/Name
                    </Label>
                    <Input
                        id="passwordTag"
                        placeholder="e.g., Gmail, Netflix, Bank"
                        value={passwordTag}
                        onChange={(e) => setPasswordTag(e.target.value)}
                        className={inputClasses}
                    />
                </div>
            )}
        </>
    )
}