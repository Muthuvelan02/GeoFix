"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { authService } from "@/services/authService";
import {
    FileText,
    Download,
    Calendar,
    TrendingUp,
    TrendingDown,
    Users,
    CheckCircle,
    Clock,
    AlertCircle,
    BarChart3,
    Filter,
    Loader2
} from "lucide-react";

interface ReportStats {
    totalTickets: number;
    completedTickets: number;
    pendingTickets: number;
    inProgressTickets: number;
    averageCompletionTime: number;
    totalContractors: number;
    activeContractors: number;
    totalWorkers: number;
    citizenSatisfaction: number;
    trend: {
        tickets: number;
        contractors: number;
        completionTime: number;
    };
}

interface MonthlyReport {
    id: string;
    month: string;
    year: number;
    ticketsCreated: number;
    ticketsCompleted: number;
    averageTime: number;
    contractorsActive: number;
    workersActive: number;
    generatedDate: string;
}

export default function AdminReportsPage({
    params,
}: {
    params: { locale: string };
}) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [selectedPeriod, setSelectedPeriod] = useState<string>("monthly");
    const [selectedYear, setSelectedYear] = useState<string>("2025");
    const [generatingReport, setGeneratingReport] = useState(false);

    // Mock data - will be replaced with API call
    const mockStats: ReportStats = {
        totalTickets: 456,
        completedTickets: 342,
        pendingTickets: 78,
        inProgressTickets: 36,
        averageCompletionTime: 4.5, // days
        totalContractors: 45,
        activeContractors: 38,
        totalWorkers: 89,
        citizenSatisfaction: 4.6,
        trend: {
            tickets: 12.5, // percentage increase
            contractors: 8.3,
            completionTime: -15.2, // negative is good (faster)
        }
    };

    const mockMonthlyReports: MonthlyReport[] = [
        {
            id: "1",
            month: "September",
            year: 2025,
            ticketsCreated: 45,
            ticketsCompleted: 38,
            averageTime: 4.2,
            contractorsActive: 35,
            workersActive: 78,
            generatedDate: "2025-10-01",
        },
        {
            id: "2",
            month: "August",
            year: 2025,
            ticketsCreated: 52,
            ticketsCompleted: 48,
            averageTime: 5.1,
            contractorsActive: 34,
            workersActive: 76,
            generatedDate: "2025-09-01",
        },
        {
            id: "3",
            month: "July",
            year: 2025,
            ticketsCreated: 48,
            ticketsCompleted: 44,
            averageTime: 4.8,
            contractorsActive: 32,
            workersActive: 72,
            generatedDate: "2025-08-01",
        },
    ];

    const [stats] = useState<ReportStats>(mockStats);
    const [reports] = useState<MonthlyReport[]>(mockMonthlyReports);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        setLoading(false);
    }, []);

    const handleGenerateReport = async (period: string) => {
        setGeneratingReport(true);
        // BACKEND INTEGRATION POINT
        // Simulate report generation
        setTimeout(() => {
            setGeneratingReport(false);
            // Trigger download
            alert(`${period} report generated successfully!`);
        }, 2000);
    };

    const handleDownloadReport = (reportId: string) => {
        // BACKEND INTEGRATION POINT
        // await adminService.downloadReport(reportId)
        alert(`Downloading report ${reportId}...`);
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
            <CollapsibleSidebar userRole="admin" locale={params.locale} />
            <div className="flex-1 overflow-auto">
                <div className="p-8">
                    {/* Header */}
                    <div className="mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                            Reports & Analytics
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            View comprehensive reports and performance metrics
                        </p>
                    </div>

                    {/* Stats Overview */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Total Tickets</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.totalTickets}
                                        </p>
                                    </div>
                                    <FileText className="h-8 w-8 text-blue-500" />
                                </div>
                                <div className="flex items-center mt-4">
                                    {stats.trend.tickets > 0 ? (
                                        <>
                                            <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                            <span className="text-sm text-green-500">+{stats.trend.tickets}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingDown className="h-4 w-4 text-red-500 mr-1" />
                                            <span className="text-sm text-red-500">{stats.trend.tickets}%</span>
                                        </>
                                    )}
                                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Completed</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.completedTickets}
                                        </p>
                                    </div>
                                    <CheckCircle className="h-8 w-8 text-green-500" />
                                </div>
                                <div className="mt-4">
                                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                                        <div
                                            className="bg-green-500 h-2 rounded-full"
                                            style={{ width: `${(stats.completedTickets / stats.totalTickets) * 100}%` }}
                                        />
                                    </div>
                                    <p className="text-sm text-gray-500 mt-1">
                                        {((stats.completedTickets / stats.totalTickets) * 100).toFixed(1)}% completion rate
                                    </p>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Avg. Completion</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.averageCompletionTime} days
                                        </p>
                                    </div>
                                    <Clock className="h-8 w-8 text-orange-500" />
                                </div>
                                <div className="flex items-center mt-4">
                                    {stats.trend.completionTime < 0 ? (
                                        <>
                                            <TrendingDown className="h-4 w-4 text-green-500 mr-1" />
                                            <span className="text-sm text-green-500">{stats.trend.completionTime}%</span>
                                        </>
                                    ) : (
                                        <>
                                            <TrendingUp className="h-4 w-4 text-red-500 mr-1" />
                                            <span className="text-sm text-red-500">+{stats.trend.completionTime}%</span>
                                        </>
                                    )}
                                    <span className="text-sm text-gray-500 ml-1">faster completion</span>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-gray-600 dark:text-gray-400">Active Contractors</p>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                                            {stats.activeContractors}
                                        </p>
                                    </div>
                                    <Users className="h-8 w-8 text-purple-500" />
                                </div>
                                <div className="flex items-center mt-4">
                                    <TrendingUp className="h-4 w-4 text-green-500 mr-1" />
                                    <span className="text-sm text-green-500">+{stats.trend.contractors}%</span>
                                    <span className="text-sm text-gray-500 ml-1">vs last month</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Generate New Report */}
                    <Card className="mb-8">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <BarChart3 className="h-5 w-5" />
                                Generate New Report
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="flex flex-col md:flex-row gap-4 items-end">
                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Report Period
                                    </label>
                                    <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="daily">Daily Report</SelectItem>
                                            <SelectItem value="weekly">Weekly Report</SelectItem>
                                            <SelectItem value="monthly">Monthly Report</SelectItem>
                                            <SelectItem value="quarterly">Quarterly Report</SelectItem>
                                            <SelectItem value="yearly">Yearly Report</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <div className="flex-1">
                                    <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
                                        Year
                                    </label>
                                    <Select value={selectedYear} onValueChange={setSelectedYear}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="2025">2025</SelectItem>
                                            <SelectItem value="2024">2024</SelectItem>
                                            <SelectItem value="2023">2023</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>

                                <Button
                                    onClick={() => handleGenerateReport(selectedPeriod)}
                                    disabled={generatingReport}
                                    className="bg-primary hover:bg-primary/90"
                                >
                                    {generatingReport ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Generating...
                                        </>
                                    ) : (
                                        <>
                                            <FileText className="mr-2 h-4 w-4" />
                                            Generate Report
                                        </>
                                    )}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Recent Reports */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Calendar className="h-5 w-5" />
                                Recent Reports
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {reports.map((report) => (
                                    <div
                                        key={report.id}
                                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <div className="flex-1">
                                            <h3 className="font-semibold text-gray-900 dark:text-white">
                                                {report.month} {report.year} Report
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                                                Generated on {new Date(report.generatedDate).toLocaleDateString()}
                                            </p>
                                            <div className="flex gap-4 mt-3">
                                                <div className="text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Tickets: </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {report.ticketsCreated} created, {report.ticketsCompleted} completed
                                                    </span>
                                                </div>
                                                <div className="text-sm">
                                                    <span className="text-gray-600 dark:text-gray-400">Avg Time: </span>
                                                    <span className="font-medium text-gray-900 dark:text-white">
                                                        {report.averageTime} days
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Badge variant="outline" className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400">
                                                {report.contractorsActive} Contractors
                                            </Badge>
                                            <Badge variant="outline" className="bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400">
                                                {report.workersActive} Workers
                                            </Badge>
                                            <Button
                                                size="sm"
                                                variant="outline"
                                                onClick={() => handleDownloadReport(report.id)}
                                            >
                                                <Download className="h-4 w-4 mr-2" />
                                                Download
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
