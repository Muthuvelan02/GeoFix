"use client"

import React, { useState, useEffect } from "react"
import { useParams } from "next/navigation"
import { authService } from "@/services/authService"
import { useRouter } from "@/i18n/navigation"
import { Input } from "@/components/ui/input"
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import CollapsibleSidebar from "@/components/CollapsibleSidebar"
import DashboardHeader from "@/components/DashboardHeader"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import DashboardFooter from "@/components/DashboardFooter"
import { Mail, Phone, Clock, Search } from "lucide-react"



// Mock FAQs
const mockFAQs = [
    {
        q: "How do I report an issue?",
        a: "Click on 'Report Issue' in the menu and fill out the form with details and photos.",
    },
    {
        q: "How long does it take?",
        a: "Most issues are resolved within 3-5 business days.",
    },
    {
        q: "Can I track my issue?",
        a: "Yes! Go to 'Track Issues' to see real-time updates.",
    },
]

export default function CitizenHelpPage() {
    const params = useParams()
    const router = useRouter()
    const locale = params.locale as string || 'en'
    const [user, setUser] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState("")
    const [filteredFAQs, setFilteredFAQs] = useState(mockFAQs)

    useEffect(() => {
        const userData = authService.getCurrentUser()
        if (!userData || userData.roles[0] !== 'ROLE_CITIZEN') {
            router.push("/login/citizen")
            return
        }
        setUser(userData)
        setLoading(false)
    }, [router])

    useEffect(() => {
        const lowerSearch = search.toLowerCase()
        setFilteredFAQs(
            mockFAQs.filter(
                (faq) => faq.q.toLowerCase().includes(lowerSearch) || faq.a.toLowerCase().includes(lowerSearch)
            )
        )
    }, [search])

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="flex items-center gap-2">
                    <div className="w-6 h-6 border-2 border-orange-600 border-t-transparent rounded-full animate-spin" />
                    <span className="text-gray-600">Loading...</span>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
            <DashboardHeader />
            <div className="flex">
                <CollapsibleSidebar userRole="citizen" locale={locale} user={user} />
                <main className="flex-1 p-8">
                    <div className="max-w-4xl mx-auto space-y-6">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Help & Support</h1>
                            <p className="text-gray-600 dark:text-gray-400 mt-1">
                                Find answers to common questions
                            </p>
                        </div>

                        {/* Search */}
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                            <Input
                                placeholder="Search FAQs..."
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="pl-10"
                            />
                        </div>

                        {/* FAQ Accordion */}
                        <Card>
                            <CardHeader>
                                <CardTitle>Frequently Asked Questions</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <Accordion type="single" collapsible className="space-y-2">
                                    {filteredFAQs.length > 0 ? (
                                        filteredFAQs.map((faq, idx) => (
                                            <AccordionItem key={idx} value={`faq-${idx}`}>
                                                <AccordionTrigger className="text-left">
                                                    {faq.q}
                                                </AccordionTrigger>
                                                <AccordionContent className="text-gray-600 dark:text-gray-400">
                                                    {faq.a}
                                                </AccordionContent>
                                            </AccordionItem>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">
                                            No FAQs found for "{search}"
                                        </p>
                                    )}
                                </Accordion>
                            </CardContent>
                        </Card>

                        {/* Contact Support Card */}
                        <Card className="border-l-4 border-orange-600">
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <Phone className="h-5 w-5 text-orange-600" />
                                    Contact Support
                                </CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="flex items-center gap-2">
                                    <Mail className="h-4 w-4 text-gray-600" />
                                    <span><strong>Email:</strong> support@geofix.com</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Phone className="h-4 w-4 text-gray-600" />
                                    <span><strong>Phone:</strong> +91 9876543210</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <Clock className="h-4 w-4 text-gray-600" />
                                    <span><strong>Hours:</strong> Mon-Fri 9:00 AM - 6:00 PM</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                    <DashboardFooter />
                </main>
            </div>
        </div>
    )
}
