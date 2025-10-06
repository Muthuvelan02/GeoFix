"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import {
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    Award,
    BarChart3,
    Calendar
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { contractorService, ContractorTicket, Worker } from "@/services/contractorService"

export default function PerformancePage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string || 'en'

    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<ContractorTicket[]>([])
    const [workers, setWorkers] = useState<Worker[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData || userData.roles[0] !== 'ROLE_CONTRACTOR') {
            router.push("/login/contractor")
            return
        }
        setUser(userData)
        loadData()
    }, [router])

    const loadData = async () => {
        try {
            setLoading(true)
            const [ticketsData, workersData] = await Promise.all([
                contractorService.getAssignedTickets(),
                contractorService.getWorkers()
            ])
            setTickets(ticketsData)
            setWorkers(workersData)
        } catch (error: any) {
            console.error('Error loading data:', error)
        } finally {
            setLoading(false)
        }
    }

    const getPerformanceMetrics = () => {
        const total = tickets.length
        const completed = tickets.filter(t => t.status === 'COMPLETED').length
        const inProgress = tickets.filter(t => t.status === 'IN_PROGRESS').length
        const assignedToWorker = tickets.filter(t => t.status === 'ASSIGNED_TO_WORKER').length
        const toAssign = tickets.filter(t => t.status === 'ASSIGNED_TO_CONTRACTOR').length

        const completionRate = total > 0 ? (completed / total) * 100 : 0
        const activeRate = total > 0 ? ((inProgress + assignedToWorker) / total) * 100 : 0

        return {
            total,
            completed,
            inProgress,
            assignedToWorker,
            toAssign,
            completionRate,
            activeRate,
            activeWorkers: workers.filter(w => w.status === 'ACTIVE').length,
            totalWorkers: workers.length
        }
    }

    const metrics = getPerformanceMetrics()

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="contractor" locale={locale} user={user} />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                Performance Overview
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Track your work statistics and team performance
                            </p>
                        </div>

                        {/* Key Metrics */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Total Tickets
                                            </p>
                                            <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                                {metrics.total}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                            <BarChart3 className="h-6 w-6 text-blue-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Completed
                                            </p>
                                            <p className="text-3xl font-bold text-green-600">
                                                {metrics.completed}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                            <CheckCircle className="h-6 w-6 text-green-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                In Progress
                                            </p>
                                            <p className="text-3xl font-bold text-orange-600">
                                                {metrics.inProgress + metrics.assignedToWorker}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                            <Clock className="h-6 w-6 text-orange-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                                Active Workers
                                            </p>
                                            <p className="text-3xl font-bold text-purple-600">
                                                {metrics.activeWorkers}
                                            </p>
                                        </div>
                                        <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                            <Users className="h-6 w-6 text-purple-600" />
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Performance Charts */}
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Completion Rate */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <TrendingUp className="h-5 w-5 text-green-600" />
                                        Completion Rate
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Overall Progress
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {metrics.completionRate.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress value={metrics.completionRate} className="h-3" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                            <div>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {metrics.completed}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Completed
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                                    {metrics.total - metrics.completed}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Remaining
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Active Work */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Clock className="h-5 w-5 text-orange-600" />
                                        Active Work
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        <div>
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm text-gray-600 dark:text-gray-400">
                                                    Active Tickets
                                                </span>
                                                <span className="text-sm font-medium">
                                                    {metrics.activeRate.toFixed(1)}%
                                                </span>
                                            </div>
                                            <Progress value={metrics.activeRate} className="h-3" />
                                        </div>

                                        <div className="grid grid-cols-2 gap-4 pt-4 border-t">
                                            <div>
                                                <p className="text-2xl font-bold text-purple-600">
                                                    {metrics.assignedToWorker}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Assigned to Workers
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {metrics.inProgress}
                                                </p>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    In Progress
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Team Performance */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-purple-600" />
                                    Team Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <div className="text-center p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-purple-600">
                                            {metrics.totalWorkers}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Total Workers
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-green-600">
                                            {metrics.activeWorkers}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Active Workers
                                        </p>
                                    </div>
                                    <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <p className="text-3xl font-bold text-blue-600">
                                            {metrics.total > 0 && metrics.totalWorkers > 0
                                                ? (metrics.total / metrics.totalWorkers).toFixed(1)
                                                : '0'}
                                        </p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                            Avg Tickets per Worker
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Summary */}
                        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
                            <CardContent className="p-6">
                                <div className="flex items-start gap-4">
                                    <div className="w-12 h-12 bg-orange-600 rounded-lg flex items-center justify-center flex-shrink-0">
                                        <Award className="h-6 w-6 text-white" />
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            Performance Summary
                                        </h3>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    You have completed <strong className="text-green-600">{metrics.completed}</strong> out of{' '}
                                                    <strong className="text-gray-900 dark:text-white">{metrics.total}</strong> assigned tickets
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-gray-600 dark:text-gray-400">
                                                    <strong className="text-yellow-600">{metrics.toAssign}</strong> tickets waiting to be assigned to workers
                                                </p>
                                            </div>
                                        </div>
                                    </div>
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
