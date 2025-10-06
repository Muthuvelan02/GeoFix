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
import { ArrowLeft, Crown, Eye, EyeOff, AlertCircle, Loader2 } from "lucide-react"
import { authService } from "@/services/authService"

export default function SuperadminLogin() {
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

            // Validate that user has SUPERADMIN role
            const userRole = response.roles[0]

            if (userRole !== "ROLE_SUPERADMIN") {
                setError(
                    `Access Denied: These credentials are for a ${userRole.replace(
                        "ROLE_",
                        ""
                    )} account, not a Super Administrator account. Please use the correct login portal or contact support if you believe this is an error.`
                )
                authService.logout()
                return
            }

            // Success - redirect to superadmin dashboard
            router.push("/dashboard/superadmin")

        } catch (err: any) {
            console.error("Superadmin login error:", err)
            if (err.response?.status === 401) {
                setError("Invalid email or password. Please check your credentials and try again.")
            } else if (err.response?.status === 403) {
                setError("Access denied. Super Administrator privileges required.")
            } else {
                setError(err.response?.data?.error || "Login failed. Please try again.")
            }
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-gray-900 to-black flex items-center justify-center p-4">
            <div className="w-full max-w-md space-y-6">
                {/* Language Switcher */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>

                {/* Back Link */}
                <Link
                    href="/admin/login"
                    className="inline-flex items-center gap-2 text-red-400 hover:text-red-300 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to Admin Login</span>
                </Link>

                {/* Login Card */}
                <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                    <CardHeader className="text-center space-y-4">
                        <div className="w-16 h-16 mx-auto bg-red-900/30 rounded-full flex items-center justify-center">
                            <Crown className="h-8 w-8 text-red-400" />
                        </div>
                        <div>
                            <CardTitle className="text-2xl font-bold text-white">
                                Super Administrator
                            </CardTitle>
                            <p className="text-red-200 text-sm mt-2">
                                Maximum security clearance required
                            </p>
                        </div>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {error && (
                            <Alert className="border-red-800 bg-red-900/20">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription className="text-red-200">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email" className="text-gray-200">
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                    className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-red-500"
                                    placeholder="superadmin@geofix.com"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password" className="text-gray-200">
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
                                        className="bg-gray-800 border-gray-700 text-white placeholder:text-gray-400 focus:border-red-500 pr-10"
                                        placeholder="Enter your secure password"
                                    />
                                    <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        className="absolute right-0 top-0 h-full px-3 text-gray-400 hover:text-white"
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
                                className="w-full bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 text-white font-semibold"
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Authenticating...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="mr-2 h-4 w-4" />
                                        Access Super Admin
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Security Notice */}
                        <div className="text-center pt-4 border-t border-gray-800">
                            <p className="text-xs text-gray-400">
                                🔒 This is a high-security access point
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                                All login attempts are monitored and logged
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Additional Links */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
                        <Link href="/admin" className="hover:text-red-400 transition-colors">
                            Admin Portal
                        </Link>
                        <span>•</span>
                        <Link href="/" className="hover:text-red-400 transition-colors">
                            Public Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
