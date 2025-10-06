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
import adminService, { Contractor } from "@/services/adminService"
import { authService } from "@/services/authService"

export default function ContractorManagementPage() {
    const [user, setUser] = useState<any>(null)
    const [contractors, setContractors] = useState<Contractor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [actionLoading, setActionLoading] = useState(false)
    const [tab, setTab] = useState<"PENDING" | "ALL">("PENDING")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedAction, setSelectedAction] = useState<"VERIFY" | "REJECT" | null>(null)
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)

    // Load contractors from backend
    useEffect(() => {
        const currentUser = authService.getCurrentUser()
        if (currentUser) {
            setUser(currentUser)
        }
        loadContractors()
    }, [])

    const loadContractors = async () => {
        try {
            setLoading(true)
            setError(null)
            const data = await adminService.getPendingContractors()
            setContractors(data)
        } catch (err: any) {
            setError(err.message || "Failed to load contractors")
        } finally {
            setLoading(false)
        }
    }

    const filteredContractors = useMemo(() => {
        return contractors.filter((c) => {
            const matchTab = tab === "PENDING" ? c.status === "PENDING" : true
            const matchSearch =
                c.name.toLowerCase().includes(search.toLowerCase()) ||
                c.email.toLowerCase().includes(search.toLowerCase())
            const matchStatus = statusFilter === "ALL" ? true : c.status === statusFilter
            return matchTab && matchSearch && matchStatus
        })
    }, [contractors, tab, search, statusFilter])

    // Stats
    const totalCount = contractors.length
    const pendingCount = contractors.filter((c) => c.status === "PENDING").length
    const activeCount = contractors.filter((c) => c.status === "ACTIVE").length

    const getStatusBadge = (status: Contractor["status"]) => {
        switch (status) {
            case "PENDING":
                return <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
            case "ACTIVE":
                return <Badge className="bg-green-100 text-green-800">Active</Badge>
            case "REJECTED":
                return <Badge className="bg-red-100 text-red-800">Rejected</Badge>
            default:
                return null
        }
    }

    const openDialog = (contractor: Contractor, action: "VERIFY" | "REJECT") => {
        setSelectedContractor(contractor)
        setSelectedAction(action)
        setDialogOpen(true)
    }

    const handleConfirmAction = async () => {
        if (!selectedContractor || !selectedAction) return

        try {
            setActionLoading(true)
            if (selectedAction === "VERIFY") {
                await adminService.verifyContractor(selectedContractor.id)
            } else {
                await adminService.rejectContractor(selectedContractor.id, 'Rejected by admin')
            }
            setDialogOpen(false)
            // Reload contractors to get updated data
            await loadContractors()
        } catch (err: any) {
            alert(err.message || "Failed to update contractor status")
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
                        {/* Page Title */}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Contractor Management
                        </h1>

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
                                {/* Stats */}
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Total Contractors</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-2xl font-semibold">{totalCount}</CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Pending</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-2xl font-semibold text-yellow-600">
                                            {pendingCount}
                                        </CardContent>
                                    </Card>
                                    <Card>
                                        <CardHeader>
                                            <CardTitle>Active</CardTitle>
                                        </CardHeader>
                                        <CardContent className="text-2xl font-semibold text-green-600">
                                            {activeCount}
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Tabs */}
                                <div className="flex border-b mb-4">
                                    <button
                                        onClick={() => setTab("PENDING")}
                                        className={`px-4 py-2 font-medium cursor-pointer ${tab === "PENDING"
                                            ? "border-b-2 border-orange-600 text-orange-600"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        Pending Verification
                                    </button>
                                    <button
                                        onClick={() => setTab("ALL")}
                                        className={`px-4 py-2 font-medium cursor-pointer ${tab === "ALL"
                                            ? "border-b-2 border-orange-600 text-orange-600"
                                            : "text-gray-600"
                                            }`}
                                    >
                                        All Contractors
                                    </button>
                                </div>

                                {/* Search + Filter */}
                                <div className="flex flex-col sm:flex-row gap-4">
                                    <Input
                                        placeholder="Search by name or email..."
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
                                            <SelectItem value="ACTIVE">Active</SelectItem>
                                            <SelectItem value="REJECTED">Rejected</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                {/* Contractor Grid */}
                                {filteredContractors.length === 0 ? (
                                    <p className="text-gray-500 mt-6">No contractors found.</p>
                                ) : (
                                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredContractors.map((contractor) => (
                                            <Card key={contractor.id} className="shadow-sm">
                                                <CardHeader>
                                                    <CardTitle className="text-lg font-semibold">
                                                        {contractor.name}
                                                    </CardTitle>
                                                </CardHeader>
                                                <CardContent className="space-y-2">
                                                    <p className="text-sm text-gray-600">{contractor.email}</p>
                                                    <p className="text-sm text-gray-600">{contractor.mobile}</p>
                                                    <p className="text-sm text-gray-600">{contractor.address}</p>
                                                    <div>{getStatusBadge(contractor.status)}</div>

                                                    {contractor.status === "PENDING" && (
                                                        <div className="flex gap-2 pt-2">
                                                            <Button
                                                                className="bg-green-600 hover:bg-green-700 text-white flex-1 cursor-pointer"
                                                                onClick={() => openDialog(contractor, "VERIFY")}
                                                            >
                                                                ✓ Verify
                                                            </Button>
                                                            <Button
                                                                className="bg-red-600 hover:bg-red-700 text-white flex-1 cursor-pointer"
                                                                onClick={() => openDialog(contractor, "REJECT")}
                                                            >
                                                                ✗ Reject
                                                            </Button>
                                                        </div>
                                                    )}
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

            {/* Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {selectedAction === "VERIFY" ? "Verify Contractor" : "Reject Contractor"}
                        </DialogTitle>
                    </DialogHeader>
                    <p className="text-gray-600">
                        Are you sure you want to{" "}
                        {selectedAction === "VERIFY" ? "verify" : "reject"}{" "}
                        <span className="font-semibold">{selectedContractor?.name}</span>?
                    </p>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDialogOpen(false)} className="cursor-pointer">
                            Cancel
                        </Button>
                        <Button
                            className={`cursor-pointer ${selectedAction === "VERIFY"
                                ? "bg-green-600 hover:bg-green-700 text-white"
                                : "bg-red-600 hover:bg-red-700 text-white"
                                }`}
                            onClick={handleConfirmAction}
                            disabled={actionLoading}
                        >
                            {actionLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Confirm"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
