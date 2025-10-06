"use client"

import React from "react"
import { useTranslations } from "next-intl"
import { Link } from "@/i18n/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import LanguageSwitcher from "@/components/LanguageSwitcher"
import { ArrowLeft, Users, HardHat, Shield } from "lucide-react"

export default function LoginPage() {
  const t = useTranslations()

  const roles = [
    {
      id: "citizen",
      label: t("login.roles.citizen.label"),
      description: t("login.roles.citizen.desc"),
      color: "#0078D7",
      icon: Users,
      href: "/login/citizen"
    },
    {
      id: "contractor",
      label: t("login.roles.contractor.label"),
      description: t("login.roles.contractor.desc"),
      color: "#F39C12",
      icon: HardHat,
      href: "/login/contractor"
    },
    {
      id: "worker",
      label: "Worker",
      description: "Access your assigned tasks and work dashboard",
      color: "#FF6B35",
      icon: HardHat,
      href: "/login/worker"
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
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
          {t("login.back")}
        </Link>

        <Card className="shadow-xl border-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm">
          <CardHeader className="text-center space-y-4">
            <CardTitle className="text-3xl font-bold text-gray-900 dark:text-white">
              {t("login.title")}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("login.subtitle")}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("nav.loginAs")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your role to continue
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
                              Login
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
            <div className="text-center pt-6 border-t border-gray-200 dark:border-gray-700 space-y-3">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {t("login.noAccount")}{" "}
                <Link
                  href="/register"
                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium"
                >
                  {t("login.create")}
                </Link>
              </p>
              <div className="pt-2">
                <Link
                  href="/admin"
                  className="inline-flex items-center gap-2 text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 text-sm font-medium transition-colors"
                >
                  <Shield className="h-4 w-4" />
                  System Administrator? Access Admin Portal
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
