"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import adminService from "@/services/adminService";
import {
    BarChart3,
    TrendingUp,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    Loader2,
    Activity,
    PieChart,
} from "lucide-react";

export default function AdminAnalyticsPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [stats, setStats] = useState({
        totalTickets: 0,
        completedTickets: 0,
        pendingTickets: 0,
        inProgressTickets: 0,
        averageCompletionTime: 0,
        totalContractors: 0,
        activeContractors: 0,
        totalUsers: 0,
        completionRate: 0,
    });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        loadAnalytics();
    }, []);

    const loadAnalytics = async () => {
        try {
            setLoading(true);
            setError(null);
            const [reportData, allUsers] = await Promise.all([
                adminService.getReportStats(),
                adminService.getAllUsers(),
            ]);

            const total = reportData.totalTickets || 0;
            const completed = reportData.completedTickets || 0;
            const completionRate = total > 0 ? (completed / total) * 100 : 0;

            setStats({
                totalTickets: total,
                completedTickets: completed,
                pendingTickets: reportData.pendingTickets || 0,
                inProgressTickets: reportData.inProgressTickets || 0,
                averageCompletionTime: 2.5, // mock data
                totalContractors: 8, // mock data
                activeContractors: 6, // mock data
                totalUsers: allUsers.length,
                completionRate: Math.round(completionRate),
            });
        } catch (err: any) {
            setError(err.message || "Failed to load analytics");
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
                <Loader2 className="h-8 w-8 animate-spin text-orange-600" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="admin" locale="en" user={user} />

            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Analytics Dashboard
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Comprehensive insights and performance metrics
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Key Metrics */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
                        <Card className="border-l-4 border-l-blue-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Total Tickets
                                    </p>
                                    <BarChart3 className="h-5 w-5 text-blue-600" />
                                </div>
                                <p className="text-3xl font-bold text-gray-900 dark:text-white">
                                    {stats.totalTickets}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">All time</p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Completion Rate
                                    </p>
                                    <TrendingUp className="h-5 w-5 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.completionRate}%
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.completedTickets} completed
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Active Contractors
                                    </p>
                                    <Users className="h-5 w-5 text-purple-600" />
                                </div>
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats.activeContractors}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    of {stats.totalContractors} total
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-orange-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Avg. Completion Time
                                    </p>
                                    <Clock className="h-5 w-5 text-orange-600" />
                                </div>
                                <p className="text-3xl font-bold text-orange-600">
                                    {stats.averageCompletionTime}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">days</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Ticket Distribution */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <PieChart className="h-5 w-5" />
                                    Ticket Status Distribution
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <CheckCircle className="h-5 w-5 text-green-600" />
                                            <span className="font-medium">Completed</span>
                                        </div>
                                        <span className="text-2xl font-bold text-green-600">
                                            {stats.completedTickets}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Activity className="h-5 w-5 text-blue-600" />
                                            <span className="font-medium">In Progress</span>
                                        </div>
                                        <span className="text-2xl font-bold text-blue-600">
                                            {stats.inProgressTickets}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                        <div className="flex items-center gap-3">
                                            <Clock className="h-5 w-5 text-yellow-600" />
                                            <span className="font-medium">Pending</span>
                                        </div>
                                        <span className="text-2xl font-bold text-yellow-600">
                                            {stats.pendingTickets}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BarChart3 className="h-5 w-5" />
                                    System Overview
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="font-medium">Total Users</span>
                                        <span className="text-2xl font-bold">{stats.totalUsers}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="font-medium">Total Contractors</span>
                                        <span className="text-2xl font-bold">{stats.totalContractors}</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                        <span className="font-medium">Active Contractors</span>
                                        <span className="text-2xl font-bold text-green-600">
                                            {stats.activeContractors}
                                        </span>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Metrics */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <TrendingUp className="h-5 w-5" />
                                Performance Metrics
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Completion Rate
                                    </p>
                                    <p className="text-4xl font-bold text-blue-600 mb-1">
                                        {stats.completionRate}%
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.completedTickets} / {stats.totalTickets} tickets
                                    </p>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Contractor Utilization
                                    </p>
                                    <p className="text-4xl font-bold text-purple-600 mb-1">
                                        {stats.totalContractors > 0
                                            ? Math.round((stats.activeContractors / stats.totalContractors) * 100)
                                            : 0}%
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {stats.activeContractors} active contractors
                                    </p>
                                </div>
                                <div className="text-center p-6 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 rounded-lg">
                                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                                        Avg. Resolution Time
                                    </p>
                                    <p className="text-4xl font-bold text-orange-600 mb-1">
                                        {stats.averageCompletionTime}
                                    </p>
                                    <p className="text-xs text-gray-500">days per ticket</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
