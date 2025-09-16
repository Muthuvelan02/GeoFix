'use client';

import { useParams, usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  Home, 
  FileText, 
  Settings, 
  Users, 
  BarChart3, 
  MapPin,
  Shield,
  HelpCircle,
  PlusCircle,
  Clock,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';

interface DashboardSidebarProps {
  isMobile?: boolean;
}

export default function DashboardSidebar({ isMobile = false }: DashboardSidebarProps) {
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string;

  // Determine user role from pathname (this would typically come from auth/context)
  const getUserRole = () => {
    if (pathname.includes('/dashboard/citizen')) return 'citizen';
    if (pathname.includes('/dashboard/contractor')) return 'contractor';
    if (pathname.includes('/dashboard/admin')) return 'admin';
    return 'citizen'; // default
  };

  const userRole = getUserRole();

  // Navigation items based on user role
  const getNavigationItems = () => {
    const baseItems = [
      {
        href: `/${locale}/dashboard`,
        icon: Home,
        label: 'Dashboard Overview',
        description: 'Main dashboard view'
      }
    ];

    if (userRole === 'citizen') {
      return [
        ...baseItems,
        {
          href: `/${locale}/dashboard/citizen`,
          icon: Home,
          label: 'My Dashboard',
          description: 'Personal dashboard and activity'
        },
        {
          href: `/${locale}/dashboard/citizen/report`,
          icon: PlusCircle,
          label: 'Report Issue',
          description: 'Submit a new issue report'
        },
        {
          href: `/${locale}/dashboard/citizen/issues`,
          icon: FileText,
          label: 'My Issues',
          description: 'View and manage your reports'
        },
        {
          href: `/${locale}/dashboard/citizen/map`,
          icon: MapPin,
          label: 'Community Map',
          description: 'Explore issues in your area'
        }
      ];
    }

    if (userRole === 'contractor') {
      return [
        ...baseItems,
        {
          href: `/${locale}/dashboard/contractor`,
          icon: Home,
          label: 'Work Dashboard',
          description: 'Assigned work and progress'
        },
        {
          href: `/${locale}/dashboard/contractor/assigned`,
          icon: Clock,
          label: 'Assigned Issues',
          description: 'Issues assigned to you'
        },
        {
          href: `/${locale}/dashboard/contractor/completed`,
          icon: CheckCircle,
          label: 'Completed Work',
          description: 'Your completed projects'
        },
        {
          href: `/${locale}/dashboard/contractor/schedule`,
          icon: BarChart3,
          label: 'Schedule',
          description: 'Work schedule and planning'
        }
      ];
    }

    if (userRole === 'admin') {
      return [
        ...baseItems,
        {
          href: `/${locale}/dashboard/admin`,
          icon: Home,
          label: 'Admin Dashboard',
          description: 'System overview and management'
        },
        {
          href: `/${locale}/dashboard/admin/issues`,
          icon: FileText,
          label: 'All Issues',
          description: 'Manage all reported issues'
        },
        {
          href: `/${locale}/dashboard/admin/contractors`,
          icon: Users,
          label: 'Contractors',
          description: 'Manage contractor assignments'
        },
        {
          href: `/${locale}/dashboard/admin/analytics`,
          icon: BarChart3,
          label: 'Analytics',
          description: 'System performance and reports'
        },
        {
          href: `/${locale}/dashboard/admin/users`,
          icon: Shield,
          label: 'User Management',
          description: 'Manage users and permissions'
        }
      ];
    }

    return baseItems;
  };

  const navigationItems = getNavigationItems();

  const isActiveRoute = (href: string) => {
    if (href === `/${locale}/dashboard`) {
      return pathname === href;
    }
    return pathname.startsWith(href);
  };

  return (
    <aside className={cn(
      "bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col",
      isMobile ? "w-64 h-full" : "hidden lg:flex lg:w-64 lg:sticky lg:top-16 lg:h-[calc(100vh-4rem)]"
    )}>
      {/* Sidebar Header */}
      <div className="p-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold">
              {userRole === 'citizen' ? 'C' : userRole === 'contractor' ? 'W' : 'A'}
            </span>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white capitalize">
              {userRole} Portal
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Welcome back
            </p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);
          
          return (
            <Link key={item.href} href={item.href}>
              <Button
                variant={isActive ? "secondary" : "ghost"}
                className={cn(
                  "w-full justify-start h-auto p-3 text-left",
                  isActive && "bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border border-blue-200 dark:border-blue-800"
                )}
              >
                <Icon className={cn(
                  "h-5 w-5 mr-3 flex-shrink-0",
                  isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                )} />
                <div className="flex-1 min-w-0">
                  <p className={cn(
                    "text-sm font-medium truncate",
                    isActive ? "text-blue-700 dark:text-blue-300" : "text-gray-700 dark:text-gray-300"
                  )}>
                    {item.label}
                  </p>
                  <p className={cn(
                    "text-xs truncate mt-0.5",
                    isActive ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"
                  )}>
                    {item.description}
                  </p>
                </div>
              </Button>
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Link href={`/${locale}/dashboard/settings`}>
            <Button variant="ghost" className="w-full justify-start">
              <Settings className="h-4 w-4 mr-3" />
              Settings
            </Button>
          </Link>
          
          <Link href={`/${locale}/help`}>
            <Button variant="ghost" className="w-full justify-start">
              <HelpCircle className="h-4 w-4 mr-3" />
              Help & Support
            </Button>
          </Link>
        </div>

        {/* Quick Stats (for non-mobile) */}
        {!isMobile && (
          <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wide mb-2">
              Quick Stats
            </h4>
            <div className="space-y-1">
              {userRole === 'citizen' && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Active Reports</span>
                    <span className="font-medium text-gray-900 dark:text-white">3</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Resolved</span>
                    <span className="font-medium text-green-600 dark:text-green-400">12</span>
                  </div>
                </>
              )}
              
              {userRole === 'contractor' && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Assigned</span>
                    <span className="font-medium text-blue-600 dark:text-blue-400">5</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Completed</span>
                    <span className="font-medium text-green-600 dark:text-green-400">28</span>
                  </div>
                </>
              )}
              
              {userRole === 'admin' && (
                <>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Total Issues</span>
                    <span className="font-medium text-gray-900 dark:text-white">147</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-300">Pending</span>
                    <span className="font-medium text-orange-600 dark:text-orange-400">23</span>
                  </div>
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
}
