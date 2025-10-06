"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from "@/i18n/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, Clock, AlertTriangle, HardHat, Loader2, AlertCircle } from "lucide-react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { authService } from "@/services/authService";
import workerService from "@/services/workerService";

export default function WorkerDashboard() {
    const router = useRouter();
    const [user, setUser] = useState<{ userId: number; roles: string[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalTasks: 0,
        pendingTasks: 0,
        inProgressTasks: 0,
        completedTasks: 0,
        averageRating: 0,
        totalHours: 0
    });

    useEffect(() => {
        const userData = authService.getCurrentUser();
        if (!userData) {
            router.push("/login/worker");
            return;
        }

        const userRole = userData.roles[0];
        if (userRole !== 'ROLE_WORKER') {
            if (userRole === 'ROLE_CITIZEN') {
                router.push("/dashboard/citizen");
            } else if (userRole === 'ROLE_CONTRACTOR') {
                router.push("/dashboard/contractor");
            } else if (userRole === 'ROLE_ADMIN') {
                router.push("/dashboard/admin");
            } else {
                authService.logout();
                router.push("/login/worker");
            }
            return;
        }

        setUser(userData);
        loadDashboardData();
    }, [router]);

    const loadDashboardData = async () => {
        try {
            setLoading(true);
            setError(null);
            const performanceStats = await workerService.getPerformanceStats();
            setStats({
                totalTasks: performanceStats.totalAssigned,
                pendingTasks: performanceStats.totalAssigned - performanceStats.totalInProgress - performanceStats.totalCompleted,
                inProgressTasks: performanceStats.totalInProgress,
                completedTasks: performanceStats.totalCompleted,
                averageRating: performanceStats.averageRating,
                totalHours: performanceStats.totalHoursWorked
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="worker" locale="en" user={user} />

            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Worker Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Welcome back! Here's your work overview.
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Stats Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="border-l-4 border-l-blue-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Total Tasks
                                        </p>
                                        <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {stats.totalTasks}
                                        </p>
                                    </div>
                                    <HardHat className="h-10 w-10 text-blue-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Pending
                                        </p>
                                        <p className="text-3xl font-bold text-yellow-600">
                                            {stats.pendingTasks}
                                        </p>
                                    </div>
                                    <Clock className="h-10 w-10 text-yellow-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            In Progress
                                        </p>
                                        <p className="text-3xl font-bold text-orange-600">
                                            {stats.inProgressTasks}
                                        </p>
                                    </div>
                                    <AlertTriangle className="h-10 w-10 text-orange-600" />
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                                            Completed
                                        </p>
                                        <p className="text-3xl font-bold text-green-600">
                                            {stats.completedTasks}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-10 w-10 text-green-600" />
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Overview */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <Card>
                            <CardHeader>
                                <CardTitle>Performance Summary</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Average Rating
                                        </span>
                                        <Badge className="bg-yellow-100 text-yellow-800 border-yellow-300">
                                            {stats.averageRating.toFixed(1)}/5.0
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Total Hours Worked
                                        </span>
                                        <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                                            {stats.totalHours}h
                                        </Badge>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                            Completion Rate
                                        </span>
                                        <Badge className="bg-green-100 text-green-800 border-green-300">
                                            {stats.totalTasks > 0 ? Math.round((stats.completedTasks / stats.totalTasks) * 100) : 0}%
                                        </Badge>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle>Quick Actions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <button
                                        onClick={() => router.push('/dashboard/worker/tasks')}
                                        className="w-full p-4 text-left bg-blue-50 dark:bg-blue-900/20 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors"
                                    >
                                        <div className="font-medium text-blue-900 dark:text-blue-100">
                                            View My Tasks
                                        </div>
                                        <div className="text-sm text-blue-600 dark:text-blue-400">
                                            Check assigned work and start new tasks
                                        </div>
                                    </button>

                                    <button
                                        onClick={() => router.push('/dashboard/worker/completed')}
                                        className="w-full p-4 text-left bg-green-50 dark:bg-green-900/20 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors"
                                    >
                                        <div className="font-medium text-green-900 dark:text-green-100">
                                            View Work History
                                        </div>
                                        <div className="text-sm text-green-600 dark:text-green-400">
                                            Review completed tasks and ratings
                                        </div>
                                    </button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
