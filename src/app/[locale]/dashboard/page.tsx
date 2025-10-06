"use client"

import { useEffect } from "react"
import { useRouter } from "@/i18n/navigation"
import { useParams } from "next/navigation"
import { authService } from "@/services/authService"

export default function DashboardPage() {
  const router = useRouter()
  const params = useParams()
  const locale = params.locale as string || 'en'

  useEffect(() => {
    // Redirect based on user role
    const user = authService.getCurrentUser()

    if (!user) {
      router.push("/login")
      return
    }

    const userRole = user.roles[0]

    if (userRole === 'ROLE_CITIZEN') {
      router.push("/dashboard/citizen")
    } else if (userRole === 'ROLE_CONTRACTOR') {
      router.push("/dashboard/contractor")
    } else if (userRole === 'ROLE_ADMIN') {
      router.push("/dashboard/admin")
    } else if (userRole === 'ROLE_SUPERADMIN') {
      router.push("/dashboard/superadmin")
    } else if (userRole === 'ROLE_WORKER') {
      router.push("/dashboard/worker")
    } else {
      // Default fallback
      router.push("/login")
    }
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex items-center gap-2">
        <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
        <span className="text-gray-600">Redirecting...</span>
      </div>
    </div>
  )
}
