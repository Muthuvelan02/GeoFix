"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import workerService, { CompletedTask } from "@/services/workerService";
import {
    CheckCircle,
    Search,
    Calendar,
    MapPin,
    Clock,
    Star,
    Image as ImageIcon,
    TrendingUp,
    Award,
    Target,
    Loader2,
    AlertCircle,
    Eye,
} from "lucide-react";

export default function WorkerCompletedPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);
    const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>([]);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        loadCompletedTasks();
    }, []);

    const loadCompletedTasks = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await workerService.getCompletedTasks();
            setCompletedTasks(data);
        } catch (err: any) {
            setError(err.message || "Failed to load completed tasks");
        } finally {
            setLoading(false);
        }
    };

    const filteredTasks = completedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
    const totalCompleted = completedTasks.length;
    const averageRating = completedTasks.filter(t => t.rating).length > 0
        ? completedTasks.reduce((acc, task) => acc + (task.rating || 0), 0) /
        completedTasks.filter((t) => t.rating).length
        : 0;
    const totalHoursWorked = completedTasks.reduce(
        (acc, task) => acc + (task.timeTaken || 0),
        0
    );
    const averageTimePerTask = totalCompleted > 0 ? totalHoursWorked / totalCompleted : 0;

    const viewTaskDetails = (task: CompletedTask) => {
        setSelectedTask(task);
        setShowDetailsDialog(true);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="worker" locale="en" user={user} />

            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    <div className="space-y-6">
                        {/* Header */}
                        <div>
                            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">
                                Completed Work
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Review your completed tasks and performance
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert variant="destructive">
                                <AlertCircle className="h-4 w-4" />
                                <AlertDescription>{error}</AlertDescription>
                            </Alert>
                        )}

                        {/* Statistics Cards */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                            <Card className="border-l-4 border-l-green-600">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Completed
                                        </p>
                                        <CheckCircle className="h-5 w-5 text-green-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {totalCompleted}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-yellow-600">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Average Rating
                                        </p>
                                        <Star className="h-5 w-5 text-yellow-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {averageRating > 0 ? averageRating.toFixed(1) : 'N/A'}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-blue-600">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Hours
                                        </p>
                                        <Clock className="h-5 w-5 text-blue-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {totalHoursWorked}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="border-l-4 border-l-purple-600">
                                <CardContent className="p-6">
                                    <div className="flex items-center justify-between mb-2">
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Avg. Time/Task
                                        </p>
                                        <Target className="h-5 w-5 text-purple-600" />
                                    </div>
                                    <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                        {averageTimePerTask.toFixed(1)}h
                                    </p>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Search */}
                        <div className="flex items-center gap-2">
                            <Search className="h-5 w-5 text-gray-400" />
                            <Input
                                type="text"
                                placeholder="Search completed tasks..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="max-w-md"
                            />
                        </div>

                        {/* Task List */}
                        {filteredTasks.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <p className="text-gray-500">
                                        {searchQuery
                                            ? "No matching completed tasks found"
                                            : "No completed tasks yet"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {filteredTasks.map((task) => (
                                    <Card key={task.id} className="hover:shadow-lg transition-shadow">
                                        <CardHeader>
                                            <CardTitle className="text-lg">{task.title}</CardTitle>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                                                {task.description}
                                            </p>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <MapPin className="h-4 w-4" />
                                                <span className="line-clamp-1">{task.location}</span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-4 w-4" />
                                                <span>
                                                    Completed: {task.completedAt
                                                        ? workerService.formatDate(task.completedAt)
                                                        : 'N/A'}
                                                </span>
                                            </div>

                                            <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                                                <Clock className="h-4 w-4" />
                                                <span>Time Taken: {task.timeTaken || 0} hours</span>
                                            </div>

                                            {task.rating && (
                                                <div className="flex items-center gap-1">
                                                    {[...Array(5)].map((_, i) => (
                                                        <Star
                                                            key={i}
                                                            className={`h-4 w-4 ${i < task.rating!
                                                                    ? "fill-yellow-400 text-yellow-400"
                                                                    : "text-gray-300"
                                                                }`}
                                                        />
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex gap-2 pt-2">
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => viewTaskDetails(task)}
                                                    className="cursor-pointer flex-1"
                                                >
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Task Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
                    {selectedTask && (
                        <>
                            <DialogHeader>
                                <DialogTitle>{selectedTask.title}</DialogTitle>
                                <DialogDescription>{selectedTask.location}</DialogDescription>
                            </DialogHeader>

                            <div className="space-y-4">
                                <div>
                                    <h4 className="font-semibold mb-2">Description</h4>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">
                                        {selectedTask.description}
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <h4 className="font-semibold mb-1 text-sm">Completed Date</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedTask.completedAt
                                                ? workerService.formatDateTime(selectedTask.completedAt)
                                                : 'N/A'}
                                        </p>
                                    </div>
                                    <div>
                                        <h4 className="font-semibold mb-1 text-sm">Time Taken</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedTask.timeTaken || 0} hours
                                        </p>
                                    </div>
                                </div>

                                {selectedTask.citizen && (
                                    <div>
                                        <h4 className="font-semibold mb-1 text-sm">Reported By</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedTask.citizen.name} ({selectedTask.citizen.email})
                                        </p>
                                    </div>
                                )}

                                {selectedTask.assignedContractor && (
                                    <div>
                                        <h4 className="font-semibold mb-1 text-sm">Contractor</h4>
                                        <p className="text-sm text-gray-600">
                                            {selectedTask.assignedContractor.name}
                                        </p>
                                    </div>
                                )}

                                {selectedTask.rating && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Rating</h4>
                                        <div className="flex items-center gap-1">
                                            {[...Array(5)].map((_, i) => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i < selectedTask.rating!
                                                            ? "fill-yellow-400 text-yellow-400"
                                                            : "text-gray-300"
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}

                                {selectedTask.feedback && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Feedback</h4>
                                        <p className="text-sm text-gray-600 dark:text-gray-400 italic">
                                            "{selectedTask.feedback}"
                                        </p>
                                    </div>
                                )}

                                {selectedTask.proofOfWorkPhoto && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Proof of Work</h4>
                                        <img
                                            src={workerService.getPhotoUrl(selectedTask.proofOfWorkPhoto)}
                                            alt="Proof of Work"
                                            className="w-full rounded-lg cursor-pointer hover:opacity-90"
                                            onClick={() => window.open(workerService.getPhotoUrl(selectedTask.proofOfWorkPhoto!), '_blank')}
                                        />
                                    </div>
                                )}

                                {selectedTask.photos && selectedTask.photos.length > 0 && (
                                    <div>
                                        <h4 className="font-semibold mb-2">Task Photos</h4>
                                        <div className="grid grid-cols-3 gap-2">
                                            {selectedTask.photos.map((photo, idx) => (
                                                <img
                                                    key={idx}
                                                    src={workerService.getPhotoUrl(photo)}
                                                    alt={`Task Photo ${idx + 1}`}
                                                    className="w-full h-24 object-cover rounded cursor-pointer hover:opacity-90"
                                                    onClick={() => window.open(workerService.getPhotoUrl(photo), '_blank')}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
