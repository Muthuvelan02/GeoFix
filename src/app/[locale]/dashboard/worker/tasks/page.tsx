"use client"

import React, { useState, useMemo, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from "@/components/ui/dialog"
import { Loader2, AlertCircle } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import workerService, { WorkerTask } from "@/services/workerService"

export default function WorkerTasksPage() {
    const params = useParams()
    const router = useRouter()
    const locale = params.locale as string || 'en'

    const [user, setUser] = useState<any>(null)
    const [tasks, setTasks] = useState<WorkerTask[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [statusFilter, setStatusFilter] = useState<"ALL" | "ASSIGNED_TO_WORKER" | "IN_PROGRESS" | "COMPLETED">("ALL")
    const [completionDialogOpen, setCompletionDialogOpen] = useState(false)
    const [selectedTask, setSelectedTask] = useState<WorkerTask | null>(null)
    const [proofPhoto, setProofPhoto] = useState<File | null>(null)
    const [actionLoading, setActionLoading] = useState(false)

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push(`/${locale}/login/worker`)
            return
        }

        authService.getProfile()
            .then(profile => setUser(profile))
            .catch(() => {
                setUser({
                    id: userData.userId,
                    name: 'Worker User',
                    email: 'worker@example.com'
                })
            })

        loadTasks()
    }, [locale, router])

    const loadTasks = async () => {
        try {
            setLoading(true)
            setError(null)
            const fetchedTasks = await workerService.getMyTasks()
            setTasks(fetchedTasks)
        } catch (err: any) {
            console.error('Error loading tasks:', err)
            setError(err.message || 'Failed to load tasks')
        } finally {
            setLoading(false)
        }
    }

    const filteredTasks = useMemo(() => {
        return tasks.filter((t) => (statusFilter === "ALL" ? true : t.status === statusFilter))
    }, [tasks, statusFilter])

    const getStatusBadge = (status: WorkerTask["status"]) => {
        switch (status) {
            case "ASSIGNED_TO_WORKER":
                return <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400">To Do</Badge>
            case "IN_PROGRESS":
                return <Badge className="bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400">In Progress</Badge>
            case "COMPLETED":
                return <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400">Completed</Badge>
            default:
                return null
        }
    }

    const startWork = async (task: WorkerTask) => {
        try {
            setActionLoading(true)
            setError(null)
            await workerService.startTask(task.id)
            await loadTasks() // Reload tasks after starting
        } catch (err: any) {
            console.error('Error starting task:', err)
            setError(err.message || 'Failed to start task')
        } finally {
            setActionLoading(false)
        }
    }

    const openCompletionDialog = (task: WorkerTask) => {
        setSelectedTask(task)
        setProofPhoto(null)
        setCompletionDialogOpen(true)
    }

    const handleCompleteTask = async () => {
        if (!selectedTask || !proofPhoto) {
            setError('Please upload proof of work photo')
            return
        }

        try {
            setActionLoading(true)
            setError(null)
            await workerService.completeTask(selectedTask.id, proofPhoto)
            setCompletionDialogOpen(false)
            await loadTasks() // Reload tasks after completion
        } catch (err: any) {
            console.error('Error completing task:', err)
            setError(err.message || 'Failed to complete task')
        } finally {
            setActionLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push(`/${locale}`)
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="worker" locale={locale} user={{}} />
                <main className="flex-1 p-8">
                    <div className="max-w-7xl mx-auto space-y-8">
                        <h1 className="text-2xl font-bold text-gray-800 dark:text-white">My Assigned Tasks</h1>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Status Filter */}
                        <div className="flex gap-2 mb-4">
                            {["ALL", "ASSIGNED_TO_WORKER", "IN_PROGRESS", "COMPLETED"].map((status) => (
                                <Button
                                    key={status}
                                    variant={statusFilter === status ? "default" : "outline"}
                                    onClick={() => setStatusFilter(status as any)}
                                >
                                    {status === "ALL"
                                        ? "All"
                                        : status === "ASSIGNED_TO_WORKER"
                                            ? "To Do"
                                            : status === "IN_PROGRESS"
                                                ? "In Progress"
                                                : "Completed"}
                                </Button>
                            ))}
                        </div>

                        {/* Task Cards */}
                        {filteredTasks.length === 0 ? (
                            <p className="text-gray-500">No tasks found.</p>
                        ) : (
                            <div className="space-y-4">
                                {filteredTasks.map((task) => (
                                    <Card key={task.id} className="shadow-sm border-l-4 border-orange-600">
                                        <CardHeader>
                                            <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-2">
                                            <p className="text-gray-700 dark:text-gray-300">{task.description}</p>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                <strong>Location:</strong> {task.location}
                                            </p>
                                            {task.assignedContractor && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <strong>Assigned by:</strong> {task.assignedContractor.name}
                                                </p>
                                            )}
                                            {task.assignedAt && (
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    <strong>Assigned:</strong> {new Date(task.assignedAt).toLocaleDateString()}
                                                </p>
                                            )}
                                            <div className="flex gap-2">{getStatusBadge(task.status)}</div>

                                            {task.photos && task.photos.length > 0 && (
                                                <div className="flex gap-2 pt-2">
                                                    {task.photos.map((photo, idx) => (
                                                        <img
                                                            key={idx}
                                                            src={workerService.getPhotoUrl(photo)}
                                                            alt="Task Photo"
                                                            className="w-16 h-16 object-cover rounded"
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                {task.status === "ASSIGNED_TO_WORKER" && (
                                                    <Button
                                                        className="bg-blue-600 hover:bg-blue-700 text-white"
                                                        onClick={() => startWork(task)}
                                                        disabled={actionLoading}
                                                    >
                                                        {actionLoading ? (
                                                            <>
                                                                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                                                Starting...
                                                            </>
                                                        ) : (
                                                            <>▶ Start Work</>
                                                        )}
                                                    </Button>
                                                )}
                                                {task.status === "IN_PROGRESS" && (
                                                    <Button
                                                        className="bg-green-600 hover:bg-green-700 text-white"
                                                        onClick={() => openCompletionDialog(task)}
                                                        disabled={actionLoading}
                                                    >
                                                        ✓ Mark Complete
                                                    </Button>
                                                )}
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

            {/* Complete Task Dialog */}
            <Dialog open={completionDialogOpen} onOpenChange={setCompletionDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Mark Task as Complete</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                            <strong>Task:</strong> {selectedTask?.title}
                        </p>
                        <div>
                            <Label htmlFor="proof-photo">Upload Proof of Work Photo *</Label>
                            <Input
                                id="proof-photo"
                                type="file"
                                accept="image/*"
                                onChange={(e) => setProofPhoto(e.target.files?.[0] || null)}
                                className="mt-1"
                            />
                            {proofPhoto && (
                                <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                                    Selected: {proofPhoto.name}
                                </p>
                            )}
                        </div>
                    </div>
                    <DialogFooter className="mt-4">
                        <Button
                            variant="outline"
                            onClick={() => setCompletionDialogOpen(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleCompleteTask}
                            disabled={!proofPhoto || actionLoading}
                            className="bg-green-600 hover:bg-green-700"
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Completing...
                                </>
                            ) : (
                                'Complete Task'
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    )
}
