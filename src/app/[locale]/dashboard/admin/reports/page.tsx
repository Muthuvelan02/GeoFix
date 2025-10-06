"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import adminService from "@/services/adminService";
import {
    FileText,
    Download,
    TrendingUp,
    CheckCircle,
    Clock,
    AlertCircle,
    BarChart3,
    Loader2,
} from "lucide-react";

interface User {
    userId: number;
    roles: string[];
    name?: string;
    email?: string;
}

export default function AdminReportsPage() {
    const [user, setUser] = useState<User | null>(null);
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
        completionRate: 0,
    });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        loadReportStats();
    }, []);

    const loadReportStats = async () => {
        try {
            setLoading(true);
            setError(null);
            const reportData = await adminService.getReportStats();
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
                completionRate: Math.round(completionRate),
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load report statistics");
        } finally {
            setLoading(false);
        }
    };

    const handleGenerateReport = async () => {
        try {
            setError(null);
            const dateRange = {
                from: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                to: new Date().toISOString().split('T')[0]
            };
            await adminService.generateReports('system', dateRange);
            alert("Report generated successfully!");
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to generate report");
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
                        <div className="flex items-center justify-between flex-wrap gap-4">
                            <div>
                                <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                    Reports & Analytics
                                </h1>
                                <p className="text-gray-600 dark:text-gray-400">
                                    View system performance and generate reports
                                </p>
                            </div>
                            <Button
                                onClick={handleGenerateReport}
                                className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                            >
                                <Download className="h-4 w-4 mr-2" />
                                Generate Report
                            </Button>
                        </div>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Overview Stats */}
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
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-green-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Completed Tickets
                                    </p>
                                    <CheckCircle className="h-5 w-5 text-green-600" />
                                </div>
                                <p className="text-3xl font-bold text-green-600">
                                    {stats.completedTickets}
                                </p>
                                <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                                    <TrendingUp className="h-3 w-3" />
                                    <span>{stats.completionRate}% completion rate</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-yellow-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        Pending Tickets
                                    </p>
                                    <Clock className="h-5 w-5 text-yellow-600" />
                                </div>
                                <p className="text-3xl font-bold text-yellow-600">
                                    {stats.pendingTickets}
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="border-l-4 border-l-purple-600">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                                        In Progress
                                    </p>
                                    <TrendingUp className="h-5 w-5 text-purple-600" />
                                </div>
                                <p className="text-3xl font-bold text-purple-600">
                                    {stats.inProgressTickets}
                                </p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Performance Insights */}
                    <Card className="mb-6">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Performance Insights
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Ticket Resolution</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.completedTickets} out of {stats.totalTickets} tickets completed
                                        </p>
                                    </div>
                                    <Badge className="bg-green-100 text-green-700 border-green-300">
                                        {stats.completionRate}%
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Pending Work</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.pendingTickets} tickets awaiting assignment
                                        </p>
                                    </div>
                                    <Badge className="bg-yellow-100 text-yellow-700 border-yellow-300">
                                        Pending
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">In Progress</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.inProgressTickets} tickets currently being worked on
                                        </p>
                                    </div>
                                    <Badge className="bg-blue-100 text-blue-700 border-blue-300">
                                        Active
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Avg. Completion Time</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.averageCompletionTime} days average to complete a ticket
                                        </p>
                                    </div>
                                    <Badge className="bg-purple-100 text-purple-700 border-purple-300">
                                        {stats.averageCompletionTime}d
                                    </Badge>
                                </div>

                                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                                    <div>
                                        <p className="font-medium text-gray-900 dark:text-white">Active Contractors</p>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            {stats.activeContractors} out of {stats.totalContractors} contractors active
                                        </p>
                                    </div>
                                    <Badge className="bg-indigo-100 text-indigo-700 border-indigo-300">
                                        {stats.activeContractors} Active
                                    </Badge>
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Report Actions */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <FileText className="h-5 w-5" />
                                Report Generation
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                <p className="text-gray-600 dark:text-gray-400">
                                    Generate comprehensive reports for system performance and analytics.
                                </p>
                                <div className="flex flex-wrap gap-3">
                                    <Button
                                        onClick={handleGenerateReport}
                                        className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                                    >
                                        <Download className="h-4 w-4 mr-2" />
                                        Generate Full Report
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => alert("Monthly report generation coming soon!")}
                                        className="cursor-pointer"
                                    >
                                        <FileText className="h-4 w-4 mr-2" />
                                        Monthly Summary
                                    </Button>
                                    <Button
                                        variant="outline"
                                        onClick={() => alert("Analytics export coming soon!")}
                                        className="cursor-pointer"
                                    >
                                        <BarChart3 className="h-4 w-4 mr-2" />
                                        Export Analytics
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
