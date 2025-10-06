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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Crown, Eye, EyeOff, AlertCircle, CheckCircle2, Loader2, Upload, X } from "lucide-react"
import { authService } from "@/services/authService"

export default function SuperAdminRegister() {
    const t = useTranslations()
    const router = useRouter()
    const [loading, setLoading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState("")

    // File uploads
    const [photo, setPhoto] = useState<File | null>(null)
    const [aadharFront, setAadharFront] = useState<File | null>(null)
    const [aadharBack, setAadharBack] = useState<File | null>(null)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        mobile: "",
        password: "",
        confirmPassword: "",
        address: "",
        // Superadmin specific fields
        department: "System Administration",
        employeeId: "",
        specialization: "System Management"
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

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fileType: 'photo' | 'aadharFront' | 'aadharBack') => {
        const file = e.target.files?.[0]
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setError("File size must be less than 5MB")
                return
            }

            // Validate file type
            if (!file.type.startsWith('image/')) {
                setError("Please upload only image files")
                return
            }

            switch (fileType) {
                case 'photo':
                    setPhoto(file)
                    break
                case 'aadharFront':
                    setAadharFront(file)
                    break
                case 'aadharBack':
                    setAadharBack(file)
                    break
            }
        }
    }

    const removeFile = (fileType: 'photo' | 'aadharFront' | 'aadharBack') => {
        switch (fileType) {
            case 'photo':
                setPhoto(null)
                break
            case 'aadharFront':
                setAadharFront(null)
                break
            case 'aadharBack':
                setAadharBack(null)
                break
        }
    }

    const validateForm = () => {
        if (!formData.name.trim()) return "Name is required"
        if (!formData.email.trim()) return "Email is required"
        if (!formData.mobile.trim()) return "Mobile number is required"
        if (!formData.password) return "Password is required"
        if (formData.password !== formData.confirmPassword) return "Passwords do not match"
        if (formData.password.length < 8) return "Password must be at least 8 characters"
        if (!formData.address.trim()) return "Address is required"
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
            const signupData = {
                name: formData.name.trim(),
                email: formData.email.trim().toLowerCase(),
                mobile: formData.mobile.trim(),
                password: formData.password,
                address: formData.address.trim(),
                role: 'ROLE_SUPERADMIN' as const,
                department: formData.department.trim(),
                employeeId: formData.employeeId.trim()
            }

            // Prepare files
            const files: { photo?: File; aadharFront?: File; aadharBack?: File } = {}
            if (photo) files.photo = photo
            if (aadharFront) files.aadharFront = aadharFront
            if (aadharBack) files.aadharBack = aadharBack

            await authService.signup(signupData, files)

            setSuccess("SuperAdmin account created successfully! You now have complete system access.")

            // Redirect to login after success
            setTimeout(() => {
                router.push("/admin/login/superadmin")
            }, 3000)

        } catch (error: any) {
            console.error('SuperAdmin registration error:', error)
            setError(error.message || "Registration failed. Please try again.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-red-900 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-6">
                {/* Header */}
                <div className="text-center space-y-2">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <div className="p-3 bg-gradient-to-r from-red-600 to-red-800 rounded-full">
                            <Crown className="h-8 w-8 text-white" />
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold text-white">
                                SuperAdmin Registration
                            </h1>
                            <p className="text-red-400 font-medium">
                                Phase 1: Setup SuperAdmin User
                            </p>
                        </div>
                    </div>
                    <p className="text-gray-300 max-w-2xl mx-auto">
                        Register as system superadmin with complete control over the GeoFix platform. This creates the highest level administrative account.
                    </p>
                </div>

                {/* Registration Form */}
                <Card className="border-red-800/50 shadow-2xl bg-gray-800/90 backdrop-blur">
                    <CardHeader className="space-y-1 pb-4">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl text-white">
                                Create SuperAdmin Account (Phase 1)
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
                    <CardContent className="space-y-6">
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

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {/* Personal Information */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Personal Information
                                </h3>

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

                                <div className="space-y-2">
                                    <Label htmlFor="address" className="text-gray-300">Address *</Label>
                                    <Textarea
                                        id="address"
                                        name="address"
                                        placeholder="Enter your address"
                                        value={formData.address}
                                        onChange={handleInputChange}
                                        disabled={loading}
                                        className="bg-gray-700/50 border-gray-600 text-white placeholder-gray-400 focus:border-red-500"
                                        rows={3}
                                    />
                                </div>
                            </div>

                            {/* Password Section */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Security
                                </h3>

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
                            </div>

                            {/* Document Upload */}
                            <div className="space-y-4">
                                <h3 className="text-lg font-semibold text-white border-b border-gray-700 pb-2">
                                    Document Verification (Optional)
                                </h3>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    {/* Profile Photo */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Profile Photo</Label>
                                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                            {photo ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-green-400">{photo.name}</div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile('photo')}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <div className="text-sm text-gray-400">Upload Photo</div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, 'photo')}
                                                        className="hidden"
                                                        id="photo-upload"
                                                    />
                                                    <Label
                                                        htmlFor="photo-upload"
                                                        className="cursor-pointer text-red-400 hover:text-red-300 text-xs"
                                                    >
                                                        Choose File
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Aadhar Front */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Aadhar Front</Label>
                                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                            {aadharFront ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-green-400">{aadharFront.name}</div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile('aadharFront')}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <div className="text-sm text-gray-400">Upload Aadhar Front</div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, 'aadharFront')}
                                                        className="hidden"
                                                        id="aadhar-front-upload"
                                                    />
                                                    <Label
                                                        htmlFor="aadhar-front-upload"
                                                        className="cursor-pointer text-red-400 hover:text-red-300 text-xs"
                                                    >
                                                        Choose File
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Aadhar Back */}
                                    <div className="space-y-2">
                                        <Label className="text-gray-300">Aadhar Back</Label>
                                        <div className="border-2 border-dashed border-gray-600 rounded-lg p-4 text-center">
                                            {aadharBack ? (
                                                <div className="space-y-2">
                                                    <div className="text-sm text-green-400">{aadharBack.name}</div>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => removeFile('aadharBack')}
                                                        className="text-red-400 hover:text-red-300"
                                                    >
                                                        <X className="h-4 w-4 mr-1" />
                                                        Remove
                                                    </Button>
                                                </div>
                                            ) : (
                                                <div>
                                                    <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                                                    <div className="text-sm text-gray-400">Upload Aadhar Back</div>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        onChange={(e) => handleFileChange(e, 'aadharBack')}
                                                        className="hidden"
                                                        id="aadhar-back-upload"
                                                    />
                                                    <Label
                                                        htmlFor="aadhar-back-upload"
                                                        className="cursor-pointer text-red-400 hover:text-red-300 text-xs"
                                                    >
                                                        Choose File
                                                    </Label>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <p className="text-xs text-gray-400">
                                    Documents are optional but recommended for verification. Max file size: 5MB each.
                                </p>
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
                                        Creating SuperAdmin Account...
                                    </>
                                ) : (
                                    <>
                                        <Crown className="mr-2 h-4 w-4" />
                                        Create SuperAdmin Account
                                    </>
                                )}
                            </Button>

                            <div className="text-center space-y-2 pt-4 border-t border-gray-700">
                                <p className="text-sm text-gray-400">
                                    After registration, you can login and proceed to Phase 2: Verify Admins
                                </p>
                                <div className="flex items-center justify-center gap-6 text-sm">
                                    <Link
                                        href="/admin/login/superadmin"
                                        className="text-red-400 hover:text-red-300 font-medium"
                                    >
                                        SuperAdmin Login
                                    </Link>
                                    <span className="text-gray-600">•</span>
                                    <Link
                                        href="/register/admin"
                                        className="text-red-400 hover:text-red-300 font-medium"
                                    >
                                        Register Admin Instead
                                    </Link>
                                </div>
                            </div>
                        </form>
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