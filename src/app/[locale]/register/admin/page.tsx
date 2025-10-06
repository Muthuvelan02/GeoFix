"use client"

import React, { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { authService, SignupRequest } from "@/services/authService"
import { Link } from "@/i18n/navigation"
import {
  Shield,
  Upload,
  FileImage,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Users,
  UserCheck
} from "lucide-react"

export default function AdminRegister() {
  const router = useRouter()

  // Form state
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    department: "",
    employeeId: ""
  })

  // File uploads
  const [files, setFiles] = useState({
    photo: null as File | null,
    aadharFront: null as File | null,
    aadharBack: null as File | null
  })

  // UI state
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [success, setSuccess] = useState("")

  // Validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) newErrors.name = "Full name is required"
    if (!formData.email.trim()) newErrors.email = "Email is required"
    if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format"
    if (!formData.password) newErrors.password = "Password is required"
    if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters"
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }
    if (!formData.phoneNumber.trim()) newErrors.phoneNumber = "Phone number is required"
    if (!/^\d{10}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
      newErrors.phoneNumber = "Invalid phone number format"
    }
    if (!formData.department.trim()) newErrors.department = "Department is required"
    if (!formData.employeeId.trim()) newErrors.employeeId = "Employee ID is required"

    // File validations
    if (!files.photo) newErrors.photo = "Profile photo is required"
    if (!files.aadharFront) newErrors.aadharFront = "Aadhar front image is required"
    if (!files.aadharBack) newErrors.aadharBack = "Aadhar back image is required"

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // File upload handler
  const handleFileChange = (field: keyof typeof files, file: File | null) => {
    if (file) {
      // Validate file size (5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        setErrors(prev => ({
          ...prev,
          [field]: "File size must be less than 5MB"
        }))
        return
      }

      // Validate file type
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({
          ...prev,
          [field]: "Only image files are allowed"
        }))
        return
      }

      // Clear previous error and set file
      setErrors(prev => {
        const newErrors = { ...prev }
        delete newErrors[field]
        return newErrors
      })
    }

    setFiles(prev => ({
      ...prev,
      [field]: file
    }))
  }

  // Form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) return

    setLoading(true)
    setErrors({})
    setSuccess("")

    try {
      // Create signup request
      const signupData: SignupRequest = {
        name: formData.name.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        mobile: formData.phoneNumber.trim(),
        address: `${formData.department} - Government Office`,
        role: "ROLE_ADMIN",
        department: formData.department.trim(),
        employeeId: formData.employeeId.trim(),
        // In real implementation, these would be URLs after file upload
        photoUrl: files.photo ? URL.createObjectURL(files.photo) : "",
        aadharFrontUrl: files.aadharFront ? URL.createObjectURL(files.aadharFront) : "",
        aadharBackUrl: files.aadharBack ? URL.createObjectURL(files.aadharBack) : ""
      }

      const response = await authService.signup(signupData)

      setSuccess("Admin registration successful! Please wait for SuperAdmin verification.")

      // Clear form
      setFormData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        phoneNumber: "",
        department: "",
        employeeId: ""
      })
      setFiles({
        photo: null,
        aadharFront: null,
        aadharBack: null
      })

      // Redirect after success
      setTimeout(() => {
        router.push("/login")
      }, 3000)

    } catch (error: any) {
      setErrors({
        submit: error.response?.data?.message || "Registration failed. Please try again."
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 dark:from-gray-900 dark:to-orange-900/20 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Header */}
        <Card className="bg-gradient-to-r from-orange-600 to-red-600 text-white border-0">
          <CardHeader className="text-center">
            <div className="flex items-center justify-center gap-3 mb-2">
              <Shield className="w-10 h-10" />
              <CardTitle className="text-3xl font-bold">Admin Registration</CardTitle>
            </div>
            <div className="flex items-center justify-center">
              <Badge className="bg-yellow-200 text-yellow-800 border-0">
                Requires SuperAdmin Verification
              </Badge>
            </div>
            <p className="text-orange-100 mt-2">
              System administration with comprehensive verification
            </p>
          </CardHeader>
        </Card>

        {/* Main Form */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-6 h-6 text-orange-600" />
                <CardTitle>Admin Account Details</CardTitle>
              </div>
              <Button variant="outline" size="sm" asChild>
                <Link href="/register">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Link>
              </Button>
            </div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Success Message */}
              {success && (
                <Alert className="bg-green-50 border-green-200 text-green-800">
                  <CheckCircle2 className="h-4 w-4" />
                  <AlertDescription>{success}</AlertDescription>
                </Alert>
              )}

              {/* Error Message */}
              {errors.submit && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{errors.submit}</AlertDescription>
                </Alert>
              )}

              {/* Personal Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Personal Information
                </h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                      placeholder="Enter your full name"
                      className={errors.name ? "border-red-500" : ""}
                    />
                    {errors.name && <p className="text-sm text-red-600">{errors.name}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="admin@example.com"
                      className={errors.email ? "border-red-500" : ""}
                    />
                    {errors.email && <p className="text-sm text-red-600">{errors.email}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phoneNumber}
                      onChange={(e) => setFormData(prev => ({ ...prev, phoneNumber: e.target.value }))}
                      placeholder="10-digit phone number"
                      className={errors.phoneNumber ? "border-red-500" : ""}
                    />
                    {errors.phoneNumber && <p className="text-sm text-red-600">{errors.phoneNumber}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="department">Department *</Label>
                    <Select
                      value={formData.department}
                      onValueChange={(value) => setFormData(prev => ({ ...prev, department: value }))}
                    >
                      <SelectTrigger className={errors.department ? "border-red-500" : ""}>
                        <SelectValue placeholder="Select department" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="PWD">Public Works Department</SelectItem>
                        <SelectItem value="MUNICIPAL">Municipal Corporation</SelectItem>
                        <SelectItem value="WATER">Water Department</SelectItem>
                        <SelectItem value="ELECTRICITY">Electricity Board</SelectItem>
                        <SelectItem value="ROADS">Roads & Transport</SelectItem>
                        <SelectItem value="SANITATION">Sanitation Department</SelectItem>
                        <SelectItem value="PARKS">Parks & Recreation</SelectItem>
                      </SelectContent>
                    </Select>
                    {errors.department && <p className="text-sm text-red-600">{errors.department}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="employeeId">Employee ID *</Label>
                    <Input
                      id="employeeId"
                      type="text"
                      value={formData.employeeId}
                      onChange={(e) => setFormData(prev => ({ ...prev, employeeId: e.target.value }))}
                      placeholder="Government employee ID"
                      className={errors.employeeId ? "border-red-500" : ""}
                    />
                    {errors.employeeId && <p className="text-sm text-red-600">{errors.employeeId}</p>}
                  </div>
                </div>
              </div>

              {/* Password Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Security</h3>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password">Password *</Label>
                    <Input
                      id="password"
                      type="password"
                      value={formData.password}
                      onChange={(e) => setFormData(prev => ({ ...prev, password: e.target.value }))}
                      placeholder="Minimum 8 characters"
                      className={errors.password ? "border-red-500" : ""}
                    />
                    {errors.password && <p className="text-sm text-red-600">{errors.password}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword">Confirm Password *</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      placeholder="Re-enter password"
                      className={errors.confirmPassword ? "border-red-500" : ""}
                    />
                    {errors.confirmPassword && <p className="text-sm text-red-600">{errors.confirmPassword}</p>}
                  </div>
                </div>
              </div>

              {/* Document Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <FileImage className="w-5 h-5" />
                  Document Verification
                </h3>
                <p className="text-sm text-gray-600">
                  Upload clear photos of required documents for verification
                </p>

                <div className="grid md:grid-cols-3 gap-4">
                  {/* Profile Photo */}
                  <div className="space-y-2">
                    <Label>Profile Photo *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('photo', e.target.files?.[0] || null)}
                        className="hidden"
                        id="photo-upload"
                      />
                      <label htmlFor="photo-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {files.photo ? files.photo.name : "Click to upload"}
                        </p>
                      </label>
                    </div>
                    {errors.photo && <p className="text-sm text-red-600">{errors.photo}</p>}
                  </div>

                  {/* Aadhar Front */}
                  <div className="space-y-2">
                    <Label>Aadhar Card (Front) *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('aadharFront', e.target.files?.[0] || null)}
                        className="hidden"
                        id="aadhar-front-upload"
                      />
                      <label htmlFor="aadhar-front-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {files.aadharFront ? files.aadharFront.name : "Click to upload"}
                        </p>
                      </label>
                    </div>
                    {errors.aadharFront && <p className="text-sm text-red-600">{errors.aadharFront}</p>}
                  </div>

                  {/* Aadhar Back */}
                  <div className="space-y-2">
                    <Label>Aadhar Card (Back) *</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center hover:border-orange-400 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileChange('aadharBack', e.target.files?.[0] || null)}
                        className="hidden"
                        id="aadhar-back-upload"
                      />
                      <label htmlFor="aadhar-back-upload" className="cursor-pointer">
                        <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                        <p className="text-sm text-gray-600">
                          {files.aadharBack ? files.aadharBack.name : "Click to upload"}
                        </p>
                      </label>
                    </div>
                    {errors.aadharBack && <p className="text-sm text-red-600">{errors.aadharBack}</p>}
                  </div>
                </div>
              </div>

              {/* Verification Process Info */}
              <Card className="bg-orange-50 border-orange-200">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <UserCheck className="w-5 h-5 text-orange-600 mt-0.5" />
                    <div>
                      <h4 className="font-semibold text-orange-800 mb-1">Verification Process</h4>
                      <p className="text-sm text-orange-700">
                        After registration, your application will be reviewed by a SuperAdmin.
                        You'll receive email notification once verified. Ensure all documents are clear and valid.
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full bg-orange-600 hover:bg-orange-700 text-white"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Registering...
                  </>
                ) : (
                  <>
                    <Shield className="w-4 h-4 mr-2" />
                    Register as Admin
                  </>
                )}
              </Button>
            </form>
          </CardContent>
        </Card>


      </div>
    </div>
  )
}