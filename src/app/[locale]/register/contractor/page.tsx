"use client"

import type React from "react"
import { useState } from "react"
import { useTranslations } from "next-intl"
import { Link, useRouter } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Checkbox } from "@/components/ui/checkbox"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, HardHat, AlertCircle, CheckCircle } from "lucide-react"
import { authService } from "@/services/authService"

export default function ContractorRegisterPage() {
  const t = useTranslations()
  const router = useRouter()

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    companyName: "",
    licenseNumber: "",
    specialization: "",
    address: "",
    city: "",
    pincode: "",
    agreeToTerms: false
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.password) {
      setError("Please fill in all required fields")
      return
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const signupData = {
        name: `${formData.firstName} ${formData.lastName}`,
        email: formData.email,
        mobile: formData.phone,
        password: formData.password,
        address: `${formData.address}, ${formData.city}, ${formData.pincode}`,
        role: 'ROLE_CONTRACTOR' as const
      }

      await authService.signup(signupData)

      setSuccess(true)
      // Don't auto-login, show approval message instead
    } catch (err: any) {
      setError(err.message || "Registration failed. Please try again.")
      console.error("Registration failed:", err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-yellow-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* Back to Register Selection Link */}
        <Link
          href="/register"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("register.backToOptions")}
        </Link>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="space-y-4 text-center">
            {/* Role Badge */}
            <div className="mx-auto w-fit">
              <div
                className="flex items-center gap-2 px-4 py-2 rounded-full text-white font-medium"
                style={{ backgroundColor: "#F39C12" }}
              >
                <HardHat className="h-4 w-4" />
                {t("register.roles.contractor.label")}
              </div>
            </div>

            <CardTitle className="text-2xl font-bold text-gray-900 dark:text-white">
              {t("register.title")}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              {t("register.roles.contractor.desc")}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Success Message */}
            {success && (
              <div className="flex items-center gap-2 p-4 rounded-md bg-green-50 border border-green-200 text-green-700 dark:bg-green-900/20 dark:border-green-800 dark:text-green-400">
                <CheckCircle className="h-5 w-5" />
                <div className="text-sm">
                  <p className="font-medium">Registration Successful!</p>
                  <p className="mt-1">Your contractor account has been created and is pending admin approval. You will receive an email notification once your account is verified.</p>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 rounded-md bg-red-50 border border-red-200 text-red-700 dark:bg-red-900/20 dark:border-red-800 dark:text-red-400">
                <AlertCircle className="h-4 w-4" />
                <div className="text-sm">
                  <p className="font-medium">Registration Failed</p>
                  <p className="text-xs mt-1 opacity-90">{error}</p>
                </div>
              </div>
            )}

            <form onSubmit={handleRegister} className="space-y-4">
              {/* Personal Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {t("register.personalInfo")}
                </h3>

                {/* First Name & Last Name */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.firstName")}
                    </Label>
                    <Input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.lastName")}
                    </Label>
                    <Input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div className="space-y-2">
                  <Label htmlFor="phone" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("register.phone")}
                  </Label>
                  <Input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                    placeholder="+91 98765 43210"
                    required
                  />
                </div>
              </div>

              {/* Business Information Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  Business Information
                </h3>

                {/* Company Name */}
                <div className="space-y-2">
                  <Label htmlFor="companyName" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("register.companyName")}
                  </Label>
                  <Input
                    id="companyName"
                    name="companyName"
                    type="text"
                    value={formData.companyName}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                    placeholder="ABC Construction Pvt Ltd"
                    required
                  />
                </div>

                {/* License Number & Specialization */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.licenseNumber")}
                    </Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      type="text"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      placeholder="LICENSE123456"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialization" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.specialization")}
                    </Label>
                    <Input
                      id="specialization"
                      name="specialization"
                      type="text"
                      value={formData.specialization}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      placeholder="Road repair, Electrical, Plumbing"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Account Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {t("register.accountDetails")}
                </h3>

                {/* Email */}
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("register.email")}
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                    placeholder="contractor@company.com"
                    required
                  />
                </div>

                {/* Password & Confirm Password */}
                <div className="grid grid-cols-1 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="password" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.password")}
                    </Label>
                    <Input
                      id="password"
                      name="password"
                      type="password"
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.confirmPassword")}
                    </Label>
                    <Input
                      id="confirmPassword"
                      name="confirmPassword"
                      type="password"
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Location Details Section */}
              <div className="space-y-4">
                <h3 className="text-sm font-semibold text-gray-900 dark:text-white border-b border-gray-200 dark:border-gray-700 pb-2">
                  {t("register.location")}
                </h3>

                {/* Address */}
                <div className="space-y-2">
                  <Label htmlFor="address" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                    {t("register.address")}
                  </Label>
                  <Input
                    id="address"
                    name="address"
                    type="text"
                    value={formData.address}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                    placeholder="Business address"
                    required
                  />
                </div>

                {/* City & PIN Code */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.city")}
                    </Label>
                    <Input
                      id="city"
                      name="city"
                      type="text"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="pincode" className="text-sm font-medium text-gray-700 dark:text-gray-300">
                      {t("register.pincode")}
                    </Label>
                    <Input
                      id="pincode"
                      name="pincode"
                      type="text"
                      value={formData.pincode}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-orange-500 dark:bg-gray-800 dark:text-white"
                      placeholder="400001"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* Terms and Conditions */}
              <div className="flex items-start space-x-2">
                <Checkbox
                  id="terms"
                  checked={formData.agreeToTerms}
                  onCheckedChange={(checked) =>
                    setFormData(prev => ({ ...prev, agreeToTerms: checked as boolean }))
                  }
                  className="mt-1"
                  required
                />
                <Label
                  htmlFor="terms"
                  className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed"
                >
                  {t("register.terms")}
                </Label>
              </div>

              {/* Submit Button */}
              <Button
                type="submit"
                className="w-full py-3 px-4 rounded-md text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ backgroundColor: "#F39C12" }}
                disabled={!formData.agreeToTerms || loading}
              >
                {loading ? (
                  <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Registering...
                  </div>
                ) : (
                  t("register.signup", { role: t("register.roles.contractor.label") })
                )}
              </Button>
            </form>

            {/* Sign In Link */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("register.haveAccount")}{" "}
                <Link
                  href="/login/contractor"
                  className="text-orange-600 hover:text-orange-500 dark:text-orange-400 font-medium"
                >
                  {t("register.signin")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
