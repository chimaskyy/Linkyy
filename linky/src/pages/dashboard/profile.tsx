"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../../components/ui/card"
import { Button } from "../../components/ui/button"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { useToast } from "../../hooks/use-toast"
import { supabase } from "../../lib/supabase"
import { useAuth } from "../../contexts/auth-context"
import DashboardLayout from "../../components/dashboard-layout"

export default function ProfilePage() {
    const { toast } = useToast()
    const { user } = useAuth()
    const [loading, setLoading] = useState(false)
    const [username, setUsername] = useState("")
    const [fullName, setFullName] = useState("")
    const [email, setEmail] = useState("")
    const [newPassword, setNewPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")

    useEffect(() => {
        const fetchProfile = async () => {
            if (!user) return

            try {
                setLoading(true)

                // Get user profile from profiles table
                const { data, error } = await supabase.from("profiles").select("*").eq("id", user.id).single()

                if (error && error.code !== "PGRST116") {
                    throw error
                }

                if (data) {
                    setUsername(data.username || "")
                    setFullName(data.full_name || "")
                }

                // Set email from auth user
                setEmail(user.email || "")
            } catch (error) {
                console.error("Error fetching profile:", error)
                toast({
                    title: "Error",
                    description: "Failed to load profile",
                    variant: "destructive",
                })
            } finally {
                setLoading(false)
            }
        }

        fetchProfile()
    }, [user, toast])

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) return

        try {
            setLoading(true)

            // Check if username is already taken
            if (username) {
                const { data: existingUser, error: checkError } = await supabase
                    .from("profiles")
                    .select("id")
                    .eq("username", username)
                    .neq("id", user.id)
                    .single()

                if (checkError && checkError.code !== "PGRST116") {
                    throw checkError
                }

                if (existingUser) {
                    toast({
                        title: "Username taken",
                        description: "This username is already in use",
                        variant: "destructive",
                    })
                    return
                }
            }

            // Update profile
            const { error: updateError } = await supabase.from("profiles").upsert({
                id: user.id,
                username,
                full_name: fullName,
                updated_at: new Date().toISOString(),
            })

            if (updateError) throw updateError

            toast({
                title: "Profile updated",
                description: "Your profile has been updated successfully",
            })
        } catch (error) {
            console.error("Error updating profile:", error)
            toast({
                title: "Error",
                description: "Failed to update profile",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (!user) return

        if (newPassword.length < 6) {
            toast({
                title: "Password too short",
                description: "Password must be at least 6 characters",
                variant: "destructive",
            })
            return
        }

        if (newPassword !== confirmPassword) {
            toast({
                title: "Passwords don't match",
                description: "New password and confirmation must match",
                variant: "destructive",
            })
            return
        }

        try {
            setLoading(true)

            const { error } = await supabase.auth.updateUser({
                password: newPassword,
            })

            if (error) throw error

            setNewPassword("")
            setConfirmPassword("")

            toast({
                title: "Password updated",
                description: "Your password has been updated successfully",
            })
        } catch (error) {
            console.error("Error updating password:", error)
            toast({
                title: "Error",
                description: "Failed to update password",
                variant: "destructive",
            })
        } finally {
            setLoading(false)
        }
    }

    return (
        <DashboardLayout>
            <div className="space-y-8">
                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle>Profile Information</CardTitle>
                        <CardDescription>Update your account profile information</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdateProfile} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="username">Username</Label>
                                    <Input
                                        id="username"
                                        placeholder="username"
                                        value={username}
                                        onChange={(e) => setUsername(e.target.value)}
                                        className="bg-gray-800 border-gray-700"
                                    />
                                    <p className="text-xs text-gray-400">
                                        This will be used for your link tree URL: {window.location.origin}/tree/{username || "username"}
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="fullName">Full Name</Label>
                                    <Input
                                        id="fullName"
                                        placeholder="John Doe"
                                        value={fullName}
                                        onChange={(e) => setFullName(e.target.value)}
                                        className="bg-gray-800 border-gray-700"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={email}
                                    disabled
                                    className="bg-gray-700 border-gray-600 opacity-70"
                                />
                                <p className="text-xs text-gray-400">Email cannot be changed</p>
                            </div>

                            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                {loading ? "Updating..." : "Update Profile"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card className="bg-gray-900/60 backdrop-blur-sm border-gray-800">
                    <CardHeader>
                        <CardTitle>Change Password</CardTitle>
                        <CardDescription>Update your account password</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleUpdatePassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="newPassword">New Password</Label>
                                <Input
                                    id="newPassword"
                                    type="password"
                                    value={newPassword}
                                    onChange={(e) => setNewPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm New Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    className="bg-gray-800 border-gray-700"
                                />
                            </div>

                            <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
                                {loading ? "Updating..." : "Change Password"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    )
}
