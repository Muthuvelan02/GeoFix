'use client';

import React, { useState, useEffect } from 'react';
import { Bell, Search, Settings, User, LogOut, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { authService } from '@/services/authService';

interface DashboardHeaderProps {
    userRole?: 'admin' | 'citizen' | 'contractor' | 'superadmin';
    userName?: string;
    userEmail?: string;
    notificationCount?: number;
    onProfileClick?: () => void;
    onSettingsClick?: () => void;
    onLogout?: () => void;
}

const DashboardHeader: React.FC<DashboardHeaderProps> = ({
    userRole,
    userName,
    userEmail,
    notificationCount = 0,
    onProfileClick,
    onSettingsClick,
    onLogout
}) => {
    const { theme, setTheme } = useTheme();
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadUserData = async () => {
            try {
                const currentUser = authService.getCurrentUser();
                if (currentUser) {
                    // Try to get full profile data
                    try {
                        const profile = await authService.getProfile();
                        setUser(profile);
                    } catch (profileError) {
                        // Fallback to basic user data
                        setUser({
                            id: currentUser.userId,
                            name: (currentUser as any).name || 'User',
                            email: (currentUser as any).email || 'user@example.com',
                            roles: currentUser.roles
                        });
                    }
                }
            } catch (error) {
                console.error('Error loading user data:', error);
            } finally {
                setLoading(false);
            }
        };

        loadUserData();
    }, []);

    // Use props if provided, otherwise use loaded user data
    const displayUserRole = userRole || (user?.roles?.[0]?.replace('ROLE_', '').toLowerCase()) || 'citizen';
    const displayUserName = userName || user?.name || 'User';
    const displayUserEmail = userEmail || user?.email || 'user@example.com';

    const getRoleColor = (role: string) => {
        switch (role) {
            case 'admin':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'superadmin':
                return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300';
            case 'contractor':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            default:
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
        }
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60 dark:bg-gray-900/95 dark:supports-[backdrop-filter]:bg-gray-900/60">
            <div className="container flex h-16 items-center justify-between px-4">
                {/* Logo and Title */}
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
                            <span className="text-white font-bold text-sm">GF</span>
                        </div>
                        <div>
                            <h1 className="text-lg font-semibold">GeoFix</h1>
                            <p className="text-xs text-muted-foreground hidden sm:block">
                                {displayUserRole.charAt(0).toUpperCase() + displayUserRole.slice(1)} Dashboard
                            </p>
                        </div>
                    </div>
                </div>

                {/* Search Bar - Hidden on mobile */}
                <div className="hidden md:flex flex-1 max-w-md mx-8">
                    <div className="relative w-full">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Search..."
                            className="pl-10 w-full"
                        />
                    </div>
                </div>

                {/* Right side actions */}
                <div className="flex items-center space-x-4">
                    {/* Theme Toggle */}
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="hidden sm:flex"
                    >
                        {theme === 'dark' ? (
                            <Sun className="h-4 w-4" />
                        ) : (
                            <Moon className="h-4 w-4" />
                        )}
                    </Button>

                    {/* Notifications */}
                    <Button variant="ghost" size="sm" className="relative">
                        <Bell className="h-4 w-4" />
                        {notificationCount > 0 && (
                            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs">
                                {notificationCount}
                            </Badge>
                        )}
                    </Button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                                <Avatar className="h-10 w-10">
                                    <AvatarImage src="/placeholder-avatar.svg" alt={displayUserName} />
                                    <AvatarFallback>
                                        {displayUserName.split(' ').map((n: string) => n[0]).join('')}
                                    </AvatarFallback>
                                </Avatar>
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent className="w-56" align="end" forceMount>
                            <DropdownMenuLabel className="font-normal">
                                <div className="flex flex-col space-y-1">
                                    <p className="text-sm font-medium leading-none">{displayUserName}</p>
                                    <p className="text-xs leading-none text-muted-foreground">
                                        {displayUserEmail}
                                    </p>
                                    <Badge className={`${getRoleColor(displayUserRole)} w-fit mt-1`}>
                                        {displayUserRole}
                                    </Badge>
                                </div>
                            </DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem onClick={onProfileClick}>
                                <User className="mr-2 h-4 w-4" />
                                <span>Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={onSettingsClick}>
                                <Settings className="mr-2 h-4 w-4" />
                                <span>Settings</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                className="text-red-600"
                                onClick={() => {
                                    if (onLogout) {
                                        onLogout();
                                    } else {
                                        // Default logout behavior
                                        if (window.confirm('Are you sure you want to log out?')) {
                                            console.log('User logged out');
                                            // Redirect to login page
                                            window.location.href = '/login';
                                        }
                                    }
                                }}
                            >
                                <LogOut className="mr-2 h-4 w-4" />
                                <span>Log out</span>
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default DashboardHeader;