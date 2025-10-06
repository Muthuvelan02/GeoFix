"use client"

import React, { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { CheckCircle, XCircle, AlertCircle, User, Mail, Phone, MapPin } from "lucide-react"
import adminService, { Contractor } from "@/services/adminService"

export default function ContractorVerification() {
    const [pendingContractors, setPendingContractors] = useState<Contractor[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const [verificationLoading, setVerificationLoading] = useState<{ [key: number]: boolean }>({})

    useEffect(() => {
        loadPendingContractors()
    }, [])

    const loadPendingContractors = async () => {
        try {
            setLoading(true)
            setError(null)
            const contractors = await adminService.getPendingContractors()
            setPendingContractors(contractors)
        } catch (err) {
            console.error('Error loading pending contractors:', err)
            setError(err instanceof Error ? err.message : "Failed to load pending contractors")
        } finally {
            setLoading(false)
        }
    }

    const handleVerifyContractor = async (contractorId: number, approve: boolean) => {
        try {
            setVerificationLoading(prev => ({ ...prev, [contractorId]: true }))

            if (approve) {
                await adminService.verifyContractor(contractorId)
            } else {
                await adminService.rejectContractor(contractorId)
            }

            // Remove the contractor from the pending list
            setPendingContractors(prev => prev.filter(contractor => contractor.id !== contractorId))

            // Show success message (you can implement a toast system)
            console.log(`Contractor ${approve ? 'approved' : 'rejected'} successfully`)

        } catch (err) {
            console.error('Error verifying contractor:', err)
            setError(err instanceof Error ? err.message : `Failed to ${approve ? 'approve' : 'reject'} contractor`)
        } finally {
            setVerificationLoading(prev => ({ ...prev, [contractorId]: false }))
        }
    }

    if (loading) {
        return (
            <div className="flex items-center justify-center py-8">
                <div className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600 dark:text-gray-400">Loading contractors...</span>
                </div>
            </div>
        )
    }

    if (error) {
        return (
            <Alert className="border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription className="text-red-700 dark:text-red-400">
                    {error}
                </AlertDescription>
            </Alert>
        )
    }

    if (pendingContractors.length === 0) {
        return (
            <div className="text-center py-8">
                <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <p className="text-gray-600 dark:text-gray-400 text-lg font-medium">
                    No pending contractor verifications
                </p>
                <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">
                    All contractors have been processed
                </p>
            </div>
        )
    }

    return (
        <div className="space-y-4">
            {pendingContractors.map((contractor) => (
                <Card key={contractor.id} className="border border-gray-200 dark:border-gray-700">
                    <CardContent className="p-6">
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center">
                                        <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                            {contractor.name}
                                        </h3>
                                        <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800">
                                            {contractor.status || 'PENDING'}
                                        </Badge>
                                    </div>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                                    <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                        <Mail className="h-4 w-4" />
                                        <span className="text-sm">{contractor.email}</span>
                                    </div>
                                    {contractor.mobile && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <Phone className="h-4 w-4" />
                                            <span className="text-sm">{contractor.mobile}</span>
                                        </div>
                                    )}
                                    {contractor.address && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <MapPin className="h-4 w-4" />
                                            <span className="text-sm">{contractor.address}</span>
                                        </div>
                                    )}
                                    {contractor.specialization && (
                                        <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                                            <span className="text-sm font-medium">Specialization:</span>
                                            <span className="text-sm">{contractor.specialization}</span>
                                        </div>
                                    )}
                                </div>

                                {contractor.description && (
                                    <div className="mb-4">
                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                            <span className="font-medium">Description:</span> {contractor.description}
                                        </p>
                                    </div>
                                )}
                            </div>

                            <div className="flex gap-2 ml-4">
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-green-200 text-green-700 hover:bg-green-50 dark:border-green-800 dark:text-green-400 dark:hover:bg-green-900/20"
                                    onClick={() => handleVerifyContractor(contractor.id, true)}
                                    disabled={verificationLoading[contractor.id]}
                                >
                                    {verificationLoading[contractor.id] ? (
                                        <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <CheckCircle className="h-4 w-4" />
                                    )}
                                    Approve
                                </Button>
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="border-red-200 text-red-700 hover:bg-red-50 dark:border-red-800 dark:text-red-400 dark:hover:bg-red-900/20"
                                    onClick={() => handleVerifyContractor(contractor.id, false)}
                                    disabled={verificationLoading[contractor.id]}
                                >
                                    {verificationLoading[contractor.id] ? (
                                        <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                    ) : (
                                        <XCircle className="h-4 w-4" />
                                    )}
                                    Reject
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    )
}