"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import Head from "next/head"
import {
  AlertTriangle,
  MapPin,
  FileText,
  Users,
  TrendingUp,
  Plus,
  Eye,
  ThumbsUp,
  MessageSquare,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search,
  ChevronLeft,
  ChevronRight,
  Bell,
  Calendar,
  BarChart3,
  Award,
  User,
  UserCheck,
  Phone,
  Mail
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
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

interface Notification {
  id: number
  type: "update" | "comment" | "resolved"
  message: string
  timestamp: string
  read: boolean
}

interface Stats {
  total: number
  pending: number
  inProgress: number
  resolved: number
}

export default function CitizenDashboard() {
  const router = useRouter()
  const locale = "en" // Hardcoded for now

  const [user, setUser] = useState<any>(null)
  const [stats, setStats] = useState<Stats>({
    total: 0,
    pending: 0,
    inProgress: 0,
    resolved: 0
  })
  const [tickets, setTickets] = useState<Ticket[]>([])
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [filterCategory, setFilterCategory] = useState("all")
  const [filterPriority, setFilterPriority] = useState("all")
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const itemsPerPage = 6

  // Initialize user and load data
  useEffect(() => {
    const userData = authService.getCurrentUser()
    if (!userData) {
      router.push(`/${locale}/login/citizen`)
      return
    }

    // Verify user has CITIZEN role
    const userRole = userData.roles[0]
    if (userRole !== 'ROLE_CITIZEN') {
      // Redirect to appropriate dashboard silently
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

    // Get profile data
    authService.getProfile()
      .then(profile => {
        setUser(profile)
      })
      .catch(error => {
        console.error('Failed to load profile:', error)
        // Use basic data from localStorage
        setUser({
          id: userData.userId,
          name: 'Citizen User',
          email: 'user@example.com',
          mobile: '',
          address: '',
          role: userData.roles
        })
      })

    loadDashboardData()
  }, [locale, router])

  // Load real data from API
  const loadDashboardData = async () => {
    setLoading(true)
    setError(null)

    try {
      // Fetch tickets from backend
      const fetchedTickets = await ticketService.getMyTickets()
      setTickets(fetchedTickets)

      // Calculate stats from fetched tickets
      const ticketStats = ticketService.calculateStats(fetchedTickets)
      setStats({
        total: ticketStats.total,
        pending: ticketStats.pending,
        inProgress: ticketStats.inProgress + ticketStats.assignedToContractor + ticketStats.assignedToWorker,
        resolved: ticketStats.completed
      })

      // Generate notifications based on tickets
      const generatedNotifications: Notification[] = []
      fetchedTickets.forEach((ticket, index) => {
        if (ticket.status === 'ASSIGNED_TO_CONTRACTOR' && ticket.assignedContractor) {
          generatedNotifications.push({
            id: index + 1,
            type: "update",
            message: `Your ticket "${ticket.title}" has been assigned to ${ticket.assignedContractor.name}`,
            timestamp: ticketService.formatDate(ticket.assignedAt || ticket.updatedAt),
            read: false
          })
        } else if (ticket.status === 'COMPLETED') {
          generatedNotifications.push({
            id: index + 100,
            type: "resolved",
            message: `Ticket "${ticket.title}" has been marked as completed`,
            timestamp: ticketService.formatDate(ticket.completedAt || ticket.updatedAt),
            read: false
          })
        }
      })

      setNotifications(generatedNotifications.slice(0, 10))

    } catch (err: any) {
      console.error('Error loading dashboard data:', err)
      setError(err.message || 'Failed to load dashboard data')
      // Set empty data on error
      setTickets([])
      setStats({
        total: 0,
        pending: 0,
        inProgress: 0,
        resolved: 0
      })
    } finally {
      setLoading(false)
    }
  }

  // Filter and search logic
  const filteredTickets = tickets.filter((ticket: Ticket) => {
    const matchesSearch = ticket.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ticket.description.toLowerCase().includes(searchQuery.toLowerCase())

    // Map backend status to filter status
    let ticketFilterStatus = "all"
    if (ticket.status === 'PENDING') ticketFilterStatus = "pending"
    else if (ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED_TO_CONTRACTOR' || ticket.status === 'ASSIGNED_TO_WORKER') ticketFilterStatus = "in-progress"
    else if (ticket.status === 'COMPLETED') ticketFilterStatus = "resolved"
    else if (ticket.status === 'REJECTED') ticketFilterStatus = "rejected"

    const matchesStatus = filterStatus === "all" || ticketFilterStatus === filterStatus
    // Category and priority filters are not in backend, so we'll accept all for now
    const matchesCategory = filterCategory === "all"
    const matchesPriority = filterPriority === "all"

    return matchesSearch && matchesStatus && matchesCategory && matchesPriority
  })

  // Pagination logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentTickets = filteredTickets.slice(startIndex, endIndex)

  const handleLogout = () => {
    authService.logout()
    router.push(`/${locale}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <DashboardHeader
          userRole="citizen"
          userName={user?.name || "Citizen User"}
          userEmail={user?.email || "user@example.com"}
          notificationCount={0}
          onLogout={handleLogout}
        />
        <div className="flex">
          <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />
          <main className="flex-1 lg:ml-64 pt-16">
            <div className="container mx-auto px-4 py-8">
              <Card className="border-red-200 dark:border-red-800 bg-red-50 dark:bg-red-900/20">
                <CardContent className="p-6">
                  <div className="flex items-start gap-4">
                    <XCircle className="h-12 w-12 text-red-500 flex-shrink-0" />
                    <div className="flex-1">
                      <h2 className="text-xl font-semibold text-red-900 dark:text-red-100 mb-2">
                        {error.includes('Access Denied') ? 'Access Denied' : 'Error Loading Dashboard'}
                      </h2>
                      <p className="text-red-700 dark:text-red-300 mb-4 whitespace-pre-wrap">
                        {error}
                      </p>
                      {!error.includes('Access Denied') && (
                        <div className="space-y-2">
                          <Button onClick={() => loadDashboardData()} variant="outline" className="mr-2">
                            Try Again
                          </Button>
                          <div className="mt-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-red-200 dark:border-red-700">
                            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Troubleshooting Tips:</h3>
                            <ul className="list-disc list-inside space-y-1 text-sm text-gray-600 dark:text-gray-400">

                              <li>Verify your account has the CITIZEN role</li>
                              <li>Try logging out and logging back in</li>
                              <li>Clear your browser cache and cookies</li>
                              <li>Contact support if the issue persists</li>
                            </ul>
                          </div>
                        </div>
                      )}
                      {error.includes('Access Denied') && (
                        <p className="text-sm text-red-600 dark:text-red-400 mt-2">
                          You will be redirected automatically in a few seconds...
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </div>
    )
  }

  return (
    <>
      <Head>
        <title>Citizen Dashboard - GeoFix</title>
        <meta name="description" content="Manage your tickets and track infrastructure issues in your area" />
      </Head>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        {/* Header */}
        <DashboardHeader
          userRole="citizen"
          userName={user?.name || "Citizen User"}
          userEmail={user?.email || "user@example.com"}
          notificationCount={notifications.filter(n => !n.read).length}
          onLogout={handleLogout}
        />

        <div className="flex">
          {/* Sidebar */}
          <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />

          {/* Main Content */}
          <main className="flex-1 lg:ml-64 pt-10">
            <div className="container mx-auto px-4 py-8 max-w-7xl">
              {/* Welcome Section */}
              <div className="mb-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                  Welcome back, {user?.name?.split(' ')[0] || "Citizen"}!
                </h1>
                <p className="text-gray-600 dark:text-gray-300">
                  Manage your civic tickets and track progress on your reports
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Total Tickets
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.total}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          All tickets reported
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                        <FileText className="h-6 w-6 text-blue-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Pending
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.pending}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Awaiting review
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
                        <Clock className="h-6 w-6 text-orange-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          In Progress
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.inProgress}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Being worked on
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-purple-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:shadow-md transition-shadow duration-200">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                          Resolved
                        </p>
                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                          {stats.resolved}
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Successfully completed
                        </p>
                      </div>
                      <div className="w-12 h-12 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions */}
              <Card className="mb-8 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <CardHeader className="">
                  <CardTitle className="flex items-center gap-3 text-lg font-semibold text-gray-900 dark:text-white">
                    <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
                      <Plus className="h-5 w-5 text-blue-600" />
                    </div>
                    Quick Actions
                  </CardTitle>

                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <Button
                      className="w-full h-auto py-6 flex flex-col items-center gap-3 bg-blue-500 hover:bg-blue-600 transition-colors cursor-pointer"
                      onClick={() => router.push(`/${locale}/dashboard/citizen/report`)}
                    >
                      <AlertTriangle className="h-6 w-6" />
                      <span className="font-medium">Report New Ticket</span>
                      <span className="text-xs opacity-90">Submit a civic problem</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex flex-col items-center gap-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => router.push(`/${locale}/dashboard/citizen/reports`)}
                    >
                      <FileText className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">View All My Tickets</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Track your reports</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="w-full h-auto py-6 flex flex-col items-center gap-3 border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                      onClick={() => router.push(`/${locale}/dashboard/citizen/profile`)}
                    >
                      <User className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                      <span className="font-medium text-gray-900 dark:text-white">Edit Profile</span>
                      <span className="text-xs text-gray-500 dark:text-gray-400">Update your details</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content - Tickets List */}
                <div className="lg:col-span-2">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center justify-between">
                        <span>Recent Tickets</span>
                        <Button
                          variant="link"
                          className="text-blue-600 dark:text-blue-400"
                          onClick={() => router.push(`/${locale}/dashboard/citizen/reports`)}
                        >
                          View All →
                        </Button>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {/* Search and Filters */}
                      <div className="space-y-4 mb-6">
                        <div className="flex flex-col sm:flex-row gap-3">
                          <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                              placeholder="Search tickets..."
                              value={searchQuery}
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="pl-10"
                            />
                          </div>
                          <Button variant="outline" size="icon">
                            <Filter className="h-4 w-4" />
                          </Button>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
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
                              <SelectItem value="other">Other</SelectItem>
                            </SelectContent>
                          </Select>

                          <Select value={filterPriority} onValueChange={setFilterPriority}>
                            <SelectTrigger>
                              <SelectValue placeholder="All Priority" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">All Priority</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="low">Low</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      {/* Tickets List */}
                      {currentTickets.length === 0 ? (
                        <div className="text-center py-12">
                          <FileText className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                          <p className="text-gray-600 dark:text-gray-400">
                            No issues match your current filters
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          {currentTickets.map((ticket: Ticket) => (
                            <Card
                              key={ticket.id}
                              className="hover:shadow-md transition-shadow duration-200 cursor-pointer border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800"
                              onClick={() => router.push(`/${locale}/dashboard/citizen/tickets/${ticket.id}`)}
                            >
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-3">
                                  <div className="flex-1">
                                    <div className="flex items-start gap-3 mb-2">
                                      <div className="mt-1">
                                        <AlertTriangle className="h-4 w-4 text-orange-600" />
                                      </div>
                                      <div className="flex-1">
                                        <h3 className="font-semibold text-gray-900 dark:text-white mb-1">
                                          {ticket.title}
                                        </h3>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                          {ticket.description}
                                        </p>
                                      </div>
                                    </div>

                                    {/* Status and Location */}
                                    <div className="flex items-center gap-2 flex-wrap mt-3">
                                      <Badge className={ticketService.getStatusColor(ticket.status)}>
                                        {ticketService.getStatusLabel(ticket.status)}
                                      </Badge>
                                      <Badge variant="outline" className="text-xs">
                                        <MapPin className="h-3 w-3 mr-1" />
                                        {ticket.location}
                                      </Badge>
                                    </div>

                                    {/* Assignment Information */}
                                    {ticket.assignedContractor && (
                                      <div className="mt-3 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center justify-between mb-2">
                                          <h4 className="text-sm font-medium text-blue-900 dark:text-blue-100 flex items-center gap-1">
                                            <UserCheck className="h-4 w-4" />
                                            Assigned Contractor
                                          </h4>
                                        </div>
                                        <div className="space-y-1 text-sm text-blue-800 dark:text-blue-200">
                                          <p className="font-medium">{ticket.assignedContractor.name}</p>
                                          {ticket.assignedContractor.phone && (
                                            <p className="flex items-center gap-1">
                                              <Phone className="h-3 w-3" />
                                              {ticket.assignedContractor.phone}
                                            </p>
                                          )}
                                          {ticket.assignedContractor.email && (
                                            <p className="flex items-center gap-1">
                                              <Mail className="h-3 w-3" />
                                              {ticket.assignedContractor.email}
                                            </p>
                                          )}
                                          {ticket.estimatedCompletionDate && (
                                            <p className="flex items-center gap-1 text-green-700 dark:text-green-300 mt-2">
                                              <Clock className="h-3 w-3" />
                                              Expected completion: {ticketService.formatDate(ticket.estimatedCompletionDate)}
                                            </p>
                                          )}
                                        </div>
                                      </div>
                                    )}

                                    {/* Progress Bar for In-Progress Issues */}
                                    {(ticket.status === 'IN_PROGRESS' || ticket.status === 'ASSIGNED_TO_CONTRACTOR' || ticket.status === 'ASSIGNED_TO_WORKER') && (
                                      <div className="mt-3">
                                        <div className="flex items-center justify-between text-sm mb-1">
                                          <span className="text-gray-600 dark:text-gray-400">Progress</span>
                                          <span className="font-medium text-gray-900 dark:text-white">
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
                                </div>

                                <div className="flex items-center justify-between pt-3 border-t border-gray-100 dark:border-gray-800">
                                  <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                                    <span className="flex items-center gap-1">
                                      <Calendar className="h-4 w-4" />
                                      {ticketService.formatDate(ticket.createdAt)}
                                    </span>
                                    {ticket.photos && ticket.photos.length > 0 && (
                                      <span className="flex items-center gap-1">
                                        <FileText className="h-4 w-4" />
                                        {ticket.photos.length} {ticket.photos.length === 1 ? 'photo' : 'photos'}
                                      </span>
                                    )}
                                  </div>
                                  <div className="flex items-center gap-2">
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        router.push(`/${locale}/dashboard/citizen/tickets/${ticket.id}`)
                                      }}
                                    >
                                      <Eye className="h-4 w-4 mr-1" />
                                      View Details
                                    </Button>
                                    <span className="text-xs text-gray-500 dark:text-gray-400">
                                      ID: #{ticket.id}
                                    </span>
                                  </div>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}

                      {/* Pagination */}
                      {totalPages > 1 && (
                        <div className="flex items-center justify-between mt-6 pt-4 border-t border-gray-200 dark:border-gray-700">
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Showing {startIndex + 1}-{Math.min(endIndex, filteredTickets.length)} of {filteredTickets.length}
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
                    </CardContent>
                  </Card>
                </div>

                {/* Sidebar - Activity & Stats */}
                <div className="space-y-6">
                  {/* Recent Activity */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        Recent Activity
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {notifications.slice(0, 5).map((notification) => (
                          <div
                            key={notification.id}
                            className={`flex items-start gap-3 p-3 rounded-lg transition-colors ${!notification.read
                              ? 'bg-blue-50 dark:bg-blue-900/20'
                              : 'bg-gray-50 dark:bg-gray-800/50'
                              }`}
                          >
                            <div className={`w-2 h-2 rounded-full mt-2 flex-shrink-0 ${!notification.read ? 'bg-blue-600' : 'bg-gray-400'
                              }`} />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-gray-900 dark:text-white">
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {notification.timestamp}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                      <Button
                        variant="link"
                        className="w-full mt-4 text-blue-600 dark:text-blue-400"
                      >
                        View All Notifications
                      </Button>
                    </CardContent>
                  </Card>


                </div>
              </div>
            </div>

            {/* Footer */}
            <DashboardFooter />
          </main>
        </div>
      </div>
    </>
  )
}
