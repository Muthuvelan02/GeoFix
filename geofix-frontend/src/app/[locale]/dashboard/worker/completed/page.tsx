"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
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
    Download,
    Eye,
} from "lucide-react";

interface CompletedTask {
    id: string;
    title: string;
    description: string;
    location: string;
    priority: "HIGH" | "MEDIUM" | "LOW";
    completedDate: string;
    startedDate: string;
    timeTaken: number; // in hours
    rating?: number;
    feedback?: string;
    beforePhoto?: string;
    afterPhoto?: string;
    contractorName: string;
    citizenName: string;
}

export default function WorkerCompletedPage({
    params,
}: {
    params: { locale: string };
}) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedTask, setSelectedTask] = useState<CompletedTask | null>(null);
    const [showDetailsDialog, setShowDetailsDialog] = useState(false);

    // Mock data - will be replaced with API call
    const mockCompletedTasks: CompletedTask[] = [
        {
            id: "1",
            title: "Pothole Repair on MG Road",
            description: "Large pothole causing traffic issues near the market area",
            location: "MG Road, Sector 14, Mumbai",
            priority: "HIGH",
            completedDate: "2025-10-02",
            startedDate: "2025-10-01",
            timeTaken: 6,
            rating: 5,
            feedback: "Excellent work! The road is smooth now.",
            beforePhoto: "/uploads/photo_before_1.png",
            afterPhoto: "/uploads/photo_after_1.png",
            contractorName: "Vijay Constructions",
            citizenName: "Rajesh Kumar",
        },
        {
            id: "2",
            title: "Streetlight Installation",
            description: "Install new LED streetlight at park entrance",
            location: "Central Park, Andheri West",
            priority: "MEDIUM",
            completedDate: "2025-09-30",
            startedDate: "2025-09-30",
            timeTaken: 4,
            rating: 4,
            feedback: "Good work, light is working perfectly",
            beforePhoto: "/uploads/photo_before_2.png",
            afterPhoto: "/uploads/photo_after_2.png",
            contractorName: "Mumbai Infrastructure Ltd",
            citizenName: "Priya Sharma",
        },
        {
            id: "3",
            title: "Drainage System Cleaning",
            description: "Blocked drainage causing water accumulation",
            location: "Linking Road, Bandra",
            priority: "HIGH",
            completedDate: "2025-09-28",
            startedDate: "2025-09-27",
            timeTaken: 8,
            rating: 5,
            feedback: "Very professional and thorough work",
            beforePhoto: "/uploads/photo_before_3.png",
            afterPhoto: "/uploads/photo_after_3.png",
            contractorName: "Vijay Constructions",
            citizenName: "Amit Patel",
        },
        {
            id: "4",
            title: "Sidewalk Repair",
            description: "Broken tiles on pedestrian path",
            location: "Hill Road, Bandra",
            priority: "MEDIUM",
            completedDate: "2025-09-25",
            startedDate: "2025-09-24",
            timeTaken: 5,
            rating: 4,
            beforePhoto: "/uploads/photo_before_4.png",
            afterPhoto: "/uploads/photo_after_4.png",
            contractorName: "Mumbai Infrastructure Ltd",
            citizenName: "Sneha Reddy",
        },
        {
            id: "5",
            title: "Tree Trimming",
            description: "Overgrown branches blocking road visibility",
            location: "SV Road, Goregaon",
            priority: "LOW",
            completedDate: "2025-09-22",
            startedDate: "2025-09-22",
            timeTaken: 3,
            rating: 5,
            feedback: "Quick and efficient service",
            beforePhoto: "/uploads/photo_before_5.png",
            afterPhoto: "/uploads/photo_after_5.png",
            contractorName: "Green Solutions",
            citizenName: "Vikram Singh",
        },
    ];

    const [completedTasks, setCompletedTasks] = useState<CompletedTask[]>(
        mockCompletedTasks
    );

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        // BACKEND INTEGRATION POINT
        // const fetchCompletedTasks = async () => {
        //   const data = await workerService.getCompletedTasks();
        //   setCompletedTasks(data);
        // };
        // fetchCompletedTasks();
        setLoading(false);
    }, []);

    const filteredTasks = completedTasks.filter((task) =>
        task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        task.description.toLowerCase().includes(searchQuery.toLowerCase())
    );

    // Calculate statistics
    const totalCompleted = completedTasks.length;
    const averageRating =
        completedTasks.reduce((acc, task) => acc + (task.rating || 0), 0) /
        completedTasks.filter((t) => t.rating).length;
    const totalHoursWorked = completedTasks.reduce(
        (acc, task) => acc + task.timeTaken,
        0
    );
    const averageTimePerTask = totalHoursWorked / totalCompleted;

    const getPriorityColor = (priority: string) => {
        switch (priority) {
            case "HIGH":
                return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700";
            case "MEDIUM":
                return "bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700";
            case "LOW":
                return "bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700";
            default:
                return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700";
        }
    };

    const viewTaskDetails = (task: CompletedTask) => {
        setSelectedTask(task);
        setShowDetailsDialog(true);
    };

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="worker" locale={params.locale} />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Completed Work
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            View your work history and performance
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Tasks Completed
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {totalCompleted}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-10 w-10 text-green-500" />
                                </div>
                                <div className="flex items-center mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-500">+12%</span>
                                    <span className="text-sm text-gray-500 ml-1">this month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Average Rating
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {averageRating.toFixed(1)}
                                        </p>
                                    </div>
                                    <Star className="h-10 w-10 text-yellow-500 fill-yellow-500" />
                                </div>
                                <div className="flex items-center mt-4">
                                    <div className="flex">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-4 w-4 ${star <= Math.round(averageRating)
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Total Hours
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            {totalHoursWorked}h
                                        </p>
                                    </div>
                                    <Clock className="h-10 w-10 text-blue-500" />
                                </div>
                                <p className="text-sm text-gray-500 mt-4">
                                    Avg: {averageTimePerTask.toFixed(1)}h per task
                                </p>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            Performance
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white mt-1">
                                            Excellent
                                        </p>
                                    </div>
                                    <Award className="h-10 w-10 text-purple-500" />
                                </div>
                                <Badge className="mt-4 bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400">
                                    Top Performer
                                </Badge>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Search */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input
                                    placeholder="Search completed tasks..."
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    className="pl-10"
                                />
                            </div>
                        </CardContent>
                    </Card>

                    {/* Completed Tasks List */}
                    <div className="space-y-4">
                        {filteredTasks.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No completed tasks found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        {searchQuery
                                            ? "Try a different search term"
                                            : "Completed tasks will appear here"}
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredTasks.map((task) => (
                                <Card
                                    key={task.id}
                                    className="hover:shadow-lg transition-shadow cursor-pointer"
                                    onClick={() => viewTaskDetails(task)}
                                >
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {task.title}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className={getPriorityColor(task.priority)}
                                                    >
                                                        {task.priority}
                                                    </Badge>
                                                    <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                        <CheckCircle className="h-3 w-3 mr-1" />
                                                        Completed
                                                    </Badge>
                                                </div>

                                                <p className="text-gray-600 dark:text-gray-400 mb-3">
                                                    {task.description}
                                                </p>

                                                <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
                                                    <div className="flex items-center gap-1">
                                                        <MapPin className="h-4 w-4" />
                                                        <span>{task.location}</span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            Completed: {new Date(task.completedDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <div className="flex items-center gap-1">
                                                        <Clock className="h-4 w-4" />
                                                        <span>{task.timeTaken}h work time</span>
                                                    </div>
                                                    {task.rating && (
                                                        <div className="flex items-center gap-1">
                                                            <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
                                                            <span className="font-medium">
                                                                {task.rating}/5 Rating
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>

                                                <div className="mt-3 flex items-center gap-2">
                                                    <Badge variant="outline">
                                                        Contractor: {task.contractorName}
                                                    </Badge>
                                                    <Badge variant="outline">
                                                        Citizen: {task.citizenName}
                                                    </Badge>
                                                </div>
                                            </div>

                                            <div className="flex flex-col gap-2">
                                                {task.beforePhoto && task.afterPhoto && (
                                                    <Badge className="bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                                        <ImageIcon className="h-3 w-3 mr-1" />
                                                        Photos
                                                    </Badge>
                                                )}
                                                <Button size="sm" variant="outline">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    View Details
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Task Details Dialog */}
            <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
                <DialogContent className="max-w-3xl">
                    <DialogHeader>
                        <DialogTitle>{selectedTask?.title}</DialogTitle>
                        <DialogDescription>{selectedTask?.description}</DialogDescription>
                    </DialogHeader>

                    {selectedTask && (
                        <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Task Details
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <MapPin className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                {selectedTask.location}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Calendar className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Started: {new Date(selectedTask.startedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <CheckCircle className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Completed: {new Date(selectedTask.completedDate).toLocaleDateString()}
                                            </span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock className="h-4 w-4 text-gray-500" />
                                            <span className="text-gray-600 dark:text-gray-400">
                                                Time Taken: {selectedTask.timeTaken} hours
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        People Involved
                                    </h4>
                                    <div className="space-y-2 text-sm">
                                        <div>
                                            <span className="text-gray-500">Contractor:</span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {selectedTask.contractorName}
                                            </p>
                                        </div>
                                        <div>
                                            <span className="text-gray-500">Citizen:</span>
                                            <p className="font-medium text-gray-900 dark:text-white">
                                                {selectedTask.citizenName}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {selectedTask.rating && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                                        Rating & Feedback
                                    </h4>
                                    <div className="flex items-center gap-2 mb-2">
                                        {[1, 2, 3, 4, 5].map((star) => (
                                            <Star
                                                key={star}
                                                className={`h-5 w-5 ${star <= (selectedTask.rating || 0)
                                                        ? "text-yellow-500 fill-yellow-500"
                                                        : "text-gray-300 dark:text-gray-600"
                                                    }`}
                                            />
                                        ))}
                                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                                            {selectedTask.rating}/5
                                        </span>
                                    </div>
                                    {selectedTask.feedback && (
                                        <p className="text-gray-600 dark:text-gray-400 italic">
                                            "{selectedTask.feedback}"
                                        </p>
                                    )}
                                </div>
                            )}

                            {selectedTask.beforePhoto && selectedTask.afterPhoto && (
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
                                        Before & After Photos
                                    </h4>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">Before</p>
                                            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                        <div>
                                            <p className="text-sm text-gray-500 mb-2">After</p>
                                            <div className="relative aspect-video bg-gray-200 dark:bg-gray-700 rounded-lg overflow-hidden">
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <ImageIcon className="h-12 w-12 text-gray-400" />
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
}
