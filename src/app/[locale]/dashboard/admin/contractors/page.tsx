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
interface Contractor {
    id: number
    name: string
    email: string
    mobile: string
    address: string
    status: "PENDING" | "ACTIVE" | "REJECTED"
    createdAt: string
}

const mockContractors: Contractor[] = [
    {
        id: 1,
        name: "ABC Construction",
        email: "abc@example.com",
        mobile: "9876543210",
        address: "123 Builder St",
        status: "PENDING",
        createdAt: "2025-10-01",
    },
    {
        id: 2,
        name: "XYZ Contractors",
        email: "xyz@example.com",
        mobile: "9876543211",
        address: "456 Work Ave",
        status: "ACTIVE",
        createdAt: "2025-09-15",
    },
    {
        id: 3,
        name: "BuildIt Corp",
        email: "buildit@example.com",
        mobile: "9876543212",
        address: "789 Construct Rd",
        status: "PENDING",
        createdAt: "2025-10-03",
    },
]

export default function ContractorManagementPage() {
    const params = useParams()
    const locale = params.locale as string || 'en'
    const [tab, setTab] = useState<"PENDING" | "ALL">("PENDING")
    const [search, setSearch] = useState("")
    const [statusFilter, setStatusFilter] = useState<string>("ALL")
    const [dialogOpen, setDialogOpen] = useState(false)
    const [selectedAction, setSelectedAction] = useState<"VERIFY" | "REJECT" | null>(null)
    const [selectedContractor, setSelectedContractor] = useState<Contractor | null>(null)

    // BACKEND INTEGRATION POINT
    // TO BE REPLACED WITH: await adminService.getPendingContractors() / getAllContractors()
    const contractors = mockContractors

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

    const handleConfirmAction = () => {
        if (!selectedContractor || !selectedAction) return
        if (selectedAction === "VERIFY") {
            // BACKEND INTEGRATION POINT
            // await adminService.verifyContractor(selectedContractor.id, 'VERIFIED')
            console.log("Verified contractor:", selectedContractor.id)
        } else {
            // BACKEND INTEGRATION POINT
            // await adminService.verifyContractor(selectedContractor.id, 'REJECTED')
            console.log("Rejected contractor:", selectedContractor.id)
        }
        setDialogOpen(false)
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="admin" locale={locale} user={{}} />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Page Title */}
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">
                            Contractor Management
                        </h1>

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
                                className={`px-4 py-2 font-medium ${tab === "PENDING"
                                    ? "border-b-2 border-orange-600 text-orange-600"
                                    : "text-gray-600"
                                    }`}
                            >
                                Pending Verification
                            </button>
                            <button
                                onClick={() => setTab("ALL")}
                                className={`px-4 py-2 font-medium ${tab === "ALL"
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
                                                        className="bg-green-600 hover:bg-green-700 text-white flex-1"
                                                        onClick={() => openDialog(contractor, "VERIFY")}
                                                    >
                                                        ✓ Verify
                                                    </Button>
                                                    <Button
                                                        className="bg-red-600 hover:bg-red-700 text-white flex-1"
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
                    </div>
                    <DashboardFooter />
                </main>
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
                        <Button variant="outline" onClick={() => setDialogOpen(false)}>
                            Cancel
                        </Button>
                        <Button
                            className={
                                selectedAction === "VERIFY"
                                    ? "bg-green-600 hover:bg-green-700 text-white"
                                    : "bg-red-600 hover:bg-red-700 text-white"
                            }
                            onClick={handleConfirmAction}
                        >
                            Confirm
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
