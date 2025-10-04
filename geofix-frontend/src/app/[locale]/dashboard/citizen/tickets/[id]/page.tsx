"use client"

import React, { useState, useEffect } from "react"
import { useRouter, useParams } from "next/navigation"
import {
    AlertTriangle,
    MapPin,
    FileText,
    User,
    Calendar,
    Clock,
    CheckCircle,
    ArrowLeft,
    ImageIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { ticketService, Ticket } from "@/services/ticketService"

export default function TicketDetailPage() {
    const locale = "en" // Hardcoded for now
    const router = useRouter()
    const params = useParams()
    const ticketId = params.id as string

    const [user, setUser] = useState<any>(null)
    const [ticket, setTicket] = useState<Ticket | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

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

        loadTicketDetails()
    }, [ticketId, locale, router])

    const loadTicketDetails = async () => {
        try {
            setLoading(true)
            setError(null)
            const fetchedTicket = await ticketService.getTicketById(Number(ticketId))
            setTicket(fetchedTicket)
        } catch (err: any) {
            console.error('Error loading ticket:', err)
            setError(err.message || 'Failed to load ticket details')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push(`/${locale}`)
    }

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
                        <div className="container mx-auto px-4 py-8 max-w-4xl">
                            <div className="text-center py-12">
                                <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-6" />
                                <div className="space-y-2">
                                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Loading Ticket Details</h2>
                                    <p className="text-gray-600 dark:text-gray-400">Please wait while we fetch the ticket information...</p>
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
                    <div className="container mx-auto px-4 py-8 max-w-4xl">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            className="mb-6"
                            onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>

                        {error && (
                            <Card className="mb-6 border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900/10">
                                <CardContent className="p-6">
                                    <div className="flex items-start gap-4">
                                        <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <AlertTriangle className="h-5 w-5 text-red-600" />
                                        </div>
                                        <div className="flex-1">
                                            <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-2">
                                                Error Loading Ticket
                                            </h2>
                                            <p className="text-red-700 dark:text-red-300 mb-4 text-sm">
                                                {error}
                                            </p>
                                            <Button
                                                onClick={() => loadTicketDetails()}
                                                variant="outline"
                                                className="border-red-300 text-red-700 hover:bg-red-50 dark:border-red-600 dark:text-red-300 dark:hover:bg-red-900/20"
                                            >
                                                Try Again
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {ticket && (
                            <>
                                {/* Ticket Header */}
                                <Card className="mb-6 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                    <CardHeader className="p-6">
                                        <div className="flex items-start gap-4">
                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center flex-shrink-0">
                                                <AlertTriangle className="h-5 w-5 text-orange-600" />
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <CardTitle className="text-2xl font-semibold text-gray-900 dark:text-white mb-3">{ticket.title}</CardTitle>
                                                <div className="flex items-center gap-4 flex-wrap">
                                                    <Badge className={ticketService.getStatusColor(ticket.status)}>
                                                        {ticketService.getStatusLabel(ticket.status)}
                                                    </Badge>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <FileText className="h-4 w-4" />
                                                        <span>Ticket #{ticket.id}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500 dark:text-gray-400">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>Created {ticketService.formatDate(ticket.createdAt)}</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </CardHeader>
                                </Card>

                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    {/* Main Content */}
                                    <div className="lg:col-span-2 space-y-6">
                                        {/* Description */}
                                        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <FileText className="h-5 w-5 text-blue-600" />
                                                    Description
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap leading-relaxed">
                                                    {ticket.description}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Location */}
                                        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <MapPin className="h-5 w-5 text-green-600" />
                                                    Location
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <p className="text-gray-700 dark:text-gray-300">
                                                    {ticket.location}
                                                </p>
                                            </CardContent>
                                        </Card>

                                        {/* Photos */}
                                        {ticket.photos && ticket.photos.length > 0 && (
                                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                        <ImageIcon className="h-5 w-5 text-purple-600" />
                                                        Photos ({ticket.photos.length})
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="grid grid-cols-2 gap-4">
                                                        {ticket.photos.map((photo, index) => (
                                                            <div key={index} className="relative">
                                                                <img
                                                                    src={ticketService.getPhotoUrl(photo)}
                                                                    alt={`Photo ${index + 1}`}
                                                                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200 border border-gray-200 dark:border-gray-600"
                                                                    onClick={() => window.open(ticketService.getPhotoUrl(photo), '_blank')}
                                                                />
                                                            </div>
                                                        ))}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Proof of Work */}
                                        {ticket.proofOfWorkPhoto && (
                                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                                        Proof of Completion
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="relative">
                                                        <img
                                                            src={ticketService.getPhotoUrl(ticket.proofOfWorkPhoto)}
                                                            alt="Proof of work"
                                                            className="w-full max-w-md rounded-lg cursor-pointer hover:opacity-90 transition-opacity duration-200 border border-gray-200 dark:border-gray-600"
                                                            onClick={() => window.open(ticketService.getPhotoUrl(ticket.proofOfWorkPhoto!), '_blank')}
                                                        />
                                                    </div>
                                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
                                                        Click to view full size
                                                    </p>
                                                </CardContent>
                                            </Card>
                                        )}
                                    </div>

                                    {/* Sidebar */}
                                    <div className="space-y-6">
                                        {/* Reporter Info */}
                                        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <User className="h-5 w-5 text-blue-600" />
                                                    Reported By
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent className="pt-0">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                        <span className="font-medium text-blue-700 dark:text-blue-300">
                                                            {ticket.citizen.name.charAt(0)}
                                                        </span>
                                                    </div>
                                                    <div>
                                                        <p className="font-medium text-gray-900 dark:text-white">
                                                            {ticket.citizen.name}
                                                        </p>
                                                        <p className="text-sm text-gray-500 dark:text-gray-400">
                                                            Citizen
                                                        </p>
                                                    </div>
                                                </div>
                                            </CardContent>
                                        </Card>

                                        {/* Assignment Info */}
                                        {ticket.assignedContractor && (
                                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                        <User className="h-5 w-5 text-orange-600" />
                                                        Assigned Contractor
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="space-y-3">
                                                        <div className="flex items-center gap-3">
                                                            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                                                <span className="font-medium text-orange-700 dark:text-orange-300">
                                                                    {ticket.assignedContractor.name.charAt(0)}
                                                                </span>
                                                            </div>
                                                            <div>
                                                                <p className="font-medium text-gray-900 dark:text-white">
                                                                    {ticket.assignedContractor.name}
                                                                </p>
                                                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                    Contractor
                                                                </p>
                                                            </div>
                                                        </div>
                                                        {ticket.assignedAt && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-700/50 px-3 py-2 rounded-md">
                                                                <Clock className="h-4 w-4" />
                                                                <span>Assigned {ticketService.formatDate(ticket.assignedAt)}</span>
                                                            </div>
                                                        )}
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {ticket.assignedWorker && (
                                            <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                                <CardHeader className="pb-3">
                                                    <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                        <User className="h-5 w-5 text-green-600" />
                                                        Assigned Worker
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="pt-0">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                            <span className="font-medium text-green-700 dark:text-green-300">
                                                                {ticket.assignedWorker.name.charAt(0)}
                                                            </span>
                                                        </div>
                                                        <div>
                                                            <p className="font-medium text-gray-900 dark:text-white">
                                                                {ticket.assignedWorker.name}
                                                            </p>
                                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                                Worker
                                                            </p>
                                                        </div>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        )}

                                        {/* Timeline */}
                                        <Card className="border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                                            <CardHeader className="pb-3">
                                                <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900 dark:text-white">
                                                    <Clock className="h-5 w-5 text-purple-600" />
                                                    Timeline
                                                </CardTitle>
                                            </CardHeader>
                                            <CardContent>
                                                <div className="space-y-4">
                                                    <div className="flex gap-3">
                                                        <div className="flex flex-col items-center">
                                                            <div className="w-8 h-8 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                                                <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                                            </div>
                                                            <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-2" />
                                                        </div>
                                                        <div className="flex-1 pb-4">
                                                            <p className="font-medium text-gray-900 dark:text-white">Created</p>
                                                            <p className="text-sm text-gray-500">
                                                                {new Date(ticket.createdAt).toLocaleString()}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    {ticket.assignedAt && (
                                                        <div className="flex gap-3">
                                                            <div className="flex flex-col items-center">
                                                                <div className="w-8 h-8 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                                                    <User className="h-4 w-4 text-orange-600 dark:text-orange-400" />
                                                                </div>
                                                                {ticket.completedAt && <div className="w-px h-full bg-gray-200 dark:bg-gray-700 mt-2" />}
                                                            </div>
                                                            <div className="flex-1 pb-4">
                                                                <p className="font-medium text-gray-900 dark:text-white">Assigned</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(ticket.assignedAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}

                                                    {ticket.completedAt && (
                                                        <div className="flex gap-3">
                                                            <div className="w-8 h-8 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center">
                                                                <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
                                                            </div>
                                                            <div className="flex-1">
                                                                <p className="font-medium text-gray-900 dark:text-white">Completed</p>
                                                                <p className="text-sm text-gray-500">
                                                                    {new Date(ticket.completedAt).toLocaleString()}
                                                                </p>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}
