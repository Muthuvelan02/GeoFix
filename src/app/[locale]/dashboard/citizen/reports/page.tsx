"use client"

import React, { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
    AlertTriangle,
    MapPin,
    FileText,
    Search,
    Filter,
    Calendar,
    Eye,
    ArrowLeft,
    Clock,
    CheckCircle,
    XCircle,
    UserCheck,
    Phone,
    Mail,
    ChevronLeft,
    ChevronRight
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { ticketService, Ticket } from "@/services/ticketService"

export default function CitizenReports() {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [filterCategory, setFilterCategory] = useState("all")
    const [sortBy, setSortBy] = useState("newest")
    const [currentPage, setCurrentPage] = useState(1)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const itemsPerPage = 10

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

        loadUserData()
        loadTickets()
    }, [locale, router])

    const loadUserData = async () => {
        try {
            const profile = await authService.getProfile()
            setUser(profile)
        } catch (error) {
            console.error('Failed to load profile:', error)
            setUser({ name: 'Citizen User', email: 'user@example.com' })
        }
    }

    const loadTickets = async () => {
        setLoading(true)
        setError(null)

        try {
            const fetchedTickets = await ticketService.getMyTickets()
            setTickets(fetchedTickets)
        } catch (err: any) {
            console.error('Error loading tickets:', err)
            setError(err.message || 'Failed to load reports')
            setTickets([])
        } finally {
            setLoading(false)
        }
    }

    // Filter and search logic
    const filteredTickets = tickets.filter((ticket: Ticket) => {
        const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
            ticket.location.toLowerCase().includes(searchQuery.toLowerCase())

        // Map backend status to filter status
        let ticketFilterStatus = "all"
        if (ticket.status === 'PENDING') ticketFilterStatus = "pending"
        else if (ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED_TO_CONTRACTOR' || ticket.status === 'ASSIGNED_TO_WORKER') ticketFilterStatus = "in-progress"
        else if (ticket.status === 'COMPLETED') ticketFilterStatus = "resolved"
        else if (ticket.status === 'REJECTED') ticketFilterStatus = "rejected"

        const matchesStatus = filterStatus === "all" || ticketFilterStatus === filterStatus
        const matchesCategory = filterCategory === "all" || ticket.title.toLowerCase().includes(filterCategory.toLowerCase())

        return matchesSearch && matchesStatus && matchesCategory
    })

    // Sort tickets
    const sortedTickets = [...filteredTickets].sort((a, b) => {
        switch (sortBy) {
            case 'newest':
                return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
            case 'oldest':
                return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
            case 'status':
                return a.status.localeCompare(b.status)
            case 'location':
                return a.location.localeCompare(b.location)
            default:
                return 0
        }
    })

    // Pagination
    const totalPages = Math.ceil(sortedTickets.length / itemsPerPage)
    const startIndex = (currentPage - 1) * itemsPerPage
    const endIndex = startIndex + itemsPerPage
    const currentTickets = sortedTickets.slice(startIndex, endIndex)

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
                                <div className="space-y-4">
                                    {[...Array(5)].map((_, i) => (
                                        <Card key={i}>
                                            <CardContent className="p-6">
                                                <div className="space-y-4">
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                    <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
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
                            <div className="flex items-center space-x-4 mb-4">
                                <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                                >
                                    <ArrowLeft className="h-4 w-4 mr-2" />
                                    {t('common.back')}
                                </Button>
                                <div>
                                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                        My Reports
                                    </h1>
                                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                                        View and manage all your reported issues
                                    </p>
                                </div>
                            </div>

                            {/* Stats Summary */}
                            <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 mb-6">
                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Total Reports</p>
                                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{tickets.length}</p>
                                            </div>
                                            <FileText className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Pending</p>
                                                <p className="text-2xl font-bold text-orange-600">
                                                    {tickets.filter(t => t.status === 'PENDING').length}
                                                </p>
                                            </div>
                                            <Clock className="h-8 w-8 text-orange-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                                                <p className="text-2xl font-bold text-blue-600">
                                                    {tickets.filter(t => ['IN_PROGRESS', 'ASSIGNED_TO_CONTRACTOR', 'ASSIGNED_TO_WORKER'].includes(t.status)).length}
                                                </p>
                                            </div>
                                            <AlertTriangle className="h-8 w-8 text-blue-600" />
                                        </div>
                                    </CardContent>
                                </Card>

                                <Card>
                                    <CardContent className="p-4">
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm text-gray-600 dark:text-gray-400">Resolved</p>
                                                <p className="text-2xl font-bold text-green-600">
                                                    {tickets.filter(t => t.status === 'COMPLETED').length}
                                                </p>
                                            </div>
                                            <CheckCircle className="h-8 w-8 text-green-600" />
                                        </div>
                                    </CardContent>
                                </Card>
                            </div>
                        </div>

                        {/* Filters and Search */}
                        <Card className="mb-6">
                            <CardContent className="p-6">
                                <div className="space-y-4">
                                    <div className="flex flex-col sm:flex-row gap-4">
                                        <div className="relative flex-1">
                                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                            <Input
                                                placeholder="Search by title, description, or location..."
                                                value={searchQuery}
                                                onChange={(e) => setSearchQuery(e.target.value)}
                                                className="pl-10"
                                            />
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/${locale}/dashboard/citizen/report`)}
                                            className="whitespace-nowrap"
                                        >
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Report New Issue
                                        </Button>
                                    </div>

                                    <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                                        <Select value={filterStatus} onValueChange={setFilterStatus}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Status" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Status</SelectItem>
                                                <SelectItem value="pending">Pending</SelectItem>
                                                <SelectItem value="in-progress">In Progress</SelectItem>
                                                <SelectItem value="resolved">Resolved</SelectItem>
                                                <SelectItem value="rejected">Rejected</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={filterCategory} onValueChange={setFilterCategory}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="All Categories" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="all">All Categories</SelectItem>
                                                <SelectItem value="infrastructure">Infrastructure</SelectItem>
                                                <SelectItem value="lighting">Street Lighting</SelectItem>
                                                <SelectItem value="sanitation">Sanitation</SelectItem>
                                                <SelectItem value="traffic">Traffic</SelectItem>
                                                <SelectItem value="water">Water</SelectItem>
                                                <SelectItem value="other">Other</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Select value={sortBy} onValueChange={setSortBy}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Sort by" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="newest">Newest First</SelectItem>
                                                <SelectItem value="oldest">Oldest First</SelectItem>
                                                <SelectItem value="status">By Status</SelectItem>
                                                <SelectItem value="location">By Location</SelectItem>
                                            </SelectContent>
                                        </Select>

                                        <Button variant="outline" onClick={() => {
                                            setSearchQuery("")
                                            setFilterStatus("all")
                                            setFilterCategory("all")
                                            setSortBy("newest")
                                        }}>
                                            <Filter className="h-4 w-4 mr-2" />
                                            Clear Filters
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Error State */}
                        {error && (
                            <Card className="mb-6">
                                <CardContent className="p-6">
                                    <div className="text-center text-red-600 dark:text-red-400">
                                        <XCircle className="h-12 w-12 mx-auto mb-4" />
                                        <p className="text-lg font-semibold mb-2">Error loading reports</p>
                                        <p>{error}</p>
                                        <Button onClick={loadTickets} className="mt-4">
                                            Try Again
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Reports List */}
                        {currentTickets.length === 0 && !error ? (
                            <Card>
                                <CardContent className="p-12">
                                    <div className="text-center">
                                        <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                            No reports found
                                        </h3>
                                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                                            {searchQuery || filterStatus !== "all" || filterCategory !== "all"
                                                ? "No reports match your current filters. Try adjusting your search criteria."
                                                : "You haven't reported any issues yet. Start by reporting your first issue."}
                                        </p>
                                        <Button onClick={() => router.push(`/${locale}/dashboard/citizen/report`)}>
                                            <AlertTriangle className="h-4 w-4 mr-2" />
                                            Report Your First Issue
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="space-y-4">
                                {currentTickets.map((ticket: Ticket) => (
                                    <Card
                                        key={ticket.id}
                                        className="hover:shadow-md transition-shadow duration-200"
                                    >
                                        <CardContent className="p-6">
                                            <div className="flex items-start justify-between mb-4">
                                                <div className="flex-1">
                                                    <div className="flex items-start gap-3 mb-3">
                                                        <div className="mt-1">
                                                            <AlertTriangle className="h-5 w-5 text-orange-600" />
                                                        </div>
                                                        <div className="flex-1">
                                                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                                                {ticket.title}
                                                            </h3>
                                                            <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                                {ticket.description}
                                                            </p>

                                                            <div className="flex items-center gap-3 flex-wrap">
                                                                <Badge className={ticketService.getStatusColor(ticket.status)}>
                                                                    {ticketService.getStatusLabel(ticket.status)}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    <MapPin className="h-3 w-3 mr-1" />
                                                                    {ticket.location}
                                                                </Badge>
                                                                <Badge variant="outline" className="text-xs">
                                                                    <Calendar className="h-3 w-3 mr-1" />
                                                                    {ticketService.formatDate(ticket.createdAt)}
                                                                </Badge>
                                                            </div>
                                                        </div>
                                                    </div>

                                                    {/* Assignment Information */}
                                                    {ticket.assignedContractor && (
                                                        <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                                            <div className="flex items-center justify-between mb-2">
                                                                <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-2">
                                                                    <UserCheck className="h-4 w-4" />
                                                                    Assigned to Contractor
                                                                </h4>
                                                            </div>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-blue-800 dark:text-blue-200">
                                                                <div>
                                                                    <p className="font-medium">{ticket.assignedContractor.name}</p>
                                                                    {ticket.assignedContractor.email && (
                                                                        <p className="flex items-center gap-1 mt-1">
                                                                            <Mail className="h-3 w-3" />
                                                                            {ticket.assignedContractor.email}
                                                                        </p>
                                                                    )}
                                                                    {ticket.assignedContractor.phone && (
                                                                        <p className="flex items-center gap-1 mt-1">
                                                                            <Phone className="h-3 w-3" />
                                                                            {ticket.assignedContractor.phone}
                                                                        </p>
                                                                    )}
                                                                </div>
                                                                <div>
                                                                    {ticket.estimatedCompletionDate && (
                                                                        <p className="flex items-center gap-1 text-green-700 dark:text-green-300">
                                                                            <Clock className="h-3 w-3" />
                                                                            Est. completion: {ticketService.formatDate(ticket.estimatedCompletionDate)}
                                                                        </p>
                                                                    )}
                                                                    <p className="text-xs mt-1">
                                                                        Assigned: {ticketService.formatDate(ticket.assignedAt || ticket.updatedAt)}
                                                                    </p>
                                                                </div>
                                                            </div>

                                                            {/* Progress Bar */}
                                                            {(ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED_TO_CONTRACTOR' || ticket.status === 'ASSIGNED_TO_WORKER') && (
                                                                <div className="mt-3">
                                                                    <div className="flex items-center justify-between text-xs mb-1">
                                                                        <span className="text-blue-800 dark:text-blue-200">Progress</span>
                                                                        <span className="font-medium text-blue-900 dark:text-blue-100">
                                                                            {ticket.status === 'ASSIGNED_TO_CONTRACTOR' ? '25%' :
                                                                                ticket.status === 'ASSIGNED_TO_WORKER' ? '50%' :
                                                                                    ticket.status === 'IN_PROGRESS' ? '75%' : '0%'}
                                                                        </span>
                                                                    </div>
                                                                    <Progress
                                                                        value={ticket.status === 'ASSIGNED_TO_CONTRACTOR' ? 25 :
                                                                            ticket.status === 'ASSIGNED_TO_WORKER' ? 50 :
                                                                                ticket.status === 'IN_PROGRESS' ? 75 : 0}
                                                                        className="h-2"
                                                                    />
                                                                </div>
                                                            )}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>

                                            <div className="flex items-center justify-between pt-4 border-t border-gray-100 dark:border-gray-800">
                                                <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                                    {ticket.photos && ticket.photos.length > 0 && (
                                                        <span className="flex items-center gap-1">
                                                            <FileText className="h-4 w-4" />
                                                            {ticket.photos.length} {ticket.photos.length === 1 ? 'photo' : 'photos'}
                                                        </span>
                                                    )}
                                                    <span className="text-xs">
                                                        Last updated: {ticketService.formatDate(ticket.updatedAt)}
                                                    </span>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        onClick={() => router.push(`/${locale}/dashboard/citizen/tickets/${ticket.id}`)}
                                                    >
                                                        <Eye className="h-4 w-4 mr-1" />
                                                        View Details
                                                    </Button>
                                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                                        #{ticket.id}
                                                    </span>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}

                                {/* Pagination */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-between mt-8">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Showing {startIndex + 1}-{Math.min(endIndex, sortedTickets.length)} of {sortedTickets.length} reports
                                        </p>
                                        <div className="flex items-center gap-2">
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                                                disabled={currentPage === 1}
                                            >
                                                <ChevronLeft className="h-4 w-4" />
                                                Previous
                                            </Button>
                                            <span className="text-sm text-gray-600 dark:text-gray-400">
                                                Page {currentPage} of {totalPages}
                                            </span>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                                                disabled={currentPage === totalPages}
                                            >
                                                Next
                                                <ChevronRight className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}