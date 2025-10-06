"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Shield, Crown, Users } from "lucide-react"

export default function AdminLoginSelection() {
    const t = useTranslations()

    const adminRoles = [
        {
            id: "admin",
            label: "System Administrator",
            description: "Manage contractors, users, and system operations",
            color: "#DC2626", // red-600
            icon: Shield,
            href: "/login/admin", // Use existing admin login
            features: [
                "Contractor verification",
                "User management",
                "System monitoring",
                "Ticket oversight"
            ]
        },
        {
            id: "superadmin",
            label: "Super Administrator",
            description: "Full system control and configuration access",
            color: "#7C2D12", // red-900
            icon: Crown,
            href: "/admin/login/superadmin",
            features: [
                "Complete system control",
                "Admin user management",
                "System configuration",
                "Database administration"
            ]
        }
    ]

    return (
        <div className="min-h-screen bg-gradient-to-br from-red-50 to-gray-100 dark:from-red-900/20 dark:to-gray-800 flex items-center justify-center p-4">
            <div className="w-full max-w-4xl space-y-6">
                {/* Language Switcher */}
                <div className="flex justify-end">
                    <LanguageSwitcher />
                </div>

                {/* Back to Admin Portal Link */}
                <Link
                    href="/admin"
                    className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors"
                >
                    <ArrowLeft className="h-4 w-4" />
                    <span className="text-sm font-medium">Back to Admin Portal</span>
                </Link>

                {/* Header */}
                <div className="text-center space-y-4">
                    <div className="flex items-center justify-center gap-3">
                        <Shield className="h-8 w-8 text-red-600" />
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
                            Admin Access
                        </h1>
                    </div>
                    <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                        Choose your administrative access level to continue to the GeoFix management system
                    </p>
                </div>

                {/* Role Selection Cards */}
                <div className="grid md:grid-cols-2 gap-6">
                    {adminRoles.map((role) => (
                        <Card
                            key={role.id}
                            className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-red-300 dark:hover:border-red-700 bg-white dark:bg-gray-800"
                        >
                            <CardHeader className="text-center pb-4">
                                <div
                                    className="w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300"
                                    style={{ backgroundColor: `${role.color}15` }}
                                >
                                    <role.icon
                                        className="h-8 w-8"
                                        style={{ color: role.color }}
                                    />
                                </div>
                                <CardTitle className="text-xl font-semibold text-gray-900 dark:text-white">
                                    {role.label}
                                </CardTitle>
                                <p className="text-gray-600 dark:text-gray-300 text-sm">
                                    {role.description}
                                </p>
                            </CardHeader>

                            <CardContent className="space-y-4">
                                {/* Features List */}
                                <div className="space-y-2">
                                    <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                                        Access Includes:
                                    </h4>
                                    <ul className="space-y-1">
                                        {role.features.map((feature, index) => (
                                            <li
                                                key={index}
                                                className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400"
                                            >
                                                <div
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: role.color }}
                                                />
                                                {feature}
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {/* Login Button */}
                                <Button
                                    asChild
                                    className="w-full group-hover:scale-105 transition-transform duration-300"
                                    style={{
                                        backgroundColor: role.color,
                                        borderColor: role.color
                                    }}
                                >
                                    <Link href={role.href}>
                                        <role.icon className="mr-2 h-4 w-4" />
                                        Login as {role.label.split(' ')[0]}
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>

                {/* Additional Info */}
                <div className="text-center space-y-3 pt-6 border-t border-gray-200 dark:border-gray-700">
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                        Don't have an account?
                    </p>
                    <div className="flex items-center justify-center gap-6 text-sm">
                        <Link
                            href="/admin/register"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                        >
                            Register as Admin
                        </Link>
                        <span className="text-gray-400">•</span>
                        <Link
                            href="/admin/register/superadmin"
                            className="text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 font-medium transition-colors"
                        >
                            Register as Superadmin
                        </Link>
                    </div>
                    <div className="flex items-center justify-center gap-4 text-xs text-gray-400 dark:text-gray-500 pt-2">
                        <Link href="/" className="hover:text-red-600 transition-colors">
                            Public Portal
                        </Link>
                        <span>•</span>
                        <Link href="/admin" className="hover:text-red-600 transition-colors">
                            Admin Portal
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    )
}
