"use client"

import type React from "react"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Label } from "../components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "../components/ui/alert"
import { useAuth } from "../contexts/auth-context"
import toast from "react-hot-toast"
// import { GoogleLogo } from "../components/icons" // You'll need to create or import a Google logo component

export function AuthForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  // const [isGoogleLoading, setIsGoogleLoading] = useState(false)
  const navigate = useNavigate()
  //import signInWithGoogle from when I need to implement Google Sign-In
  const { signIn, signUp, } = useAuth()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signUp(email, password)

      if (error) {
        setError(error.message)
        return
      }

      toast.success("Account created successfully!.")
      navigate("/dashboard")
    } catch (err) {
      console.error("Error signing up:", err)
      toast.error("An unexpected error occurred, please try again.")
      setError("An unexpected error occurred, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError(null)

    try {
      const { error } = await signIn(email, password)

      if (error) {
        setError(error.message)
        return
      }
      toast.success("Signed in successfully!")
      navigate("/dashboard")
    } catch (err) {
      console.error("Error signing in:", err)
      toast.error("Error occurred, please try again.")
    } finally {
      setIsLoading(false)
    }
  }

  // const handleGoogleSignIn = async () => {
  //   setIsGoogleLoading(true)
  //   setError(null)

  //   try {
  //     const result = await signInWithGoogle()
  //     if (result.error) throw result.error

  //     navigate("/dashboard")
  //   } catch (err) {
  //     toast.error("Error signing in with Google, please try again.")
  //     setError(err instanceof Error ? err.message : "An unexpected error occurred")
  //     console.error("Error signing in with Google:", err)
    
  //   } finally {
  //     setIsGoogleLoading(false)
  //   }
  // }

  return (
    <Card className="w-full max-w-md mx-auto bg-gray-900/60 backdrop-blur-sm border-gray-800">
      <Tabs defaultValue="login" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login" className="data-[state=active]:bg-purple-600">
            Login
          </TabsTrigger>
          <TabsTrigger value="register" className="data-[state=active]:bg-purple-600">
            Register
          </TabsTrigger>
        </TabsList>

        <TabsContent value="login">
          <form onSubmit={handleSignIn}>
            <CardHeader>
              <CardTitle className="text-xl">Welcome back</CardTitle>
              <CardDescription>Sign in to your account to continue</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign-In Button */}
              {/* <Button
                type="button"
                variant="outline"
                className="w-full bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <span>Signing in with Google...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <GoogleLogo className="w-5 h-5" />
                    Sign in with Google
                  </span>
                )}
              </Button> */}

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-gray-900/60 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password">Password</Label>
                <Input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </div>
          </form>
        </TabsContent>

        <TabsContent value="register">
          <form onSubmit={handleSignUp}>
            <CardHeader>
              <CardTitle className="text-xl">Create an account</CardTitle>
              <CardDescription>Enter your details to get started</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Google Sign-In Button */}
               {/* <Button
                type="button"
                variant="outline"
                className="w-full bg-white text-gray-800 hover:bg-gray-100 border-gray-300"
                onClick={handleGoogleSignIn}
                disabled={isGoogleLoading}
              >
                {isGoogleLoading ? (
                  <span>Signing up with Google...</span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    <GoogleLogo className="w-5 h-5" />
                    Sign up with Google
                  </span>
                )}
              </Button>  */}

              {/* <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-gray-700" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="px-2 bg-gray-900/60 text-gray-400">
                    Or continue with
                  </span>
                </div>
              </div> */}

              <div className="space-y-2">
                <Label htmlFor="register-email">Email</Label>
                <Input
                  id="register-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="register-password">Password</Label>
                <Input
                  id="register-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800/50 border-gray-700"
                />
              </div>
            </CardContent>
            <div className="px-6 pb-6">
              <Button type="submit" className="w-full bg-purple-600 hover:bg-purple-700" disabled={isLoading}>
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </div>
          </form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}