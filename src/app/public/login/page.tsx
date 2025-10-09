'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import {
    MapPin,
    ArrowLeft,
    Eye,
    EyeOff,
    AlertCircle,
    Users,
    Wrench
} from 'lucide-react';
import { authService } from '@/services/authService';

export default function PublicLoginPage() {
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

            // Check if user has citizen or contractor role
            const userRoles = response.roles || [];
            const isPublicUser = userRoles.includes('ROLE_CITIZEN') || userRoles.includes('ROLE_CONTRACTOR');

            if (!isPublicUser) {
                setError('Access denied. This portal is for citizens and contractors only.');
                return;
            }

            // Redirect based on role
            if (userRoles.includes('ROLE_CITIZEN')) {
                router.push('/dashboard/citizen');
            } else if (userRoles.includes('ROLE_CONTRACTOR')) {
                router.push('/dashboard/contractor');
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
        <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center space-x-2 mb-4">
                        <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
                            <MapPin className="h-7 w-7 text-white" />
                        </div>
                        <span className="text-3xl font-bold text-gray-900">GeoFix</span>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-900 mb-2">
                        Public Portal Login
                    </h1>
                    <p className="text-gray-600">
                        Access your account to report issues or manage work
                    </p>
                </div>

                {/* Login Form */}
                <Card className="shadow-lg">
                    <CardHeader className="text-center">
                        <CardTitle className="text-xl">Sign In</CardTitle>
                        <CardDescription>
                            Enter your credentials to access your account
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
                                    placeholder="your@email.com"
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
                                Back to Home
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                {/* User Types Info */}
                <div className="mt-8">
                    <Card className="bg-green-50 border-green-200">
                        <CardContent className="pt-6">
                            <div className="text-center">
                                <h3 className="text-lg font-semibold text-green-900 mb-2">
                                    Public Portal Access
                                </h3>
                                <p className="text-green-700 text-sm mb-4">
                                    This portal is for citizens and contractors
                                </p>
                                <div className="grid grid-cols-2 gap-4 text-sm">
                                    <div className="flex items-center space-x-2">
                                        <Users className="h-4 w-4 text-blue-600" />
                                        <span className="text-green-800">Citizens</span>
                                    </div>
                                    <div className="flex items-center space-x-2">
                                        <Wrench className="h-4 w-4 text-orange-600" />
                                        <span className="text-green-800">Contractors</span>
                                    </div>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Admin Portal Link */}
                <div className="mt-4 text-center">
                    <Button
                        variant="outline"
                        onClick={() => router.push('/admin')}
                        className="text-gray-600 hover:text-gray-800"
                    >
                        Admin Portal Access
                    </Button>
                </div>
            </div>
        </div>
    );
}
