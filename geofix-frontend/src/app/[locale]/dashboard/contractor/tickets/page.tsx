"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import {
    Briefcase,
    MapPin,
    Clock,
    User,
    Calendar,
    Search,
    Filter,
    Users,
    CheckCircle,
    AlertTriangle,
    Eye
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { contractorService, ContractorTicket, Worker } from "@/services/contractorService"

export default function ContractorTicketsPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string || 'en'

    const [user, setUser] = useState<any>(null)
    const [tickets, setTickets] = useState<ContractorTicket[]>([])
    const [workers, setWorkers] = useState<Worker[]>([])
    const [filteredTickets, setFilteredTickets] = useState<ContractorTicket[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [filterStatus, setFilterStatus] = useState("all")
    const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
    const [selectedTicket, setSelectedTicket] = useState<ContractorTicket | null>(null)
    const [selectedWorkerId, setSelectedWorkerId] = useState<string>("")
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData || userData.roles[0] !== 'ROLE_CONTRACTOR') {
            router.push("/login/contractor")
            return
        }
        setUser(userData)
        loadData()
    }, [router])

    useEffect(() => {
        let filtered = tickets

        if (filterStatus !== "all") {
            filtered = filtered.filter(t => t.status === filterStatus)
        }

        if (searchQuery.trim() !== "") {
            const query = searchQuery.toLowerCase()
            filtered = filtered.filter(
                t =>
                    t.title.toLowerCase().includes(query) ||
                    t.location.toLowerCase().includes(query) ||
                    t.description.toLowerCase().includes(query)
            )
        }

        setFilteredTickets(filtered)
    }, [searchQuery, filterStatus, tickets])

    const loadData = async () => {
        try {
            setLoading(true)
            const [ticketsData, workersData] = await Promise.all([
                contractorService.getAssignedTickets(),
                contractorService.getWorkers()
            ])
            setTickets(ticketsData)
            setWorkers(workersData)
            setFilteredTickets(ticketsData)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAssignToWorker = async () => {
        if (!selectedTicket || !selectedWorkerId) return

        setSubmitting(true)
        setError(null)

        try {
            await contractorService.assignTicketToWorker(selectedTicket.id, parseInt(selectedWorkerId))
            setIsAssignDialogOpen(false)
            setSelectedTicket(null)
            setSelectedWorkerId("")
            await loadData()
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const getStatusStats = () => {
        return {
            total: tickets.length,
            toAssign: tickets.filter(t => t.status === 'ASSIGNED_TO_CONTRACTOR').length,
            assigned: tickets.filter(t => t.status === 'ASSIGNED_TO_WORKER').length,
            inProgress: tickets.filter(t => t.status === 'IN_PROGRESS').length,
            completed: tickets.filter(t => t.status === 'COMPLETED').length
        }
    }

    const stats = getStatusStats()

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
                                Assigned Tickets
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Manage and assign tickets to your workers
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.total}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">To Assign</p>
                                        <p className="text-2xl font-bold text-yellow-600 mt-1">
                                            {stats.toAssign}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Assigned</p>
                                        <p className="text-2xl font-bold text-purple-600 mt-1">
                                            {stats.assigned}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">In Progress</p>
                                        <p className="text-2xl font-bold text-blue-600 mt-1">
                                            {stats.inProgress}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-4">
                                    <div className="text-center">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                        <p className="text-2xl font-bold text-green-600 mt-1">
                                            {stats.completed}
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Filters */}
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search tickets by title, location, or description..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                            <Select value={filterStatus} onValueChange={setFilterStatus}>
                                <SelectTrigger className="w-full sm:w-[200px]">
                                    <SelectValue placeholder="Filter by status" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Status</SelectItem>
                                    <SelectItem value="ASSIGNED_TO_CONTRACTOR">To Assign</SelectItem>
                                    <SelectItem value="ASSIGNED_TO_WORKER">Assigned to Worker</SelectItem>
                                    <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                                    <SelectItem value="COMPLETED">Completed</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        {/* Tickets List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>All Tickets ({filteredTickets.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filteredTickets.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {searchQuery || filterStatus !== "all"
                                                ? "No tickets found matching your criteria"
                                                : "No tickets assigned yet"}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {filteredTickets.map((ticket) => (
                                            <Card key={ticket.id} className="overflow-hidden border-l-4" style={{
                                                borderLeftColor: ticket.status === 'COMPLETED' ? '#16a34a' :
                                                    ticket.status === 'IN_PROGRESS' ? '#2563eb' :
                                                        ticket.status === 'ASSIGNED_TO_WORKER' ? '#9333ea' :
                                                            '#eab308'
                                            }}>
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="flex-1">
                                                            <div className="flex items-center gap-3 mb-2">
                                                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                                    {ticket.title}
                                                                </h3>
                                                                <Badge className={contractorService.getStatusColor(ticket.status)}>
                                                                    {contractorService.getStatusLabel(ticket.status)}
                                                                </Badge>
                                                            </div>
                                                            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">
                                                                {ticket.description}
                                                            </p>
                                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                    <MapPin className="h-4 w-4" />
                                                                    <span>{ticket.location}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                    <User className="h-4 w-4" />
                                                                    <span>{ticket.citizen.name}</span>
                                                                </div>
                                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                    <Calendar className="h-4 w-4" />
                                                                    <span>{new Date(ticket.createdAt).toLocaleDateString()}</span>
                                                                </div>
                                                                {ticket.assignedWorker && (
                                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                                        <Users className="h-4 w-4" />
                                                                        <span>Assigned to: {ticket.assignedWorker.name}</span>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        </div>
                                                        <div className="flex flex-col gap-2 ml-4">
                                                            <Button
                                                                variant="outline"
                                                                size="sm"
                                                                onClick={() => router.push(`/${locale}/dashboard/contractor/tickets/${ticket.id}`)}
                                                            >
                                                                <Eye className="h-4 w-4 mr-1" />
                                                                View
                                                            </Button>
                                                            {ticket.status === 'ASSIGNED_TO_CONTRACTOR' && (
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-orange-600 hover:bg-orange-700"
                                                                    onClick={() => {
                                                                        setSelectedTicket(ticket)
                                                                        setIsAssignDialogOpen(true)
                                                                    }}
                                                                    disabled={workers.length === 0}
                                                                >
                                                                    <Users className="h-4 w-4 mr-1" />
                                                                    Assign
                                                                </Button>
                                                            )}
                                                        </div>
                                                    </div>

                                                    {ticket.photos && ticket.photos.length > 0 && (
                                                        <div className="flex gap-2 mt-4 overflow-x-auto">
                                                            {ticket.photos.map((photo, idx) => (
                                                                <img
                                                                    key={idx}
                                                                    src={`http://localhost:8080/uploads/${photo}`}
                                                                    alt={`Ticket photo ${idx + 1}`}
                                                                    className="h-20 w-20 object-cover rounded border"
                                                                />
                                                            ))}
                                                        </div>
                                                    )}
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {workers.length === 0 && tickets.some(t => t.status === 'ASSIGNED_TO_CONTRACTOR') && (
                            <Card className="border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800">
                                <CardContent className="p-4">
                                    <div className="flex items-center gap-3">
                                        <AlertTriangle className="h-5 w-5 text-yellow-600" />
                                        <div>
                                            <p className="font-medium text-yellow-900 dark:text-yellow-400">
                                                No workers available
                                            </p>
                                            <p className="text-sm text-yellow-800 dark:text-yellow-500">
                                                You need to add workers before you can assign tickets.
                                            </p>
                                        </div>
                                        <Button
                                            onClick={() => router.push(`/${locale}/dashboard/contractor/workers`)}
                                            variant="outline"
                                            size="sm"
                                            className="ml-auto"
                                        >
                                            Add Workers
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        )}
                    </div>

                    <DashboardFooter />
                </main>
            </div>

            {/* Assign to Worker Dialog */}
            <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Assign Ticket to Worker</DialogTitle>
                        <DialogDescription>
                            Select a worker to assign this ticket: {selectedTicket?.title}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-4 py-4">
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                                {error}
                            </div>
                        )}

                        <div className="space-y-2">
                            <Label>Select Worker</Label>
                            <Select value={selectedWorkerId} onValueChange={setSelectedWorkerId}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Choose a worker" />
                                </SelectTrigger>
                                <SelectContent>
                                    {workers
                                        .filter(w => w.status === 'ACTIVE')
                                        .map(worker => (
                                            <SelectItem key={worker.id} value={worker.id.toString()}>
                                                <div className="flex items-center gap-2">
                                                    <span>{worker.name}</span>
                                                    <span className="text-xs text-gray-500">({worker.email})</span>
                                                </div>
                                            </SelectItem>
                                        ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => {
                                setIsAssignDialogOpen(false)
                                setSelectedWorkerId("")
                            }}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleAssignToWorker}
                            disabled={submitting || !selectedWorkerId}
                            className="bg-orange-600 hover:bg-orange-700"
                        >
                            {submitting ? "Assigning..." : "Assign Ticket"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
