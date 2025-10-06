"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
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
import adminService, { AdminUser } from "@/services/adminService";
import {
    Users,
    Search,
    Shield,
    Building,
    Wrench,
    User,
    Mail,
    Phone,
    MapPin,
    Calendar,
    Loader2,
    Ban,
    CheckCircle,
    AlertCircle,
} from "lucide-react";

export default function AdminUsersPage() {
    const [user, setUser] = useState<any>(null);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedRole, setSelectedRole] = useState<string>("all");
    const [selectedStatus, setSelectedStatus] = useState<string>("all");
    const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
    const [showSuspendDialog, setShowSuspendDialog] = useState(false);
    const [showActivateDialog, setShowActivateDialog] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
        }
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await adminService.getAllUsers();
            setUsers(data);
        } catch (err: any) {
            setError(err.message || "Failed to load users");
        } finally {
            setLoading(false);
        }
    };

    const filteredUsers = users.filter((user) => {
        const roleString = user.role.join(", ").toUpperCase();
        const matchesSearch =
            user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.mobile.includes(searchQuery);
        const matchesRole =
            selectedRole === "all" || roleString.includes(selectedRole.toUpperCase());
        const matchesStatus =
            selectedStatus === "all" || user.status === selectedStatus.toUpperCase();

        return matchesSearch && matchesRole && matchesStatus;
    });

    const stats = {
        total: users.length,
        citizens: users.filter((u) => u.role.some(r => r.includes("CITIZEN"))).length,
        contractors: users.filter((u) => u.role.some(r => r.includes("CONTRACTOR"))).length,
        workers: users.filter((u) => u.role.some(r => r.includes("WORKER"))).length,
        admins: users.filter((u) => u.role.some(r => r.includes("ADMIN"))).length,
        active: users.filter((u) => u.status === "ACTIVE").length,
        suspended: users.filter((u) => u.status === "SUSPENDED").length,
    };

    const handleSuspendUser = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            await adminService.suspendUser(selectedUser.id);
            setShowSuspendDialog(false);
            setSelectedUser(null);
            await loadUsers();
        } catch (err: any) {
            alert(err.message || "Failed to suspend user");
        } finally {
            setActionLoading(false);
        }
    };

    const handleActivateUser = async () => {
        if (!selectedUser) return;

        try {
            setActionLoading(true);
            await adminService.activateUser(selectedUser.id);
            setShowActivateDialog(false);
            setSelectedUser(null);
            await loadUsers();
        } catch (err: any) {
            alert(err.message || "Failed to activate user");
        } finally {
            setActionLoading(false);
        }
    };

    const getRoleIcon = (role: string[]) => {
        const roleStr = role.join("").toUpperCase();
        if (roleStr.includes("CITIZEN")) return <User className="h-4 w-4" />;
        if (roleStr.includes("CONTRACTOR")) return <Building className="h-4 w-4" />;
        if (roleStr.includes("WORKER")) return <Wrench className="h-4 w-4" />;
        if (roleStr.includes("ADMIN")) return <Shield className="h-4 w-4" />;
        return <User className="h-4 w-4" />;
    };

    const getRoleBadgeColor = (role: string[]) => {
        const roleStr = role.join("").toUpperCase();
        if (roleStr.includes("CITIZEN"))
            return "bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 border-blue-300";
        if (roleStr.includes("CONTRACTOR"))
            return "bg-purple-100 dark:bg-purple-900/20 text-purple-700 dark:text-purple-400 border-purple-300";
        if (roleStr.includes("WORKER"))
            return "bg-orange-100 dark:bg-orange-900/20 text-orange-700 dark:text-orange-400 border-orange-300";
        if (roleStr.includes("ADMIN"))
            return "bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300";
        return "bg-gray-100 dark:bg-gray-900/20 text-gray-700 dark:text-gray-400 border-gray-300";
    };

    const getStatusBadge = (status: string) => {
        if (status === "ACTIVE") {
            return (
                <Badge className="bg-green-100 dark:bg-green-900/20 text-green-700 dark:text-green-400 border-green-300">
                    <CheckCircle className="h-3 w-3 mr-1" />
                    Active
                </Badge>
            );
        }
        if (status === "SUSPENDED") {
            return (
                <Badge className="bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 border-red-300">
                    <Ban className="h-3 w-3 mr-1" />
                    Suspended
                </Badge>
            );
        }
        return (
            <Badge className="bg-yellow-100 dark:bg-yellow-900/20 text-yellow-700 dark:text-yellow-400 border-yellow-300">
                Pending
            </Badge>
        );
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
                            User Management
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage all users across the platform
                        </p>
                    </div>

                    {/* Error Alert */}
                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    {/* Stats Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-4 mb-6">
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Users className="h-4 w-4 text-gray-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total</p>
                                </div>
                                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <User className="h-4 w-4 text-blue-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Citizens</p>
                                </div>
                                <p className="text-2xl font-bold text-blue-600">{stats.citizens}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Building className="h-4 w-4 text-purple-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Contractors</p>
                                </div>
                                <p className="text-2xl font-bold text-purple-600">{stats.contractors}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Wrench className="h-4 w-4 text-orange-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Workers</p>
                                </div>
                                <p className="text-2xl font-bold text-orange-600">{stats.workers}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Shield className="h-4 w-4 text-red-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Admins</p>
                                </div>
                                <p className="text-2xl font-bold text-red-600">{stats.admins}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <CheckCircle className="h-4 w-4 text-green-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Active</p>
                                </div>
                                <p className="text-2xl font-bold text-green-600">{stats.active}</p>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent className="p-4">
                                <div className="flex items-center gap-2 mb-1">
                                    <Ban className="h-4 w-4 text-red-600" />
                                    <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Suspended</p>
                                </div>
                                <p className="text-2xl font-bold text-red-600">{stats.suspended}</p>
                            </CardContent>
                        </Card>
                    </div>

                    {/* Filters */}
                    <Card className="mb-6">
                        <CardContent className="p-4">
                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                                <div className="relative">
                                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                    <Input
                                        placeholder="Search by name, email, or phone..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                        className="pl-10"
                                    />
                                </div>
                                <Select value={selectedRole} onValueChange={setSelectedRole}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Role" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Roles</SelectItem>
                                        <SelectItem value="citizen">Citizens</SelectItem>
                                        <SelectItem value="contractor">Contractors</SelectItem>
                                        <SelectItem value="worker">Workers</SelectItem>
                                        <SelectItem value="admin">Admins</SelectItem>
                                    </SelectContent>
                                </Select>
                                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Filter by Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">All Status</SelectItem>
                                        <SelectItem value="active">Active</SelectItem>
                                        <SelectItem value="suspended">Suspended</SelectItem>
                                        <SelectItem value="pending">Pending</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Users List */}
                    {filteredUsers.length === 0 ? (
                        <Card>
                            <CardContent className="p-12 text-center">
                                <Users className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                <p className="text-gray-600 dark:text-gray-400">No users found</p>
                            </CardContent>
                        </Card>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredUsers.map((userData) => (
                                <Card key={userData.id} className="hover:shadow-lg transition-shadow">
                                    <CardHeader className="pb-3">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-center gap-2">
                                                {getRoleIcon(userData.role)}
                                                <CardTitle className="text-lg">{userData.name}</CardTitle>
                                            </div>
                                            {getStatusBadge(userData.status)}
                                        </div>
                                    </CardHeader>
                                    <CardContent className="space-y-3">
                                        <div className="flex flex-wrap gap-1">
                                            {userData.role.map((r, idx) => (
                                                <Badge key={idx} variant="outline" className={getRoleBadgeColor(userData.role)}>
                                                    {r.replace('ROLE_', '')}
                                                </Badge>
                                            ))}
                                        </div>

                                        <div className="space-y-2 text-sm">
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Mail className="h-4 w-4 flex-shrink-0" />
                                                <span className="truncate">{userData.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Phone className="h-4 w-4 flex-shrink-0" />
                                                <span>{userData.mobile}</span>
                                            </div>
                                            {userData.address && (
                                                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                    <MapPin className="h-4 w-4 flex-shrink-0" />
                                                    <span className="truncate">{userData.address}</span>
                                                </div>
                                            )}
                                            <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                                <Calendar className="h-4 w-4 flex-shrink-0" />
                                                <span>{new Date(userData.createdAt).toLocaleDateString()}</span>
                                            </div>
                                        </div>

                                        {userData.ticketsCreated !== undefined && (
                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Tickets Created: <span className="font-semibold">{userData.ticketsCreated}</span>
                                                </p>
                                            </div>
                                        )}
                                        {userData.ticketsCompleted !== undefined && (
                                            <div className="pt-2 border-t">
                                                <p className="text-sm text-gray-600 dark:text-gray-400">
                                                    Tickets Completed: <span className="font-semibold">{userData.ticketsCompleted}</span>
                                                </p>
                                            </div>
                                        )}

                                        <div className="pt-3 flex gap-2">
                                            {userData.status === "ACTIVE" ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(userData);
                                                        setShowSuspendDialog(true);
                                                    }}
                                                    className="flex-1 border-red-300 text-red-600 hover:bg-red-50 cursor-pointer"
                                                >
                                                    <Ban className="h-4 w-4 mr-1" />
                                                    Suspend
                                                </Button>
                                            ) : userData.status === "SUSPENDED" ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    onClick={() => {
                                                        setSelectedUser(userData);
                                                        setShowActivateDialog(true);
                                                    }}
                                                    className="flex-1 border-green-300 text-green-600 hover:bg-green-50 cursor-pointer"
                                                >
                                                    <CheckCircle className="h-4 w-4 mr-1" />
                                                    Activate
                                                </Button>
                                            ) : null}
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Suspend Dialog */}
            <Dialog open={showSuspendDialog} onOpenChange={setShowSuspendDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Suspend User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to suspend <span className="font-semibold">{selectedUser?.name}</span>?
                            This will prevent them from accessing the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowSuspendDialog(false)}
                            disabled={actionLoading}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleSuspendUser}
                            disabled={actionLoading}
                            className="cursor-pointer"
                        >
                            {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <Ban className="h-4 w-4 mr-2" />
                                    Suspend User
                                </>
                            )}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Activate Dialog */}
            <Dialog open={showActivateDialog} onOpenChange={setShowActivateDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Activate User</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to activate <span className="font-semibold">{selectedUser?.name}</span>?
                            This will restore their access to the platform.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowActivateDialog(false)}
                            disabled={actionLoading}
                            className="cursor-pointer"
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={handleActivateUser}
                            disabled={actionLoading}
                            className="bg-green-600 hover:bg-green-700 cursor-pointer"
                        >
                            {actionLoading ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <>
                                    <CheckCircle className="h-4 w-4 mr-2" />
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
