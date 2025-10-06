"use client"

import React, { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Shield, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2 } from "lucide-react"
import { authService } from "@/services/authService"

export default function AdminRegister() {
    const t = useTranslations()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        address: "",
        adminCode: "", // Special code required for admin registration
        department: "",
        employeeId: ""
    })

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: value
        }))
        // Clear errors when user starts typing
        if (error) setError("")
        if (success) setSuccess("")
    }

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required"
        if (!formData.email.trim()) return "Email is required"
        if (!formData.mobile.trim()) return "Mobile number is required"
        if (!formData.password) return "Password is required"
        if (formData.password !== formData.confirmPassword) return "Passwords do not match"
        if (formData.password.length < 8) return "Password must be at least 8 characters"
        if (!formData.address.trim()) return "Address is required"
        if (!formData.adminCode.trim()) return "Admin authorization code is required"
        if (!formData.department.trim()) return "Department is required"
        if (!formData.employeeId.trim()) return "Employee ID is required"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) return "Invalid email format"

        const mobileRegex = /^[0-9]{10}$/
        if (!mobileRegex.test(formData.mobile)) return "Mobile number must be 10 digits"

        return null
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        const validationError = validateForm()
        if (validationError) {
            setError(validationError)
            return
        }

        setLoading(true)
        setError("")

        try {
            const registerData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile: formData.mobile.trim(),
                password: formData.password,
                address: formData.address.trim(),
                role: 'ROLE_ADMIN' as const,
                isAdmin: true,
                adminCode: formData.adminCode.trim(),
                department: formData.department.trim(),
                employeeId: formData.employeeId.trim()
            }

            await authService.registerAdmin(registerData)

            setSuccess("Admin account created successfully! Please wait for approval from superadmin.")

            // Redirect to login after success
            setTimeout(() => {
                router.push("/admin/login")
            }, 3000)

        } catch (error: any) {
            console.error('Admin registration error:', error)
            setError(error.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950 flex items-center justify-center p-4">
            <div className="w-full max-w-2xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-red-100 dark:bg-red-900/30 rounded-full">
                            <Shield className="h-8 w-8 text-red-600 dark:text-red-400" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Admin Registration
                            </h1>
                            <p className="text-red-600 dark:text-red-400 font-medium">
                                GeoFix Administrative Portal
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                        Register as a system administrator to manage contractors, users, and system operations.
                    </p>
                </div>

                {/* Registration Form */}
                <Card className="border-red-200 dark:border-red-800/30 shadow-xl">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-gray-900 dark:text-white">
                                Create Admin Account
                            </CardTitle>
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors"
                            >
                                <ArrowLeft className="h-4 w-4" />
                                Back to Admin Portal
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {success && (
                            <Alert className="border-green-200 text-green-800 dark:border-green-800 dark:text-green-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="border-gray-300 focus:border-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="admin@geofix.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="border-gray-300 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile">Mobile Number *</Label>
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        placeholder="1234567890"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="border-gray-300 focus:border-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employeeId">Employee ID *</Label>
                                    <Input
                                        id="employeeId"
                                        name="employeeId"
                                        type="text"
                                        placeholder="EMP001"
                                        value={formData.employeeId}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="border-gray-300 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            {/* Department and Address */}
                            <div className="space-y-2">
                                <Label htmlFor="department">Department *</Label>
                                <Input
                                    id="department"
                                    name="department"
                                    type="text"
                                    placeholder="Public Works Department"
                                    value={formData.department}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="border-gray-300 focus:border-red-500"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Office Address *</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter your office address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="border-gray-300 focus:border-red-500"
                                    rows={3}
                                />
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="border-gray-300 focus:border-red-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="border-gray-300 focus:border-red-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Admin Authorization Code */}
                            <div className="space-y-2">
                                <Label htmlFor="adminCode">Admin Authorization Code *</Label>
                                <Input
                                    id="adminCode"
                                    name="adminCode"
                                    type="password"
                                    placeholder="Enter admin authorization code"
                                    value={formData.adminCode}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="border-gray-300 focus:border-red-500"
                                />
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Contact your superadmin for the authorization code
                                </p>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-red-600 hover:bg-red-700 text-white py-2.5"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Account...
                                    </>
                                ) : (
                                    "Create Admin Account"
                                )}
                            </Button>
                        </form>

                        {/* Additional Links */}
                        <div className="text-center pt-4 border-t border-gray-200 dark:border-gray-700 space-y-3">
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                Already have an admin account?{" "}
                                <Link
                                    href="/admin/login"
                                    className="text-red-600 hover:text-red-700 dark:text-red-400 font-medium"
                                >
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                                Need superadmin access?{" "}
                                <Link
                                    href="/admin/register/superadmin"
                                    className="text-red-600 hover:text-red-700 dark:text-red-400 underline"
                                >
                                    Request Superadmin Registration
                                </Link>
                            </p>
                        </div>
                    </CardContent>
                </Card>

                {/* Language Switcher */}
                <div className="flex justify-center">
                    <LanguageSwitcher />
                </div>
            </div>
        </div>
    )
}