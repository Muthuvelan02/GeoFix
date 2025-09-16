'use client';
import React, { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import {
    Users,
    MapPin,
    AlertTriangle,
    TrendingUp,
    Settings,
    FileText,
    Eye,
    Edit,
    Trash2,
    Plus,
    Search,
    Filter,
    Download,
    RefreshCw
} from 'lucide-react';

interface User {
    id: string;
    name: string;
    email: string;
    role: 'admin' | 'user';
    status: 'active' | 'inactive';
    joinDate: string;
    lastActive: string;
}

interface Report {
    id: string;
    title: string;
    location: string;
    reporterName: string;
    status: 'pending' | 'in-progress' | 'resolved' | 'rejected';
    priority: 'low' | 'medium' | 'high';
    category: string;
    createdAt: string;
    assignedTo?: string;
}

interface Stats {
    totalUsers: number;
    totalReports: number;
    pendingReports: number;
    resolvedReports: number;
    activeUsers: number;
}

export default function AdminDashboard() {
    const t = useTranslations('admin');

    // Backend needed: Fetch these from API endpoints
    const [stats, setStats] = useState<Stats>({
        totalUsers: 0,
        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        activeUsers: 0
    });

    const [users, setUsers] = useState<User[]>([]);
    const [reports, setReports] = useState<Report[]>([]);
    const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'reports' | 'settings'>('overview');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [loading, setLoading] = useState(true);

    // Backend API calls needed here
    useEffect(() => {
        fetchDashboardData();
    }, []);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            // Backend API calls needed:
            // const statsResponse = await fetch('/api/admin/stats');
            // const usersResponse = await fetch('/api/admin/users');
            // const reportsResponse = await fetch('/api/admin/reports');

            // Mock data for demonstration
            setStats({
                totalUsers: 1250,
                totalReports: 456,
                pendingReports: 23,
                resolvedReports: 398,
                activeUsers: 89
            });

            setUsers([
                {
                    id: '1',
                    name: 'John Doe',
                    email: 'john@example.com',
                    role: 'user',
                    status: 'active',
                    joinDate: '2024-01-15',
                    lastActive: '2024-01-20'
                }
            ]);

            setReports([
                {
                    id: '1',
                    title: 'Pothole on Main Street',
                    location: 'Main St, Downtown',
                    reporterName: 'Jane Smith',
                    status: 'pending',
                    priority: 'high',
                    category: 'Road Infrastructure',
                    createdAt: '2024-01-20T10:30:00Z'
                }
            ]);
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleUserAction = async (userId: string, action: 'activate' | 'deactivate' | 'delete') => {
        // Backend API call needed: `/api/admin/users/${userId}/${action}`
        console.log(`${action} user ${userId}`);
        fetchDashboardData();
    };

    const handleReportAction = async (reportId: string, action: 'approve' | 'reject' | 'assign') => {
        // Backend API call needed: `/api/admin/reports/${reportId}/${action}`
        console.log(`${action} report ${reportId}`);
        fetchDashboardData();
    };

    const StatCard = ({ icon: Icon, title, value, change, color }: any) => (
        <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-gray-600">{title}</p>
                    <p className="text-2xl font-bold text-gray-900">{value}</p>
                    {change && (
                        <p className={`text-sm ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {change > 0 ? '+' : ''}{change}%
                        </p>
                    )}
                </div>
                <Icon className="h-8 w-8 text-gray-400" />
            </div>
        </div>
    );

    const UserTable = () => (
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
            <div className="px-6 py-4 border-b border-gray-200">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
                    <div className="flex space-x-2">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                            <input
                                type="text"
                                placeholder="Search users..."
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                        <button className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center">
                            <Plus className="h-4 w-4 mr-2" />
                            Add User
                        </button>
                    </div>
                </div>
            </div>

            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Join Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Active</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {users.map((user) => (
                            <tr key={user.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div>
                                        <div className="text-sm font-medium text-gray-900">{user.name}</div>
                                        <div className="text-sm text-gray-500">{user.email}</div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.role === 'admin' ? 'bg-purple-100 text-purple-800' : 'bg-blue-100 text-blue-800'
                                        }`}>
                                        {user.role}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${user.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                                        }`}>
                                        {user.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.joinDate}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{user.lastActive}</td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleUserAction(user.id, 'activate')}
                                            className="text-blue-600 hover:text-blue-900"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleUserAction(user.id, 'delete')}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 p-6">
                <div className="flex justify-center items-center h-64">
                    <RefreshCw className="h-8 w-8 animate-spin text-blue-600" />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-7xl mx-auto">
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-gray-900">{t('title')}</h1>
                    <p className="text-gray-600 mt-2">{t('description')}</p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
                    <StatCard
                        icon={Users}
                        title="Total Users"
                        value={stats.totalUsers}
                        color="#3B82F6"
                    />
                    <StatCard
                        icon={MapPin}
                        title="Total Reports"
                        value={stats.totalReports}
                        color="#10B981"
                    />
                    <StatCard
                        icon={AlertTriangle}
                        title="Pending Reports"
                        value={stats.pendingReports}
                        color="#F59E0B"
                    />
                    <StatCard
                        icon={TrendingUp}
                        title="Resolved Reports"
                        value={stats.resolvedReports}
                        color="#8B5CF6"
                    />
                    <StatCard
                        icon={Users}
                        title="Active Users"
                        value={stats.activeUsers}
                        color="#EF4444"
                    />
                </div>

                <div className="mb-6">
                    <nav className="flex space-x-8">
                        {['overview', 'users', 'reports', 'settings'].map((tab) => (
                            <button
                                key={tab}
                                onClick={() => setActiveTab(tab as any)}
                                className={`py-2 px-1 border-b-2 font-medium text-sm ${activeTab === tab
                                        ? 'border-blue-500 text-blue-600'
                                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                    }`}
                            >
                                {tab.charAt(0).toUpperCase() + tab.slice(1)}
                            </button>
                        ))}
                    </nav>
                </div>

                {activeTab === 'users' && <UserTable />}
            </div>
        </div>
    );
}