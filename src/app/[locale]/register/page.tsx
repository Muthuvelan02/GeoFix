"use client"

import type React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Users, HardHat, Shield } from "lucide-react"

export default function RegisterPage() {
  const t = useTranslations()

  const roles = [
    {
      id: "superadmin",
      label: "SuperAdmin",
      description: "Complete system control and administration",
      color: "#DC2626", // red-600
      icon: Shield,
      href: "/register/superadmin"
    },
    {
      id: "admin",
      label: "Admin",
      description: "System administration and contractor management",
      color: "#EA580C", // orange-600
      icon: Shield,
      href: "/register/admin"
    },
    {
      id: "contractor",
      label: "Contractor",
      description: "Infrastructure project execution and worker management",
      color: "#F59E0B", // amber-500
      icon: HardHat,
      href: "/register/contractor"
    },
    {
      id: "citizen",
      label: "Citizen",
      description: "Report civic issues and track resolution progress",
      color: "#0078D7", // blue
      icon: Users,
      href: "/register/citizen"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl space-y-6">
        {/* Language Switcher */}
        <div className="flex justify-end">
          <LanguageSwitcher />
        </div>

        {/* Back to Home Link */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("register.back")}
        </Link>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              GeoFix Registration
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400">
              Join the GeoFix platform to report and manage civic issues
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Select Your Role
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your role to get started with GeoFix
              </p>
            </div>

            <div className="grid gap-4 md:grid-cols-1">
              {roles.map((role) => {
                const Icon = role.icon
                return (
                  <Link key={role.id} href={role.href}>
                    <Card className="transition-all duration-200 hover:shadow-lg hover:-translate-y-1 cursor-pointer border-2 hover:border-gray-300 dark:hover:border-gray-600">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-4">
                          <div
                            className="flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white"
                            style={{ backgroundColor: role.color }}
                          >
                            <Icon className="h-6 w-6" />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-lg font-semibold text-gray-900 dark:text-white">
                              {role.label}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                              {role.description}
                            </p>
                          </div>
                          <div className="flex-shrink-0">
                            <Button
                              variant="outline"
                              style={{ borderColor: role.color, color: role.color }}
                              className="cursor-pointer hover:text-white"
                              onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = role.color
                                e.currentTarget.style.color = "#fff"
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = "transparent"
                                e.currentTarget.style.color = role.color
                              }}
                            >
                              Register
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                )
              })}
            </div>

            {/* Additional Info */}
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("register.haveAccount")}{" "}
                <Link
                  href="/login"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                >
                  {t("register.signin")}
                </Link>
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
