"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, HardHat, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { authService } from "@/services/authService"

export default function WorkerLogin() {
    const t = useTranslations()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [error, setError] = useState("")
    const [formData, setFormData] = useState({
        email: "",
        password: ""
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        if (error) setError("")
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError("")

        try {
            const response = await authService.login({
                email: formData.email,
                password: formData.password
            })

            // Validate that user has WORKER role
            const userRole = response.roles[0]

            if (userRole !== "ROLE_WORKER") {
                setError(
                    `Access Denied: These credentials are for a ${userRole.replace(
                        "ROLE_",
                        ""
                    )} account, not a Worker account. Please use the correct login portal or contact your contractor if you believe this is an error.`
                )
                authService.logout()
                return
            }

            // Success - redirect to worker dashboard
            router.push("/dashboard/worker")

        } catch (err: any) {
            console.error("Worker login error:", err)
            if (err.response?.status === 401) {
                setError("Invalid email or password. Please check your credentials and try again.")
            } else if (err.response?.status === 403) {
                setError("Access denied. Worker account required.")
            } else {
                setError(err.response?.data?.error || "Login failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-50 to-gray-100 dark:from-orange-900/20 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Language Switcher */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>

                {/* Back Link */}
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-orange-600 hover:text-orange-700 dark:text-orange-400 dark:hover:text-orange-300 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to Public Portal</span>
                </Link>

                {/* Login Card */}
                <Card className="border-orange-200 dark:border-orange-800">
                    <CardHeader className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                            <HardHat className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
                                Worker Login
                            </CardTitle>
                            <p className="text-gray-600 dark:text-gray-300 text-sm mt-2">
                                Access your assigned tasks and work dashboard
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-red-700 dark:text-red-400">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-700 dark:text-gray-300">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="focus:border-orange-500 focus:ring-orange-500"
                                    placeholder="worker@company.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-700 dark:text-gray-300">
                                    Password
                                </Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? "text" : "password"}
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                        className="focus:border-orange-500 focus:ring-orange-500 pr-10"
                                        placeholder="Enter your password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-gray-600"
                                        onClick={() => setShowPassword(!showPassword)}
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </Button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 text-white font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        <HardHat className="mr-2 h-4 w-4" />
                                        Sign In to Work Dashboard
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Additional Info */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Don't have an account?
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                                Contact your contractor to get worker access
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Footer Links */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <Link href="/" className="hover:text-orange-600 transition-colors">
                            Public Portal
                        </Link>
                        <span>•</span>
                        <Link href="/login/contractor" className="hover:text-orange-600 transition-colors">
                            Contractor Login
                        </Link>
                        <span>•</span>
                        <Link href="/admin" className="hover:text-orange-600 transition-colors">
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
