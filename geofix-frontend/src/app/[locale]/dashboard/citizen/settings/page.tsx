"use client"

import React, { useState, useEffect } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
    Settings,
    Bell,
    Shield,
    Globe,
    Moon,
    Sun,
    Smartphone,
    Mail,
    ArrowLeft,
    Save,
    Eye,
    EyeOff,
    MapPin,
    Clock
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { useTheme } from "next-themes"

interface SettingsData {
    notifications: {
        email: boolean
        sms: boolean
        push: boolean
        updates: boolean
        marketing: boolean
    }
    privacy: {
        profileVisible: boolean
        locationSharing: boolean
        dataSharing: boolean
    }
    preferences: {
        language: string
        theme: string
        timezone: string
        autoLocation: boolean
    }
}

export default function CitizenSettings() {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()
    const { theme, setTheme } = useTheme()

    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState<string | null>(null)
    const [showPassword, setShowPassword] = useState(false)

    const [settings, setSettings] = useState<SettingsData>({
        notifications: {
            email: true,
            sms: false,
            push: true,
            updates: true,
            marketing: false
        },
        privacy: {
            profileVisible: true,
            locationSharing: true,
            dataSharing: false
        },
        preferences: {
            language: locale,
            theme: theme || 'system',
            timezone: 'Asia/Kolkata',
            autoLocation: true
        }
    })

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push(`/${locale}/login/citizen`)
            return
        }

        // Verify user has CITIZEN role
        const userRole = userData.roles[0]
        if (userRole !== 'ROLE_CITIZEN') {
            if (userRole === 'ROLE_ADMIN') {
                router.push(`/${locale}/dashboard/admin`)
            } else if (userRole === 'ROLE_CONTRACTOR') {
                router.push(`/${locale}/dashboard/contractor`)
            } else {
                authService.logout()
                router.push(`/${locale}/login/citizen`)
            }
            return
        }

        loadSettingsData()
    }, [locale, router])

    const loadSettingsData = async () => {
        setLoading(true)
        setError(null)

        try {
            // Get profile data
            const profile = await authService.getProfile()
            setUser(profile)

            // Load saved settings from localStorage or use defaults
            const savedSettings = localStorage.getItem('citizenSettings')
            if (savedSettings) {
                setSettings({ ...settings, ...JSON.parse(savedSettings) })
            }

        } catch (err: any) {
            console.error('Error loading settings:', err)
            setError(err.message || 'Failed to load settings')
        } finally {
            setLoading(false)
        }
    }

    const handleSettingsChange = (category: keyof SettingsData, key: string, value: any) => {
        setSettings(prev => ({
            ...prev,
            [category]: {
                ...prev[category],
                [key]: value
            }
        }))
    }

    const handleSaveSettings = async () => {
        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            // Save settings to localStorage (replace with API call when available)
            localStorage.setItem('citizenSettings', JSON.stringify(settings))

            // Apply theme change immediately
            if (settings.preferences.theme !== theme) {
                setTheme(settings.preferences.theme)
            }

            setSuccess('Settings saved successfully!')
            setTimeout(() => setSuccess(null), 3000)

        } catch (err: any) {
            console.error('Error saving settings:', err)
            setError(err.message || 'Failed to save settings')
        } finally {
            setSaving(false)
        }
    }

    const handlePasswordChange = async () => {
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setError('New passwords do not match')
            return
        }

        if (passwordData.newPassword.length < 6) {
            setError('Password must be at least 6 characters long')
            return
        }

        setSaving(true)
        setError(null)
        setSuccess(null)

        try {
            // Simulate password change (replace with actual API call)
            await new Promise(resolve => setTimeout(resolve, 1000))

            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            })

            setSuccess('Password changed successfully!')
            setTimeout(() => setSuccess(null), 3000)

        } catch (err: any) {
            console.error('Error changing password:', err)
            setError(err.message || 'Failed to change password')
        } finally {
            setSaving(false)
        }
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader />
                <div className="flex">
                    <CollapsibleSidebar userRole="citizen" locale={locale} />
                    <main className="flex-1 lg:ml-64">
                        <div className="p-8">
                            <div className="animate-pulse space-y-6">
                                <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4"></div>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    <Card>
                                        <CardContent className="p-6">
                                            <div className="space-y-4">
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </div>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />

            <div className="flex">
                <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />

                <main className="flex-1 lg:ml-64 transition-all duration-300">
                    <div className="p-6 lg:p-8">
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-4">
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                                    >
                                        <ArrowLeft className="h-4 w-4 mr-2" />
                                        {t('common.back')}
                                    </Button>
                                    <div>
                                        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                            {t('settings.title')}
                                        </h1>
                                        <p className="text-gray-600 dark:text-gray-400 mt-1">
                                            {t('settings.subtitle')}
                                        </p>
                                    </div>
                                </div>

                                <Button onClick={handleSaveSettings} disabled={saving}>
                                    <Save className="h-4 w-4 mr-2" />
                                    {saving ? t('common.saving') : t('common.save')}
                                </Button>
                            </div>
                        </div>

                        {/* Success/Error Messages */}
                        {success && (
                            <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                                <p className="text-green-800 dark:text-green-200">{success}</p>
                            </div>
                        )}

                        {error && (
                            <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                                <p className="text-red-800 dark:text-red-200">{error}</p>
                            </div>
                        )}

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Notification Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Bell className="h-5 w-5" />
                                        {t('settings.notifications')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="email-notifications">{t('settings.emailNotifications')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.emailNotificationsDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="email-notifications"
                                            checked={settings.notifications.email}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('notifications', 'email', checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="sms-notifications">{t('settings.smsNotifications')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.smsNotificationsDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="sms-notifications"
                                            checked={settings.notifications.sms}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('notifications', 'sms', checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="push-notifications">{t('settings.pushNotifications')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.pushNotificationsDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="push-notifications"
                                            checked={settings.notifications.push}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('notifications', 'push', checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="updates-notifications">{t('settings.updateNotifications')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.updateNotificationsDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="updates-notifications"
                                            checked={settings.notifications.updates}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('notifications', 'updates', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Privacy Settings */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        {t('settings.privacy')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="profile-visible">{t('settings.profileVisibility')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.profileVisibilityDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="profile-visible"
                                            checked={settings.privacy.profileVisible}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('privacy', 'profileVisible', checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="location-sharing">{t('settings.locationSharing')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.locationSharingDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="location-sharing"
                                            checked={settings.privacy.locationSharing}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('privacy', 'locationSharing', checked)
                                            }
                                        />
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="data-sharing">{t('settings.dataSharing')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.dataSharingDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="data-sharing"
                                            checked={settings.privacy.dataSharing}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('privacy', 'dataSharing', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Preferences */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Settings className="h-5 w-5" />
                                        {t('settings.preferences')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="language">{t('settings.language')}</Label>
                                        <Select
                                            value={settings.preferences.language}
                                            onValueChange={(value) =>
                                                handleSettingsChange('preferences', 'language', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('settings.selectLanguage')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="en">English</SelectItem>
                                                <SelectItem value="hi">हिंदी (Hindi)</SelectItem>
                                                <SelectItem value="mr">मराठी (Marathi)</SelectItem>
                                                <SelectItem value="ta">தமிழ் (Tamil)</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="theme">{t('settings.theme')}</Label>
                                        <Select
                                            value={settings.preferences.theme}
                                            onValueChange={(value) =>
                                                handleSettingsChange('preferences', 'theme', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('settings.selectTheme')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="light">
                                                    <div className="flex items-center">
                                                        <Sun className="h-4 w-4 mr-2" />
                                                        {t('settings.lightMode')}
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="dark">
                                                    <div className="flex items-center">
                                                        <Moon className="h-4 w-4 mr-2" />
                                                        {t('settings.darkMode')}
                                                    </div>
                                                </SelectItem>
                                                <SelectItem value="system">
                                                    <div className="flex items-center">
                                                        <Smartphone className="h-4 w-4 mr-2" />
                                                        {t('settings.systemMode')}
                                                    </div>
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="timezone">{t('settings.timezone')}</Label>
                                        <Select
                                            value={settings.preferences.timezone}
                                            onValueChange={(value) =>
                                                handleSettingsChange('preferences', 'timezone', value)
                                            }
                                        >
                                            <SelectTrigger>
                                                <SelectValue placeholder={t('settings.selectTimezone')} />
                                            </SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                                <SelectItem value="Asia/Mumbai">Asia/Mumbai (IST)</SelectItem>
                                                <SelectItem value="UTC">UTC</SelectItem>
                                            </SelectContent>
                                        </Select>
                                    </div>

                                    <Separator />

                                    <div className="flex items-center justify-between">
                                        <div>
                                            <Label htmlFor="auto-location">{t('settings.autoLocation')}</Label>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {t('settings.autoLocationDesc')}
                                            </p>
                                        </div>
                                        <Switch
                                            id="auto-location"
                                            checked={settings.preferences.autoLocation}
                                            onCheckedChange={(checked: boolean) =>
                                                handleSettingsChange('preferences', 'autoLocation', checked)
                                            }
                                        />
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Password Change */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5" />
                                        {t('settings.changePassword')}
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="space-y-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="current-password">{t('settings.currentPassword')}</Label>
                                        <div className="relative">
                                            <Input
                                                id="current-password"
                                                type={showPassword ? "text" : "password"}
                                                value={passwordData.currentPassword}
                                                onChange={(e) => setPasswordData({
                                                    ...passwordData,
                                                    currentPassword: e.target.value
                                                })}
                                                placeholder={t('settings.currentPasswordPlaceholder')}
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="sm"
                                                className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                                                onClick={() => setShowPassword(!showPassword)}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-4 w-4" />
                                                ) : (
                                                    <Eye className="h-4 w-4" />
                                                )}
                                            </Button>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="new-password">{t('settings.newPassword')}</Label>
                                        <Input
                                            id="new-password"
                                            type="password"
                                            value={passwordData.newPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                newPassword: e.target.value
                                            })}
                                            placeholder={t('settings.newPasswordPlaceholder')}
                                        />
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="confirm-password">{t('settings.confirmPassword')}</Label>
                                        <Input
                                            id="confirm-password"
                                            type="password"
                                            value={passwordData.confirmPassword}
                                            onChange={(e) => setPasswordData({
                                                ...passwordData,
                                                confirmPassword: e.target.value
                                            })}
                                            placeholder={t('settings.confirmPasswordPlaceholder')}
                                        />
                                    </div>

                                    <Button
                                        onClick={handlePasswordChange}
                                        disabled={saving || !passwordData.currentPassword || !passwordData.newPassword}
                                        className="w-full"
                                    >
                                        {saving ? t('common.saving') : t('settings.updatePassword')}
                                    </Button>
                                </CardContent>
                            </Card>
                        </div>
                    </div>

                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}