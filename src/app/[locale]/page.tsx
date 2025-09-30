"use client"
import * as React from "react"
import { useTranslations, useLocale } from "next-intl"
import { Link } from "@/i18n/navigation"
import BackToTop from "@/components/BackToTop"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Nav from "./nav"
import Image from "next/image"
import {
  Camera,
  MapPin,
  Bell,
  ShieldCheck,
  ClipboardList,
  Timer,
  Users,
  BarChart3,
  MapIcon,
  Smartphone,
  Languages,
  CheckCircle2,
  Lightbulb,
  TreePine,
} from "lucide-react"

export default function GeoFixLanding() {
  const t = useTranslations()
  const locale = useLocale()

  return (
    <div
      key={locale}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50 dark:from-gray-950 dark:via-gray-900 dark:to-blue-950"
    >
      <Nav />

      {/* Hero Section */}
      <section className="relative overflow-hidden py-20 lg:py-32">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/5 via-transparent to-emerald-600/5"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_30%_20%,rgba(59,130,246,0.05),transparent_50%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.1),transparent_50%)] dark:bg-[radial-gradient(circle_at_70%_80%,rgba(16,185,129,0.05),transparent_50%)]"></div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold leading-tight">
                <span className="text-white to-emerald-600 bg-clip-text">
                  {t("hero.title").split(" ")[0]}
                </span>{" "}
                <span className="text-gray-900 dark:text-white">{t("hero.title").split(" ").slice(1).join(" ")}</span>
              </h1>

              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {t("hero.subtitle")}
              </p>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                  >
                    {t("hero.cta")}
                  </Button>
                </Link>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-gray-300 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 px-8 py-4 text-lg font-semibold rounded-2xl hover:bg-blue-50 dark:hover:bg-blue-950/20 transition-all duration-300 bg-transparent"
                  >
                    {t("login.button")}
                  </Button>
                </Link>
              </div>

              <div className="flex flex-wrap items-center gap-6 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Free to use</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">Privacy protected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 bg-white/60 dark:bg-gray-800/60 backdrop-blur-sm px-4 py-2 rounded-full border border-gray-200/50 dark:border-gray-700/50">
                  <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  <span className="font-medium">24/7 support</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="bg-white/20 dark:bg-gray-800/20 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-white/30 dark:border-gray-700/30">
                  <Image
                    src="/GeoFix (1).gif"
                    alt={t("hero.alt")}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>

                <div className="absolute -bottom-6 -left-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent">
                    1,000+
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Issues Resolved</div>
                </div>

                <div className="absolute -top-6 -right-6 bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-2xl p-6 shadow-xl border border-white/50 dark:border-gray-700/50 transform hover:scale-105 transition-transform duration-300">
                  <div className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    24h
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Avg Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/50">
              <span>✨</span> Platform Features
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              {t("common.platformFeatures")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("features.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 text-center rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-teal-500 rounded-full flex items-center justify-center shadow-lg">
                  <CheckCircle2 className="w-4 h-4 text-white" />
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("features.cards.easy.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.easy.desc")}</p>
            </div>

            <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 text-center rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Timer className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("features.cards.tracking.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.tracking.desc")}</p>
            </div>

            <div className="group bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl p-8 text-center rounded-3xl border border-white/50 dark:border-gray-700/50 shadow-lg hover:shadow-2xl hover:bg-white/80 dark:hover:bg-gray-800/80 transition-all duration-500 hover:-translate-y-2">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full flex items-center justify-center shadow-lg">
                  <span className="text-sm">🛡️</span>
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {t("features.cards.resolution.title")}
              </h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.resolution.desc")}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="bg-gradient-to-br from-blue-50/80 to-indigo-50/80 dark:from-blue-950/30 dark:to-indigo-950/30 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-blue-200/30 dark:border-blue-800/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("features.roles.citizens.title")}
                </h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-blue-500 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{t(`features.roles.citizens.points.${i}` as any)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-orange-50/80 to-amber-50/80 dark:from-orange-950/30 dark:to-amber-950/30 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-orange-200/30 dark:border-orange-800/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <ClipboardList className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  {t("features.roles.contractors.title")}
                </h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">
                      {t(`features.roles.contractors.points.${i}` as any)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-emerald-50/80 to-teal-50/80 dark:from-emerald-950/30 dark:to-teal-950/30 backdrop-blur-xl rounded-3xl p-8 shadow-lg border border-emerald-200/30 dark:border-emerald-800/30 hover:shadow-xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-7 h-7 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t("features.roles.admins.title")}</h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0, 1, 2, 3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-sm leading-relaxed">{t(`features.roles.admins.points.${i}` as any)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-24 bg-gradient-to-b from-gray-50 to-white dark:from-gray-900 dark:to-gray-950">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-100 to-teal-100 dark:from-emerald-950/50 dark:to-teal-950/50 rounded-full text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-6 border border-emerald-200/50 dark:border-emerald-800/50">
              <span className="animate-pulse">🌟</span> Real Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">
              Real Impact, Real Stories
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              See how communities across the country are using GeoFix to make a difference
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: MapPin,
                title: "Quick Reporting",
                desc: "Report issues in under 60 seconds",
                color: "#0078D7",
                bgColor: "from-blue-500/10 to-indigo-500/10",
              },
              {
                icon: Bell,
                title: t("features.capabilities.1.title"),
                desc: t("features.capabilities.1.desc"),
                color: "#F39C12",
                bgColor: "from-orange-500/10 to-amber-500/10",
              },
              {
                icon: MapIcon,
                title: t("features.capabilities.2.title"),
                desc: t("features.capabilities.2.desc"),
                color: "#27AE60",
                bgColor: "from-emerald-500/10 to-teal-500/10",
              },
              {
                icon: Smartphone,
                title: t("features.capabilities.3.title"),
                desc: t("features.capabilities.3.desc"),
                color: "#0078D7",
                bgColor: "from-blue-500/10 to-indigo-500/10",
              },
              {
                icon: Languages,
                title: t("features.capabilities.4.title"),
                desc: t("features.capabilities.4.desc"),
                color: "#F39C12",
                bgColor: "from-orange-500/10 to-amber-500/10",
              },
              {
                icon: ShieldCheck,
                title: t("features.capabilities.5.title"),
                desc: t("features.capabilities.5.desc"),
                color: "#27AE60",
                bgColor: "from-emerald-500/10 to-teal-500/10",
              },
            ].map((f, i) => (
              <div
                key={i}
                className={`group bg-gradient-to-br ${f.bgColor} dark:from-gray-800/60 dark:to-gray-700/60 backdrop-blur-xl p-6 rounded-2xl hover:shadow-xl transition-all duration-300 border border-white/50 dark:border-gray-700/50 hover:-translate-y-1`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300 shadow-lg`}
                    style={{ background: `linear-gradient(135deg, ${f.color}20, ${f.color}30)` }}
                  >
                    {React.createElement(f.icon, { className: "w-6 h-6", style: { color: f.color } })}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-gray-900 dark:text-white mb-2">{f.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Benefits Section */}
      <section className="py-24 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-gray-950 dark:via-blue-950/30 dark:to-emerald-950/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6 border border-purple-200/50 dark:border-purple-800/50">
              <span>🏘️</span> Community Impact
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Community Impact</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              Real people solving real problems in their neighborhoods every day.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <CheckCircle2 className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("features.simpleTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("features.simpleDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Timer className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("features.fastTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("features.fastDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Users className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t("common.communityDriven")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {t("testimonials.communityJoin")}
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-gray-600 dark:to-gray-700 rounded-full shadow-lg"></div>
                <div>
                  <p className="font-bold text-gray-900 dark:text-white text-lg">{t("testimonials.sarahName")}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{t("common.localParent")}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic mb-6">
                "{t("testimonials.sarahQuote")}"
              </p>
              <div className="flex items-center gap-2">
                {[1, 2, 3, 4, 5].map((i) => (
                  <span key={i} className="text-yellow-400 text-lg">
                    ⭐
                  </span>
                ))}
                <span className="text-sm text-gray-500 dark:text-gray-400 ml-2 font-medium">
                  {t("common.verifiedReview")}
                </span>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <Users className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("common.citiesTrusted")}</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("common.citiesTrustedDesc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <ShieldCheck className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("common.securePercent")}</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("common.secureDesc")}</p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                <CheckCircle2 className="w-10 h-10 text-white" />
              </div>
              <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("common.support24")}</h4>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("common.supportDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section id="impact" className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-100 to-emerald-100 dark:from-green-950/50 dark:to-emerald-950/50 rounded-full text-green-700 dark:text-green-300 text-sm font-medium mb-6 border border-green-200/50 dark:border-green-800/50">
              <span>📊</span> By the Numbers
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("impact.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("stats.realNumbers")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="text-center group">
              <div className="bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 rounded-3xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
                  {t("stats.reportedCount")}
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-bold">{t("impact.reported")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.citizensHelping")}</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-emerald-500/10 to-teal-500/10 dark:from-emerald-500/20 dark:to-teal-500/20 rounded-3xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-4">
                  {t("stats.resolvedCount")}
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-bold">{t("impact.resolved")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.problemsFixed")}</p>
              </div>
            </div>
            <div className="text-center group">
              <div className="bg-gradient-to-br from-orange-500/10 to-amber-500/10 dark:from-orange-500/20 dark:to-amber-500/20 rounded-3xl p-8 mb-6 group-hover:shadow-xl transition-all duration-300">
                <div className="text-6xl md:text-7xl font-bold bg-gradient-to-r from-orange-600 to-amber-600 bg-clip-text text-transparent mb-4">
                  {t("stats.progressCount")}
                </div>
                <p className="text-xl text-gray-600 dark:text-gray-300 font-bold">{t("impact.progress")}</p>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.currentlyWorking")}</p>
              </div>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-800/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <MapPin className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">{t("testimonials.potholeFix")}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  "{t("testimonials.potholeStory")}"
                </p>
                <p className="text-xs text-gray-500 font-medium">- {t("testimonials.downtownResident")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Lightbulb className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                  {t("testimonials.lightRepair")}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  "{t("testimonials.lightStory")}"
                </p>
                <p className="text-xs text-gray-500 font-medium">- {t("testimonials.nightShiftWorker")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <TreePine className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">
                  {t("testimonials.parkCleanup")}
                </h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  "{t("testimonials.parkStory")}"
                </p>
                <p className="text-xs text-gray-500 font-medium">- {t("testimonials.familyUser")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Park Cleaned</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  "Reported illegal dumping. Park is clean and safe for kids again."
                </p>
                <p className="text-xs text-gray-500 font-medium">- Parent & Coach</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-800/60 backdrop-blur-xl hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <CardContent className="p-6">
                <div className="w-14 h-14 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center mb-4 shadow-lg">
                  <Timer className="w-7 h-7 text-white" />
                </div>
                <h4 className="font-bold text-gray-900 dark:text-white mb-3 text-lg">Light Restored</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 leading-relaxed">
                  "Broken street light made evening walks unsafe. Now it's bright!"
                </p>
                <p className="text-xs text-gray-500 font-medium">- Evening Walker</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section
        id="how-it-works"
        className="py-24 bg-gradient-to-br from-blue-50/50 via-white to-purple-50/50 dark:from-blue-950/30 dark:via-gray-950 dark:to-purple-950/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-24">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full text-white text-sm font-medium mb-6 shadow-lg">
              <span>📱</span> Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("how.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("how.subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-24">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-5xl font-bold text-white">1</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
                {/* Connection line for desktop */}
                <div className="hidden md:block absolute top-14 left-full w-12 h-0.5 bg-gradient-to-r from-blue-300 to-purple-300 dark:from-blue-600 dark:to-purple-600"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("how.steps.0.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.0.desc")}</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-5xl font-bold text-white">2</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-r from-orange-500 to-red-500 rounded-full"></div>
                {/* Connection line for desktop */}
                <div className="hidden md:block absolute top-14 left-full w-12 h-0.5 bg-gradient-to-r from-orange-300 to-red-300 dark:from-orange-600 dark:to-red-600"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("how.steps.1.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.1.desc")}</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-28 h-28 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-full flex items-center justify-center mx-auto shadow-2xl group-hover:scale-110 transition-transform duration-500">
                  <span className="text-5xl font-bold text-white">3</span>
                </div>
                <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-20 h-2 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{t("how.steps.2.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.2.desc")}</p>
            </div>
          </div>

          <div className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-12 shadow-xl border border-white/50 dark:border-gray-700/50">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Can You Report?</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From potholes to broken streetlights, help make your community better.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                {
                  icon: "🕳️",
                  title: "Road Issues",
                  desc: "Potholes, cracks, damage",
                  color: "from-red-500/10 to-orange-500/10",
                },
                {
                  icon: "💡",
                  title: "Street Lights",
                  desc: "Broken or dim lighting",
                  color: "from-yellow-500/10 to-amber-500/10",
                },
                {
                  icon: "🚮",
                  title: "Waste Issues",
                  desc: "Illegal dumping, overflowing bins",
                  color: "from-green-500/10 to-emerald-500/10",
                },
                {
                  icon: "🌳",
                  title: "Tree Problems",
                  desc: "Fallen branches, blocked paths",
                  color: "from-emerald-500/10 to-teal-500/10",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className={`text-center p-6 rounded-2xl bg-gradient-to-br ${item.color} dark:from-gray-700/60 dark:to-gray-600/60 backdrop-blur-sm hover:shadow-lg transition-all duration-300 group border border-white/30 dark:border-gray-600/30`}
                >
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">
                    {item.icon}
                  </div>
                  <h4 className="font-bold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{t("common.anyIssue")}</p>
              <Link href="/login">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {t("common.startReportingNow")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy Section */}
      <section
        id="safety"
        className="py-24 bg-gradient-to-br from-gray-50 via-blue-50/30 to-emerald-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-emerald-950/30"
      >
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-950/50 dark:to-pink-950/50 rounded-full text-purple-700 dark:text-purple-300 text-sm font-medium mb-6 border border-purple-200/50 dark:border-purple-800/50">
              <span>🛡️</span> Safety & Privacy
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("safety.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("safety.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              {/* Enhanced safety items with better visual hierarchy */}
              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                    {t("safety.anonymousTitle")}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">
                    {t("safety.anonymousDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <ShieldCheck className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("safety.secureTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("safety.secureDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-6 group">
                <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-3xl flex items-center justify-center flex-shrink-0 shadow-lg group-hover:shadow-xl group-hover:scale-110 transition-all duration-300">
                  <Bell className="w-8 h-8 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{t("safety.updatesTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("safety.updatesDesc")}</p>
                </div>
              </div>
            </div>

            {/* Enhanced safety card with better glassmorphism */}
            <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-white/50 dark:border-gray-700/50 hover:shadow-2xl transition-all duration-300">
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t("common.citiesNationwide")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t("common.governmentApproved")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t("common.secureHandling")}</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="w-6 h-6 text-green-500" />
                  <span className="text-gray-700 dark:text-gray-300 font-medium">
                    {t("common.communitySupportAvailable")}
                  </span>
                </div>
              </div>

              <div className="mt-8 p-6 bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-xl border border-white/50 dark:border-gray-700/50">
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  "{t("testimonials.anonymousQuote")}"
                </p>
                <p className="text-sm text-gray-500 mt-3 font-medium">- {t("common.communityMember")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-950 dark:to-gray-900">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-950/50 dark:to-purple-950/50 rounded-full text-blue-700 dark:text-blue-300 text-sm font-medium mb-6 border border-blue-200/50 dark:border-blue-800/50">
              <span>❓</span> Frequently Asked Questions
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("faq.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="max-w-5xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {t.raw("faq.questions").map((faq: any, i: number) => (
                <div
                  key={i}
                  className="bg-white/60 dark:bg-gray-800/60 backdrop-blur-xl rounded-3xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/50 dark:border-gray-700/50"
                >
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">{faq.q}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-20">
              <p className="text-gray-600 dark:text-gray-300 mb-6 text-lg">{t("common.stillQuestions")}</p>
              <Link href="/contact">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
                >
                  {t("common.contactSupport")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gradient-to-br from-gray-900 via-blue-950/50 to-emerald-950/50 dark:from-gray-950 dark:via-blue-950/30 dark:to-emerald-950/30 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-green-950/20"></div>
        <div className="relative z-10 py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent mb-6">
                  GeoFix
                </h3>
                <p className="text-gray-300 leading-relaxed max-w-lg mb-8 text-lg">{t("footer.description")}</p>
                <div className="flex items-center gap-3 text-gray-400">
                  <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="font-medium">{t("common.activeCities")}</span>
                </div>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-white">{t("footer.quickLinks")}</h4>
                <ul className="space-y-4">
                  {[
                    { href: "#features", text: t("footer.links.features") },
                    { href: "#how-it-works", text: t("footer.links.howItWorks") },
                    { href: "#safety", text: t("footer.links.safety") },
                    { href: "#help-center", text: t("footer.links.helpCenter") },
                  ].map((link, i) => (
                    <li key={i}>
                      <Link
                        href={link.href}
                        className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 inline-block"
                      >
                        {link.text}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-white">{t("footer.getStarted")}</h4>
                <div className="space-y-4">
                  <Link href="/login/citizen">
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/5 hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {t("footer.portals.reportCitizen")}
                      </span>
                    </div>
                  </Link>
                  <Link href="/login/contractor">
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/5 hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-to-r from-orange-400 to-red-400 rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {t("footer.portals.contractorPortal")}
                      </span>
                    </div>
                  </Link>
                  <Link href="/login/admin">
                    <div className="group flex items-center gap-3 p-3 rounded-xl bg-white/5 dark:bg-gray-800/5 hover:bg-white/10 dark:hover:bg-gray-800/10 transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-to-r from-emerald-400 to-teal-400 rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">
                        {t("footer.portals.adminDashboard")}
                      </span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-8 text-sm text-gray-400">
                  <Link href="/privacy" className="hover:text-white transition-colors">
                    {t("footer.legal.privacy")}
                  </Link>
                  <Link href="/terms" className="hover:text-white transition-colors">
                    {t("footer.legal.terms")}
                  </Link>
                  <Link href="/accessibility" className="hover:text-white transition-colors">
                    {t("footer.legal.accessibility")}
                  </Link>
                  <Link href="/contact" className="hover:text-white transition-colors">
                    {t("footer.legal.contact")}
                  </Link>
                </div>
                <p className="text-gray-400 text-sm">{t("footer.copyright")}</p>
              </div>
            </div>
          </div>
        </div>
      </footer>

      {/* Back to Top Button */}
      <BackToTop />
    </div>
  )
}
