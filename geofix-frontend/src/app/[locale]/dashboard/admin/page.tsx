"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import {
    Shield,
    Users,
    HardHat,
    FileText,
    CheckCircle,
    Clock,
    AlertTriangle,
    BarChart3
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"

export default function AdminDashboard() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string || 'en'
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
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

        setUser(userData)
        setLoading(false)
    }, [router])

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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="admin" locale={locale} user={user} />

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

                        {/* Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                Total Tickets
                                            </p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
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
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <HardHat className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

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
    )
}
