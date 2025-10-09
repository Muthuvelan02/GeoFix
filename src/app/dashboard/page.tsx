'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { authService } from '@/services/authService';

export default function DashboardPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const checkUserAndRedirect = async () => {
            try {
                const user = await authService.getCurrentUser();

                if (!user) {
                    router.push('/public/login');
                    return;
                }

                const roles = user.roles || [];

                // Redirect based on role
                if (roles.includes('ROLE_SUPERADMIN')) {
                    router.push('/dashboard/superadmin');
                } else if (roles.includes('ROLE_ADMIN')) {
                    router.push('/dashboard/admin');
                } else if (roles.includes('ROLE_CONTRACTOR')) {
                    router.push('/dashboard/contractor');
                } else if (roles.includes('ROLE_CITIZEN')) {
                    router.push('/dashboard/citizen');
                } else if (roles.includes('ROLE_WORKER')) {
                    router.push('/dashboard/worker');
                } else {
                    // Unknown role, redirect to public login
                    router.push('/public/login');
                }
            } catch (error) {
                console.error('Error checking user:', error);
                router.push('/public/login');
            } finally {
                setLoading(false);
            }
        };

        checkUserAndRedirect();
    }, [router]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                    <p className="text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return null;
}
