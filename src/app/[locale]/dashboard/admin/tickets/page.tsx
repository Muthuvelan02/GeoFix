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
import adminService, { TicketForAdmin, Contractor } from "@/services/adminService"
import { authService } from "@/services/authService"

export default function TicketManagementPage() {
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
                adminService.getAllContractors()
            ])

            setTickets(ticketsData)
            setContractors(contractorsData.filter((c: any) => c.status === 'ACTIVE'))
        } catch (err: any) {
            console.error('Error loading data:', err)
            setError(err.message || 'Failed to load data')
        } finally {
            setLoading(false)
        }
    }

    const handleAssignToContractor = async () => {
        if (!selectedTicket || !selectedContractor) return

        try {
            setActionLoading(true)
            await adminService.assignTicketToContractor(selectedTicket.id, selectedContractor)

            // Refresh data
            await loadData()

            // Close dialog
            setAssignDialogOpen(false)
            setSelectedTicket(null)
            setSelectedContractor(null)
        } catch (err: any) {
            console.error('Error assigning ticket:', err)
            setError(err.message || 'Failed to assign ticket')
        } finally {
            setActionLoading(false)
        }
    }

    const openAssignDialog = (ticket: TicketForAdmin) => {
        setSelectedTicket(ticket)
        setAssignDialogOpen(true)
    }

    // Filter tickets based on search, status, and date
    const filteredTickets = useMemo(() => {
        return tickets.filter(ticket => {
            const matchesSearch = !search ||
                ticket.title.toLowerCase().includes(search.toLowerCase()) ||
                ticket.description.toLowerCase().includes(search.toLowerCase()) ||
                ticket.location.toLowerCase().includes(search.toLowerCase()) ||
                ticket.citizen.name.toLowerCase().includes(search.toLowerCase())

            const matchesStatus = statusFilter === "ALL" || ticket.status === statusFilter

            const matchesDate = !dateFilter ||
                new Date(ticket.createdAt).toDateString() === new Date(dateFilter).toDateString()

            return matchesSearch && matchesStatus && matchesDate
        })
    }, [tickets, search, statusFilter, dateFilter])

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

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <div className="flex">
                    <CollapsibleSidebar userRole="admin" locale="en" />
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
            <div className="flex">
                <CollapsibleSidebar userRole="admin" locale="en" />
                <main className="flex-1 lg:ml-64 pt-16">
                    <div className="container mx-auto px-4 py-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Ticket Management</h1>
                        <p className="text-gray-600 dark:text-gray-300 mb-6">
                            Manage and assign tickets to contractors
                        </p>

                        {error && (
                            <Alert className="mb-6">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Filters */}
                        <Card className="mb-6">
                            <CardContent className="p-4">
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
                                    <Input
                                        type="date"
                                        value={dateFilter}
                                        onChange={(e) => setDateFilter(e.target.value)}
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={() => {
                                            setSearch("")
                                            setStatusFilter("ALL")
                                            setDateFilter("")
                                        }}
                                    >
                                        Clear Filters
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Stats Cards */}
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
                                    <CardContent className="p-8 text-center">
                                        <p className="text-gray-500 dark:text-gray-400">
                                            No tickets found matching your criteria.
                                        </p>
                                    </CardContent>
                                </Card>
                            ) : (
                                filteredTickets.map((ticket) => (
                                    <Card key={ticket.id}>
                                        <CardHeader>
                                            <div className="flex justify-between items-start">
                                                <div>
                                                    <CardTitle className="text-lg">{ticket.title}</CardTitle>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                        Reported by: {ticket.citizen.name} ({ticket.citizen.email})
                                                    </p>
                                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                                        Location: {ticket.location}
                                                    </p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    {getStatusBadge(ticket.status)}
                                                    {ticket.status === 'PENDING' && (
                                                        <Button
                                                            size="sm"
                                                            onClick={() => openAssignDialog(ticket)}
                                                            disabled={actionLoading}
                                                        >
                                                            Assign
                                                        </Button>
                                                    )}
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
                                                                className="w-20 h-20 object-cover rounded border"
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

                                            <div className="text-sm text-gray-500 dark:text-gray-400">
                                                Created: {new Date(ticket.createdAt).toLocaleDateString()}
                                                {ticket.completedAt && (
                                                    <span className="ml-4">
                                                        Completed: {new Date(ticket.completedAt).toLocaleDateString()}
                                                    </span>
                                                )}
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))
                            )}
                        </div>
                    </div>
                </main>
            </div>

            {/* Assign Dialog */}
            <Dialog open={assignDialogOpen} onOpenChange={setAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Ticket to Contractor</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        {selectedTicket && (
                            <div>
                                <p><strong>Ticket:</strong> {selectedTicket.title}</p>
                                <p><strong>Location:</strong> {selectedTicket.location}</p>
                            </div>
                        )}
                        <Select
                            value={selectedContractor?.toString() || ""}
                            onValueChange={(value) => setSelectedContractor(parseInt(value))}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a contractor" />
                            </SelectTrigger>
                            <SelectContent>
                                {contractors.map((contractor) => (
                                    <SelectItem key={contractor.id} value={contractor.id.toString()}>
                                        {contractor.name} - {contractor.email}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setAssignDialogOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignToContractor}
                            disabled={!selectedContractor || actionLoading}
                        >
                            {actionLoading && <Loader2 className="h-4 w-4 animate-spin mr-2" />}
                            Assign
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}