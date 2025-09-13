"use client"
import * as React from "react"
import {useTranslations, useLocale} from "next-intl"
import {Link} from "@/i18n/navigation"
import LanguageSwitcher from "@/components/LanguageSwitcher"
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
  Map as MapIcon,
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
    <div key={locale} className="min-h-screen bg-white dark:bg-gray-950">
      <Nav />
      

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-subtle py-50">
        <div className="container-max relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
             
              
              <h1 className="text-5xl md:text-6xl lg:text-5xl font-bold text-gray-900 dark:text-white leading-tight">
                <span className=" bg-clip-text ">
                  {t("hero.title").split(' ')[0]}
                </span>{' '}
                <span className="text-gray-900 dark:text-white">
                  {t("hero.title").split(' ').slice(1).join(' ')}
                </span>
              </h1>
              
              <p className="text-xl md:text-2xl text-gray-600 dark:text-gray-300 leading-relaxed max-w-2xl">
                {t("hero.subtitle")}
              </p>
              
                            <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <button className="btn-primary-large">
                    {t("hero.cta")}
                  </button>
                </Link>
                <Link href="/login">
                  <button className="btn-secondary-large">
                    {t("login.button")}
                  </button>
                </Link>
              </div>
              
              <div className="flex items-center gap-8 pt-4">
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Free to use</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>Privacy protected</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                  <CheckCircle2 className="w-5 h-5 text-green-500" />
                  <span>24/7 support</span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-center lg:justify-end">
              <div className="relative">
                <div className="glass-strong rounded-2xl overflow-hidden shadow-strong">
                  <Image
                    src="/GeoFix (1).gif"
                    alt={t("hero.alt")}
                    width={600}
                    height={400}
                    className="w-full h-auto object-cover"
                    priority
                  />
                </div>
                
                {/* Stats cards */}
                <div className="absolute -bottom-4 -left-4 glass-light rounded-xl p-4 shadow-soft">
                  <div className="text-2xl font-bold text-green-600">1,000+</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Issues Resolved</div>
                </div>
                
                <div className="absolute -top-4 -right-4 glass-light rounded-xl p-4 shadow-soft">
                  <div className="text-2xl font-bold text-blue-600">24h</div>
                  <div className="text-xs text-gray-600 dark:text-gray-400">Avg Response</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-white dark:bg-gray-950 section-gradient">
        <div className="container-max">
                    <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              {t("common.platformFeatures")}
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("features.subtitle")}
            </p>
          </div>

          {/* Main feature cards */}
          <div className="grid md:grid-cols-3 gap-8 mb-20">
            <div className="card-elevated p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Camera className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">✓</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("features.cards.easy.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.easy.desc")}</p>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <Timer className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">⚡</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("features.cards.tracking.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.tracking.desc")}</p>
            </div>

            <div className="card-elevated p-8 text-center">
              <div className="relative mb-8">
                <div className="w-20 h-20 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto shadow-soft">
                  <ShieldCheck className="w-10 h-10 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-green-600 rounded-full flex items-center justify-center">
                  <span className="text-xs text-white">🛡️</span>
                </div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("features.cards.resolution.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.cards.resolution.desc")}</p>
            </div>
          </div>

          {/* Role-based features */}
          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="glass-light rounded-2xl p-8 shadow-soft border border-blue-200/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#0078D7] rounded-xl flex items-center justify-center">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t("features.roles.citizens.title")}</h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0,1,2,3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#0078D7] flex-shrink-0" /> 
                    <span className="text-sm leading-relaxed">{t(`features.roles.citizens.points.${i}` as any)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-light rounded-2xl p-8 shadow-soft border border-orange-200/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#F39C12] rounded-xl flex items-center justify-center">
                  <ClipboardList className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t("features.roles.contractors.title")}</h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0,1,2,3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#F39C12] flex-shrink-0" /> 
                    <span className="text-sm leading-relaxed">{t(`features.roles.contractors.points.${i}` as any)}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="glass-light rounded-2xl p-8 shadow-soft border border-green-200/20">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-[#27AE60] rounded-xl flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">{t("features.roles.admins.title")}</h3>
              </div>
              <ul className="space-y-4 text-gray-600 dark:text-gray-300">
                {[0,1,2,3].map((i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 text-[#27AE60] flex-shrink-0" /> 
                    <span className="text-sm leading-relaxed">{t(`features.roles.admins.points.${i}` as any)}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Community Impact Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 section-gradient">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Real Impact, Real Stories</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              See how communities across the country are using GeoFix to make a difference
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[{
              icon: MapPin, title: "Quick Reporting", desc: "Report issues in under 60 seconds",
              color: "#0078D7"
            },{
              icon: Bell, title: t("features.capabilities.1.title"), desc: t("features.capabilities.1.desc"),
              color: "#F39C12"
            },{
              icon: MapIcon, title: t("features.capabilities.2.title"), desc: t("features.capabilities.2.desc"),
              color: "#27AE60"
            },{
              icon: Smartphone, title: t("features.capabilities.3.title"), desc: t("features.capabilities.3.desc"),
              color: "#0078D7"
            },{
              icon: Languages, title: t("features.capabilities.4.title"), desc: t("features.capabilities.4.desc"),
              color: "#F39C12"
            },{
              icon: ShieldCheck, title: t("features.capabilities.5.title"), desc: t("features.capabilities.5.desc"),
              color: "#27AE60"
            }].map((f, i) => (
              <div key={i} className="glass-light p-6 rounded-xl hover:glass-strong transition-all duration-300 group">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300" 
                       style={{ backgroundColor: `${f.color}15` }}>
                    {React.createElement(f.icon, { className: "w-6 h-6", style: { color: f.color } })}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{f.title}</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-relaxed">{f.desc}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Community Benefits Section */}
      <section className="py-24 bg-gray-50 dark:bg-gray-900 section-pattern">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">Community Impact</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              Real people solving real problems in their neighborhoods every day.
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center mb-20">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("features.simpleTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.simpleDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Timer className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("features.fastTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("features.fastDesc")}</p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-success rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Users className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("common.communityDriven")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{t("testimonials.communityJoin")}</p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-8 shadow-strong">
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-full"></div>
                <div>
                  <p className="font-semibold text-gray-900 dark:text-white">{t("testimonials.sarahName")}</p>
                  <p className="text-sm text-gray-500">{t("common.localParent")}</p>
                </div>
              </div>
              <p className="text-gray-700 dark:text-gray-300 text-lg leading-relaxed italic">
                "{t("testimonials.sarahQuote")}"
              </p>
              <div className="flex items-center gap-1 mt-4">
                {[1,2,3,4,5].map(i => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
                <span className="text-sm text-gray-500 ml-2">{t("common.verifiedReview")}</span>
              </div>
            </div>
          </div>

          {/* Trust indicators */}
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("common.citiesTrusted")}</h4>
              <p className="text-gray-600 dark:text-gray-300">{t("common.citiesTrustedDesc")}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-secondary rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <ShieldCheck className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("common.securePercent")}</h4>
              <p className="text-gray-600 dark:text-gray-300">{t("common.secureDesc")}</p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-gradient-success rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-soft">
                <CheckCircle2 className="w-8 h-8 text-white" />
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("common.support24")}</h4>
              <p className="text-gray-600 dark:text-gray-300">{t("common.supportDesc")}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
  <section id="impact" className="py-20 bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">{t("impact.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("stats.realNumbers")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#0078D7] mb-4">{t("stats.reportedCount")}</div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{t("impact.reported")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.citizensHelping")}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#27AE60] mb-4">{t("stats.resolvedCount")}</div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{t("impact.resolved")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.problemsFixed")}</p>
            </div>
            <div className="text-center">
              <div className="text-5xl md:text-6xl font-bold text-[#F39C12] mb-4">{t("stats.progressCount")}</div>
              <p className="text-xl text-gray-600 dark:text-gray-300 font-medium">{t("impact.progress")}</p>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">{t("stats.currentlyWorking")}</p>
            </div>
          </div>

          {/* Success Stories */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="border-0 shadow-lg dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#0078D7] rounded-full flex items-center justify-center mb-4">
                  <MapPin className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("testimonials.potholeFix")}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  "{t("testimonials.potholeStory")}"
                </p>
                <p className="text-xs text-gray-500">- {t("testimonials.downtownResident")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center mb-4">
                  <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("testimonials.lightRepair")}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  "{t("testimonials.lightStory")}"
                </p>
                <p className="text-xs text-gray-500">- {t("testimonials.nightShiftWorker")}</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mb-4">
                  <TreePine className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{t("testimonials.parkCleanup")}</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  "{t("testimonials.parkStory")}"
                </p>
                <p className="text-xs text-gray-500">- {t("testimonials.familyUser")}</p>
              </CardContent>
            </Card>            <Card className="border-0 shadow-lg dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#27AE60] rounded-full flex items-center justify-center mb-4">
                  <Bell className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Park Cleaned</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  "Reported illegal dumping. Park is clean and safe for kids again."
                </p>
                <p className="text-xs text-gray-500">- Parent & Coach</p>
              </CardContent>
            </Card>

            <Card className="border-0 shadow-lg dark:bg-gray-900">
              <CardContent className="p-6">
                <div className="w-12 h-12 bg-[#F39C12] rounded-full flex items-center justify-center mb-4">
                  <Timer className="w-6 h-6 text-white" />
                </div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-2">Light Restored</h4>
                <p className="text-gray-600 dark:text-gray-300 text-sm mb-3">
                  "Broken street light made evening walks unsafe. Now it's bright!"
                </p>
                <p className="text-xs text-gray-500">- Evening Walker</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
  <section id="how-it-works" className="py-24 bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="text-center mb-20">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-secondary rounded-full text-white text-sm font-medium mb-6 shadow-soft">
              <span>📱</span> Simple Process
            </div>
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("how.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">{t("how.subtitle")}</p>
          </div>

          <div className="grid md:grid-cols-3 gap-12 mb-20">
            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-primary rounded-3xl flex items-center justify-center mx-auto shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-white">1</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-primary rounded-full"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("how.steps.0.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.0.desc")}</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-secondary rounded-3xl flex items-center justify-center mx-auto shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-white">2</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-secondary rounded-full"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("how.steps.1.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.1.desc")}</p>
            </div>

            <div className="text-center group">
              <div className="relative mb-8">
                <div className="w-24 h-24 bg-gradient-success rounded-3xl flex items-center justify-center mx-auto shadow-strong group-hover:scale-110 transition-transform duration-300">
                  <span className="text-4xl font-bold text-white">3</span>
                </div>
                <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-16 h-1 bg-gradient-success rounded-full"></div>
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 dark:text-white mb-4">{t("how.steps.2.title")}</h3>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-lg">{t("how.steps.2.desc")}</p>
            </div>
          </div>

          {/* Common Issues - Simplified */}
          <div className="glass-strong rounded-3xl p-12">
            <div className="text-center mb-12">
              <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">What Can You Report?</h3>
              <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
                From potholes to broken streetlights, help make your community better.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[
                { icon: "🕳️", title: "Road Issues", desc: "Potholes, cracks, damage" },
                { icon: "💡", title: "Street Lights", desc: "Broken or dim lighting" },
                { icon: "🚮", title: "Waste Issues", desc: "Illegal dumping, overflowing bins" },
                { icon: "�", title: "Tree Problems", desc: "Fallen branches, blocked paths" }
              ].map((item, i) => (
                <div key={i} className="text-center p-6 rounded-2xl glass-light hover:glass-strong transition-all duration-300 group">
                  <div className="text-4xl mb-4 group-hover:scale-110 transition-transform duration-300">{item.icon}</div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">{item.title}</h4>
                  <p className="text-sm text-gray-600 dark:text-gray-300">{item.desc}</p>
                </div>
              ))}
            </div>

            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-300 mb-6">
                {t("common.anyIssue")}
              </p>
              <Link href="/login">
                <Button variant="brand" size="lg" className="px-8 py-4 text-lg shadow-strong hover:scale-105 transition-all duration-300">
                  {t("common.startReportingNow")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Safety & Privacy Section */}
      <section id="safety" className="py-24 bg-gray-50 dark:bg-gray-900 section-pattern">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("safety.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("safety.subtitle")}
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="space-y-8">
              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-success rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("safety.anonymousTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("safety.anonymousDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-primary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <ShieldCheck className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("safety.secureTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("safety.secureDesc")}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-6">
                <div className="w-14 h-14 bg-gradient-secondary rounded-2xl flex items-center justify-center flex-shrink-0 shadow-soft">
                  <Bell className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">{t("safety.updatesTitle")}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                    {t("safety.updatesDesc")}
                  </p>
                </div>
              </div>
            </div>

            <div className="glass-strong rounded-2xl p-8 shadow-strong">
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
                  <span className="text-gray-700 dark:text-gray-300 font-medium">{t("common.communitySupportAvailable")}</span>
                </div>
              </div>

              <div className="mt-8 p-6 glass-light rounded-xl">
                <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">
                  "{t("testimonials.anonymousQuote")}"
                </p>
                <p className="text-sm text-gray-500 mt-3">- {t("common.communityMember")}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-24 bg-white dark:bg-gray-950">
        <div className="container-max">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6">{t("faq.title")}</h2>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
              {t("faq.subtitle")}
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-8">
              {t.raw("faq.questions").map((faq: any, i: number) => (
                <div key={i} className="glass-light rounded-2xl p-8 shadow-soft hover:shadow-strong transition-all duration-300">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">{faq.q}</h3>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed">{faq.a}</p>
                </div>
              ))}
            </div>

            <div className="text-center mt-16">
              <p className="text-gray-600 dark:text-gray-300 mb-6">{t("common.stillQuestions")}</p>
              <Button variant="brand" size="lg" className="px-8 py-4 text-lg shadow-soft hover:scale-105 transition-all duration-300">
                {t("common.contactSupport")}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 dark:bg-gray-950 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950/20 via-transparent to-green-950/20"></div>
        <div className="relative z-10 py-20">
          <div className="container-max">
            <div className="grid md:grid-cols-4 gap-12 mb-16">
              <div className="col-span-2">
                <h3 className="text-3xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-6">GeoFix</h3>
                <p className="text-gray-300 leading-relaxed max-w-lg mb-8 text-lg">
                  {t("footer.description")}
                </p>
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
                    { href: "#", text: t("footer.links.helpCenter") }
                  ].map((link, i) => (
                    <li key={i}>
                      <a href={link.href} className="text-gray-300 hover:text-white hover:pl-2 transition-all duration-300 inline-block">
                        {link.text}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="text-xl font-semibold mb-6 text-white">{t("footer.getStarted")}</h4>
                <div className="space-y-4">
                  <Link href="/login/citizen">
                    <div className="group flex items-center gap-3 p-3 rounded-xl glass-light hover:glass-strong transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-primary rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{t("footer.portals.reportCitizen")}</span>
                    </div>
                  </Link>
                  <Link href="/login/contractor">
                    <div className="group flex items-center gap-3 p-3 rounded-xl glass-light hover:glass-strong transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-secondary rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{t("footer.portals.contractorPortal")}</span>
                    </div>
                  </Link>
                  <Link href="/login/admin">
                    <div className="group flex items-center gap-3 p-3 rounded-xl glass-light hover:glass-strong transition-all duration-300 cursor-pointer">
                      <div className="w-3 h-3 bg-gradient-success rounded-full"></div>
                      <span className="text-gray-300 group-hover:text-white transition-colors">{t("footer.portals.adminDashboard")}</span>
                    </div>
                  </Link>
                </div>
              </div>
            </div>

            <div className="border-t border-gray-800/50 pt-8">
              <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div className="flex items-center gap-8 text-sm text-gray-400">
                  <a href="#" className="hover:text-white transition-colors">{t("footer.legal.privacy")}</a>
                  <a href="#" className="hover:text-white transition-colors">{t("footer.legal.terms")}</a>
                  <a href="#" className="hover:text-white transition-colors">{t("footer.legal.accessibility")}</a>
                  <a href="#" className="hover:text-white transition-colors">{t("footer.legal.contact")}</a>
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
