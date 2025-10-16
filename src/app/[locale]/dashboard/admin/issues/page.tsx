"use client"

import React, { useState, useMemo, useEffect } from "react"
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
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Loader2, AlertCircle } from "lucide-react"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import adminService, { TicketForAdmin, AdminUser, Contractor } from "@/services/adminService"
import { authService } from "@/services/authService"

export default function IssueAssignmentPage() {
    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<TicketForAdmin[]>([])
    const [contractors, setContractors] = useState<Contractor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [dateFilter, setDateFilter] = useState("")
    const [assignDialogOpen, setAssignDialogOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<TicketForAdmin | null>(null)
    const [selectedContractor, setSelectedContractor] = useState<number | null>(null)

    // Load tickets and contractors from backend
    useEffect(() => {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
        }
        loadData()
    }, [])

    const loadData = async () => {
        try {
            setLoading(true)
            setError(null)
            const [ticketsData, contractorsData] = await Promise.all([
                adminService.getAllTickets(),
                adminService.getActiveContractors() // Use getActiveContractors instead
            ])
            setTickets(ticketsData)
            setContractors(contractorsData) // No need to filter since getActiveContractors returns only active ones
        } catch (err: any) {
            setError(err.message || "Failed to load data")
        } finally {
            setLoading(false)
        }
    }


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

    const getStatusBadge = (status: TicketForAdmin["status"]) => {
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

    const openAssignDialog = (ticket: TicketForAdmin) => {
        setSelectedTicket(ticket)
        setSelectedContractor(null)
        setAssignDialogOpen(true)
    }

    const handleAssign = async () => {
        if (!selectedTicket || !selectedContractor) return

        try {
            setActionLoading(true)
            await adminService.assignTicketToContractor(selectedTicket.id, selectedContractor)
            setAssignDialogOpen(false)
            // Reload tickets to get updated data
            await loadData()
        } catch (err: any) {
            alert(err.message || "Failed to assign ticket")
        } finally {
            setActionLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="admin" locale="en" user={user} />

            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Issue Management</h1>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Loading State */}
                        {loading ? (
                            <div className="flex justify-center items-center py-12">
                                <Loader2 className="w-8 h-8 animate-spin text-orange-600" />
                            </div>
                        ) : (
                            <>
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
                                                            className="bg-gray-600 hover:bg-gray-700 text-white cursor-pointer"
                                                            onClick={() => alert("View details not implemented")}
                                                        >
                                                            👁 View
                                                        </Button>
                                                        <Button
                                                            className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
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
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Assign Ticket to Contractor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4 py-4">
                        {selectedTicket && (
                            <div className="text-sm">
                                <p className="font-semibold">{selectedTicket.title}</p>
                                <p className="text-gray-600">{selectedTicket.location}</p>
                            </div>
                        )}
                        <div>
                            <label className="text-sm font-medium mb-2 block">
                                Select Contractor {contractors.length > 0 && `(${contractors.length} available)`}
                            </label>
                            <Select
                                value={selectedContractor?.toString() || ""}
                                onValueChange={(val) => setSelectedContractor(Number(val))}
                            >
                                <SelectTrigger className="w-full">
                                    <SelectValue placeholder={contractors.length === 0 ? "No active contractors available" : "Select a contractor..."} />
                                </SelectTrigger>
                                <SelectContent>
                                    {contractors.length === 0 ? (
                                        <SelectItem value="none" disabled>No active contractors found</SelectItem>
                                    ) : (
                                        contractors.map((c) => (
                                            <SelectItem key={c.id} value={c.id.toString()}>
                                                <div className="flex flex-col">
                                                    <span className="font-medium">{c.name}</span>
                                                    <span className="text-xs text-gray-500">{c.email} • {c.mobile}</span>
                                                </div>
                                            </SelectItem>
                                        ))
                                    )}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <DialogFooter className="flex gap-2">
                        <Button variant="outline" onClick={() => setAssignDialogOpen(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            className="bg-orange-600 hover:bg-orange-700 text-white cursor-pointer"
                            onClick={handleAssign}
                            disabled={actionLoading || !selectedContractor || contractors.length === 0}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Assign"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
