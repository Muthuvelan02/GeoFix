"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import {
    User,
    Mail,
    Phone,
    MapPin,
    Camera,
    Save,
    ArrowLeft,
    Edit3,
    Shield,
    Calendar,
    Award
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { ticketService } from "@/services/ticketService"

interface ProfileData {
    id: string
    name: string
    email: string
    mobile: string
    address: string
    joinedDate: string
    totalReports: number
    resolvedReports: number
    communityRank: number
    verificationStatus: 'verified' | 'pending' | 'unverified'
}

export default function CitizenProfile() {
    const router = useRouter()
    const locale = "en" // Hardcoded for now
    const [user, setUser] = useState<ProfileData | null>(null)
    const [isEditing, setIsEditing] = useState(false)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        mobile: '',
        address: ''
    })

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push(`/${locale}/login/citizen`)
            return
        }

        // Verify user has CITIZEN role
        const userRole = userData.roles[0]
        if (userRole !== 'ROLE_CITIZEN') {
            if (userRole === 'ROLE_ADMIN') {
                router.push(`/${locale}/dashboard/admin`)
            } else if (userRole === 'ROLE_CONTRACTOR') {
                router.push(`/${locale}/dashboard/contractor`)
            } else {
                authService.logout()
                router.push(`/${locale}/login/citizen`)
            }
            return
        }

        loadProfileData()
    }, [locale, router])

    const loadProfileData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Get profile data
            const profile = await authService.getProfile()

            // Get ticket statistics
            const tickets = await ticketService.getMyTickets()
            const stats = ticketService.calculateStats(tickets)

            const profileData: ProfileData = {
                id: String(profile.id) || '1',
                name: profile.name || 'Citizen User',
                email: profile.email || 'user@example.com',
                mobile: profile.mobile || '',
                address: profile.address || '',
                joinedDate: '2024-01-01',
                totalReports: stats.total,
                resolvedReports: stats.completed,
                communityRank: Math.floor(Math.random() * 100) + 1,
                verificationStatus: 'verified'
            }

            setUser(profileData)
            setFormData({
                name: profileData.name,
                email: profileData.email,
                mobile: profileData.mobile,
                address: profileData.address
            })

        } catch (err: any) {
            console.error('Error loading profile:', err)
            setError(err.message || 'Failed to load profile data')
        } finally {
            setLoading(false)
        }
    }

    const handleSave = async () => {
        if (!user) return

        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            // Simulate profile update - replace with actual API call when available
            // await authService.updateProfile(formData)

            // Update local user data
            setUser({
                ...user,
                ...formData
            })

            setIsEditing(false)
            setSuccess('Profile updated successfully!')

            // Clear success message after 3 seconds
            setTimeout(() => setSuccess(null), 3000)

        } catch (err: any) {
            console.error('Error updating profile:', err)
            setError(err.message || 'Failed to update profile')
        } finally {
            setSaving(false)
        }
    }

    const handleCancel = () => {
        if (!user) return

        setFormData({
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            address: user.address
        })
        setIsEditing(false)
        setError(null)
        setSuccess(null)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader />
                <div className="flex">
                    <CollapsibleSidebar userRole="citizen" locale={locale} />
                    <main className="flex-1 lg:ml-64">
                        <div className="p-8">
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                    <div className="space-y-6">
                                        <Card>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="h-20 w-20 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mx-auto"></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader />
                <div className="flex">
                    <CollapsibleSidebar userRole="citizen" locale={locale} />
                    <main className="flex-1 lg:ml-64">
                        <div className="p-8">
                            <div className="text-center">
                                <p className="text-red-600 dark:text-red-400">Failed to load profile data</p>
                                <Button onClick={loadProfileData} className="mt-4">
                                    Retry
                                </Button>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />

            <div className="flex">
                <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />

                <main className="flex-1 lg:ml-64 transition-all duration-300">
                    <div className="p-6 lg:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        Back
                                    </Button>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            My Profile
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            Manage your personal information and account settings
                                        </p>
                                    </div>
                                </div>

                                {!isEditing ? (
                                    <Button onClick={() => setIsEditing(true)}>
                                        <Edit3 className="h-4 w-4 mr-2" />
                                        Edit Profile
                                    </Button>
                                ) : (
                                    <div className="space-x-2">
                                        <Button variant="outline" onClick={handleCancel}>
                                            Cancel
                                        </Button>
                                        <Button onClick={handleSave} disabled={saving}>
                                            <Save className="h-4 w-4 mr-2" />
                                            {saving ? 'Saving...' : 'Save Changes'}
                                        </Button>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Success/Error Messages */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-green-800 dark:text-green-200">{success}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                            {/* Main Profile Form */}
                            <div className="lg:col-span-2 space-y-6">
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <User className="h-5 w-5 text-blue-600" />
                                            </div>
                                            Personal Information
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Update your personal details and contact information
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label htmlFor="name">Full Name</Label>
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your full name"
                                                />
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="email">Email Address</Label>
                                                <Input
                                                    id="email"
                                                    type="email"
                                                    value={formData.email}
                                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                                    disabled={!isEditing}
                                                    placeholder="Enter your email address"
                                                />
                                            </div>
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="mobile">Mobile Number</Label>
                                            <Input
                                                id="mobile"
                                                value={formData.mobile}
                                                onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="Enter your mobile number"
                                            />
                                        </div>

                                        <div className="space-y-2">
                                            <Label htmlFor="address">Address</Label>
                                            <Textarea
                                                id="address"
                                                value={formData.address}
                                                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                disabled={!isEditing}
                                                placeholder="Enter your complete address"
                                                rows={3}
                                            />
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Account Security */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <Shield className="h-5 w-5 text-green-600" />
                                            </div>
                                            Account Security
                                        </CardTitle>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Manage your password and security settings
                                        </p>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    Password
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Last changed 3 months ago
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Change Password
                                            </Button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                            <div>
                                                <p className="font-medium text-gray-900 dark:text-white">
                                                    Two-Factor Authentication
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Add an extra layer of security to your account
                                                </p>
                                            </div>
                                            <Button variant="outline" size="sm">
                                                Enable
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Sidebar */}
                            <div className="space-y-6">
                                {/* Profile Picture */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="text-center">
                                            <Avatar className="h-24 w-24 mx-auto mb-4">
                                                <AvatarFallback className="text-2xl bg-blue-600 text-white">
                                                    {user.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>

                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                                                {user.name}
                                            </h3>

                                            <div className="flex items-center justify-center gap-2 mb-4">
                                                <Badge
                                                    variant={user.verificationStatus === 'verified' ? 'default' : 'secondary'}
                                                >
                                                    {user.verificationStatus === 'verified' ? 'Verified' : 'Unverified'}
                                                </Badge>
                                            </div>

                                            <Button variant="outline" size="sm" className="w-full">
                                                <Camera className="h-4 w-4 mr-2" />
                                                Change Photo
                                            </Button>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Statistics */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                                <Award className="h-5 w-5 text-orange-600" />
                                            </div>
                                            My Statistics
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-4">
                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Total Reports</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">{user.totalReports}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Resolved Reports</span>
                                            <span className="font-semibold text-green-600">{user.resolvedReports}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Community Rank</span>
                                            <span className="font-semibold text-blue-600">#{user.communityRank}</span>
                                        </div>

                                        <Separator />

                                        <div className="flex justify-between items-center">
                                            <span className="text-gray-600 dark:text-gray-400">Member Since</span>
                                            <span className="font-semibold text-gray-900 dark:text-white">
                                                {new Date(user.joinedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Quick Actions */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardHeader>
                                        <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                                            <div className="w-8 h-8 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <MapPin className="h-5 w-5 text-purple-600" />
                                            </div>
                                            Quick Actions
                                        </CardTitle>
                                    </CardHeader>
                                    <CardContent className="space-y-2">
                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => router.push(`/${locale}/dashboard/citizen/report`)}
                                        >
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Report New Issue
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => router.push(`/${locale}/dashboard/citizen/reports`)}
                                        >
                                            <Calendar className="h-4 w-4 mr-2" />
                                            View My Reports
                                        </Button>

                                        <Button
                                            variant="outline"
                                            className="w-full justify-start hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                            onClick={() => router.push(`/${locale}/dashboard/citizen/settings`)}
                                        >
                                            <User className="h-4 w-4 mr-2" />
                                            Account Settings
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>
                    </div>

                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}