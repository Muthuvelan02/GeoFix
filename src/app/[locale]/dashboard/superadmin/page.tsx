"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "@/i18n/navigation"
import {
    Crown,
    Users,
    Database,
    Settings,
    Shield,
    Activity,
    AlertTriangle,
    TrendingUp,
    Server,
    Lock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import superadminService, { SuperadminStats, SystemConfig } from "@/services/superadminService"

export default function SuperadminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState<SuperadminStats | null>(null)
    const [config, setConfig] = useState<SystemConfig | null>(null)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const initializeSuperadmin = async () => {
            try {
                const userData = authService.getCurrentUser()
                if (!userData) {
                    router.push("/admin/login")
                    return
                }

                // Verify user has SUPERADMIN role
                const userRole = userData.roles[0]
                if (userRole !== 'ROLE_SUPERADMIN') {
                    // Redirect to appropriate dashboard
                    if (userRole === 'ROLE_ADMIN') {
                        router.push("/dashboard/admin")
                    } else if (userRole === 'ROLE_CITIZEN') {
                        router.push("/dashboard/citizen")
                    } else if (userRole === 'ROLE_CONTRACTOR') {
                        router.push("/dashboard/contractor")
                    } else {
                        authService.logout()
                        router.push("/admin/login")
                    }
                    return
                }

                // Get user profile data
                try {
                    const profile = await authService.getUserProfile()
                    setUser(profile)
                } catch (profileError) {
                    // Fallback to basic user data
                    setUser({
                        id: userData.userId,
                        name: 'Super Administrator',
                        email: 'superadmin@geofix.com',
                        roles: userData.roles
                    })
                }

                // Load dashboard stats and config
                try {
                    const [dashboardStats, systemConfig] = await Promise.all([
                        superadminService.getDashboardStats(),
                        superadminService.getSystemConfig()
                    ])
                    setStats(dashboardStats)
                    setConfig(systemConfig)
                } catch (statsError) {
                    console.error('Error loading dashboard data:', statsError)
                    // Set fallback stats
                    setStats({
                        totalUsers: 0,
                        totalAdmins: 0,
                        totalTickets: 0,
                        totalContractors: 0,
                        systemUptime: "Loading...",
                        databaseSize: "Loading...",
                        activeUsers: 0,
                        systemLoad: 0,
                        criticalAlerts: 0,
                        pendingApprovals: 0,
                        systemHealth: "Good",
                        activeConnections: 0
                    })
                }

            } catch (error) {
                console.error('Error initializing superadmin dashboard:', error)
                setError('Failed to initialize dashboard')
            } finally {
                setLoading(false)
            }
        }

        initializeSuperadmin()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/20 via-gray-900 to-black">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-red-200">Loading Super Admin Dashboard...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Super Admin Dashboard - GeoFix</title>
                <meta name="description" content="Super administrator dashboard for complete system management" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-gray-900 to-black">
                <DashboardHeader />

                <div className="flex">
                    <CollapsibleSidebar userRole="superadmin" locale="en" />

                    <main className="flex-1 p-6 lg:p-8">
                        {error && (
                            <Alert className="mb-6 border-red-800 bg-red-900/20">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-red-200">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Welcome Section */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-3xl font-bold text-white">
                                        Super Administrator Dashboard
                                    </h1>
                                    <p className="text-red-200">
                                        Complete system control and management
                                    </p>
                                </div>
                            </div>
                            <Badge className="bg-red-900/30 text-red-400 border-red-800">
                                🔒 Maximum Security Clearance
                            </Badge>
                        </div>

                        {/* System Statistics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                            <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-200 mb-1">
                                                Total Users
                                            </p>
                                            <p className="text-2xl font-bold text-white">{stats?.totalUsers || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <Users className="h-6 w-6 text-blue-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-200 mb-1">
                                                System Admins
                                            </p>
                                            <p className="text-2xl font-bold text-white">{stats?.totalAdmins || 0}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Shield className="h-6 w-6 text-purple-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-200 mb-1">
                                                System Uptime
                                            </p>
                                            <p className="text-2xl font-bold text-white">{stats?.systemUptime || "Loading..."}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <TrendingUp className="h-6 w-6 text-green-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm font-medium text-red-200 mb-1">
                                                Database Size
                                            </p>
                                            <p className="text-2xl font-bold text-white">{stats?.databaseSize || "Loading..."}</p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-900/30 rounded-lg flex items-center justify-center">
                                            <Database className="h-6 w-6 text-orange-400" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* System Management Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                            {[
                                {
                                    title: "User Management",
                                    description: "Manage all system users including admins",
                                    icon: Users,
                                    color: "blue",
                                    action: "Manage Users"
                                },
                                {
                                    title: "System Configuration",
                                    description: "Configure system settings and parameters",
                                    icon: Settings,
                                    color: "purple",
                                    action: "System Settings"
                                },
                                {
                                    title: "Database Administration",
                                    description: "Database management and optimization",
                                    icon: Database,
                                    color: "green",
                                    action: "Database Admin"
                                },
                                {
                                    title: "Security Center",
                                    description: "Security monitoring and access control",
                                    icon: Lock,
                                    color: "red",
                                    action: "Security Settings"
                                },
                                {
                                    title: "System Monitoring",
                                    description: "Real-time system health and performance",
                                    icon: Activity,
                                    color: "orange",
                                    action: "View Monitoring"
                                },
                                {
                                    title: "Server Management",
                                    description: "Server configuration and maintenance",
                                    icon: Server,
                                    color: "indigo",
                                    action: "Manage Servers"
                                }
                            ].map((card, index) => (
                                <Card key={index} className="border-red-800 bg-gray-900/50 backdrop-blur hover:bg-gray-800/50 transition-colors">
                                    <CardContent className="p-6">
                                        <div className={`w-12 h-12 bg-${card.color}-900/30 rounded-lg flex items-center justify-center mb-4`}>
                                            <card.icon className={`h-6 w-6 text-${card.color}-400`} />
                                        </div>
                                        <h3 className="text-lg font-semibold text-white mb-2">
                                            {card.title}
                                        </h3>
                                        <p className="text-gray-300 text-sm mb-4">
                                            {card.description}
                                        </p>
                                        <Button
                                            variant="outline"
                                            className="w-full border-red-800 text-red-400 hover:bg-red-900/20"
                                        >
                                            {card.action}
                                        </Button>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>

                        {/* System Status */}
                        <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white flex items-center gap-2">
                                    <Activity className="h-5 w-5 text-green-400" />
                                    System Status Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Activity className="h-8 w-8 text-green-400" />
                                        </div>
                                        <div className="text-white font-semibold">System Health</div>
                                        <div className="text-green-400">{stats?.systemHealth || "Good"}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-8 w-8 text-blue-400" />
                                        </div>
                                        <div className="text-white font-semibold">Active Connections</div>
                                        <div className="text-blue-400">{stats?.activeConnections || 0}</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Database className="h-8 w-8 text-orange-400" />
                                        </div>
                                        <div className="text-white font-semibold">Total Tickets</div>
                                        <div className="text-orange-400">{stats?.totalTickets || 0}</div>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <DashboardFooter />
                    </main>
                </div>
            </div>
        </>
    )
}
