"use client"

import React, { useState, useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import {
    Users,
    Plus,
    Edit,
    Trash2,
    Mail,
    Phone,
    MapPin,
    UserCheck,
    Search,
    X
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
import { contractorService, Worker, WorkerCreateRequest } from "@/services/contractorService"

export default function WorkersPage() {
    const router = useRouter()
    const params = useParams()
    const locale = params.locale as string || 'en'

    const [user, setUser] = useState<any>(null)
    const [workers, setWorkers] = useState<Worker[]>([])
    const [filteredWorkers, setFilteredWorkers] = useState<Worker[]>([])
    const [loading, setLoading] = useState(true)
    const [searchQuery, setSearchQuery] = useState("")
    const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const [selectedWorker, setSelectedWorker] = useState<Worker | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [error, setError] = useState<string | null>(null)

    const [formData, setFormData] = useState<WorkerCreateRequest>({
        name: "",
        email: "",
        password: "",
        mobile: "",
        address: ""
    })

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData || userData.roles[0] !== 'ROLE_CONTRACTOR') {
            router.push("/login/contractor")
            return
        }
        setUser(userData)
        loadWorkers()
    }, [router])

    useEffect(() => {
        if (searchQuery.trim() === "") {
            setFilteredWorkers(workers)
        } else {
            const query = searchQuery.toLowerCase()
            setFilteredWorkers(
                workers.filter(
                    (worker) =>
                        worker.name.toLowerCase().includes(query) ||
                        worker.email.toLowerCase().includes(query) ||
                        worker.mobile.includes(query)
                )
            )
        }
    }, [searchQuery, workers])

    const loadWorkers = async () => {
        try {
            setLoading(true)
            const data = await contractorService.getWorkers()
            setWorkers(data)
            setFilteredWorkers(data)
        } catch (error: any) {
            setError(error.message)
        } finally {
            setLoading(false)
        }
    }

    const handleAddWorker = async (e: React.FormEvent) => {
        e.preventDefault()
        setSubmitting(true)
        setError(null)

        try {
            await contractorService.createWorker(formData)
            setIsAddDialogOpen(false)
            setFormData({
                name: "",
                email: "",
                password: "",
                mobile: "",
                address: ""
            })
            await loadWorkers()
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false)
        }
    }

    const handleDeleteWorker = async () => {
        if (!selectedWorker) return

        setSubmitting(true)
        setError(null)

        try {
            await contractorService.deleteWorker(selectedWorker.id)
            setIsDeleteDialogOpen(false)
            setSelectedWorker(null)
            await loadWorkers()
        } catch (error: any) {
            setError(error.message)
        } finally {
            setSubmitting(false)
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
                <CollapsibleSidebar userRole="contractor" locale={locale} user={user} />

                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        {/* Header */}
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                    Worker Management
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                    Manage your team of workers
                                </p>
                            </div>
                            <Button
                                onClick={() => setIsAddDialogOpen(true)}
                                className="bg-orange-600 hover:bg-orange-700 text-white"
                            >
                                <Plus className="h-4 w-4 mr-2" />
                                Add Worker
                            </Button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Total Workers</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                                {workers.length}
                                            </p>
                                        </div>
                                        <Users className="h-8 w-8 text-blue-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Active Workers</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                                {workers.filter(w => w.status === 'ACTIVE').length}
                                            </p>
                                        </div>
                                        <UserCheck className="h-8 w-8 text-green-600" />
                                    </div>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">Available</p>
                                            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                                {workers.filter(w => w.status === 'ACTIVE').length}
                                            </p>
                                        </div>
                                        <UserCheck className="h-8 w-8 text-purple-600" />
                                    </div>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search workers by name, email, or phone..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </div>

                        {/* Workers List */}
                        <Card>
                            <CardHeader>
                                <CardTitle>All Workers ({filteredWorkers.length})</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {filteredWorkers.length === 0 ? (
                                    <div className="text-center py-12">
                                        <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                        <p className="text-gray-600 dark:text-gray-400">
                                            {searchQuery ? "No workers found" : "No workers added yet"}
                                        </p>
                                        {!searchQuery && (
                                            <Button
                                                onClick={() => setIsAddDialogOpen(true)}
                                                className="mt-4"
                                                variant="outline"
                                            >
                                                Add Your First Worker
                                            </Button>
                                        )}
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {filteredWorkers.map((worker) => (
                                            <Card key={worker.id} className="overflow-hidden">
                                                <CardContent className="p-6">
                                                    <div className="flex items-start justify-between mb-4">
                                                        <div className="w-12 h-12 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center">
                                                            <UserCheck className="h-6 w-6 text-orange-600" />
                                                        </div>
                                                        <Badge
                                                            variant={worker.status === 'ACTIVE' ? 'default' : 'secondary'}
                                                            className={worker.status === 'ACTIVE' ? 'bg-green-100 text-green-800' : ''}
                                                        >
                                                            {worker.status}
                                                        </Badge>
                                                    </div>

                                                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                                                        {worker.name}
                                                    </h3>

                                                    <div className="space-y-2 mb-4">
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <Mail className="h-4 w-4" />
                                                            <span className="truncate">{worker.email}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <Phone className="h-4 w-4" />
                                                            <span>{worker.mobile}</span>
                                                        </div>
                                                        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                            <MapPin className="h-4 w-4" />
                                                            <span className="truncate">{worker.address}</span>
                                                        </div>
                                                    </div>

                                                    <div className="flex gap-2">
                                                        <Button
                                                            variant="outline"
                                                            size="sm"
                                                            className="flex-1"
                                                            onClick={() => {
                                                                setSelectedWorker(worker)
                                                                setIsDeleteDialogOpen(true)
                                                            }}
                                                        >
                                                            <Trash2 className="h-4 w-4 mr-1" />
                                                            Remove
                                                        </Button>
                                                    </div>
                                                </CardContent>
                                            </Card>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </div>

                    <DashboardFooter />
                </main>
            </div>

            {/* Add Worker Dialog */}
            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogContent className="sm:max-w-[500px]">
                    <DialogHeader>
                        <DialogTitle>Add New Worker</DialogTitle>
                        <DialogDescription>
                            Add a new worker to your team. They will be able to work on assigned tickets.
                        </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleAddWorker}>
                        <div className="space-y-4 py-4">
                            {error && (
                                <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name *</Label>
                                <Input
                                    id="name"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Email *</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password *</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="mobile">Mobile Number *</Label>
                                <Input
                                    id="mobile"
                                    type="tel"
                                    value={formData.mobile}
                                    onChange={(e) => setFormData({ ...formData, mobile: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="address">Address *</Label>
                                <Input
                                    id="address"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    required
                                />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button
                                type="button"
                                variant="outline"
                                onClick={() => setIsAddDialogOpen(false)}
                                disabled={submitting}
                            >
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                disabled={submitting}
                                className="bg-orange-600 hover:bg-orange-700"
                            >
                                {submitting ? "Adding..." : "Add Worker"}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Remove Worker</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to remove {selectedWorker?.name}? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    {error && (
                        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-400 px-4 py-3 rounded">
                            {error}
                        </div>
                    )}
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                            disabled={submitting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDeleteWorker}
                            disabled={submitting}
                        >
                            {submitting ? "Removing..." : "Remove"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
