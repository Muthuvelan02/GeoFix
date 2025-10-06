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
import { ArrowLeft, Crown, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Shield } from "lucide-react"
import { authService } from "@/services/authService"

export default function SuperadminRegister() {
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
        masterKey: "", // Master key required for superadmin registration
        organization: "",
        designation: "",
        employeeId: "",
        securityQuestion1: "",
        securityAnswer1: "",
        securityQuestion2: "",
        securityAnswer2: ""
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
        if (formData.password.length < 12) return "Superadmin password must be at least 12 characters"
        if (!formData.address.trim()) return "Address is required"
        if (!formData.masterKey.trim()) return "Master key is required"
        if (!formData.organization.trim()) return "Organization is required"
        if (!formData.designation.trim()) return "Designation is required"
        if (!formData.employeeId.trim()) return "Employee ID is required"
        if (!formData.securityQuestion1.trim()) return "Security question 1 is required"
        if (!formData.securityAnswer1.trim()) return "Security answer 1 is required"
        if (!formData.securityQuestion2.trim()) return "Security question 2 is required"
        if (!formData.securityAnswer2.trim()) return "Security answer 2 is required"

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
        if (!emailRegex.test(formData.email)) return "Invalid email format"

        const mobileRegex = /^[0-9]{10}$/
        if (!mobileRegex.test(formData.mobile)) return "Mobile number must be 10 digits"

        // Password strength check for superadmin
        const hasUpperCase = /[A-Z]/.test(formData.password)
        const hasLowerCase = /[a-z]/.test(formData.password)
        const hasNumbers = /\d/.test(formData.password)
        const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(formData.password)

        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecialChar) {
            return "Password must contain uppercase, lowercase, numbers, and special characters"
        }

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
                role: 'ROLE_SUPERADMIN' as const,
                isAdmin: true,
                masterKey: formData.masterKey.trim(),
                organization: formData.organization.trim(),
                designation: formData.designation.trim(),
                employeeId: formData.employeeId.trim(),
                securityQuestions: [
                    { question: formData.securityQuestion1, answer: formData.securityAnswer1 },
                    { question: formData.securityQuestion2, answer: formData.securityAnswer2 }
                ]
            }

            await authService.registerSuperadmin(registerData)

            setSuccess("Superadmin account created successfully! You can now sign in with full system access.")

            // Redirect to login after success
            setTimeout(() => {
                router.push("/admin/login/superadmin")
            }, 3000)

        } catch (error: any) {
            console.error('Superadmin registration error:', error)
            setError(error.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
            <div className="w-full max-w-3xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-3xl font-bold text-white">
                                Superadmin Registration
                            </h1>
                            <p className="text-red-400 font-medium">
                                Maximum Security Access Portal
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-300 max-w-lg mx-auto">
                        Register as a system superadmin with complete control over the GeoFix infrastructure system.
                    </p>
                </div>

                {/* Registration Form */}
                <Card className="border-red-800/50 shadow-2xl bg-gray-800/90 backdrop-blur">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-white flex items-center gap-2">
                                <Shield className="h-5 w-5 text-red-400" />
                                Create Superadmin Account
                            </CardTitle>
                            <Link
                                href="/admin"
                                className="flex items-center gap-2 text-sm text-gray-400 hover:text-white transition-colors"
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
                            <Alert className="border-green-600 bg-green-900/20 text-green-200">
                                <CheckCircle2 className="h-4 w-4" />
                                <AlertDescription>{success}</AlertDescription>
                            </Alert>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-4">
                            {/* Personal Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="name" className="text-gray-300">Full Name *</Label>
                                    <Input
                                        id="name"
                                        name="name"
                                        type="text"
                                        placeholder="Enter your full name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-gray-300">Email Address *</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="superadmin@geofix.com"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="mobile" className="text-gray-300">Mobile Number *</Label>
                                    <Input
                                        id="mobile"
                                        name="mobile"
                                        type="tel"
                                        placeholder="1234567890"
                                        value={formData.mobile}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="employeeId" className="text-gray-300">Employee ID *</Label>
                                    <Input
                                        id="employeeId"
                                        name="employeeId"
                                        type="text"
                                        placeholder="SA001"
                                        value={formData.employeeId}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            {/* Organization and Designation */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="organization" className="text-gray-300">Organization *</Label>
                                    <Input
                                        id="organization"
                                        name="organization"
                                        type="text"
                                        placeholder="Municipal Corporation"
                                        value={formData.organization}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="designation" className="text-gray-300">Designation *</Label>
                                    <Input
                                        id="designation"
                                        name="designation"
                                        type="text"
                                        placeholder="Chief Technology Officer"
                                        value={formData.designation}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address" className="text-gray-300">Office Address *</Label>
                                <Textarea
                                    id="address"
                                    name="address"
                                    placeholder="Enter your office address"
                                    value={formData.address}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    rows={3}
                                />
                            </div>

                            {/* Password Fields */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-gray-300">Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Enter secure password"
                                            value={formData.password}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                    <p className="text-xs text-gray-400">
                                        Min 12 chars with uppercase, lowercase, numbers & symbols
                                    </p>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-gray-300">Confirm Password *</Label>
                                    <div className="relative">
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            placeholder="Confirm password"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            disabled={loading}
                                            className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500 pr-10"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
                                        >
                                            {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {/* Master Key */}
                            <div className="space-y-2">
                                <Label htmlFor="masterKey" className="text-gray-300">Master Key *</Label>
                                <Input
                                    id="masterKey"
                                    name="masterKey"
                                    type="password"
                                    placeholder="Enter master key"
                                    value={formData.masterKey}
                                    onChange={handleInputChange}
                                    disabled={loading}
                                    className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                />
                                <p className="text-xs text-red-400">
                                    ⚠️ This key grants complete system access. Keep it absolutely secure.
                                </p>
                            </div>

                            {/* Security Questions */}
                            <div className="space-y-4 p-4 bg-gray-900/50 rounded-lg border border-gray-700">
                                <h3 className="text-lg font-semibold text-white">Security Questions</h3>

                                <div className="space-y-2">
                                    <Label htmlFor="securityQuestion1" className="text-gray-300">Security Question 1 *</Label>
                                    <Input
                                        id="securityQuestion1"
                                        name="securityQuestion1"
                                        type="text"
                                        placeholder="What was your first pet's name?"
                                        value={formData.securityQuestion1}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="securityAnswer1" className="text-gray-300">Answer 1 *</Label>
                                    <Input
                                        id="securityAnswer1"
                                        name="securityAnswer1"
                                        type="text"
                                        placeholder="Enter answer"
                                        value={formData.securityAnswer1}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="securityQuestion2" className="text-gray-300">Security Question 2 *</Label>
                                    <Input
                                        id="securityQuestion2"
                                        name="securityQuestion2"
                                        type="text"
                                        placeholder="In what city were you born?"
                                        value={formData.securityQuestion2}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="securityAnswer2" className="text-gray-300">Answer 2 *</Label>
                                    <Input
                                        id="securityAnswer2"
                                        name="securityAnswer2"
                                        type="text"
                                        placeholder="Enter answer"
                                        value={formData.securityAnswer2}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                    />
                                </div>
                            </div>

                            {/* Submit Button */}
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-3 font-semibold"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Creating Superadmin Account...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="mr-2 h-4 w-4" />
                                        Create Superadmin Account
                                    </>
                                )}
                            </Button>
                        </form>

                        {/* Additional Links */}
                        <div className="text-center pt-4 border-t border-gray-700 space-y-3">
                            <p className="text-sm text-gray-400">
                                Already have a superadmin account?{" "}
                                <Link
                                    href="/admin/login/superadmin"
                                    className="text-red-400 hover:text-red-300 font-medium"
                                >
                                    Sign In
                                </Link>
                            </p>
                            <p className="text-xs text-gray-500">
                                Need regular admin access?{" "}
                                <Link
                                    href="/admin/register"
                                    className="text-red-400 hover:text-red-300 underline"
                                >
                                    Admin Registration
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