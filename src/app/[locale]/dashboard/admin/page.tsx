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
    AlertTriangle,
    Bell,
    RefreshCw,
    CheckCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { AlertCircle } from "lucide-react"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import adminService from "@/services/adminService"
import ContractorVerification from "@/components/ContractorVerification"
import { useRealTimeData } from "@/hooks/useRealTimeData"

export default function AdminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [stats, setStats] = useState({
        totalTickets: 0,
        pendingTickets: 0,
        totalCitizens: 0,
        totalContractors: 0,
        completedTickets: 0,
        inProgressTickets: 0,
        assignedTickets: 0,
        activeContractors: 0,
        pendingContractors: 0,
        totalWorkers: 0
    })
    const [error, setError] = useState<string | null>(null)

    // Real-time data hook (manual refresh only)
    const { data: realTimeData, loading: realTimeLoading, refresh, clearNewTicketsCount } = useRealTimeData({
        pollingInterval: 5000, // Not used since enabled is false
        enabled: false // Manual refresh only to save resources
    })

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

            // Get dashboard data from backend
            const dashboardData = await adminService.getDashboardData()
            const dashboardStats = await adminService.getDashboardStats()
            const allTickets = await adminService.getAllTickets()
            const allUsers = await adminService.getAllUsers()

            // Calculate real statistics from backend data
            const totalTickets = allTickets.length
            const pendingTickets = allTickets.filter(t => t.status === 'PENDING').length
            const completedTickets = allTickets.filter(t => t.status === 'COMPLETED').length
            const inProgressTickets = allTickets.filter(t => t.status === 'IN_PROGRESS').length
            const assignedTickets = allTickets.filter(t => t.status === 'ASSIGNED_TO_CONTRACTOR').length

            // Count users by role and status
            const totalCitizens = allUsers.filter(u => u.role?.some((r: string) => r.includes('CITIZEN'))).length
            const totalContractors = allUsers.filter(u => u.role?.some((r: string) => r.includes('CONTRACTOR'))).length
            const activeContractors = allUsers.filter(u => u.role?.some((r: string) => r.includes('CONTRACTOR')) && u.status === 'ACTIVE').length
            const pendingContractors = allUsers.filter(u => u.role?.some((r: string) => r.includes('CONTRACTOR')) && u.status === 'PENDING').length
            const totalWorkers = allUsers.filter(u => u.role?.some((r: string) => r.includes('WORKER'))).length

            setStats({
                totalTickets,
                pendingTickets,
                totalCitizens,
                totalContractors: activeContractors, // Show only active contractors
                completedTickets,
                inProgressTickets,
                assignedTickets,
                activeContractors,
                pendingContractors,
                totalWorkers
            })
        } catch (err) {
            console.error('Error loading dashboard data:', err)
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
                    notificationCount={stats.pendingTickets + realTimeData.newTicketsCount}
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
                                {/* Total Tickets */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Tickets
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stats.completedTickets} completed
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <FileText className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Pending Tickets */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Pending Review
                                                </p>
                                                <p className="text-2xl font-bold text-orange-600">{stats.pendingTickets}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Need assignment
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-orange-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Active Contractors */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Active Contractors
                                                </p>
                                                <p className="text-2xl font-bold text-green-600">{stats.activeContractors}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {stats.pendingContractors} pending
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <HardHat className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Citizens */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Citizens
                                                </p>
                                                <p className="text-2xl font-bold text-purple-600">{stats.totalCitizens}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Registered users
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Additional Stats Row */}
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                                {/* In Progress Tickets */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    In Progress
                                                </p>
                                                <p className="text-2xl font-bold text-blue-600">{stats.inProgressTickets}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Being worked on
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <Clock className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Assigned Tickets */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Assigned
                                                </p>
                                                <p className="text-2xl font-bold text-indigo-600">{stats.assignedTickets}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    To contractors
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-indigo-100 dark:bg-indigo-900/30 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-indigo-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Completed Tickets */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Completed
                                                </p>
                                                <p className="text-2xl font-bold text-green-600">{stats.completedTickets}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Successfully resolved
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <AlertTriangle className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                {/* Total Workers */}
                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Total Workers
                                                </p>
                                                <p className="text-2xl font-bold text-cyan-600">{stats.totalWorkers}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    Field workers
                                                </p>
                                            </div>
                                            <div className="w-12 h-12 bg-cyan-100 dark:bg-cyan-900/30 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-cyan-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* New Tickets Notification */}
                            {realTimeData.newTicketsCount > 0 && (
                                <Alert className="border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800">
                                    <Bell className="h-4 w-4 text-blue-600" />
                                    <AlertDescription className="flex items-center justify-between">
                                        <span className="text-blue-800 dark:text-blue-200">
                                            <strong>{realTimeData.newTicketsCount}</strong> new ticket{realTimeData.newTicketsCount > 1 ? 's' : ''} created since last refresh
                                        </span>
                                        <div className="flex gap-2">
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => router.push('/${locale}/dashboard/admin/tickets')}
                                                className="text-blue-600 border-blue-300 hover:bg-blue-100"
                                            >
                                                View Tickets
                                            </Button>
                                            <Button
                                                size="sm"
                                                variant="ghost"
                                                onClick={clearNewTicketsCount}
                                                className="text-blue-600 hover:bg-blue-100"
                                            >
                                                <CheckCircle className="h-4 w-4 mr-1" />
                                                Mark as Read
                                            </Button>
                                        </div>
                                    </AlertDescription>
                                </Alert>
                            )}

                            {/* Real-time Status */}
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                                <div className="flex items-center gap-2">
                                    <div className={`w-2 h-2 rounded-full ${realTimeLoading ? 'bg-yellow-500 animate-pulse' : 'bg-blue-500'}`} />
                                    <span className="text-sm text-gray-600 dark:text-gray-400">
                                        {realTimeLoading ? 'Updating...' : 'Manual refresh mode'}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        Last updated: {realTimeData.lastUpdate.toLocaleTimeString()}
                                    </span>
                                </div>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    onClick={refresh}
                                    disabled={realTimeLoading}
                                    className="flex items-center gap-1"
                                >
                                    <RefreshCw className={`h-3 w-3 ${realTimeLoading ? 'animate-spin' : ''}`} />
                                    Refresh
                                </Button>
                            </div>

                            {/* System Health Overview */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">System Health Overview</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        {/* Ticket Resolution Rate */}
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-green-600 mb-2">
                                                {stats.totalTickets > 0 ? Math.round((stats.completedTickets / stats.totalTickets) * 100) : 0}%
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Resolution Rate</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {stats.completedTickets} of {stats.totalTickets} tickets completed
                                            </p>
                                        </div>

                                        {/* Pending Workload */}
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-orange-600 mb-2">
                                                {stats.pendingTickets + stats.assignedTickets}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Workload</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {stats.pendingTickets} pending + {stats.assignedTickets} assigned
                                            </p>
                                        </div>

                                        {/* Contractor Utilization */}
                                        <div className="text-center">
                                            <div className="text-3xl font-bold text-blue-600 mb-2">
                                                {stats.activeContractors > 0 ? Math.round((stats.assignedTickets / stats.activeContractors) * 10) / 10 : 0}
                                            </div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Avg Tickets/Contractor</p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {stats.activeContractors} active contractors
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Quick Actions */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                        <Button
                                            onClick={() => router.push('/en/dashboard/admin/tickets')}
                                            className="h-20 flex flex-col items-center justify-center gap-2"
                                            variant="outline"
                                        >
                                            <FileText className="h-6 w-6" />
                                            <span className="text-sm">Manage Tickets</span>
                                        </Button>
                                        <Button
                                            onClick={() => router.push('/en/dashboard/admin/contractors')}
                                            className="h-20 flex flex-col items-center justify-center gap-2"
                                            variant="outline"
                                        >
                                            <HardHat className="h-6 w-6" />
                                            <span className="text-sm">Contractors</span>
                                        </Button>
                                        <Button
                                            onClick={() => router.push('/en/dashboard/admin/issues')}
                                            className="h-20 flex flex-col items-center justify-center gap-2"
                                            variant="outline"
                                        >
                                            <AlertTriangle className="h-6 w-6" />
                                            <span className="text-sm">Issue Reports</span>
                                        </Button>
                                        <Button
                                            onClick={refresh}
                                            disabled={realTimeLoading}
                                            className="h-20 flex flex-col items-center justify-center gap-2"
                                            variant="outline"
                                        >
                                            <RefreshCw className={`h-6 w-6 ${realTimeLoading ? 'animate-spin' : ''}`} />
                                            <span className="text-sm">Refresh Data</span>
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Contractor Verification Section */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <CardTitle className="text-lg font-semibold">Pending Contractor Verifications</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <ContractorVerification />
                                </CardContent>
                            </Card>

                            {/* Recent Tickets */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            onClick={() => router.push('/en/dashboard/admin/tickets')}
                                        >
                                            View All
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    {realTimeData.tickets.length > 0 ? (
                                        <div className="space-y-3">
                                            {realTimeData.tickets
                                                .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                                                .slice(0, 5)
                                                .map((ticket) => (
                                                    <div
                                                        key={ticket.id}
                                                        className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                                                    >
                                                        <div className="flex items-center gap-3">
                                                            <div className={`w-2 h-2 rounded-full ${ticket.status === 'PENDING' ? 'bg-orange-500' :
                                                                ticket.status === 'IN_PROGRESS' ? 'bg-blue-500' :
                                                                    ticket.status === 'COMPLETED' ? 'bg-green-500' :
                                                                        'bg-gray-500'
                                                                }`} />
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    {ticket.title}
                                                                </p>
                                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                                    {ticket.description?.substring(0, 50)}...
                                                                </p>
                                                            </div>
                                                        </div>
                                                        <div className="flex items-center gap-2">
                                                            <Badge variant={
                                                                ticket.status === 'PENDING' ? 'destructive' :
                                                                    ticket.status === 'IN_PROGRESS' ? 'default' :
                                                                        ticket.status === 'COMPLETED' ? 'secondary' :
                                                                            'outline'
                                                            }>
                                                                {ticket.status}
                                                            </Badge>
                                                            <span className="text-xs text-gray-500">
                                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                                            </span>
                                                        </div>
                                                    </div>
                                                ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-12">
                                            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No tickets found
                                            </p>
                                        </div>
                                    )}
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
