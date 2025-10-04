'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
    Home,
    Users,
    MapPin,
    AlertTriangle,
    BarChart3,
    Settings,
    HelpCircle,
    FileText,
    CheckCircle,
    Clock,
    Building,
    Shield,
    UserCheck,
    Database,
    Menu,
    X,
    ChevronLeft,
    ChevronRight,
    User,
    Bell,
    LogOut
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/authService';
import { useRouter } from 'next/navigation';
interface MenuItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
}

interface CollapsibleSidebarProps {
    userRole: 'admin' | 'citizen' | 'contractor' | 'superadmin' | 'worker';
    locale: string;
    user?: any;
}

const CollapsibleSidebar: React.FC<CollapsibleSidebarProps> = ({ userRole, locale, user }) => {
    const [isCollapsed, setIsCollapsed] = useState(false);
    const [isMobileOpen, setIsMobileOpen] = useState(false);
    const pathname = usePathname();
    const router = useRouter();

    const handleLogout = () => {
        authService.logout();
        router.push(`/${locale}/login/${userRole}`);
    };

    const getMenuItems = (role: string): MenuItem[] => {
        switch (role) {
            case 'admin':
                return [
                    { name: 'Overview', href: `/${locale}/dashboard/admin`, icon: Home },
                    { name: 'Issue Management', href: `/${locale}/dashboard/admin/issues`, icon: AlertTriangle },
                    { name: 'User Management', href: `/${locale}/dashboard/admin/users`, icon: Users },
                    { name: 'Contractor Management', href: `/${locale}/dashboard/admin/contractors`, icon: Building },
                    { name: 'Analytics', href: `/${locale}/dashboard/admin/analytics`, icon: BarChart3 },
                    { name: 'Reports', href: `/${locale}/dashboard/admin/reports`, icon: FileText },
                    { name: 'Settings', href: `/${locale}/dashboard/admin/settings`, icon: Settings },
                ];

            case 'superadmin':
                return [
                    { name: 'Overview', href: `/${locale}/dashboard/superadmin`, icon: Home },
                    { name: 'System Management', href: `/${locale}/dashboard/superadmin/system`, icon: Database },
                    { name: 'Admin Management', href: `/${locale}/dashboard/superadmin/admins`, icon: Shield },
                    { name: 'Platform Analytics', href: `/${locale}/dashboard/superadmin/analytics`, icon: BarChart3 },
                    { name: 'Global Settings', href: `/${locale}/dashboard/superadmin/settings`, icon: Settings },
                ];

            case 'contractor':
                return [
                    { name: 'Dashboard', href: `/${locale}/dashboard/contractor`, icon: Home },
                    { name: 'Assigned Tickets', href: `/${locale}/dashboard/contractor/tickets`, icon: AlertTriangle },
                    { name: 'Manage Workers', href: `/${locale}/dashboard/contractor/workers`, icon: Users },
                    { name: 'Performance', href: `/${locale}/dashboard/contractor/performance`, icon: BarChart3 },
                ];

            case 'worker':
                return [
                    { name: 'Dashboard', href: `/${locale}/dashboard/worker`, icon: Home },
                    { name: 'My Tasks', href: `/${locale}/dashboard/worker/tasks`, icon: CheckCircle },
                    { name: 'Completed Work', href: `/${locale}/dashboard/worker/completed`, icon: FileText },
                ];

            case 'citizen':
            default:
                return [
                    { name: 'Dashboard', href: `/${locale}/dashboard/citizen`, icon: Home },
                    { name: 'Report Issue', href: `/${locale}/dashboard/citizen/report`, icon: AlertTriangle },
                    { name: 'My Reports', href: `/${locale}/dashboard/citizen/reports`, icon: FileText },
                    { name: 'Track Issues', href: `/${locale}/dashboard/citizen/track`, icon: MapPin },
                    { name: 'Profile', href: `/${locale}/dashboard/citizen/profile`, icon: User },
                    { name: 'Settings', href: `/${locale}/dashboard/citizen/settings`, icon: Settings },
                    { name: 'Help', href: `/${locale}/dashboard/citizen/help`, icon: HelpCircle },
                ];
        }
    };

    const menuItems = getMenuItems(userRole);

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Header */}
            <div className={cn(
                "flex justify-end ",
                isCollapsed && "justify-center px-2"
            )}>

                <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsCollapsed(!isCollapsed)}
                    className="hidden lg:flex cursor-pointer h-8 w-8 p-0 absolute -right-4  z-10 rounded-full bg-gray-200 shadow-lg items-center justify-cente"
                >
                    {isCollapsed ? <ChevronRight className="rounded-full h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
                </Button>
            </div>

            {/* Navigation */}
            <nav className="flex-1 px-2 py-0 space-y-1 overflow-y-auto">
                {menuItems.map((item) => {
                    const isActive = pathname === item.href;
                    return (
                        <Link key={item.name} href={item.href}>
                            <Button
                                variant={isActive ? "secondary" : "ghost"}
                                className={cn(
                                    "w-full justify-start h-13 transition-all duration-200 cursor-pointer",
                                    isActive && "bg-primary/10 text-primary hover:bg-primary/20",
                                    isCollapsed ? "px-2" : "px-3"
                                )}
                                onClick={() => setIsMobileOpen(false)}
                            >
                                <item.icon className={cn("h-4 w-4", !isCollapsed && "mr-3")} />
                                {!isCollapsed && (
                                    <>
                                        <span className="flex-1 text-left">{item.name}</span>
                                        {item.badge && (
                                            <Badge variant="default" className="ml-auto">
                                                {item.badge}
                                            </Badge>
                                        )}
                                    </>
                                )}
                            </Button>
                        </Link>
                    );
                })}
            </nav>

            {/* Quick Actions */}
            {!isCollapsed && (
                <div className="px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="space-y-2">
                        <Button
                            variant="outline"
                            size="sm"
                            className="w-full justify-start cursor-pointer"
                            onClick={() => router.push(`/${locale}/dashboard/${userRole}/notifications`)}
                        >
                            <Bell className="h-4 w-4 mr-2" />
                            Notifications
                        </Button>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="w-full justify-start text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Logout
                        </Button>
                    </div>
                </div>
            )}

            {/* Collapsed state actions */}
            {isCollapsed && (
                <div className="px-2 py-3 border-t border-gray-200 dark:border-gray-700 space-y-2">
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full p-2 cursor-pointer"
                        onClick={() => router.push(`/${locale}/dashboard/${userRole}/notifications`)}
                    >
                        <Bell className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="sm"
                        className="w-full p-2 text-red-600 hover:text-red-700 hover:bg-red-50 cursor-pointer"
                        onClick={handleLogout}
                    >
                        <LogOut className="h-4 w-4" />
                    </Button>
                </div>
            )}

            {/* Footer */}
            {!isCollapsed && (
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-muted-foreground text-center">
                        <p>GeoFix v1.0</p>
                        <p>© 2025 GeoFix Platform</p>
                    </div>
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile toggle button */}
            <Button
                variant="ghost"
                size="sm"
                className="lg:hidden fixed top-4 left-4 z-50"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>

            {/* Mobile overlay */}
            {isMobileOpen && (
                <div
                    className="lg:hidden fixed inset-0 z-40 bg-black bg-opacity-50"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}

            {/* Desktop sidebar */}
            <aside className={cn(
                "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-700 transition-all duration-300",
                isCollapsed ? "lg:w-16" : "lg:w-64"
            )}>
                <SidebarContent />
            </aside>

            {/* Mobile sidebar */}
            <aside className={cn(
                "lg:hidden fixed inset-y-0 left-0 z-50 w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 transform transition-transform duration-300",
                isMobileOpen ? "translate-x-0" : "-translate-x-full"
            )}>
                <div className="pt-16">
                    <SidebarContent />
                </div>
            </aside>
        </>
    );
};

export default CollapsibleSidebar;