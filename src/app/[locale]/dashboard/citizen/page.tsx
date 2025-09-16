'use client';

import { useState, useEffect, useMemo } from 'react';
import { useTranslations } from 'next-intl';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Search,
  MapPin,
  Calendar,
  Users,
  Eye,
  ThumbsUp,
  MessageSquare,
  MoreHorizontal,
  Bell,
  User
} from 'lucide-react';

// Mock data interface
interface User {
  name: string;
  email: string;
  communityRank: string;
  avatar?: string;
}

interface Issue {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'resolved';
  priority: 'high' | 'medium' | 'low';
  category: string;
  location: string;
  createdAt: string;
  updatedAt: string;
  assignedContractor?: string;
  estimatedResolution?: string;
  resolvedAt?: string;
  views: number;
  likes: number;
  comments: number;
  attachments?: string[];
  _liked?: boolean;
}

interface Notification {
  id: number;
  message: string;
  timestamp: string;
  isRead: boolean;
}

interface Statistics {
  totalIssues: number;
  pendingIssues: number;
  inProgressIssues: number;
  resolvedIssues: number;
  thisMonthReports: number;
  avgResolutionTime: string;
  communityImpact: number;
}

interface DashboardData {
  user: User;
  statistics: Statistics;
  recentIssues: Issue[];
  notifications: Notification[];
}

// Mock data
const INITIAL_DATA: DashboardData = {
  user: {
    name: 'John Citizen',
    email: 'john@example.com',
    communityRank: 'Gold Contributor',
    avatar: undefined
  },
  statistics: {
    totalIssues: 12,
    pendingIssues: 3,
    inProgressIssues: 4,
    resolvedIssues: 5,
    thisMonthReports: 3,
    avgResolutionTime: '5 days',
    communityImpact: 87
  },
  recentIssues: [
    {
      id: 'ISS-001',
      title: 'Broken Streetlight on Main St',
      description: 'The streetlight near the intersection has been out for several days, making it dangerous for pedestrians at night.',
      status: 'in-progress',
      priority: 'high',
      category: 'lighting',
      location: '123 Main Street, Downtown',
      createdAt: '2024-01-15T10:30:00Z',
      updatedAt: '2024-01-16T14:20:00Z',
      assignedContractor: 'City Electric Co.',
      estimatedResolution: '2024-01-20T00:00:00Z',
      views: 45,
      likes: 12,
      comments: 3,
      attachments: ['streetlight_photo.jpg']
    },
    {
      id: 'ISS-002',
      title: 'Pothole on Elm Avenue',
      description: 'Large pothole causing damage to vehicles and creating a safety hazard.',
      status: 'pending',
      priority: 'medium',
      category: 'infrastructure',
      location: '456 Elm Avenue, Westside',
      createdAt: '2024-01-14T08:15:00Z',
      updatedAt: '2024-01-14T08:15:00Z',
      views: 23,
      likes: 8,
      comments: 1
    },
    {
      id: 'ISS-003',
      title: 'Overflowing Trash Bin',
      description: 'Public trash bin has been overflowing for days, attracting pests.',
      status: 'resolved',
      priority: 'low',
      category: 'sanitation',
      location: 'Oak Park, Recreation Area',
      createdAt: '2024-01-10T16:45:00Z',
      updatedAt: '2024-01-12T09:30:00Z',
      resolvedAt: '2024-01-12T09:30:00Z',
      views: 67,
      likes: 15,
      comments: 5
    }
  ],
  notifications: [
    {
      id: 1,
      message: 'Your report "Broken Streetlight on Main St" has been assigned to a contractor.',
      timestamp: '2024-01-16T14:20:00Z',
      isRead: false
    },
    {
      id: 2,
      message: 'New comment on your report "Pothole on Elm Avenue".',
      timestamp: '2024-01-15T11:30:00Z',
      isRead: false
    },
    {
      id: 3,
      message: 'Your report "Overflowing Trash Bin" has been resolved.',
      timestamp: '2024-01-12T09:30:00Z',
      isRead: true
    }
  ]
};

const STORAGE_KEY = 'geofix-citizen-dashboard';

// Helper functions
const formatDate = (dateString: string, locale: string) => {
  try {
    return new Date(dateString).toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  } catch {
    return dateString;
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'pending':
      return <Clock className="h-4 w-4 text-yellow-500" />;
    case 'in-progress':
      return <AlertTriangle className="h-4 w-4 text-orange-500" />;
    case 'resolved':
      return <CheckCircle className="h-4 w-4 text-green-500" />;
    default:
      return <Clock className="h-4 w-4 text-gray-500" />;
  }
};

const getStatusColor = (status: string) => {
  const variantMap = {
    pending: "bg-yellow-100 text-yellow-800 border-yellow-300",
    'in-progress': "bg-orange-100 text-orange-800 border-orange-300",
    resolved: "bg-green-100 text-green-800 border-green-300"
  };
  return variantMap[status as keyof typeof variantMap] || "bg-gray-100 text-gray-800 border-gray-300";
};

const getPriorityColor = (priority: string) => {
  const colorMap = {
    high: "bg-red-100 text-red-800 border-red-300",
    medium: "bg-yellow-100 text-yellow-800 border-yellow-300",
    low: "bg-green-100 text-green-800 border-green-300"
  };
  return colorMap[priority as keyof typeof colorMap] || "bg-gray-100 text-gray-800 border-gray-300";
};

export default function CitizenDashboard() {
  // Graceful handling of missing translations
  const dashboardT = useTranslations('dashboard');
  const commonT = useTranslations('common');
  
  const t = (key: string, fallback?: string) => {
    try {
      return dashboardT(`citizen.${key}`);
    } catch {
      return fallback || key;
    }
  };
  
  const common = (key: string, fallback?: string) => {
    try {
      return commonT(key);
    } catch {
      return fallback || key;
    }
  };
  
  const params = useParams();
  const locale = (params?.locale as string) || 'en';

  // Load from localStorage or use initial data
  const [data, setData] = useState(INITIAL_DATA);

  // Load data from localStorage on client side only
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        // Merge with initial data to ensure all fields exist
        setData({ ...INITIAL_DATA, ...parsed });
      }
    } catch (e) {
      console.warn('Failed to load dashboard data from localStorage:', e);
    }
  }, []);

  // UI state
  const [query, setQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'in-progress' | 'resolved'>('all');
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'infrastructure' | 'lighting' | 'sanitation' | 'traffic'>('all');
  const [priorityFilter, setPriorityFilter] = useState<'all' | 'high' | 'medium' | 'low'>('all');
  const [sortBy, setSortBy] = useState<'latest' | 'likes' | 'views'>('latest');
  const [page, setPage] = useState(1);
  const PAGE_SIZE = 5;

  // Modal / details
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);

  // Sync data to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
      console.warn('Failed to save dashboard data to localStorage:', e);
    }
  }, [data]);

  // Filter issues based on search and status
  const filteredIssues = useMemo(() => {
    const q = query.trim().toLowerCase();
    let list = data.recentIssues.slice();

    if (statusFilter !== 'all') list = list.filter((issue: Issue) => issue.status === statusFilter);
    if (categoryFilter !== 'all') list = list.filter((issue: Issue) => issue.category === categoryFilter);
    if (priorityFilter !== 'all') list = list.filter((issue: Issue) => issue.priority === priorityFilter);

    if (q) {
      list = list.filter((issue: Issue) =>
        `${issue.title} ${issue.description} ${issue.location} ${issue.id}`.toLowerCase().includes(q)
      );
    }

    if (sortBy === 'latest') {
      list.sort((a: Issue, b: Issue) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'likes') {
      list.sort((a: Issue, b: Issue) => b.likes - a.likes);
    } else if (sortBy === 'views') {
      list.sort((a: Issue, b: Issue) => b.views - a.views);
    }

    return list;
  }, [data.recentIssues, query, statusFilter, categoryFilter, priorityFilter, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredIssues.length / PAGE_SIZE));
  useEffect(() => {
    if (page > totalPages) setPage(1);
  }, [totalPages, page]);

  // Interaction handlers (client-side only)
  const toggleLike = (issueId: string) => {
    setData((prev: DashboardData) => {
      const next = { ...prev };
      next.recentIssues = next.recentIssues.map((issue: Issue) => {
        if (issue.id === issueId) {
          const liked = !!issue._liked;
          return { ...issue, likes: liked ? issue.likes - 1 : issue.likes + 1, _liked: !liked };
        }
        return issue;
      });
      return next;
    });
  };

  const incrementView = (issueId: string) => {
    setData((prev: DashboardData) => {
      const next = { ...prev };
      next.recentIssues = next.recentIssues.map((issue: Issue) => {
        if (issue.id === issueId) return { ...issue, views: (issue.views || 0) + 1 };
        return issue;
      });
      return next;
    });
  };

  const openIssue = (issue: Issue) => {
    incrementView(issue.id);
    setSelectedIssue(issue);
  };

  const markResolved = (issueId: string) => {
    setData((prev: DashboardData) => {
      const next = { ...prev };
      next.recentIssues = next.recentIssues.map((issue: Issue) => {
        if (issue.id === issueId) {
          return { ...issue, status: 'resolved' as const, resolvedAt: new Date().toISOString(), updatedAt: new Date().toISOString() };
        }
        return issue;
      });
      // update statistics quick counts (simple recalculation)
      const stats = {
        totalIssues: next.recentIssues.length,
        pendingIssues: next.recentIssues.filter((i: Issue) => i.status === 'pending').length,
        inProgressIssues: next.recentIssues.filter((i: Issue) => i.status === 'in-progress').length,
        resolvedIssues: next.recentIssues.filter((i: Issue) => i.status === 'resolved').length,
        thisMonthReports: next.statistics?.thisMonthReports || 0,
        avgResolutionTime: next.statistics?.avgResolutionTime || '—',
        communityImpact: next.statistics?.communityImpact || 0
      };
      next.statistics = stats;
      return next;
    });
    setSelectedIssue(null);
  };

  const markNotificationRead = (id: number) => {
    setData((prev: DashboardData) => {
      const next = { ...prev };
      next.notifications = next.notifications.map((n: Notification) => (n.id === id ? { ...n, isRead: true } : n));
      return next;
    });
  };

  const clearFilters = () => {
    setQuery('');
    setStatusFilter('all');
    setCategoryFilter('all');
    setPriorityFilter('all');
    setSortBy('latest');
  };

  // Page slice
  const pageItems = filteredIssues.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  // small helper to open location in google maps
  const openInMaps = (addr: string) => {
    const url = `https://www.google.com/maps/search/${encodeURIComponent(addr)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      {/* Welcome Section */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
              {t('welcome', 'Welcome')} {data.user.name}!
            </h1>
            <p className="text-gray-600 dark:text-gray-300">
              {t('subtitle', 'Track your civic contributions and community impact')} • {t('communityRank', 'Community Rank')}:&nbsp;
              <span className="font-semibold text-blue-600 dark:text-blue-400">{data.user.communityRank}</span>
            </p>
          </div>
          <div className="mt-4 sm:mt-0">
            <Link href={`/${locale}/report`}>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg">
                <Plus className="h-4 w-4 mr-2" />
                {t('reportIssue', 'Report Issue')}
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 border-blue-200 dark:border-blue-800">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-blue-700 dark:text-blue-300">{t('totalReports', 'Total Reports')}</CardTitle>
            <FileText className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">{data.statistics.totalIssues}</div>
            <p className="text-xs text-blue-600 dark:text-blue-400 flex items-center mt-1">
              <TrendingUp className="h-3 w-3 mr-1" />
              +{data.statistics.thisMonthReports} {t('thisMonth', 'this month')}
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 border-yellow-200 dark:border-yellow-800">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-yellow-700 dark:text-yellow-300">{t('pending', 'Pending')}</CardTitle>
            <Clock className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">{data.statistics.pendingIssues}</div>
            <p className="text-xs text-yellow-600 dark:text-yellow-400">{t('needsAttention', 'needs attention')}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-900/20 dark:to-orange-800/20 border-orange-200 dark:border-orange-800">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-orange-700 dark:text-orange-300">{t('inProgress', 'In Progress')}</CardTitle>
            <AlertTriangle className="h-4 w-4 text-orange-600 dark:text-orange-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-900 dark:text-orange-100">{data.statistics.inProgressIssues}</div>
            <p className="text-xs text-orange-600 dark:text-orange-400">Avg: {data.statistics.avgResolutionTime}</p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 border-green-200 dark:border-green-800">
          <CardHeader className="flex items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-green-700 dark:text-green-300">{t('resolved', 'Resolved')}</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-600 dark:text-green-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-900 dark:text-green-100">{data.statistics.resolvedIssues}</div>
            <p className="text-xs text-green-600 dark:text-green-400 flex items-center">
              <BarChart3 className="h-3 w-3 mr-1" />
              {data.statistics.communityImpact}% {t('impact', 'impact')}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Issues (main) */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center space-x-4">
                  <CardTitle className="text-xl font-semibold flex items-center">
                    <FileText className="h-5 w-5 mr-2 text-blue-600" />
                    {t('recentIssues', 'Recent Issues')}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <Input
                      placeholder={t('searchIssues', 'Search issues...')}
                      className="w-56 h-8 text-sm"
                      value={query}
                      onChange={(e) => setQuery(e.target.value)}
                    />
                    <Button variant="outline" size="sm" onClick={() => setQuery('')}>
                      <Search className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="sm" onClick={clearFilters}>
                      {common('clear', 'Clear')}
                    </Button>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <select className="h-8 px-2 rounded border" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value as any)}>
                    <option value="all">{t('allStatus', 'All Status')}</option>
                    <option value="pending">{t('pending', 'Pending')}</option>
                    <option value="in-progress">{t('inProgress', 'In Progress')}</option>
                    <option value="resolved">{t('resolved', 'Resolved')}</option>
                  </select>

                  <select className="h-8 px-2 rounded border" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value as any)}>
                    <option value="all">{t('allCategories', 'All Categories')}</option>
                    <option value="infrastructure">{t('infrastructure', 'Infrastructure')}</option>
                    <option value="lighting">{t('lighting', 'Lighting')}</option>
                    <option value="sanitation">{t('sanitation', 'Sanitation')}</option>
                    <option value="traffic">{t('traffic', 'Traffic')}</option>
                  </select>

                  <select className="h-8 px-2 rounded border" value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value as any)}>
                    <option value="all">{t('allPriority', 'All Priority')}</option>
                    <option value="high">{t('high', 'High')}</option>
                    <option value="medium">{t('medium', 'Medium')}</option>
                    <option value="low">{t('low', 'Low')}</option>
                  </select>

                  <select className="h-8 px-2 rounded border" value={sortBy} onChange={(e) => setSortBy(e.target.value as any)}>
                    <option value="latest">{t('sortLatest', 'Latest')}</option>
                    <option value="likes">{t('sortLikes', 'Most Liked')}</option>
                    <option value="views">{t('sortViews', 'Most Viewed')}</option>
                  </select>

                  <Link href={`/${locale}/dashboard/citizen/issues`}>
                    <Button variant="outline" size="sm">{t('viewAll', 'View All')}</Button>
                  </Link>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <div className="space-y-4">
                {pageItems.length === 0 && (
                  <div className="p-4 text-sm text-gray-500">{t('noIssuesMatch', 'No issues match your filters')}</div>
                )}

                {pageItems.map((issue: Issue) => (
                  <div
                    key={issue.id}
                    className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors cursor-pointer"
                    onClick={() => openIssue(issue)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="mt-1">{getStatusIcon(issue.status)}</div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h3 className="font-semibold text-gray-900 dark:text-white truncate">{issue.title}</h3>
                            <Badge variant="outline" className="text-xs">{issue.id}</Badge>
                          </div>
                          <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2 mb-2">{issue.description}</p>
                          <div className="flex items-center space-x-4 text-xs text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <MapPin className="h-3 w-3" />
                              <span className="truncate max-w-40">{issue.location}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-3 w-3" />
                              <span>{formatDate(issue.createdAt, locale)}</span>
                            </div>
                            {issue.assignedContractor && (
                              <div className="flex items-center space-x-1">
                                <Users className="h-3 w-3" />
                                <span className="truncate max-w-32">{issue.assignedContractor}</span>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>

                      <div className="flex flex-col items-end space-y-2 ml-4">
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(issue.priority)}>{issue.priority}</Badge>
                          <Badge className={getStatusColor(issue.status)}>{issue.status}</Badge>
                        </div>

                        <div className="flex items-center space-x-3 text-xs text-gray-500 dark:text-gray-400">
                          <div className="flex items-center space-x-1">
                            <Eye className="h-3 w-3" />
                            <span>{issue.views}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <ThumbsUp
                              className="h-3 w-3 cursor-pointer"
                              onClick={(e: React.MouseEvent) => {
                                e.stopPropagation();
                                toggleLike(issue.id);
                              }}
                            />
                            <span>{issue.likes}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <MessageSquare className="h-3 w-3" />
                            <span>{issue.comments}</span>
                          </div>
                          <Button variant="ghost" size="sm" className="h-6 w-6 p-0" onClick={(e: React.MouseEvent) => e.stopPropagation()}>
                            <MoreHorizontal className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-gray-600">{t('showing', 'Showing')} {(page-1)*PAGE_SIZE + 1} - {Math.min(page*PAGE_SIZE, filteredIssues.length)} {t('of', 'of')} {filteredIssues.length}</div>
                <div className="flex items-center space-x-2">
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1}>{common('prev', 'Previous')}</Button>
                  <div className="text-sm">{t('page', 'Page')} {page} / {totalPages}</div>
                  <Button variant="outline" size="sm" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={page === totalPages}>{common('next', 'Next')}</Button>
                </div>
              </div>

            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Recent Activity / Notifications */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold flex items-center">
                <Bell className="h-5 w-5 mr-2 text-orange-600" />
                {t('recentActivity', 'Recent Activity')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {data.notifications.slice(0, 5).map((n: Notification) => (
                  <div
                    key={n.id}
                    className={`p-3 rounded-lg ${!n.isRead ? 'bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500' : 'bg-gray-50 dark:bg-gray-800/50'}`}
                  >
                    <p className="text-sm text-gray-700 dark:text-gray-300">{n.message}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{formatDate(n.timestamp.split('T')[0], locale)}</p>
                    {!n.isRead && (
                      <div className="mt-2">
                        <Button size="sm" variant="outline" onClick={() => markNotificationRead(n.id)}>{t('markRead', 'Mark Read')}</Button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
              <Button variant="outline" className="w-full mt-4" size="sm" onClick={() => alert('Open notifications page')}>
                {t('viewAllNotifications', 'View All Notifications')}
              </Button>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">{t('quickActions', 'Quick Actions')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Link href={`/${locale}/report`}>
                <Button className="w-full justify-start" variant="outline">
                  <Plus className="h-4 w-4 mr-2" />
                  {t('reportNewIssue', 'Report New Issue')}
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/citizen/issues`}>
                <Button className="w-full justify-start" variant="outline">
                  <FileText className="h-4 w-4 mr-2" />
                  {t('viewAllMyIssues', 'View All My Issues')}
                </Button>
              </Link>
              <Link href={`/${locale}/dashboard/citizen/profile`}>
                <Button className="w-full justify-start" variant="outline">
                  <User className="h-4 w-4 mr-2" />
                  {t('editProfile', 'Edit Profile')}
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Issue Detail Modal */}
      {selectedIssue && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSelectedIssue(null)} />
          <div className="relative bg-white dark:bg-gray-900 rounded-lg shadow-xl max-w-3xl w-full mx-4 p-6 z-10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedIssue.title}</h2>
                <div className="text-sm text-gray-500">{selectedIssue.id} • {selectedIssue.category} • {selectedIssue.priority}</div>
              </div>
              <div className="flex items-center space-x-2">
                <Button variant="ghost" size="sm" onClick={() => setSelectedIssue(null)}>{common('close', 'Close')}</Button>
              </div>
            </div>

            <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-700 dark:text-gray-300">{selectedIssue.description}</p>
                <div className="mt-3 text-sm text-gray-500 space-y-2">
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4" />
                    <button className="underline" onClick={() => openInMaps(selectedIssue.location)}>{selectedIssue.location}</button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4" />
                    <div>{t('created', 'Created')}: {formatDate(selectedIssue.createdAt, locale)}</div>
                  </div>
                  {selectedIssue.estimatedResolution && (
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <div>{t('estResolution', 'Est. Resolution')}: {formatDate(selectedIssue.estimatedResolution, locale)}</div>
                    </div>
                  )}
                  {selectedIssue.assignedContractor && (
                    <div className="flex items-center space-x-2">
                      <Users className="h-4 w-4" />
                      <div>{t('assigned', 'Assigned')}: {selectedIssue.assignedContractor}</div>
                    </div>
                  )}
                </div>

                <div className="mt-4 flex items-center space-x-2">
                  <Button onClick={() => toggleLike(selectedIssue.id)}>{selectedIssue._liked ? t('unlike', 'Unlike') : t('like', 'Like')} ({selectedIssue.likes})</Button>
                  {selectedIssue.status !== 'resolved' && (
                    <Button variant="ghost" onClick={() => markResolved(selectedIssue.id)}>{t('markResolved', 'Mark Resolved')}</Button>
                  )}
                </div>
              </div>

              <div>
                <div className="text-sm font-semibold mb-2">{t('attachments', 'Attachments')}</div>
                <div className="space-y-2">
                  {(selectedIssue.attachments || []).map((a: string, idx: number) => (
                    <div key={idx} className="p-2 border rounded">{a}</div>
                  ))}
                  {(!selectedIssue.attachments || selectedIssue.attachments.length === 0) && (
                    <div className="text-sm text-gray-500">{t('noAttachments', 'No attachments')}</div>
                  )}
                </div>

                <div className="mt-4">
                  <div className="text-sm font-semibold">{t('community', 'Community')}</div>
                  <div className="mt-2 text-xs text-gray-500">
                    {selectedIssue.views || 0} {t('views', 'views')} • {selectedIssue.likes || 0} {t('likes', 'likes')} • {selectedIssue.comments || 0} {t('comments', 'comments')}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-4 text-right">
              <Button variant="outline" onClick={() => setSelectedIssue(null)}>{common('close', 'Close')}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
