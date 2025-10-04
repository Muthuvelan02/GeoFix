"use client"

import React, { useState } from "react"
import { useTranslations, useLocale } from "next-intl"
import { useRouter } from "next/navigation"
import {
    AlertTriangle,
    MapPin,
    Upload,
    X,
    CheckCircle,
    ArrowLeft,
    Image as ImageIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Alert } from "@/components/ui/alert"
import DashboardHeader from "@/components/DashboardHeader"
import DashboardFooter from "@/components/DashboardFooter"
import { authService } from "@/services/authService"
import { ticketService } from "@/services/ticketService"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"

export default function ReportIssuePage() {
    const t = useTranslations()
    const locale = useLocale()
    const router = useRouter()

    const [user, setUser] = useState<any>(null)
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [location, setLocation] = useState("")
    const [photos, setPhotos] = useState<File[]>([])
    const [photoPreviews, setPhotoPreviews] = useState<string[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [success, setSuccess] = useState(false)

    React.useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData) {
            router.push(`/${locale}/login/citizen`)
            return
        }

        authService.getProfile()
            .then(profile => setUser(profile))
            .catch(() => {
                setUser({
                    id: userData.userId,
                    name: 'Citizen User',
                    email: 'user@example.com'
                })
            })
    }, [locale, router])

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])

        // Limit to 5 photos
        if (photos.length + files.length > 5) {
            setError("You can upload a maximum of 5 photos")
            return
        }

        // Validate file sizes (max 5MB each)
        const validFiles = files.filter(file => {
            if (file.size > 5 * 1024 * 1024) {
                setError(`File ${file.name} is too large. Maximum size is 5MB`)
                return false
            }
            return true
        })

        // Create previews
        validFiles.forEach(file => {
            const reader = new FileReader()
            reader.onloadend = () => {
                setPhotoPreviews(prev => [...prev, reader.result as string])
            }
            reader.readAsDataURL(file)
        })

        setPhotos(prev => [...prev, ...validFiles])
    }

    const removePhoto = (index: number) => {
        setPhotos(prev => prev.filter((_, i) => i !== index))
        setPhotoPreviews(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError(null)
        setLoading(true)

        try {
            // Validate inputs
            if (!title.trim()) {
                throw new Error("Please enter a title for your report")
            }
            if (!description.trim()) {
                throw new Error("Please enter a description")
            }
            if (!location.trim()) {
                throw new Error("Please enter a location")
            }

            // Create ticket
            await ticketService.createTicket(
                {
                    title: title.trim(),
                    description: description.trim(),
                    location: location.trim()
                },
                photos.length > 0 ? photos : undefined
            )

            setSuccess(true)

            // Redirect after 2 seconds
            setTimeout(() => {
                router.push(`/${locale}/dashboard/citizen`)
            }, 2000)

        } catch (err: any) {
            console.error('Error creating ticket:', err)
            setError(err.message || 'Failed to create report. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    const handleLogout = () => {
        authService.logout()
        router.push(`/${locale}`)
    }

    if (success) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
                <DashboardHeader
                    userRole="citizen"
                    userName={user?.name || "Citizen User"}
                    userEmail={user?.email || "user@example.com"}
                    notificationCount={0}
                    onLogout={handleLogout}
                />
                <div className="flex">
                    <CollapsibleSidebar userRole="citizen" locale={locale} />
                    <main className="flex-1 lg:ml-64 pt-16">
                        <div className="container mx-auto px-4 py-8 max-w-2xl">
                            <Card>
                                <CardContent className="p-12 text-center">
                                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
                                        Report Submitted Successfully!
                                    </h2>
                                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                                        Your issue has been reported and will be reviewed by the relevant authorities.
                                    </p>
                                    <p className="text-sm text-gray-500 dark:text-gray-500">
                                        Redirecting to dashboard...
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </main>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader
                userRole="citizen"
                userName={user?.name || "Citizen User"}
                userEmail={user?.email || "user@example.com"}
                notificationCount={0}
                onLogout={handleLogout}
            />

            <div className="flex">
                <CollapsibleSidebar userRole="citizen" locale={locale} />

                <main className="flex-1 lg:ml-64 pt-3">
                    <div className="container mx-auto px-1 py-5 max-w-5xl">
                        {/* Back Button */}
                        <Button
                            variant="ghost"
                            className="mb-6"
                            onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                        >
                            <ArrowLeft className="h-4 w-4 mr-2" />
                            Back to Dashboard
                        </Button>

                        {/* Page Header */}
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                                {t("dashboard.citizen.reportNewIssue")}
                            </h1>
                            <p className="text-gray-600 dark:text-gray-400">
                                Help improve your community by reporting issues
                            </p>
                        </div>

                        {/* Error Alert */}
                        {error && (
                            <Alert className="mb-6 border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800">
                                <AlertTriangle className="h-4 w-4 text-red-600 dark:text-red-400" />
                                <div className="ml-2">
                                    <h4 className="font-semibold text-red-800 dark:text-red-200">Error</h4>
                                    <p className="text-sm text-red-600 dark:text-red-300">{error}</p>
                                </div>
                            </Alert>
                        )}

                        {/* Report Form */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Issue Details</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    {/* Title */}
                                    <div className="space-y-2">
                                        <Label htmlFor="title">
                                            Issue Title <span className="text-red-500">*</span>
                                        </Label>
                                        <Input
                                            id="title"
                                            placeholder="e.g., Broken street light on Main Street"
                                            value={title}
                                            onChange={(e) => setTitle(e.target.value)}
                                            maxLength={200}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {title.length}/200 characters
                                        </p>
                                    </div>

                                    {/* Location */}
                                    <div className="space-y-2">
                                        <Label htmlFor="location">
                                            Location <span className="text-red-500">*</span>
                                        </Label>
                                        <div className="relative">
                                            <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                                            <Input
                                                id="location"
                                                placeholder="e.g., Main Street & 5th Avenue"
                                                value={location}
                                                onChange={(e) => setLocation(e.target.value)}
                                                className="pl-10"
                                                required
                                            />
                                        </div>
                                    </div>

                                    {/* Description */}
                                    <div className="space-y-2">
                                        <Label htmlFor="description">
                                            Description <span className="text-red-500">*</span>
                                        </Label>
                                        <Textarea
                                            id="description"
                                            placeholder="Please provide detailed information about the issue..."
                                            value={description}
                                            onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setDescription(e.target.value)}
                                            rows={5}
                                            maxLength={2000}
                                            required
                                        />
                                        <p className="text-xs text-gray-500">
                                            {description.length}/2000 characters
                                        </p>
                                    </div>

                                    {/* Photos */}
                                    <div className="space-y-2">
                                        <Label>Photos (Optional)</Label>
                                        <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-lg p-6">
                                            <div className="text-center">
                                                <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                                                <div className="mb-4">
                                                    <label htmlFor="photo-upload" className="cursor-pointer">
                                                        <span className="text-blue-600 dark:text-blue-400 hover:underline">
                                                            Click to upload
                                                        </span>
                                                        <span className="text-gray-600 dark:text-gray-400"> or drag and drop</span>
                                                    </label>
                                                    <input
                                                        id="photo-upload"
                                                        type="file"
                                                        accept="image/*"
                                                        multiple
                                                        onChange={handlePhotoChange}
                                                        className="hidden"
                                                    />
                                                </div>
                                                <p className="text-xs text-gray-500">
                                                    PNG, JPG up to 5MB each (max 5 photos)
                                                </p>
                                            </div>

                                            {/* Photo Previews */}
                                            {photoPreviews.length > 0 && (
                                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-6">
                                                    {photoPreviews.map((preview, index) => (
                                                        <div key={index} className="relative group">
                                                            <img
                                                                src={preview}
                                                                alt={`Preview ${index + 1}`}
                                                                className="w-full h-32 object-cover rounded-lg"
                                                            />
                                                            <button
                                                                type="button"
                                                                onClick={() => removePhoto(index)}
                                                                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                                                            >
                                                                <X className="h-4 w-4" />
                                                            </button>
                                                        </div>
                                                    ))}
                                                </div>
                                            )}
                                        </div>
                                    </div>

                                    {/* Submit Button */}
                                    <div className="flex gap-4">
                                        <Button
                                            type="submit"
                                            className="cursor-pointer"
                                            disabled={loading}
                                        >
                                            {loading ? (
                                                <>
                                                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                                                    Submitting...
                                                </>
                                            ) : (
                                                <>
                                                    <AlertTriangle className="h-4 w-4 mr-2" />
                                                    Submit Report
                                                </>
                                            )}
                                        </Button>
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => router.push(`/${locale}/dashboard/citizen`)}
                                            disabled={loading}
                                        >
                                            Cancel
                                        </Button>
                                    </div>
                                </form>
                            </CardContent>
                        </Card>
                    </div>

                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}
