"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { authService } from "@/services/authService";
import {
    Users,
    Search,
    Filter,
    UserCheck,
    UserX,
    Shield,
    Building,
    Wrench,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    MoreVertical,
    Loader2,
    Ban,
    CheckCircle,
    AlertTriangle,
} from "lucide-react";

interface UserData {
    id: string;
    name: string;
    email: string;
    phone: string;
    role: "CITIZEN" | "CONTRACTOR" | "WORKER" | "ADMIN";
    status: "ACTIVE" | "SUSPENDED" | "PENDING";
    joinedDate: string;
    location?: string;
    ticketsCreated?: number;
    ticketsCompleted?: number;
    companyName?: string;
    specialization?: string;
}

export default function AdminUsersPage({
    params,
}: {
    params: { locale: string };
}) {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<UserData | null>(null);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    // Mock data - will be replaced with API call
    const mockUsers: UserData[] = [
        {
            id: "1",
            name: "Rajesh Kumar",
            email: "rajesh.kumar@example.com",
            phone: "+91 9876543210",
            role: "CITIZEN",
            status: "ACTIVE",
            joinedDate: "2024-08-15",
            location: "Mumbai, Maharashtra",
            ticketsCreated: 12,
        },
        {
            id: "2",
            name: "Priya Sharma",
            email: "priya.sharma@example.com",
            phone: "+91 9876543211",
            role: "CITIZEN",
            status: "ACTIVE",
            joinedDate: "2024-09-01",
            location: "Delhi",
            ticketsCreated: 5,
        },
        {
            id: "3",
            name: "Vijay Constructions",
            email: "contact@vijayconstructions.com",
            phone: "+91 9876543212",
            role: "CONTRACTOR",
            status: "ACTIVE",
            joinedDate: "2024-07-10",
            companyName: "Vijay Constructions Pvt Ltd",
            specialization: "Road Repairs",
            ticketsCompleted: 45,
        },
        {
            id: "4",
            name: "Amit Patel",
            email: "amit.patel@example.com",
            phone: "+91 9876543213",
            role: "WORKER",
            status: "ACTIVE",
            joinedDate: "2024-08-20",
            specialization: "Electrician",
            ticketsCompleted: 23,
        },
        {
            id: "5",
            name: "Suresh Reddy",
            email: "suresh.reddy@example.com",
            phone: "+91 9876543214",
            role: "ADMIN",
            status: "ACTIVE",
            joinedDate: "2024-06-01",
            location: "Bangalore",
        },
        {
            id: "6",
            name: "Meera Nair",
            email: "meera.nair@example.com",
            phone: "+91 9876543215",
            role: "CITIZEN",
            status: "SUSPENDED",
            joinedDate: "2024-05-15",
            location: "Kerala",
            ticketsCreated: 8,
        },
    ];

    const [users, setUsers] = useState<UserData[]>(mockUsers);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        // BACKEND INTEGRATION POINT
        // const fetchUsers = async () => {
        //   const data = await adminService.getAllUsers();
        //   setUsers(data);
        // };
        // fetchUsers();
        setLoading(false);
    }, []);

    const filteredUsers = users.filter((user) => {
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.phone.includes(searchQuery);

        const matchesRole = selectedRole === "all" || user.role === selectedRole;
        const matchesStatus =
            selectedStatus === "all" || user.status === selectedStatus;

        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        citizens: users.filter((u) => u.role === "CITIZEN").length,
        contractors: users.filter((u) => u.role === "CONTRACTOR").length,
        workers: users.filter((u) => u.role === "WORKER").length,
        admins: users.filter((u) => u.role === "ADMIN").length,
        active: users.filter((u) => u.status === "ACTIVE").length,
        suspended: users.filter((u) => u.status === "SUSPENDED").length,
    };

    const handleSuspendUser = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        // BACKEND INTEGRATION POINT
        // await adminService.suspendUser(selectedUser.id);
        setTimeout(() => {
            setUsers(
                users.map((u) =>
                    u.id === selectedUser.id ? { ...u, status: "SUSPENDED" } : u
                )
            );
            setShowSuspendDialog(false);
            setSelectedUser(null);
            setActionLoading(false);
        }, 1000);
    };

    const handleActivateUser = async () => {
        if (!selectedUser) return;
        setActionLoading(true);
        // BACKEND INTEGRATION POINT
        // await adminService.activateUser(selectedUser.id);
        setTimeout(() => {
            setUsers(
                users.map((u) =>
                    u.id === selectedUser.id ? { ...u, status: "ACTIVE" } : u
                )
            );
            setShowActivateDialog(false);
            setSelectedUser(null);
            setActionLoading(false);
        }, 1000);
    };

    const getRoleIcon = (role: string) => {
        switch (role) {
            case "CITIZEN":
                return <User className="h-4 w-4" />;
            case "CONTRACTOR":
                return <Building className="h-4 w-4" />;
            case "WORKER":
                return <Wrench className="h-4 w-4" />;
            case "ADMIN":
                return <Shield className="h-4 w-4" />;
            default:
                return <User className="h-4 w-4" />;
        }
    };

    const getRoleBadgeColor = (role: string) => {
        switch (role) {
            case "CITIZEN":
                return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700";
            case "CONTRACTOR":
                return "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300 dark:border-purple-700";
            case "WORKER":
                return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-300 dark:border-orange-700";
            case "ADMIN":
                return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700";
            default:
                return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300 dark:border-gray-700";
        }
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case "ACTIVE":
                return (
                    <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300 dark:border-green-700">
                        <CheckCircle className="h-3 w-3 mr-1" />
                        Active
                    </Badge>
                );
            case "SUSPENDED":
                return (
                    <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700">
                        <Ban className="h-3 w-3 mr-1" />
                        Suspended
                    </Badge>
                );
            case "PENDING":
                return (
                    <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        Pending
                    </Badge>
                );
            default:
                return null;
        }
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
                            User Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400 mt-2">
                            Manage all platform users and their permissions
                        </p>
                    </div>

                    {/* Stats Cards */}
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Users className="h-5 w-5 text-gray-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.total}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Total Users</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <User className="h-5 w-5 text-blue-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.citizens}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Citizens</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Building className="h-5 w-5 text-purple-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.contractors}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Contractors</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Wrench className="h-5 w-5 text-orange-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.workers}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Workers</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Shield className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.admins}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Admins</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <CheckCircle className="h-5 w-5 text-green-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.active}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Active</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>

                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2">
                                    <Ban className="h-5 w-5 text-red-500" />
                                    <div>
                                        <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                            {stats.suspended}
                                        </p>
                                        <p className="text-xs text-gray-600 dark:text-gray-400">Suspended</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-6">
                            <div className="flex flex-col md:flex-row gap-4">
                                <div className="flex-1 relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>

                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filter by role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="CITIZEN">Citizen</SelectItem>
                                        <SelectItem value="CONTRACTOR">Contractor</SelectItem>
                                        <SelectItem value="WORKER">Worker</SelectItem>
                                        <SelectItem value="ADMIN">Admin</SelectItem>
                                    </SelectContent>
                                </Select>

                                <Select
                                    value={selectedStatus}
                                    onValueChange={setSelectedStatus}
                                >
                                    <SelectTrigger className="w-full md:w-[180px]">
                                        <Filter className="h-4 w-4 mr-2" />
                                        <SelectValue placeholder="Filter by status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="ACTIVE">Active</SelectItem>
                                        <SelectItem value="SUSPENDED">Suspended</SelectItem>
                                        <SelectItem value="PENDING">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users List */}
                    <div className="space-y-4">
                        {filteredUsers.length === 0 ? (
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                                        No users found
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-400">
                                        Try adjusting your search or filters
                                    </p>
                                </CardContent>
                            </Card>
                        ) : (
                            filteredUsers.map((userData) => (
                                <Card key={userData.id} className="hover:shadow-lg transition-shadow">
                                    <CardContent className="p-6">
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-3">
                                                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                        {userData.name}
                                                    </h3>
                                                    <Badge
                                                        variant="outline"
                                                        className={getRoleBadgeColor(userData.role)}
                                                    >
                                                        {getRoleIcon(userData.role)}
                                                        <span className="ml-1">{userData.role}</span>
                                                    </Badge>
                                                    {getStatusBadge(userData.status)}
                                                </div>

                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Mail className="h-4 w-4" />
                                                        <span>{userData.email}</span>
                                                    </div>
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Phone className="h-4 w-4" />
                                                        <span>{userData.phone}</span>
                                                    </div>
                                                    {userData.location && (
                                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                            <MapPin className="h-4 w-4" />
                                                            <span>{userData.location}</span>
                                                        </div>
                                                    )}
                                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                        <Calendar className="h-4 w-4" />
                                                        <span>
                                                            Joined {new Date(userData.joinedDate).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                </div>

                                                {(userData.companyName ||
                                                    userData.specialization ||
                                                    userData.ticketsCreated !== undefined ||
                                                    userData.ticketsCompleted !== undefined) && (
                                                        <div className="mt-3 flex flex-wrap gap-3">
                                                            {userData.companyName && (
                                                                <Badge variant="outline">
                                                                    <Building className="h-3 w-3 mr-1" />
                                                                    {userData.companyName}
                                                                </Badge>
                                                            )}
                                                            {userData.specialization && (
                                                                <Badge variant="outline">
                                                                    <Wrench className="h-3 w-3 mr-1" />
                                                                    {userData.specialization}
                                                                </Badge>
                                                            )}
                                                            {userData.ticketsCreated !== undefined && (
                                                                <Badge variant="outline">
                                                                    {userData.ticketsCreated} Tickets Created
                                                                </Badge>
                                                            )}
                                                            {userData.ticketsCompleted !== undefined && (
                                                                <Badge variant="outline">
                                                                    {userData.ticketsCompleted} Tickets Completed
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    )}
                                            </div>

                                            <div className="flex gap-2">
                                                {userData.status === "ACTIVE" ? (
                                                    <Button
                                                        size="sm"
                                                        variant="destructive"
                                                        onClick={() => {
                                                            setSelectedUser(userData);
                                                            setShowSuspendDialog(true);
                                                        }}
                                                    >
                                                        <Ban className="h-4 w-4 mr-2" />
                                                        Suspend
                                                    </Button>
                                                ) : (
                                                    <Button
                                                        size="sm"
                                                        variant="default"
                                                        className="bg-green-600 hover:bg-green-700"
                                                        onClick={() => {
                                                            setSelectedUser(userData);
                                                            setShowActivateDialog(true);
                                                        }}
                                                    >
                                                        <CheckCircle className="h-4 w-4 mr-2" />
                                                        Activate
                                                    </Button>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))
                        )}
                    </div>
                </div>
            </div>

            {/* Suspend User Dialog */}
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspend User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to suspend {selectedUser?.name}? They will not be
                            able to access the platform until reactivated.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSuspendDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSuspendUser}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Suspending...
                                </>
                            ) : (
                                <>
                                    <Ban className="mr-2 h-4 w-4" />
                                    Suspend User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Activate User Dialog */}
            <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Activate User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to activate {selectedUser?.name}? They will regain
                            access to the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowActivateDialog(false)}
                            disabled={actionLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            className="bg-green-600 hover:bg-green-700"
                            onClick={handleActivateUser}
                            disabled={actionLoading}
                        >
                            {actionLoading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Activating...
                                </>
                            ) : (
                                <>
                                    <CheckCircle className="mr-2 h-4 w-4" />
                                    Activate User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
