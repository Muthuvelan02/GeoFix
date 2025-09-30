'use client';

import { useEffect, ReactNode } from 'react';
import { useRouter, usePathname } from '@/i18n/navigation';
import { authService } from '@/services/authService';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: string[];
  redirectTo?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({
  children,
  allowedRoles = [],
  redirectTo = '/login',
}) => {
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const checkAuth = () => {
      const isAuthenticated = authService.isAuthenticated();
      
      if (!isAuthenticated) {
        // Store the attempted URL to redirect after login
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('redirectAfterLogin', pathname);
        }
        router.push(redirectTo);
        return;
      }

      // Check role-based access if roles are specified
      if (allowedRoles.length > 0) {
        const userData = authService.getCurrentUser();
        const userRole = userData?.roles[0] || null;
        if (!userRole || !allowedRoles.includes(userRole)) {
          // Redirect to appropriate dashboard based on user role
          const dashboardPath = getDashboardPath(userRole);
          router.push(dashboardPath);
          return;
        }
      }
    };

    checkAuth();
  }, [router, pathname, allowedRoles, redirectTo]);

  // Show loading spinner while checking authentication
  const isAuthenticated = authService.isAuthenticated();
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Checking authentication...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
};

// Helper function to get dashboard path based on role
const getDashboardPath = (role: string | null): string => {
  switch (role) {
    case 'ROLE_ADMIN':
      return '/dashboard/admin';
    case 'ROLE_CONTRACTOR':
      return '/dashboard/contractor';
    case 'ROLE_CITIZEN':
    default:
      return '/dashboard/citizen';
  }
};

export default ProtectedRoute;
