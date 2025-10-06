import type { Metadata } from "next"
import React from "react"

export const metadata: Metadata = {
    title: "GeoFix Admin Portal",
    description: "Administrative portal for GeoFix infrastructure management system",
    keywords: "GeoFix, admin, infrastructure, management, system administration",
}

type Props = {
    children: React.ReactNode
    params: Promise<{ locale: string }>
}

export default async function AdminLayout({ children, params }: Props) {
    const { locale } = await params

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-red-50 dark:from-gray-950 dark:via-gray-900 dark:to-red-950">
            {children}
        </div>
    )
}
