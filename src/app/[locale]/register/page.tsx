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
      id: "citizen",
      label: t("register.roles.citizen.label"),
      description: t("register.roles.citizen.desc"),
      color: "#0078D7",
      icon: Users,
      href: "/register/citizen"
    },
    {
      id: "contractor", 
      label: t("register.roles.contractor.label"),
      description: t("register.roles.contractor.desc"),
      color: "#F39C12",
      icon: HardHat,
      href: "/register/contractor"
    },
    {
      id: "admin",
      label: t("register.roles.admin.label"), 
      description: t("register.roles.admin.desc"),
      color: "#27AE60",
      icon: Shield,
      href: "/register/admin"
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
              {t("register.title")}
            </CardTitle>
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              {t("register.subtitle")}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="text-center mb-8">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {t("register.selectRole")}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Choose your role to create your account
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
