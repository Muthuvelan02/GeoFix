"use client"

import React, { useState, useMemo } from "react"
import { useParams } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
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


// Mock Data
interface AdminTicket {
    id: number
    title: string
    description: string
    location: string
    status:
    | "PENDING"
    | "ASSIGNED_TO_CONTRACTOR"
    | "ASSIGNED_TO_WORKER"
    | "IN_PROGRESS"
    | "COMPLETED"
    citizen: { id: number; name: string; email: string; mobile: string }
    assignedContractor?: { id: number; name: string }
    photos?: string[]
    createdAt: string
    priority?: "LOW" | "MEDIUM" | "HIGH"
}

const mockTickets: AdminTicket[] = [
    {
        id: 1,
        title: "Pothole on MG Road",
        description: "Large pothole causing traffic issues",
        location: "MG Road, Near Central Mall",
        status: "PENDING",
        citizen: { id: 1, name: "John Doe", email: "john@example.com", mobile: "9876543210" },
        createdAt: "2025-10-01T10:30:00",
        priority: "HIGH",
        photos: ["photo1.jpg", "photo2.jpg"],
    },
    {
        id: 2,
        title: "Street Light Not Working",
        description: "Street light broken for 3 days",
        location: "Park Street, Sector 5",
        status: "ASSIGNED_TO_CONTRACTOR",
        citizen: { id: 2, name: "Jane Smith", email: "jane@example.com", mobile: "9876543211" },
        assignedContractor: { id: 1, name: "ABC Construction" },
        createdAt: "2025-09-28T14:20:00",
        priority: "MEDIUM",
    },
]

export default function IssueAssignmentPage() {
    const params = useParams()
    const locale = params.locale as string || 'en'
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [dateFilter, setDateFilter] = useState("")
    const [assignDialogOpen, setAssignDialogOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<AdminTicket | null>(null)
    const [selectedContractor, setSelectedContractor] = useState<number | null>(null)

    // BACKEND INTEGRATION POINT
    // TO BE REPLACED WITH: await adminService.getAllTickets()
    const tickets = mockTickets

    // Mock active contractors
    const mockContractors = [
        { id: 1, name: "ABC Construction" },
        { id: 2, name: "XYZ Contractors" },
    ]

    const filteredTickets = useMemo(() => {
        return tickets.filter((t) => {
            const matchSearch =
                t.title.toLowerCase().includes(search.toLowerCase()) ||
                t.location.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "ALL" ? true : t.status === statusFilter
            const matchDate = dateFilter
                ? t.createdAt.startsWith(dateFilter)
                : true
            return matchSearch && matchStatus && matchDate
        })
    }, [tickets, search, statusFilter, dateFilter])

    const getStatusBadge = (status: AdminTicket["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "ASSIGNED_TO_CONTRACTOR":
            case "ASSIGNED_TO_WORKER":
                return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
            case "IN_PROGRESS":
                return <Badge className="bg-blue-100 text-blue-800">In Progress</Badge>
            case "COMPLETED":
                return <Badge className="bg-green-100 text-green-800">Completed</Badge>
            default:
                return null
        }
    }

    const getPriorityBadge = (priority?: "LOW" | "MEDIUM" | "HIGH") => {
        switch (priority) {
            case "LOW":
                return <Badge className="bg-blue-100 text-blue-800">Low</Badge>
            case "MEDIUM":
                return <Badge className="bg-orange-100 text-orange-800">Medium</Badge>
            case "HIGH":
                return <Badge className="bg-red-100 text-red-800">High</Badge>
            default:
                return null
        }
    }

    const openAssignDialog = (ticket: AdminTicket) => {
        setSelectedTicket(ticket)
        setSelectedContractor(null)
        setAssignDialogOpen(true)
    }

    const handleAssign = () => {
        if (!selectedTicket || !selectedContractor) return
        // BACKEND INTEGRATION POINT
        // await adminService.assignTicketToContractor(selectedTicket.id, selectedContractor)
        console.log("Assigned Ticket", selectedTicket.id, "to Contractor", selectedContractor)
        setAssignDialogOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="admin" locale={locale} user={{}} />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Issue Management</h1>

                        {/* Stats Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-5 gap-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Total</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-semibold">{tickets.length}</CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Pending</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-semibold text-yellow-600">
                                    {tickets.filter((t) => t.status === "PENDING").length}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Assigned</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-semibold text-blue-600">
                                    {tickets.filter(
                                        (t) =>
                                            t.status === "ASSIGNED_TO_CONTRACTOR" || t.status === "ASSIGNED_TO_WORKER"
                                    ).length}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>In Progress</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-semibold text-blue-600">
                                    {tickets.filter((t) => t.status === "IN_PROGRESS").length}
                                </CardContent>
                            </Card>
                            <Card>
                                <CardHeader>
                                    <CardTitle>Completed</CardTitle>
                                </CardHeader>
                                <CardContent className="text-2xl font-semibold text-green-600">
                                    {tickets.filter((t) => t.status === "COMPLETED").length}
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-4">
                            <Input
                                placeholder="Search by title or location..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full sm:w-1/2"
                            />
                            <Select value={statusFilter} onValueChange={(val) => setStatusFilter(val)}>
                                <SelectTrigger className="w-full sm:w-48">
                                    <SelectValue placeholder="Filter by Status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ALL">All</SelectItem>
                                    <SelectItem value="PENDING">Pending</SelectItem>
                                    <SelectItem value="ASSIGNED_TO_CONTRACTOR">Assigned to Contractor</SelectItem>
                                    <SelectItem value="ASSIGNED_TO_WORKER">Assigned to Worker</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                            <Input
                                type="date"
                                value={dateFilter}
                                onChange={(e) => setDateFilter(e.target.value)}
                                className="w-full sm:w-48"
                            />
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
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p>{ticket.description}</p>
                                            <p>
                                                <strong>Citizen:</strong> {ticket.citizen.name}
                                            </p>
                                            <p>
                                                <strong>Location:</strong> {ticket.location} |{" "}
                                                <strong>Created:</strong>{" "}
                                                {new Date(ticket.createdAt).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-2">
                                                {getStatusBadge(ticket.status)}
                                                {getPriorityBadge(ticket.priority)}
                                            </div>

                                            {ticket.photos && ticket.photos.length > 0 && (
                                                <div className="flex gap-2 pt-2">
                                                    {ticket.photos.map((photo, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={photo}
                                                            alt="Ticket Photo"
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    className="bg-gray-600 hover:bg-gray-700 text-white"
                                                    onClick={() => alert("View details not implemented")}
                                                >
                                                    👁 View
                                                </Button>
                                                <Button
                                                    className="bg-orange-600 hover:bg-orange-700 text-white"
                                                    onClick={() => openAssignDialog(ticket)}
                                                >
                                                    ➡ Assign to Contractor
                                                </Button>
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

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Ticket to Contractor</DialogTitle>
                    </DialogHeader>
                    <Select
                        value={selectedContractor?.toString() || ""}
                        onValueChange={(val) => setSelectedContractor(Number(val))}
                    >
                        <SelectTrigger className="w-full">
                            <SelectValue placeholder="Select Contractor" />
                        </SelectTrigger>
                        <SelectContent>
                            {mockContractors.map((c) => (
                                <SelectItem key={c.id} value={c.id.toString()}>
                                    {c.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <DialogFooter className="mt-4 flex gap-2">
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button className="bg-orange-600 hover:bg-orange-700 text-white" onClick={handleAssign}>
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
