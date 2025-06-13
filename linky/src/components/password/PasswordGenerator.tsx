import { useState } from "react"
import toast from "react-hot-toast"
import { useAuth } from "../../contexts/auth-context"
import { supabase } from "../../lib/supabase"
import {
    generatePassword,
    encryptPassword,
    calculatePasswordStrength,
    defaultPasswordOptions,
    type PasswordOptions,
} from "../../lib/password-utils"
import { PasswordOptionsForm } from "./PasswordOptionForm"
import { PasswordResult } from "./PasswordResult"
import { useNavigate } from "react-router-dom"

interface PasswordGeneratorFormProps {
    theme?: 'light' | 'dark'
}

 const PasswordGeneratorForm = ({ theme = 'light' }: PasswordGeneratorFormProps) => {
    
    const { user } = useAuth()
    const navigate = useNavigate()
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
        toast.success("Password has been copied to clipboard")
    }

    const handleSavePassword = async () => {
        if (!user) {
            toast.error("Please log in to save your passwords")
            navigate("/login")
            return
        }

        if (!password) {
            toast.error("Please generate a password first")
            return
        }

        if (!passwordTag) {
            toast.error("Please provide a tag for this password")
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

            toast.success("Your password has been saved successfully")
            // Reset form
            setPasswordTag("")
            setPassword("")
            navigate("/passwords")
        } catch (error) {
            console.error("Error saving password:", error)
            toast.error("Failed to save password")
        } finally {
            setLoading(false)
        }
    }

    const passwordStrength = password ? calculatePasswordStrength(password) : 0

    return (
        <div className={`space-y-4 ${theme === 'dark' ? 'text-white' : 'text-gray-900'}`}>
            <PasswordOptionsForm
                theme={theme}
                options={options}
                setOptions={setOptions}
                onGenerate={handleGeneratePassword}
            />

            {password && (
                <PasswordResult
                    theme={theme}
                    password={password}
                    passwordStrength={passwordStrength}
                    showPassword={showPassword}
                    setShowPassword={setShowPassword}
                    onCopy={handleCopyPassword}
                    onSave={handleSavePassword}
                    loading={loading}
                    user={user}
                    passwordTag={passwordTag}
                    setPasswordTag={setPasswordTag}
                />
            )}
        </div>
    )
}
export default PasswordGeneratorForm