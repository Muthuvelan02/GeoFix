"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams } from "next/navigation"
import { useRouter } from "@/i18n/navigation"
import { authService } from "@/services/authService"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { MapPin, User, Building, Users, Calendar, CheckCircle2, Clock, AlertCircle } from "lucide-react"


// Mock Data
interface TimelineEvent {
    event: string
    date: string | null
    completed: boolean
}

interface CitizenTicket {
    id: number
    title: string
    location: string
    status: "PENDING" | "IN_PROGRESS" | "COMPLETED"
    timeline: TimelineEvent[]
    assignedContractor: string
    assignedWorker: string
}

const mockTracking: CitizenTicket[] = [
    {
        id: 1,
        title: "Pothole on MG Road",
        location: "MG Road",
        status: "IN_PROGRESS",
        timeline: [
            { event: "Reported", date: "2025-10-01T10:30:00", completed: true },
            { event: "Assigned to Contractor", date: "2025-10-01T15:00:00", completed: true },
            { event: "Worker Assigned", date: "2025-10-02T09:00:00", completed: true },
            { event: "Work In Progress", date: "2025-10-03T08:00:00", completed: true },
            { event: "Completion", date: null, completed: false },
        ],
        assignedContractor: "ABC Construction",
        assignedWorker: "John Worker",
    },
]

export default function CitizenTrackPage() {
    const params = useParams()
    const router = useRouter()
    const locale = params.locale as string || 'en'
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [statusFilter, setStatusFilter] = useState<"ALL" | "PENDING" | "IN_PROGRESS" | "COMPLETED">("ALL")

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData || userData.roles[0] !== 'ROLE_CITIZEN') {
            router.push("/login/citizen")
            return
        }
        setUser(userData)
        setLoading(false)
    }, [router])

    // BACKEND INTEGRATION POINT
    // TO BE REPLACED WITH: await citizenService.getMyTickets()
    const tickets = mockTracking

    const filteredTickets = useMemo(() => {
        return tickets.filter((t) => (statusFilter === "ALL" ? true : t.status === statusFilter))
    }, [tickets, statusFilter])

    const getStatusBadge = (status: CitizenTicket["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-400">Pending</Badge>
            case "IN_PROGRESS":
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400">In Progress</Badge>
            case "COMPLETED":
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400">Completed</Badge>
            default:
                return null
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
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Track My Issues</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Monitor the progress of your reported issues
                            </p>
                        </div>

                        {/* Status Filter */}
                        <div className="flex gap-2 mb-4">
                            {["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    onClick={() => setStatusFilter(status as any)}
                                >
                                    {status === "ALL"
                                        ? "All"
                                        : status === "PENDING"
                                            ? "Pending"
                                            : status === "IN_PROGRESS"
                                                ? "In Progress"
                                                : "Completed"}
                                </Button>
                            ))}
                        </div>

                        {/* Ticket Cards */}
                        {filteredTickets.length === 0 ? (
                            <p className="text-gray-500">No tickets found.</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredTickets.map((ticket) => (
                                    <Card key={ticket.id} className="shadow-sm border-l-4 border-orange-600">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">{ticket.title}</CardTitle>
                                            <div className="flex gap-2">{getStatusBadge(ticket.status)}</div>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p>
                                                <strong>Location:</strong> {ticket.location}
                                            </p>

                                            {/* Timeline */}
                                            <div className="mt-2">
                                                <strong>Timeline:</strong>
                                                <ul className="list-inside list-disc ml-4 space-y-1">
                                                    {ticket.timeline.map((t, idx) => (
                                                        <li key={idx} className={t.completed ? "text-green-700" : "text-gray-500"}>
                                                            {t.completed ? "✓" : "⏳"} {t.event}
                                                            {t.date ? ` - ${new Date(t.date).toLocaleString()}` : ""}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>

                                            {/* Assigned info */}
                                            <p className="mt-2">
                                                <strong>Contractor:</strong> {ticket.assignedContractor} <br />
                                                <strong>Worker:</strong> {ticket.assignedWorker}
                                            </p>

                                            {/* Action Buttons */}
                                            <div className="flex gap-2 mt-2">
                                                <Button className="bg-blue-600 hover:bg-blue-700 text-white">View Details</Button>
                                                <Button className="bg-green-600 hover:bg-green-700 text-white">Contact Support</Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}
