"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Eye, EyeOff, Copy, Trash2} from "lucide-react"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import { formatDate } from "../../lib/utils"
import { decryptPassword, type PasswordEntry } from "../../lib/password-utils"
import { PasswordGeneratorForm } from "../../components/password-generator-form"
import DashboardLayout from "../../components/dashboard-layout"

export default function PasswordsPage() {
    const { toast } = useToast()
    const { user } = useAuth()
    const [passwords, setPasswords] = useState<PasswordEntry[]>([])
    const [visiblePasswords, setVisiblePasswords] = useState<Record<string, boolean>>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const fetchPasswords = async () => {
            if (!user) return

            try {
                const { data, error } = await supabase
                    .from("passwords")
                    .select("*")
                    .eq("user_id", user.id)
                    .order("created_at", { ascending: false })

                if (error) throw error

                setPasswords(data || [])
            } catch (error) {
                console.error("Error fetching passwords:", error)
                toast({
                    title: "Error",
                    description: "Failed to load passwords",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchPasswords()
    }, [user, toast])

    const togglePasswordVisibility = (id: string) => {
        setVisiblePasswords((prev) => ({
            ...prev,
            [id]: !prev[id],
        }))
    }

    const copyPassword = (encryptedPassword: string) => {
        if (!user) return

        try {
            const decrypted = decryptPassword(encryptedPassword, user.id)
            navigator.clipboard.writeText(decrypted)
            toast({
                title: "Password copied",
                description: "Password has been copied to clipboard",
            })
        } catch (error) {
            console.error("Error decrypting password:", error)
            toast({
                title: "Error",
                description: "Failed to copy password",
                variant: "destructive",
            })
        }
    }

    const deletePassword = async (id: string) => {
        if (!user) return

        try {
            const { error } = await supabase.from("passwords").delete().eq("id", id).eq("user_id", user.id)

            if (error) throw error

            setPasswords((prev) => prev.filter((password) => password.id !== id))
            toast({
                title: "Password deleted",
                description: "Password has been deleted successfully",
            })
        } catch (error) {
            console.error("Error deleting password:", error)
            toast({
                title: "Error",
                description: "Failed to delete password",
                variant: "destructive",
            })
        }
    }

    const filteredPasswords = passwords.filter((password) =>
        password.tag.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle className="text-lg text-center">Generate New Password</CardTitle>
                        <CardDescription className="text-center">Create a strong, customised, secure password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <PasswordGeneratorForm />
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <div>
                            <CardTitle className="text-xl text-center">Your Passwords Vault</CardTitle>
                            <CardDescription>All your saved passwords will be listed here</CardDescription>
                        </div>
                        
                    </CardHeader>
                    <CardContent>
                        {loading ? (
                            <div className="flex justify-center py-8">
                                <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-purple-500"></div>
                            </div>
                        ) : filteredPasswords.length > 0 ? (
                            <div className="space-y-4">
                                {filteredPasswords.map((password) => (
                                    <div key={password.id} className="p-4 bg-gray-800/50 rounded-lg">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="font-medium text-lg">{password.tag}</h3>
                                            <span className="text-xs text-gray-400">{formatDate(password.created_at)}</span>
                                        </div>

                                        <div className="relative mb-4">
                                            <Input
                                                type={visiblePasswords[password.id] ? "text" : "password"}
                                                value={user ? decryptPassword(password.encrypted_password, user.id) : ""}
                                                readOnly
                                                className="pr-20 font-mono bg-gray-700 border-gray-600"
                                            />
                                            <div className="absolute right-2 top-1/2 -translate-y-1/2 flex space-x-1">
                                                <button
                                                    onClick={() => togglePasswordVisibility(password.id)}
                                                    className="text-gray-400 hover:text-white p-1"
                                                    aria-label={visiblePasswords[password.id] ? "Hide password" : "Show password"}
                                                >
                                                    {visiblePasswords[password.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                                </button>
                                                <button
                                                    onClick={() => copyPassword(password.encrypted_password)}
                                                    className="text-gray-400 hover:text-white p-1"
                                                    aria-label="Copy password"
                                                >
                                                    <Copy className="h-4 w-4" />
                                                </button>
                                            </div>
                                        </div>

                                        <div className="flex justify-between items-center">
                                            <div className="flex space-x-2 text-xs">
                                                {password.options.includeUppercase && (
                                                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">A-Z</span>
                                                )}
                                                {password.options.includeLowercase && (
                                                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">a-z</span>
                                                )}
                                                {password.options.includeNumbers && (
                                                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">0-9</span>
                                                )}
                                                {password.options.includeSymbols && (
                                                    <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">!@#$</span>
                                                )}
                                                <span className="bg-purple-600/20 text-purple-400 px-2 py-1 rounded">
                                                    {password.options.length} chars
                                                </span>
                                            </div>

                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => deletePassword(password.id)}
                                                className="border-gray-700 hover:bg-gray-700 hover:text-white"
                                            >
                                                <Trash2 className="h-4 w-4 mr-1" />
                                                Delete
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-8">
                                <p className="text-gray-400 mb-4">No passwords found</p>
                                {searchTerm ? (
                                    <Button
                                        variant="outline"
                                        onClick={() => setSearchTerm("")}
                                        className="border-gray-700 hover:bg-gray-700"
                                    >
                                        Clear search
                                    </Button>
                                ) : (
                                    <p className="text-sm text-gray-500">Generate and save your first password above</p>
                                )}
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
