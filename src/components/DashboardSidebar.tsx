'use client';

import React from 'react';
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
    Database
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface MenuItem {
    name: string;
    href: string;
    icon: any;
    badge?: string;
}

interface DashboardSidebarProps {
    userRole: 'admin' | 'citizen' | 'contractor' | 'superadmin';
    locale: string;
}

const DashboardSidebar: React.FC<DashboardSidebarProps> = ({ userRole, locale }) => {
    const pathname = usePathname();

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
                    { name: 'Assigned Issues', href: `/${locale}/dashboard/contractor/issues`, icon: AlertTriangle, badge: '5' },
                    { name: 'Completed Work', href: `/${locale}/dashboard/contractor/completed`, icon: CheckCircle },
                    { name: 'Schedule', href: `/${locale}/dashboard/contractor/schedule`, icon: Clock },
                    { name: 'Performance', href: `/${locale}/dashboard/contractor/performance`, icon: BarChart3 },
                    { name: 'Profile', href: `/${locale}/dashboard/contractor/profile`, icon: UserCheck },
                ];

            case 'citizen':
            default:
                return [
                    { name: 'Dashboard', href: `/${locale}/dashboard/citizen`, icon: Home },
                    { name: 'Report Issue', href: `/${locale}/dashboard/citizen/report`, icon: AlertTriangle },
                    { name: 'My Reports', href: `/${locale}/dashboard/citizen/reports`, icon: FileText, badge: '3' },
                    { name: 'Track Issues', href: `/${locale}/dashboard/citizen/track`, icon: MapPin },
                    { name: 'Community', href: `/${locale}/dashboard/citizen/community`, icon: Users },
                    { name: 'Help', href: `/${locale}/dashboard/citizen/help`, icon: HelpCircle },
                ];
        }
    };

    const menuItems = getMenuItems(userRole);

    return (
        <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-16 lg:bg-white lg:dark:bg-gray-900 lg:border-r lg:border-gray-200 lg:dark:border-gray-700">
            <div className="flex-1 flex flex-col min-h-0 overflow-y-auto">
                <nav className="flex-1 px-4 py-6 space-y-2">
                    {menuItems.map((item) => {
                        const isActive = pathname === item.href;
                        return (
                            <Link key={item.name} href={item.href}>
                                <Button
                                    variant={isActive ? "secondary" : "ghost"}
                                    className={cn(
                                        "w-full justify-start h-10",
                                        isActive && "bg-primary/10 text-primary hover:bg-primary/20"
                                    )}
                                >
                                    <item.icon className="h-4 w-4 mr-3" />
                                    <span className="flex-1 text-left">{item.name}</span>
                                    {item.badge && (
                                        <span className="ml-auto bg-primary text-primary-foreground text-xs rounded-full px-2 py-1">
                                            {item.badge}
                                        </span>
                                    )}
                                </Button>
                            </Link>
                        );
                    })}
                </nav>

                {/* Footer section */}
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-xs text-muted-foreground text-center">
                        <p>GeoFix v1.0</p>
                        <p>© 2025 GeoFix Platform</p>
                    </div>
                </div>
            </div>
        </aside>
    );
};

export default DashboardSidebar;