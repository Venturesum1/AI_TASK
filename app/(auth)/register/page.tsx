"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useSetAtom } from "jotai"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { BrainCog } from "lucide-react"
import { auth } from "@/lib/api"
import { userAtom, isAuthenticatedAtom } from "@/lib/atoms"

export default function RegisterPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()
  const setUser = useSetAtom(userAtom)
  const setIsAuthenticated = useSetAtom(isAuthenticatedAtom)

  const validateForm = () => {
    if (!email || !password || !confirmPassword) {
      setError("All fields are required")
      return false
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    return true
  }

  const handleRegister = async () => {
    if (!validateForm()) {
      return
    }

    setLoading(true)
    setError("")

    try {
      const { data } = await auth.register({ email, password })
      console.log("Registration successful:", data)
      setUser(data.user)
      setIsAuthenticated(true)
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration failed:", error)
      setError(error.response?.data?.message || "Registration failed. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <BrainCog className="h-6 w-6 text-primary" />
            <CardTitle>Register</CardTitle>
          </div>
          <CardDescription>Create a new account</CardDescription>
        </CardHeader>
        <CardContent>
          {error && (
            <div className="text-sm text-red-500 bg-red-50 p-2 rounded-md border border-red-200 mb-4">
              {error}
            </div>
          )}
          <div className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
            />
            <Input
              type="password"
              placeholder="Confirm Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              disabled={loading}
            />
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button onClick={handleRegister} disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
          <div className="text-sm text-muted-foreground">
            Already have an account? <Link href="/login" className="text-primary">Login</Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}