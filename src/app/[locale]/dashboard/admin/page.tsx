"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "@/i18n/navigation"
import {
    Shield,
    Users,
    HardHat,
    FileText,
    Clock,
    AlertTriangle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import adminService from "@/services/adminService"
import ContractorVerification from "@/components/ContractorVerification"

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTickets: 0,
        pendingTickets: 0,
        totalCitizens: 0,
        totalContractors: 0
    })
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const initializeAdmin = async () => {
            try {
                const userData = authService.getCurrentUser()
                if (!userData) {
                    router.push("/login/admin")
                    return
                }

                // Verify user has ADMIN role
                const userRole = userData.roles[0]
                if (userRole !== 'ROLE_ADMIN') {
                    // Redirect to appropriate dashboard
                    if (userRole === 'ROLE_CITIZEN') {
                        router.push("/dashboard/citizen")
                    } else if (userRole === 'ROLE_CONTRACTOR') {
                        router.push("/dashboard/contractor")
                    } else {
                        authService.logout()
                        router.push("/login/admin")
                    }
                    return
                }

                // Get user profile data
                try {
                    const profile = await authService.getProfile()
                    setUser(profile)
                } catch (profileError) {
                    // Fallback to basic user data
                    setUser({
                        id: userData.userId,
                        name: 'Admin User',
                        email: 'admin@example.com',
                        roles: userData.roles
                    })
                }

                await loadDashboardData()
            } catch (error) {
                console.error('Error initializing admin dashboard:', error)
                setError('Failed to initialize dashboard')
            }
        }

        initializeAdmin()
    }, [router])

    const loadDashboardData = async () => {
        try {
            setLoading(true)
            setError(null)
            const dashboardStats = await adminService.getDashboardStats()
            const usersData = await adminService.getAllUsers()

            setStats({
                totalTickets: dashboardStats.totalTickets || 0,
                pendingTickets: dashboardStats.pendingTickets || 0,
                totalCitizens: dashboardStats.totalCitizens || 0,
                totalContractors: dashboardStats.verifiedContractors || 0
            })
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard data")
        } finally {
            setLoading(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Admin Dashboard - GeoFix</title>
                <meta name="description" content="Admin dashboard for managing tickets, contractors, and users" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader
                    userRole="admin"
                    userName={user?.name || "Admin User"}
                    userEmail={user?.email || "admin@example.com"}
                    notificationCount={stats.pendingTickets}
                    onLogout={() => {
                        authService.logout()
                        router.push("/login/admin")
                    }}
                />
                <div className="flex">
                    <CollapsibleSidebar userRole="admin" locale="en" user={user} />

                    <main className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Welcome Section */}
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                        <Shield className="h-6 w-6 text-green-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Admin Dashboard
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Manage tickets, users, and contractors
                                        </p>
                                    </div>
                                </div>
                            </div>

                            {/* Error Alert */}
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            {/* Stats Grid */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Tickets
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Pending Review
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingTickets}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-orange-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Citizens
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalCitizens}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Contractors
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalContractors}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <HardHat className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Contractor Verification Section */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Pending Contractor Verifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ContractorVerification />
                                </CardContent>
                            </Card>

                            {/* Main Content */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Recent Activity</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="text-center py-12">
                                        <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            No recent activity
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        <DashboardFooter />
                    </main>
                </div>
            </div>
        </>
    )
}
