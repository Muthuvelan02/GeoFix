"use client"

import React, { useState, useEffect } from "react"
import { useLocale, useTranslations } from "next-intl"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle, ArrowLeft, MapPin, Calendar, User } from "lucide-react"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { ticketService, Ticket } from "@/services/ticketService"

export default function MyTicketsPage() {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<Ticket[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push(`/${locale}/login/citizen`)
            return
        }

        authService.getProfile()
            .then(profile => setUser(profile))
            .catch(() => {
                setUser({
                    id: userData.userId,
                    name: 'Citizen User',
                    email: 'user@example.com'
                })
            })

        loadTickets()
    }, [locale, router])

    const loadTickets = async () => {
        try {
            setLoading(true)
            setError(null)
            const ticketsData = await ticketService.getMyTickets()
            setTickets(ticketsData)
        } catch (err: any) {
            console.error('Error loading tickets:', err)
            setError(err.message || 'Failed to load tickets')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push(`/${locale}`)
    }

    const getStatusBadge = (status: string) => {
        const statusMap = {
            'PENDING': { variant: 'destructive' as const, label: 'Pending' },
            'ASSIGNED_TO_CONTRACTOR': { variant: 'secondary' as const, label: 'Assigned to Contractor' },
            'ASSIGNED_TO_WORKER': { variant: 'default' as const, label: 'Assigned to Worker' },
            'IN_PROGRESS': { variant: 'default' as const, label: 'In Progress' },
            'COMPLETED': { variant: 'default' as const, label: 'Completed' },
            'REJECTED': { variant: 'destructive' as const, label: 'Rejected' }
        }
        const config = statusMap[status as keyof typeof statusMap] || { variant: 'secondary' as const, label: status }
        return <Badge variant={config.variant}>{config.label}</Badge>
    }

    const filteredTickets = tickets.filter(ticket => {
        const matchesSearch = !search ||
            ticket.title.toLowerCase().includes(search.toLowerCase()) ||
            ticket.description.toLowerCase().includes(search.toLowerCase()) ||
            ticket.location.toLowerCase().includes(search.toLowerCase())

        const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter

        return matchesSearch && matchesStatus
    })

    if (loading) {
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
                    <CollapsibleSidebar userRole="citizen" locale={locale} />
                    <main className="flex-1 lg:ml-64 pt-16">
                        <div className="container mx-auto px-4 py-8">
                            <div className="flex items-center justify-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin" />
                                <span className="ml-2">Loading tickets...</span>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

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
                <CollapsibleSidebar userRole="citizen" locale={locale} />

                <main className="flex-1 lg:ml-64 pt-16">
                    <div className="container mx-auto px-4 py-8 max-w-7xl">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            className="mb-6"
                            onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>

                        {/* Header */}
                        <div className="mb-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Tickets</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                View and manage all your reported tickets
                            </p>
                        </div>

                        {error && (
                            <Alert className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Filters */}
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Input
                                        placeholder="Search tickets..."
                                        value={search}
                                        onChange={(e) => setSearch(e.target.value)}
                                    />
                                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Filter by status" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="ALL">All Status</SelectItem>
                                            <SelectItem value="PENDING">Pending</SelectItem>
                                            <SelectItem value="ASSIGNED_TO_CONTRACTOR">Assigned to Contractor</SelectItem>
                                            <SelectItem value="ASSIGNED_TO_WORKER">Assigned to Worker</SelectItem>
                                            <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                            <SelectItem value="COMPLETED">Completed</SelectItem>
                                        </SelectContent>
                                    </Select>
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearch("")
                                            setStatusFilter("ALL")
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-blue-600">
                                        {tickets.length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Total Tickets
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-red-600">
                                        {tickets.filter(t => t.status === 'PENDING').length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Pending
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-yellow-600">
                                        {tickets.filter(t => t.status === 'IN_PROGRESS').length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        In Progress
                                    </div>
                                </CardContent>
                            </Card>
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-2xl font-bold text-green-600">
                                        {tickets.filter(t => t.status === 'COMPLETED').length}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        Completed
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Tickets List */}
                        <div className="space-y-4">
                            {filteredTickets.length === 0 ? (
                                <Card>
                                    <CardContent className="p-12 text-center">
                                        <p className="text-gray-500 dark:text-gray-400 mb-4">
                                            {tickets.length === 0
                                                ? "You haven't reported any tickets yet."
                                                : "No tickets found matching your criteria."
                                            }
                                        </p>
                                        <Button
                                            onClick={() => router.push(`/${locale}/dashboard/citizen/report`)}
                                        >
                                            Report Your First Ticket
                                        </Button>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <Card key={ticket.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                                    <div className="flex items-center gap-4 mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                        <div className="flex items-center gap-1">
                                                            <MapPin className="h-4 w-4" />
                                                            {ticket.location}
                                                        </div>
                                                        <div className="flex items-center gap-1">
                                                            <Calendar className="h-4 w-4" />
                                                            {new Date(ticket.createdAt).toLocaleDateString()}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(ticket.status)}
                                                </div>
                                            </div>
                                        </CardHeader>
                                        <CardContent>
                                            <p className="text-gray-700 dark:text-gray-300 mb-4">
                                                {ticket.description}
                                            </p>

                                            {ticket.photos && ticket.photos.length > 0 && (
                                                <div className="mb-4">
                                                    <p className="text-sm font-medium mb-2">Photos:</p>
                                                    <div className="flex gap-2 flex-wrap">
                                                        {ticket.photos.map((photo, index) => (
                                                            <img
                                                                key={index}
                                                                src={photo}
                                                                alt={`Ticket photo ${index + 1}`}
                                                                className="w-20 h-20 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                                                                onClick={() => window.open(photo, '_blank')}
                                                            />
                                                        ))}
                                                    </div>
                                                </div>
                                            )}

                                            {ticket.assignedContractor && (
                                                <div className="mb-2">
                                                    <p className="text-sm">
                                                        <span className="font-medium">Assigned Contractor:</span> {ticket.assignedContractor.name}
                                                    </p>
                                                </div>
                                            )}

                                            {ticket.assignedWorker && (
                                                <div className="mb-2">
                                                    <p className="text-sm">
                                                        <span className="font-medium">Assigned Worker:</span> {ticket.assignedWorker.name}
                                                    </p>
                                                </div>
                                            )}

                                            {ticket.proofOfWorkPhoto && (
                                                <div className="mb-2">
                                                    <p className="text-sm font-medium mb-2">Work Completion Photo:</p>
                                                    <img
                                                        src={ticket.proofOfWorkPhoto}
                                                        alt="Work completion proof"
                                                        className="w-32 h-32 object-cover rounded border cursor-pointer hover:scale-105 transition-transform"
                                                        onClick={() => window.open(ticket.proofOfWorkPhoto, '_blank')}
                                                    />
                                                </div>
                                            )}

                                            <div className="text-sm text-gray-500 dark:text-gray-400 pt-2 border-t">
                                                <div className="flex justify-between">
                                                    <span>Created: {new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                    {ticket.completedAt && (
                                                        <span>Completed: {new Date(ticket.completedAt).toLocaleDateString()}</span>
                                                    )}
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            <DashboardFooter />
        </div>
    )
}