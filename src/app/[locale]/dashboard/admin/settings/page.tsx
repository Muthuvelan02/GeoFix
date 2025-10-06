"use client";

import { useState, useEffect } from "react";
import CollapsibleSidebar from "@/components/CollapsibleSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { authService } from "@/services/authService";
import {
    Settings,
    User,
    Bell,
    Shield,
    Mail,
    Lock,
    CheckCircle,
    AlertCircle,
    Save,
} from "lucide-react";

export default function AdminSettingsPage() {
    const [user, setUser] = useState<any>(null);
    const [saveSuccess, setSaveSuccess] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Profile settings
    const [profileData, setProfileData] = useState({
        name: "",
        email: "",
        mobile: "",
    });

    // Notification settings
    const [notifications, setNotifications] = useState({
        emailNotifications: true,
        ticketAssignments: true,
        contractorVerifications: true,
        systemAlerts: true,
        weeklyReports: false,
    });

    // Security settings
    const [security, setSecurity] = useState({
        twoFactorAuth: false,
        sessionTimeout: "30",
    });

    useEffect(() => {
        const currentUser = authService.getCurrentUser();
        if (currentUser) {
            setUser(currentUser);
            // Load user profile data from backend if available
            setProfileData({
                name: "",
                email: "",
                mobile: "",
            });
        }
    }, []);

    const handleProfileSave = () => {
        try {
            setSaveSuccess(true);
            setError(null);
            setTimeout(() => setSaveSuccess(false), 3000);
            // TODO: Implement profile update API call
            console.log("Profile data:", profileData);
        } catch (err: any) {
            setError("Failed to save profile settings");
        }
    };

    const handleNotificationsSave = () => {
        try {
            setSaveSuccess(true);
            setError(null);
            setTimeout(() => setSaveSuccess(false), 3000);
            // TODO: Implement notifications update API call
            console.log("Notification settings:", notifications);
        } catch (err: any) {
            setError("Failed to save notification settings");
        }
    };

    const handleSecuritySave = () => {
        try {
            setSaveSuccess(true);
            setError(null);
            setTimeout(() => setSaveSuccess(false), 3000);
            // TODO: Implement security update API call
            console.log("Security settings:", security);
        } catch (err: any) {
            setError("Failed to save security settings");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <CollapsibleSidebar userRole="admin" locale="en" user={user} />

            <div className="lg:ml-64">
                <div className="p-4 sm:p-6 lg:p-8">
                    {/* Header */}
                    <div className="mb-6">
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
                            Settings
                        </h1>
                        <p className="text-gray-600 dark:text-gray-400">
                            Manage your account settings and preferences
                        </p>
                    </div>

                    {/* Success/Error Alerts */}
                    {saveSuccess && (
                        <Alert className="mb-6 border-green-500 bg-green-50 dark:bg-green-900/20">
                            <CheckCircle className="h-4 w-4 text-green-600" />
                            <AlertDescription className="text-green-600">
                                Settings saved successfully!
                            </AlertDescription>
                        </Alert>
                    )}

                    {error && (
                        <Alert variant="destructive" className="mb-6">
                            <AlertCircle className="h-4 w-4" />
                            <AlertDescription>{error}</AlertDescription>
                        </Alert>
                    )}

                    <div className="space-y-6">
                        {/* Profile Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <User className="h-5 w-5" />
                                    Profile Information
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="name">Full Name</Label>
                                        <Input
                                            id="name"
                                            value={profileData.name}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, name: e.target.value })
                                            }
                                            placeholder="Enter your name"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="email">Email Address</Label>
                                        <Input
                                            id="email"
                                            type="email"
                                            value={profileData.email}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, email: e.target.value })
                                            }
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mobile">Mobile Number</Label>
                                        <Input
                                            id="mobile"
                                            value={profileData.mobile}
                                            onChange={(e) =>
                                                setProfileData({ ...profileData, mobile: e.target.value })
                                            }
                                            placeholder="Enter your mobile number"
                                        />
                                    </div>
                                </div>
                                <Separator />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleProfileSave}
                                        className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Profile
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Notification Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Bell className="h-5 w-5" />
                                    Notification Preferences
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Email Notifications</Label>
                                        <p className="text-sm text-gray-500">
                                            Receive notifications via email
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.emailNotifications}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, emailNotifications: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Ticket Assignments</Label>
                                        <p className="text-sm text-gray-500">
                                            Get notified when tickets are assigned
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.ticketAssignments}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, ticketAssignments: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Contractor Verifications</Label>
                                        <p className="text-sm text-gray-500">
                                            Alerts for new contractor registrations
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.contractorVerifications}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, contractorVerifications: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>System Alerts</Label>
                                        <p className="text-sm text-gray-500">
                                            Important system notifications
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.systemAlerts}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, systemAlerts: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Weekly Reports</Label>
                                        <p className="text-sm text-gray-500">
                                            Receive weekly performance reports
                                        </p>
                                    </div>
                                    <Switch
                                        checked={notifications.weeklyReports}
                                        onCheckedChange={(checked) =>
                                            setNotifications({ ...notifications, weeklyReports: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleNotificationsSave}
                                        className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Preferences
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Security Settings */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Shield className="h-5 w-5" />
                                    Security Settings
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <div className="space-y-0.5">
                                        <Label>Two-Factor Authentication</Label>
                                        <p className="text-sm text-gray-500">
                                            Add an extra layer of security to your account
                                        </p>
                                    </div>
                                    <Switch
                                        checked={security.twoFactorAuth}
                                        onCheckedChange={(checked) =>
                                            setSecurity({ ...security, twoFactorAuth: checked })
                                        }
                                    />
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                                    <Input
                                        id="sessionTimeout"
                                        type="number"
                                        value={security.sessionTimeout}
                                        onChange={(e) =>
                                            setSecurity({ ...security, sessionTimeout: e.target.value })
                                        }
                                        className="max-w-xs"
                                    />
                                    <p className="text-sm text-gray-500">
                                        Automatically log out after period of inactivity
                                    </p>
                                </div>
                                <Separator />
                                <div className="space-y-2">
                                    <Label>Change Password</Label>
                                    <Button
                                        variant="outline"
                                        className="cursor-pointer"
                                        onClick={() => alert("Password change functionality coming soon!")}
                                    >
                                        <Lock className="h-4 w-4 mr-2" />
                                        Update Password
                                    </Button>
                                </div>
                                <Separator />
                                <div className="flex justify-end">
                                    <Button
                                        onClick={handleSecuritySave}
                                        className="bg-orange-600 hover:bg-orange-700 cursor-pointer"
                                    >
                                        <Save className="h-4 w-4 mr-2" />
                                        Save Security Settings
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
}
