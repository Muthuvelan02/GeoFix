'use client';

import { useTranslations } from 'next-intl';
import Link from 'next/link';
import { useParams, usePathname } from 'next/navigation';
import { Bell, Home, FileText, Settings, Menu, User, Search, ChevronRight, LogOut, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import LanguageSwitcher from '@/components/LanguageSwitcher';
import { ThemeToggle } from '@/components/theme-toggle';
import { Badge } from '@/components/ui/badge';
import { useState, useEffect } from 'react';

export default function DashboardNav() {
  // const t = useTranslations('dashboard'); // TODO: Re-enable when dashboard translations are ready
  const params = useParams();
  const pathname = usePathname();
  const locale = params?.locale as string;
  
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  // Sample notifications data
  const notifications = [
    { id: 1, title: 'Issue Report Approved', message: 'Your pothole report has been approved and assigned to a contractor.', time: '2 hours ago', read: false },
    { id: 2, title: 'Issue Resolved', message: 'The streetlight issue you reported has been marked as resolved.', time: '1 day ago', read: false },
    { id: 3, title: 'Community Update', message: 'New community guidelines have been posted.', time: '3 days ago', read: true },
  ];

  const unreadCount = notifications.filter(n => !n.read).length;

  // Breadcrumb generation
  const getBreadcrumbs = () => {
    const segments = pathname.split('/').filter(Boolean);
    const breadcrumbs = [];
    
    for (let i = 0; i < segments.length; i++) {
      if (segments[i] === locale) continue;
      
      const href = '/' + segments.slice(0, i + 1).join('/');
      let label = segments[i];
      
      // Customize labels
      switch (segments[i]) {
        case 'dashboard':
          label = 'Dashboard';
          break;
        case 'citizen':
          label = 'Citizen';
          break;
        case 'issues':
          label = 'My Issues';
          break;
        case 'settings':
          label = 'Settings';
          break;
        case 'profile':
          label = 'Profile';
          break;
        default:
          label = segments[i].charAt(0).toUpperCase() + segments[i].slice(1);
      }
      
      breadcrumbs.push({ href, label });
    }
    
    return breadcrumbs;
  };

  const breadcrumbs = getBreadcrumbs();

  const navItems = [
    {
      href: `/${locale}/dashboard/citizen`,
      label: "Dashboard", // t('nav.dashboard'),
      icon: Home,
      active: pathname === `/${locale}/dashboard/citizen`
    },
    {
      href: `/${locale}/dashboard/citizen/issues`,
      label: "My Issues", // t('nav.myIssues'),
      icon: FileText,
      active: pathname.includes('/issues')
    },
    {
      href: `/${locale}/dashboard/citizen/settings`,
      label: "Settings", // t('nav.settings'),
      icon: Settings,
      active: pathname.includes('/settings')
    }
  ];

  const NavItems = () => (
    <>
      {navItems.map((item) => {
        const Icon = item.icon;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-all duration-200 ${
              item.active
                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 shadow-sm'
                : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100 dark:text-gray-300 dark:hover:text-white dark:hover:bg-gray-800'
            }`}
          >
            <Icon className="h-4 w-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );

  // Handle search
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      // Implement search logic here
      console.log('Searching for:', searchQuery);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <>
      <nav className="bg-white dark:bg-gray-800 shadow-lg border-b border-gray-200 dark:border-gray-700 fixed top-0 left-0 right-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo and Desktop Navigation */}
            <div className="flex items-center">
              <Link href={`/${locale}/dashboard/citizen`} className="flex items-center space-x-2 mr-8">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-blue-700 rounded-lg flex items-center justify-center shadow-md">
                  <span className="text-white font-bold text-sm">GF</span>
                </div>
                <span className="text-xl font-bold text-gray-900 dark:text-white hidden sm:block">GeoFix</span>
              </Link>
              
              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-1">
                <NavItems />
              </div>
            </div>

            {/* Right side - Search, Theme Toggle, Language Switcher, Notifications, Profile */}
            <div className="flex items-center space-x-2">
              {/* Search Toggle */}
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setSearchOpen(!searchOpen)}
                className="hidden sm:flex"
              >
                <Search className="h-4 w-4" />
              </Button>

              <ThemeToggle />
              <LanguageSwitcher />
              
              {/* Notifications */}
              <DropdownMenu open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="relative">
                    <Bell className="h-4 w-4" />
                    {unreadCount > 0 && (
                      <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 text-xs bg-red-500 hover:bg-red-600 flex items-center justify-center">
                        {unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="p-2 border-b border-gray-200 dark:border-gray-700">
                    <h3 className="font-semibold text-sm">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {notifications.map((notification) => (
                      <DropdownMenuItem key={notification.id} className="p-3 border-b border-gray-100 dark:border-gray-800 last:border-0">
                        <div className="flex items-start space-x-2 w-full">
                          {!notification.read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          )}
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                              {notification.title}
                            </p>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                              {notification.message}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                              {notification.time}
                            </p>
                          </div>
                        </div>
                      </DropdownMenuItem>
                    ))}
                  </div>
                  <div className="p-2 border-t border-gray-200 dark:border-gray-700">
                    <Button variant="ghost" size="sm" className="w-full text-center">
                      View All
                    </Button>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* User Profile Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center space-x-2">
                    <div className="w-6 h-6 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-medium">JD</span>
                    </div>
                    <span className="hidden sm:block text-sm font-medium">John Doe</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/dashboard/citizen/profile`} className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/dashboard/citizen/settings`} className="flex items-center space-x-2">
                      <Settings className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href={`/${locale}/login`} className="flex items-center space-x-2 text-red-600 dark:text-red-400">
                      <LogOut className="h-4 w-4" />
                      <span>Logout</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Mobile menu button */}
              <div className="md:hidden">
                <Sheet>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm">
                      <Menu className="h-5 w-5" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                    <div className="flex flex-col space-y-4 mt-8">
                      {/* Mobile Search */}
                      <form onSubmit={handleSearch} className="flex space-x-2">
                        <Input
                          placeholder="Search..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="flex-1"
                        />
                        <Button type="submit" size="sm">
                          <Search className="h-4 w-4" />
                        </Button>
                      </form>
                      <NavItems />
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>

        {/* Breadcrumbs Bar */}
        {breadcrumbs.length > 0 && (
          <div className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center py-2 text-sm">
                <Link 
                  href={`/${locale}`} 
                  className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                >
                  Home
                </Link>
                {breadcrumbs.map((crumb, index) => (
                  <div key={crumb.href} className="flex items-center">
                    <ChevronRight className="h-3 w-3 text-gray-400 mx-2" />
                    {index === breadcrumbs.length - 1 ? (
                      <span className="text-gray-900 dark:text-white font-medium">{crumb.label}</span>
                    ) : (
                      <Link 
                        href={crumb.href} 
                        className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
                      >
                        {crumb.label}
                      </Link>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Search Overlay for Desktop */}
      {searchOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-start justify-center pt-20">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-2xl mx-4">
            <form onSubmit={handleSearch} className="p-4">
              <div className="flex items-center space-x-2">
                <Search className="h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search for issues, reports, or help..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-1 border-0 focus:ring-0 text-lg"
                  autoFocus
                />
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSearchOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </form>
            {searchQuery && (
              <div className="border-t border-gray-200 dark:border-gray-700 p-4">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Press Enter to search for "{searchQuery}"
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
