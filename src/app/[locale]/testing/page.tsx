"use client"

import React, { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { Separator } from "@/components/ui/separator"
import { Link } from "@/i18n/navigation"
import {
    Crown,
    Shield,
    HardHat,
    Users,
    CheckCircle2,
    Clock,
    ArrowRight,
    FileText,
    UserCheck,
    Wrench,
    Activity,
    BarChart3
} from "lucide-react"

export default function TestingDashboard() {
    const [completedPhases, setCompletedPhases] = useState<number[]>([])

    const phases = [
        {
            phase: 1,
            title: "Setup Users",
            description: "Register all user roles with proper verification documents",
            color: "bg-blue-600",
            steps: [
                {
                    id: "superadmin",
                    title: "Register SuperAdmin",
                    endpoint: "POST /auth/signup",
                    role: "ROLE_SUPERADMIN",
                    icon: Crown,
                    color: "text-red-600",
                    link: "/register/superadmin",
                    description: "Complete system control and administration"
                },
                {
                    id: "admin",
                    title: "Register Admin",
                    endpoint: "POST /auth/signup",
                    role: "ROLE_ADMIN",
                    icon: Shield,
                    color: "text-orange-600",
                    link: "/register/admin",
                    description: "System administration with documents required"
                },
                {
                    id: "contractor",
                    title: "Register Contractor",
                    endpoint: "POST /auth/signup",
                    role: "ROLE_CONTRACTOR",
                    icon: HardHat,
                    color: "text-amber-600",
                    link: "/register/contractor",
                    description: "Infrastructure project execution"
                },
                {
                    id: "citizen",
                    title: "Register Citizen",
                    endpoint: "POST /auth/signup",
                    role: "ROLE_CITIZEN",
                    icon: Users,
                    color: "text-blue-600",
                    link: "/register/citizen",
                    description: "Report civic issues and track progress"
                }
            ]
        },
        {
            phase: 2,
            title: "Verification Hierarchy",
            description: "SuperAdmin verifies Admins, then Admin verifies Contractors",
            color: "bg-green-600",
            steps: [
                {
                    id: "login-superadmin",
                    title: "Login as SuperAdmin",
                    endpoint: "POST /auth/login",
                    icon: Crown,
                    color: "text-red-600",
                    link: "/admin/login/superadmin",
                    description: "Access superadmin dashboard"
                },
                {
                    id: "list-pending-admins",
                    title: "List Pending Admins",
                    endpoint: "GET /api/superadmin/admins/pending",
                    icon: Shield,
                    color: "text-orange-600",
                    link: "/dashboard/superadmin",
                    description: "View all pending admin verifications"
                },
                {
                    id: "verify-admin",
                    title: "Verify Admin",
                    endpoint: "PUT /api/superadmin/admins/{id}/verify",
                    icon: UserCheck,
                    color: "text-green-600",
                    link: "/dashboard/superadmin",
                    description: "Approve admin after document review"
                },
                {
                    id: "login-admin",
                    title: "Login as Admin",
                    endpoint: "POST /auth/login",
                    icon: Shield,
                    color: "text-orange-600",
                    link: "/admin/login",
                    description: "Access admin dashboard"
                },
                {
                    id: "list-pending-contractors",
                    title: "List Pending Contractors",
                    endpoint: "GET /api/admin/contractors/pending",
                    icon: HardHat,
                    color: "text-amber-600",
                    link: "/dashboard/admin",
                    description: "View all pending contractor applications"
                },
                {
                    id: "verify-contractor",
                    title: "Verify Contractor",
                    endpoint: "PUT /api/admin/contractors/{id}/verify",
                    icon: UserCheck,
                    color: "text-green-600",
                    link: "/dashboard/admin",
                    description: "Approve contractor after verification"
                }
            ]
        },
        {
            phase: 3,
            title: "Ticket Creation & Assignment",
            description: "Citizens create tickets, Admins assign to Contractors",
            color: "bg-purple-600",
            steps: [
                {
                    id: "login-citizen",
                    title: "Login as Citizen",
                    endpoint: "POST /auth/login",
                    icon: Users,
                    color: "text-blue-600",
                    link: "/login/citizen",
                    description: "Access citizen dashboard"
                },
                {
                    id: "create-ticket",
                    title: "Create Ticket",
                    endpoint: "POST /api/tickets",
                    icon: FileText,
                    color: "text-purple-600",
                    link: "/dashboard/citizen",
                    description: "Report civic issues with location and photos"
                },
                {
                    id: "admin-view-tickets",
                    title: "Admin View All Tickets",
                    endpoint: "GET /api/tickets",
                    icon: Shield,
                    color: "text-orange-600",
                    link: "/dashboard/admin",
                    description: "Review all submitted tickets"
                },
                {
                    id: "assign-to-contractor",
                    title: "Assign Ticket to Contractor",
                    endpoint: "PUT /api/admin/tickets/{id}/assign",
                    icon: ArrowRight,
                    color: "text-green-600",
                    link: "/dashboard/admin",
                    description: "Assign ticket to verified contractor"
                }
            ]
        },
        {
            phase: 4,
            title: "Worker Management",
            description: "Contractors create workers and manage ticket assignments",
            color: "bg-orange-600",
            steps: [
                {
                    id: "login-contractor",
                    title: "Login as Contractor",
                    endpoint: "POST /auth/login",
                    icon: HardHat,
                    color: "text-amber-600",
                    link: "/login/contractor",
                    description: "Access contractor dashboard"
                },
                {
                    id: "create-worker",
                    title: "Create Worker Account",
                    endpoint: "POST /api/contractor/workers",
                    icon: Users,
                    color: "text-blue-600",
                    link: "/dashboard/contractor",
                    description: "Create worker accounts for field work"
                },
                {
                    id: "view-workers",
                    title: "View Contractor's Workers",
                    endpoint: "GET /api/contractor/workers",
                    icon: Users,
                    color: "text-blue-600",
                    link: "/dashboard/contractor",
                    description: "Manage all created workers"
                },
                {
                    id: "view-assigned-tickets",
                    title: "View Assigned Tickets",
                    endpoint: "GET /api/contractor/tickets",
                    icon: FileText,
                    color: "text-purple-600",
                    link: "/dashboard/contractor",
                    description: "See all tickets assigned to contractor"
                },
                {
                    id: "assign-to-worker",
                    title: "Assign Ticket to Worker",
                    endpoint: "PUT /api/contractor/tickets/{id}/assign",
                    icon: ArrowRight,
                    color: "text-green-600",
                    link: "/dashboard/contractor",
                    description: "Delegate specific tickets to workers"
                }
            ]
        },
        {
            phase: 5,
            title: "Task Resolution",
            description: "Workers login and complete assigned tasks",
            color: "bg-green-600",
            steps: [
                {
                    id: "login-worker",
                    title: "Login as Worker",
                    endpoint: "POST /auth/login",
                    icon: Wrench,
                    color: "text-green-600",
                    link: "/login/worker",
                    description: "Use credentials created by contractor"
                },
                {
                    id: "view-worker-tasks",
                    title: "View Assigned Tasks",
                    endpoint: "GET /api/worker/tasks",
                    icon: Activity,
                    color: "text-blue-600",
                    link: "/dashboard/worker",
                    description: "See all tasks assigned to worker"
                },
                {
                    id: "complete-task",
                    title: "Update Task to COMPLETED",
                    endpoint: "PUT /api/worker/tasks/{id}",
                    icon: CheckCircle2,
                    color: "text-green-600",
                    link: "/dashboard/worker",
                    description: "Mark task as completed with proof"
                }
            ]
        },
        {
            phase: 6,
            title: "Monitoring",
            description: "Admin monitoring and reporting for complete system oversight",
            color: "bg-indigo-600",
            steps: [
                {
                    id: "admin-dashboard",
                    title: "View Admin Dashboard",
                    endpoint: "GET /api/admin/dashboard",
                    icon: BarChart3,
                    color: "text-indigo-600",
                    link: "/dashboard/admin",
                    description: "Comprehensive system overview"
                },
                {
                    id: "generate-reports",
                    title: "Generate Reports",
                    endpoint: "GET /api/admin/reports",
                    icon: FileText,
                    color: "text-purple-600",
                    link: "/dashboard/admin",
                    description: "Generate system performance reports"
                }
            ]
        }
    ]

    const togglePhaseComplete = (phaseNumber: number) => {
        setCompletedPhases(prev =>
            prev.includes(phaseNumber)
                ? prev.filter(p => p !== phaseNumber)
                : [...prev, phaseNumber]
        )
    }

    const completedCount = completedPhases.length
    const totalPhases = phases.length
    const progressPercentage = (completedCount / totalPhases) * 100

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-900 dark:to-gray-800 p-4">
            <div className="max-w-6xl mx-auto space-y-6">
                {/* Header */}
                <Card className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle className="text-3xl font-bold mb-2">
                                    GeoFix Testing Dashboard
                                </CardTitle>
                                <p className="text-blue-100 text-lg">
                                    Complete Step-by-Step Backend API Testing Flow
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-3xl font-bold">{completedCount}/{totalPhases}</div>
                                <div className="text-sm text-blue-200">Phases Complete</div>
                            </div>
                        </div>
                        <Progress value={progressPercentage} className="w-full mt-4 bg-blue-800" />
                    </CardHeader>
                </Card>

                {/* Phase Cards */}
                <div className="space-y-6">
                    {phases.map((phase) => {
                        const isCompleted = completedPhases.includes(phase.phase)

                        return (
                            <Card key={phase.phase} className={`border-2 transition-all duration-300 ${isCompleted ? 'border-green-500 bg-green-50 dark:bg-green-900/20' : 'border-gray-200 dark:border-gray-700'
                                }`}>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className={`${phase.color} text-white rounded-lg p-3 font-bold text-lg`}>
                                                Phase {phase.phase}
                                            </div>
                                            <div>
                                                <CardTitle className="text-xl font-bold">{phase.title}</CardTitle>
                                                <p className="text-gray-600 dark:text-gray-400 mt-1">
                                                    {phase.description}
                                                </p>
                                            </div>
                                        </div>
                                        <Button
                                            variant={isCompleted ? "default" : "outline"}
                                            onClick={() => togglePhaseComplete(phase.phase)}
                                            className={isCompleted ? "bg-green-600 hover:bg-green-700" : ""}
                                        >
                                            {isCompleted ? (
                                                <>
                                                    <CheckCircle2 className="w-4 h-4 mr-2" />
                                                    Complete
                                                </>
                                            ) : (
                                                <>
                                                    <Clock className="w-4 h-4 mr-2" />
                                                    Mark Done
                                                </>
                                            )}
                                        </Button>
                                    </div>
                                </CardHeader>

                                <CardContent>
                                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                                        {phase.steps.map((step, index) => {
                                            const StepIcon = step.icon

                                            return (
                                                <Card key={step.id} className="hover:shadow-md transition-shadow">
                                                    <CardContent className="p-4">
                                                        <div className="flex items-start gap-3">
                                                            <div className="flex-shrink-0">
                                                                <StepIcon className={`w-6 h-6 ${step.color}`} />
                                                            </div>
                                                            <div className="flex-1 min-w-0">
                                                                <h4 className="font-semibold text-gray-900 dark:text-white mb-1">
                                                                    {step.title}
                                                                </h4>
                                                                <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                                                                    {step.description}
                                                                </p>
                                                                <div className="space-y-1">
                                                                    <Badge variant="outline" className="text-xs">
                                                                        {step.endpoint}
                                                                    </Badge>
                                                                    {'role' in step && step.role && (
                                                                        <Badge variant="secondary" className="text-xs">
                                                                            {step.role}
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                                {step.link && (
                                                                    <Button
                                                                        asChild
                                                                        variant="outline"
                                                                        size="sm"
                                                                        className="w-full mt-3"
                                                                    >
                                                                        <Link href={step.link}>
                                                                            Test Step
                                                                        </Link>
                                                                    </Button>
                                                                )}
                                                            </div>
                                                        </div>
                                                    </CardContent>
                                                </Card>
                                            )
                                        })}
                                    </div>
                                </CardContent>
                            </Card>
                        )
                    })}
                </div>

                {/* Footer */}
                <Card className="bg-gray-50 dark:bg-gray-800">
                    <CardContent className="p-6">
                        <div className="text-center space-y-4">
                            <h3 className="text-lg font-semibold">Testing Instructions</h3>
                            <div className="grid md:grid-cols-2 gap-6 text-sm text-gray-600 dark:text-gray-400">
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Backend Requirements:</h4>
                                    <ul className="space-y-1">
                                        <li>• Backend server running on http://localhost:9050</li>
                                        <li>• Database connected and migrations applied</li>
                                        <li>• File upload endpoints configured</li>
                                        <li>• JWT authentication working</li>
                                    </ul>
                                </div>
                                <div>
                                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Testing Order:</h4>
                                    <ul className="space-y-1">
                                        <li>• Follow phases sequentially (1 → 6)</li>
                                        <li>• Complete all steps in each phase</li>
                                        <li>• Verify API responses match expected format</li>
                                        <li>• Test both success and error scenarios</li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}