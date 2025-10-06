"use client"
import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import BackToTop from "@/components/BackToTop"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Nav from "./nav"
import Image from "next/image"
import {
    Shield,
    Users,
    BarChart3,
    Settings,
    Database,
    Lock,
    Activity,
    Globe,
    ArrowLeft,
    CheckCircle2,
    TrendingUp,
    UserCheck,
    AlertTriangle,
} from "lucide-react"

export default function AdminPortal() {
    const t = useTranslations()
    const locale = useLocale()

    return (
        <div
            key={locale}
            className="select-none min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950"
        >
            <Nav />

            {/* Hero Section */}
            <section className="relative overflow-hidden py-20 lg:py-32">
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/5 via-transparent to-blue-600/5"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(239,68,68,0.05),transparent_50%)]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(59,130,246,0.05),transparent_50%)]"></div>

                <div className="cursor-default container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-16 items-center">
                        <div className="space-y-8">
                            <div className="flex items-center gap-3 mb-6">
                                <Link href="/" className="flex items-center gap-2 text-blue-600 hover:text-blue-700 transition-colors">
                                    <ArrowLeft className="h-5 w-5" />
                                    <span className="text-sm font-medium">Back to Public Portal</span>
                                </Link>
                            </div>

                            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                                <span className="bg-gradient-to-r from-red-600 to-blue-600 bg-clip-text text-transparent">
                                    Admin
                                </span>{" "}
                                <span className="text-gray-900 dark:text-white">Portal</span>
                            </h1>

                            <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed">
                                System administration and management dashboard for GeoFix infrastructure platform
                            </p>

                            <div className="flex flex-col sm:flex-row gap-4">
                                <Button
                                    asChild
                                    size="lg"
                                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white px-8 py-3 text-lg font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                                >
                                    <Link href="/admin/login">
                                        <Shield className="mr-2 h-5 w-5" />
                                        Access Admin System
                                    </Link>
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    asChild
                                    className="border-2 border-gray-300 hover:border-red-300 px-8 py-3 text-lg font-semibold"
                                >
                                    <Link href="#features">
                                        <BarChart3 className="mr-2 h-5 w-5" />
                                        View System Overview
                                    </Link>
                                </Button>
                            </div>
                        </div>

                        <div className="relative">
                            <div className="relative z-10 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
                                <div className="grid grid-cols-2 gap-6">
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-red-100 dark:bg-red-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Users className="h-8 w-8 text-red-600 dark:text-red-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">156</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Total Users</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <Activity className="h-8 w-8 text-blue-600 dark:text-blue-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">47</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Active Tickets</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <UserCheck className="h-8 w-8 text-green-600 dark:text-green-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">8</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">Verified Contractors</div>
                                    </div>
                                    <div className="text-center">
                                        <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-xl flex items-center justify-center mx-auto mb-3">
                                            <TrendingUp className="h-8 w-8 text-orange-600 dark:text-orange-400" />
                                        </div>
                                        <div className="text-2xl font-bold text-gray-900 dark:text-white">92%</div>
                                        <div className="text-sm text-gray-600 dark:text-gray-400">System Uptime</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* Admin Features Section */}
            <section id="features" className="py-20 bg-white dark:bg-gray-900">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            Administrative <span className="text-red-600">Features</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto">
                            Comprehensive system management tools for efficient infrastructure administration
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {[
                            {
                                icon: Users,
                                title: "User Management",
                                description: "Manage citizens, contractors, and workers with role-based access control",
                                color: "red"
                            },
                            {
                                icon: UserCheck,
                                title: "Contractor Verification",
                                description: "Review and approve contractor applications with detailed verification workflow",
                                color: "blue"
                            },
                            {
                                icon: BarChart3,
                                title: "Analytics Dashboard",
                                description: "Real-time system analytics and performance monitoring with detailed insights",
                                color: "green"
                            },
                            {
                                icon: Settings,
                                title: "System Configuration",
                                description: "Configure system settings, parameters, and operational policies",
                                color: "purple"
                            },
                            {
                                icon: Database,
                                title: "Data Management",
                                description: "Manage system data, backups, and database administration tools",
                                color: "orange"
                            },
                            {
                                icon: Lock,
                                title: "Security Center",
                                description: "Monitor security events, manage permissions, and audit system access",
                                color: "indigo"
                            }
                        ].map((feature, index) => (
                            <Card key={index} className="group hover:shadow-xl transition-all duration-300 border-2 hover:border-red-200 dark:hover:border-red-800">
                                <CardContent className="p-8">
                                    <div className={`w-16 h-16 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                                        <feature.icon className={`h-8 w-8 text-${feature.color}-600 dark:text-${feature.color}-400`} />
                                    </div>
                                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                                        {feature.description}
                                    </p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* System Status Section */}
            <section className="py-20 bg-gray-50 dark:bg-gray-800">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center mb-16">
                        <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
                            System <span className="text-red-600">Status</span>
                        </h2>
                        <p className="text-xl text-gray-600 dark:text-gray-300">
                            Real-time overview of GeoFix platform health and performance
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {[
                            { label: "System Health", value: "Operational", status: "success", icon: CheckCircle2 },
                            { label: "Active Admins", value: "3", status: "info", icon: Shield },
                            { label: "Pending Issues", value: "2", status: "warning", icon: AlertTriangle },
                            { label: "Last Backup", value: "2h ago", status: "success", icon: Database }
                        ].map((stat, index) => (
                            <Card key={index} className="text-center border-2">
                                <CardContent className="p-6">
                                    <div className={`w-12 h-12 mx-auto mb-4 rounded-full flex items-center justify-center ${stat.status === 'success' ? 'bg-green-100 dark:bg-green-900/30' :
                                            stat.status === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30' :
                                                'bg-blue-100 dark:bg-blue-900/30'
                                        }`}>
                                        <stat.icon className={`h-6 w-6 ${stat.status === 'success' ? 'text-green-600 dark:text-green-400' :
                                                stat.status === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                                                    'text-blue-600 dark:text-blue-400'
                                            }`} />
                                    </div>
                                    <div className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        {stat.value}
                                    </div>
                                    <div className="text-sm text-gray-600 dark:text-gray-400">
                                        {stat.label}
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gradient-to-r from-red-600 to-blue-600">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
                        Ready to Manage the System?
                    </h2>
                    <p className="text-xl text-red-100 mb-8 max-w-2xl mx-auto">
                        Access the administrative dashboard to manage users, verify contractors, and oversee the entire GeoFix platform
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button
                            asChild
                            size="lg"
                            className="bg-white text-red-600 hover:bg-gray-100 px-8 py-3 text-lg font-semibold"
                        >
                            <Link href="/admin/login">
                                <Shield className="mr-2 h-5 w-5" />
                                Access Admin Dashboard
                            </Link>
                        </Button>
                        <Button
                            variant="outline"
                            size="lg"
                            asChild
                            className="border-2 border-white text-white hover:bg-white hover:text-red-600 px-8 py-3 text-lg font-semibold"
                        >
                            <Link href="/">
                                <Globe className="mr-2 h-5 w-5" />
                                Back to Public Portal
                            </Link>
                        </Button>
                    </div>
                </div>
            </section>

            <BackToTop />
        </div>
    )
}
