'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    Shield,
    ArrowLeft,
    Eye,
    EyeOff,
    AlertCircle,
    CheckCircle
} from 'lucide-react';
import { authService } from '@/services/authService';

export default function AdminLoginPage() {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await authService.login(formData);

            // Check if user has admin or superadmin role
            const userRoles = response.roles || [];
            const isAdmin = userRoles.includes('ROLE_ADMIN') || userRoles.includes('ROLE_SUPERADMIN');

            if (!isAdmin) {
                setError('Access denied. This portal is for administrators only.');
                return;
            }

            // Redirect based on role
            if (userRoles.includes('ROLE_SUPERADMIN')) {
                router.push('/dashboard/superadmin');
            } else if (userRoles.includes('ROLE_ADMIN')) {
                router.push('/dashboard/admin');
            } else {
                router.push('/dashboard');
            }
        } catch (err: any) {
            setError(err.message || 'Login failed. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <Shield className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900">GeoFix Admin</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Administrative Login
                    </h1>
                    <p className="text-gray-600">
                        Access the administrative portal with your credentials
                    </p>
                </div>

                {/* Login Form */}
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your admin credentials to access the portal
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    placeholder="admin@example.com"
                                    required
                                    className="w-full"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <div className="relative">
                                    <Input
                                        id="password"
                                        name="password"
                                        type={showPassword ? 'text' : 'password'}
                                        value={formData.password}
                                        onChange={handleInputChange}
                                        placeholder="Enter your password"
                                        required
                                        className="w-full pr-10"
                                    />
                                    <button
                                        type="button"
                                        onClick={() => setShowPassword(!showPassword)}
                                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                                    >
                                        {showPassword ? (
                                            <EyeOff className="h-4 w-4" />
                                        ) : (
                                            <Eye className="h-4 w-4" />
                                        )}
                                    </button>
                                </div>
                            </div>

                            <Button
                                type="submit"
                                className="w-full bg-blue-600 hover:bg-blue-700"
                                disabled={loading}
                            >
                                {loading ? 'Signing In...' : 'Sign In'}
                            </Button>
                        </form>

                        <div className="mt-6 text-center">
                            <Button
                                variant="ghost"
                                onClick={() => router.push('/public')}
                                className="text-gray-600 hover:text-gray-800"
                            >
                                <ArrowLeft className="h-4 w-4 mr-2" />
                                Back to Public Portal
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* Admin Roles Info */}
                <div className="mt-8">
                    <Card className="bg-blue-50 border-blue-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-blue-900 mb-2">
                                    Authorized Access Only
                                </h3>
                                <p className="text-blue-700 text-sm mb-4">
                                    This portal is restricted to verified administrators
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-blue-800">SuperAdmin</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <CheckCircle className="h-4 w-4 text-green-600" />
                                        <span className="text-blue-800">Admin</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
