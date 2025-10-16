"use client"

import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "@/i18n/navigation"
import { Crown, Shield, AlertTriangle, Check, X } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import DashboardHeader from "@/components/DashboardHeader"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import superadminService from "@/services/superadminService"

export default function SuperadminDashboard() {
    const router = useRouter()
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [pendingAdmins, setPendingAdmins] = useState<any[]>([])
    const [error, setError] = useState<string | null>(null)
    const [processingId, setProcessingId] = useState<number | null>(null)

    useEffect(() => {
        const initializeSuperadmin = async () => {
            try {
                const userData = authService.getCurrentUser()
                if (!userData) {
                    router.push("/admin/login")
                    return
                }

                // Verify user has SUPERADMIN role
                const userRole = userData.roles[0]
                if (userRole !== 'ROLE_SUPERADMIN') {
                    // Redirect to appropriate dashboard
                    if (userRole === 'ROLE_ADMIN') {
                        router.push("/dashboard/admin")
                    } else if (userRole === 'ROLE_CITIZEN') {
                        router.push("/dashboard/citizen")
                    } else if (userRole === 'ROLE_CONTRACTOR') {
                        router.push("/dashboard/contractor")
                    } else {
                        authService.logout()
                        router.push("/admin/login")
                    }
                    return
                }

                // Get user profile data
                try {
                    const profile = await authService.getUserProfile()
                    setUser(profile)
                } catch (profileError) {
                    // Fallback to basic user data
                    setUser({
                        id: userData.userId,
                        name: 'Super Administrator',
                        email: 'superadmin@geofix.com',
                        roles: userData.roles
                    })
                }

                try {
                    const list = await superadminService.getPendingAdmins()
                    setPendingAdmins(Array.isArray(list) ? list : [])
                } catch (loadErr: any) {
                    console.error('Error loading pending admins:', loadErr)
                    setError(loadErr.message || 'Failed to load pending admins')
                }

            } catch (error) {
                console.error('Error initializing superadmin dashboard:', error)
                setError('Failed to initialize dashboard')
            } finally {
                setLoading(false)
            }
        }

        initializeSuperadmin()
    }, [router])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-900/20 via-gray-900 to-black">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-red-200">Loading Super Admin Dashboard...</span>
                </div>
            </div>
        )
    }

    return (
        <>
            <Head>
                <title>Super Admin Dashboard - GeoFix</title>
                <meta name="description" content="Super administrator dashboard for complete system management" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-red-900/20 via-gray-900 to-black">
                <DashboardHeader
                    userRole="superadmin"
                    userName={user?.name || "Super Admin"}
                    userEmail={user?.email || "superadmin@example.com"}
                    notificationCount={0}
                    onLogout={() => {
                        authService.logout()
                        router.push("/login/admin")
                    }}
                />

                <div className="flex">
                    <CollapsibleSidebar userRole="superadmin" locale="en" user={user} />

                    <main className="flex-1 p-6 lg:p-8">
                        {error && (
                            <Alert className="mb-6 border-red-800 bg-red-900/20">
                                <AlertTriangle className="h-4 w-4" />
                                <AlertDescription className="text-red-200">
                                    {error}
                                </AlertDescription>
                            </Alert>
                        )}

                        {/* Header */}
                        <div className="mb-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-12 h-12 bg-red-900/30 rounded-full flex items-center justify-center">
                                    <Crown className="h-6 w-6 text-red-400" />
                                </div>
                                <div>
                                    <h1 className="text-2xl font-bold text-white">Superadmin - Admin Approvals</h1>
                                    <p className="text-red-200">Approve or reject new admin registrations</p>
                                </div>
                            </div>
                            <Badge className="bg-red-900/30 text-red-400 border-red-800">
                                🔒 Maximum Security Clearance
                            </Badge>
                        </div>

                        {/* Pending Admin Approvals */}
                        <Card className="border-red-800 bg-gray-900/50 backdrop-blur">
                            <CardHeader>
                                <CardTitle className="text-white">Pending Admin Approvals</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {pendingAdmins.length === 0 ? (
                                    <div className="text-center py-10 text-red-200">No pending admin registrations.</div>
                                ) : (
                                    <div className="overflow-x-auto">
                                        <table className="w-full text-sm">
                                            <thead>
                                                <tr className="text-left text-red-200">
                                                    <th className="py-2 pr-4">Name</th>
                                                    <th className="py-2 pr-4">Email</th>
                                                    <th className="py-2 pr-4">Department</th>
                                                    <th className="py-2 pr-4">Employee ID</th>
                                                    <th className="py-2 pr-4">Actions</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {pendingAdmins.map((admin) => (
                                                    <tr key={admin.id} className="border-t border-red-900/40">
                                                        <td className="py-2 pr-4 text-white">{admin.name}</td>
                                                        <td className="py-2 pr-4 text-red-200">{admin.email}</td>
                                                        <td className="py-2 pr-4 text-red-200">{admin.department || '-'}</td>
                                                        <td className="py-2 pr-4 text-red-200">{admin.employeeId || '-'}</td>
                                                        <td className="py-2 pr-4">
                                                            <div className="flex items-center gap-2">
                                                                <Button
                                                                    size="sm"
                                                                    className="bg-green-600 hover:bg-green-700 text-white"
                                                                    disabled={processingId === admin.id}
                                                                    onClick={async () => {
                                                                        try {
                                                                            setProcessingId(admin.id)
                                                                            await superadminService.verifyAdmin(admin.id, 'VERIFIED')
                                                                            setPendingAdmins(prev => prev.filter(a => a.id !== admin.id))
                                                                        } catch (e: any) {
                                                                            setError(e.message || 'Failed to approve admin')
                                                                        } finally {
                                                                            setProcessingId(null)
                                                                        }
                                                                    }}
                                                                >
                                                                    <Check className="h-4 w-4 mr-1" /> Approve
                                                                </Button>
                                                                <Button
                                                                    size="sm"
                                                                    variant="outline"
                                                                    className="border-red-800 text-red-300 hover:bg-red-900/20"
                                                                    disabled={processingId === admin.id}
                                                                    onClick={async () => {
                                                                        try {
                                                                            setProcessingId(admin.id)
                                                                            await superadminService.verifyAdmin(admin.id, 'REJECTED')
                                                                            setPendingAdmins(prev => prev.filter(a => a.id !== admin.id))
                                                                        } catch (e: any) {
                                                                            setError(e.message || 'Failed to reject admin')
                                                                        } finally {
                                                                            setProcessingId(null)
                                                                        }
                                                                    }}
                                                                >
                                                                    <X className="h-4 w-4 mr-1" /> Reject
                                                                </Button>
                                                            </div>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        <DashboardFooter />
                    </main>
                </div>
            </div>
        </>
    )
}
