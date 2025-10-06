"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import Head from "next/head"
import {
    HardHat,
    MapPin,
    Clock,
    CheckCircle,
    AlertTriangle,
    FileText,
    Users,
    BarChart3,
    Briefcase,
    TrendingUp
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { contractorService, ContractorTicket, Worker } from "@/services/contractorService"

export default function ContractorDashboard() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string || 'en'
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [tickets, setTickets] = useState<ContractorTicket[]>([])
    const [workers, setWorkers] = useState<Worker[]>([])
    const [stats, setStats] = useState({
        totalTickets: 0,
        assignedToContractor: 0,
        assignedToWorker: 0,
        inProgress: 0,
        completed: 0,
        totalWorkers: 0,
        activeWorkers: 0
    })

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push("/login/contractor")
            return
        }

        // Verify user has CONTRACTOR role
        const userRole = userData.roles[0]
        if (userRole !== 'ROLE_CONTRACTOR') {
            // Redirect to appropriate dashboard
            if (userRole === 'ROLE_CITIZEN') {
                router.push("/dashboard/citizen")
            } else if (userRole === 'ROLE_ADMIN') {
                router.push("/dashboard/admin")
            } else {
                authService.logout()
                router.push("/login/contractor")
            }
            return
        }

        setUser(userData)
        loadData()
    }, [router])

    const loadData = async () => {
        try {
            setLoading(true)
            console.log('🔄 Loading contractor dashboard data...');

            const [ticketsData, workersData] = await Promise.all([
                contractorService.getAssignedTickets().catch(err => {
                    console.error('Failed to load tickets:', err);
                    return []; // Return empty array on error
                }),
                contractorService.getWorkers().catch(err => {
                    console.error('Failed to load workers:', err);
                    return []; // Return empty array on error
                })
            ])

            console.log('📊 Dashboard data loaded:', { tickets: ticketsData.length, workers: workersData.length });

            setTickets(ticketsData || [])
            setWorkers(workersData || [])

            // Calculate stats with safe arrays
            const safeTicketsData = ticketsData || [];
            const safeWorkersData = workersData || [];

            const newStats = {
                totalTickets: safeTicketsData.length,
                assignedToContractor: safeTicketsData.filter(t => t.status === 'ASSIGNED_TO_CONTRACTOR').length,
                assignedToWorker: safeTicketsData.filter(t => t.status === 'ASSIGNED_TO_WORKER').length,
                inProgress: safeTicketsData.filter(t => t.status === 'IN_PROGRESS').length,
                completed: safeTicketsData.filter(t => t.status === 'COMPLETED').length,
                totalWorkers: safeWorkersData.length,
                activeWorkers: safeWorkersData.filter(w => w.status === 'ACTIVE').length
            }
            setStats(newStats)
        } catch (error) {
            console.error('❌ Error loading dashboard data:', error)
            // Set safe defaults
            setTickets([])
            setWorkers([])
            setStats({
                totalTickets: 0,
                assignedToContractor: 0,
                assignedToWorker: 0,
                inProgress: 0,
                completed: 0,
                totalWorkers: 0,
                activeWorkers: 0
            })
        } finally {
            setLoading(false)
        }
    }

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
        <>
            <Head>
                <title>Contractor Dashboard - GeoFix</title>
                <meta name="description" content="Manage assigned tickets and coordinate with workers" />
            </Head>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader />
                <div className="flex">
                    <CollapsibleSidebar userRole="contractor" locale={locale} user={user} />

                    <main className="flex-1 p-8">
                        <div className="max-w-7xl mx-auto space-y-8">
                            {/* Welcome Section */}
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <div className="flex items-center gap-4">
                                    <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                                        <HardHat className="h-6 w-6 text-orange-600" />
                                    </div>
                                    <div>
                                        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                                            Welcome, {user?.name || 'Contractor'}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400">
                                            Manage your assigned tickets and workers efficiently
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
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalTickets}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                                                <Briefcase className="h-6 w-6 text-blue-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    To Assign
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assignedToContractor}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/30 rounded-lg flex items-center justify-center">
                                                <AlertTriangle className="h-6 w-6 text-yellow-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    In Progress
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.inProgress}</p>
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
                                                    Completed
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.completed}</p>
                                            </div>
                                            <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                                                <CheckCircle className="h-6 w-6 text-green-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardContent className="p-6">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                                    Active Workers
                                                </p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeWorkers}</p>
                                                <p className="text-xs text-gray-500 mt-1">of {stats.totalWorkers} total</p>
                                            </div>
                                            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                                                <Users className="h-6 w-6 text-purple-600" />
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>

                            {/* Quick Actions */}
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <Button
                                    onClick={() => router.push(`/dashboard/contractor/tickets`)}
                                    className="h-auto p-6 flex flex-col items-start gap-2 bg-white dark:bg-gray-800 border-2 border-orange-200 hover:border-orange-400 dark:border-orange-900/30 dark:hover:border-orange-700 text-gray-900 dark:text-white hover:bg-orange-50 dark:hover:bg-orange-900/20"
                                    variant="outline"
                                >
                                    <Briefcase className="h-8 w-8 text-orange-600" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-base">View Assigned Tickets</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Manage and assign tickets to workers</p>
                                    </div>
                                </Button>

                                <Button
                                    onClick={() => router.push(`/dashboard/contractor/workers`)}
                                    className="h-auto p-6 flex flex-col items-start gap-2 bg-white dark:bg-gray-800 border-2 border-blue-200 hover:border-blue-400 dark:border-blue-900/30 dark:hover:border-blue-700 text-gray-900 dark:text-white hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                    variant="outline"
                                >
                                    <Users className="h-8 w-8 text-blue-600" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-base">Manage Workers</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Add, view, and manage your workers</p>
                                    </div>
                                </Button>

                                <Button
                                    onClick={() => router.push(`/dashboard/contractor/performance`)}
                                    className="h-auto p-6 flex flex-col items-start gap-2 bg-white dark:bg-gray-800 border-2 border-green-200 hover:border-green-400 dark:border-green-900/30 dark:hover:border-green-700 text-gray-900 dark:text-white hover:bg-green-50 dark:hover:bg-green-900/20"
                                    variant="outline"
                                >
                                    <TrendingUp className="h-8 w-8 text-green-600" />
                                    <div className="text-left">
                                        <h3 className="font-semibold text-base">Performance Overview</h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Track your work statistics</p>
                                    </div>
                                </Button>
                            </div>

                            {/* Recent Tickets */}
                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                <CardHeader className="flex flex-row items-center justify-between">
                                    <CardTitle className="text-lg font-semibold">Recent Tickets</CardTitle>
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={() => router.push(`/dashboard/contractor/tickets`)}
                                    >
                                        View All
                                    </Button>
                                </CardHeader>
                                <CardContent>
                                    {tickets.length === 0 ? (
                                        <div className="text-center py-12">
                                            <AlertTriangle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                            <p className="text-gray-600 dark:text-gray-400">
                                                No tickets assigned yet
                                            </p>
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            {tickets.slice(0, 5).map((ticket) => (
                                                <div
                                                    key={ticket.id}
                                                    className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                                                    onClick={() => router.push(`/${locale}/dashboard/contractor/tickets/${ticket.id}`)}
                                                >
                                                    <div className="flex-1">
                                                        <h3 className="font-medium text-gray-900 dark:text-white">{ticket.title}</h3>
                                                        <div className="flex items-center gap-4 mt-1 text-sm text-gray-600 dark:text-gray-400">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-3 w-3" />
                                                                {ticket.location}
                                                            </span>
                                                            <span>#{ticket.id}</span>
                                                        </div>
                                                    </div>
                                                    <Badge className={contractorService.getStatusColor(ticket.status)}>
                                                        {contractorService.getStatusLabel(ticket.status)}
                                                    </Badge>
                                                </div>
                                            ))}
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
