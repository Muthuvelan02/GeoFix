"use client"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun, Menu } from "lucide-react"
import { useTheme } from "next-themes"
import { Button } from "@/components/ui/button"
import { Link } from "@/i18n/navigation"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import LanguageSwitcher from "@/components/LanguageSwitcher"

export default function Nav() {
  const t = useTranslations()
  const { setTheme } = useTheme()
  const [scrolled, setScrolled] = React.useState(false)
  const [progress, setProgress] = React.useState(0)

  React.useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY
      setScrolled(y > 10)
      const doc = document.documentElement
      const height = doc.scrollHeight - doc.clientHeight
      const pct = height > 0 ? (y / height) * 100 : 0
      setProgress(Math.min(100, Math.max(0, pct)))
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSmoothScroll = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    e.preventDefault()
    console.log('Smooth scroll triggered for:', targetId) // Debug log
    import('../../lib/smoothScroll').then(({ smoothScrollToElement }) => {
      const headerHeight = 80 // Account for fixed navigation height
      smoothScrollToElement(targetId, headerHeight, 1000)
    })
  }

  return (
    <nav
      className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled
        ? "glass border-gray-200 dark:border-gray-800"
        : "bg-white dark:bg-gray-950 border-transparent"
        }`}
    >
      {/* Scroll progress bar */}
      <div
        className="absolute left-0 top-0 h-0.5 bg-[linear-gradient(90deg,#0078D7,#4FB3FF)] transition-[width] duration-200"
        style={{ width: `${progress}%` }}
        aria-hidden
      />
      <div className="container-max">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="#" className="flex items-center gap-2">
              <h1 className="text-2xl font-bold text-[#0078D7] tracking-tight transition-transform will-change-transform hover:scale-[1.01]">
                GeoFix
              </h1>

            </Link>
          </div>

          {/* Desktop Menu */}
          <div className="hidden md:flex items-center gap-6">
            {/* Primary nav links */}
            <div className="flex items-center gap-2 text-sm">
              {[
                { id: "features", label: t("nav.features") },
                { id: "how-it-works", label: t("nav.howItWorks") },
                { id: "impact", label: t("nav.impact") },
                { id: "safety", label: "Safety" },
              ].map((item) => (
                <a
                  key={item.id}
                  href={`#${item.id}`}
                  onClick={(e) => handleSmoothScroll(e, item.id)}
                  className="relative px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group cursor-pointer"
                >
                  {item.label}
                  <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-[#0078D7] to-[#4FB3FF] opacity-80 transition-transform duration-300 group-hover:scale-x-100" />
                </a>
              ))}
            </div>



            {/* CTA */}
            <Button asChild variant="brand" className="cursor-pointer">
              <Link href="#how-it-works">{t("nav.report")}</Link>
            </Button>

            {/* Admin Portal Link */}
            <Button asChild variant="outline" size="sm" className="cursor-pointer border-gray-300 hover:border-red-400 text-gray-700 hover:text-red-600 dark:text-gray-300 dark:hover:text-red-400">
              <Link href="/admin">Admin Portal</Link>
            </Button>

            {/* Language Switcher */}
            <LanguageSwitcher />

            {/* Theme Toggle */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="cursor-pointer relative">
                  <Sun className="h-[1.2rem] w-[1.2rem] scale-100 rotate-0 transition-all dark:scale-0 dark:-rotate-90" />
                  <Moon className="absolute h-[1.2rem] w-[1.2rem] scale-0 rotate-90 transition-all dark:scale-100 dark:rotate-0" />
                  <span className="sr-only">Toggle theme</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="end"
                className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-200 border border-gray-200 dark:border-gray-700"
              >
                <DropdownMenuItem onClick={() => setTheme("light")}>
                  Light
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                  Dark
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                  System
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="bg-white dark:bg-gray-950">
                <SheetHeader>
                  <SheetTitle className="text-lg font-bold text-[#0078D7]">GeoFix</SheetTitle>
                </SheetHeader>
                <div className="mt-6 flex flex-col space-y-4">
                  <div className="grid gap-2 text-sm">
                    <a href="#features" onClick={(e) => handleSmoothScroll(e, "features")} className="text-gray-700 dark:text-gray-300 cursor-pointer">{t("nav.features")}</a>
                    <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")} className="text-gray-700 dark:text-gray-300 cursor-pointer">{t("nav.howItWorks")}</a>
                    <a href="#impact" onClick={(e) => handleSmoothScroll(e, "impact")} className="text-gray-700 dark:text-gray-300 cursor-pointer">{t("nav.impact")}</a>
                    <a href="#safety" onClick={(e) => handleSmoothScroll(e, "safety")} className="text-gray-700 dark:text-gray-300 cursor-pointer">Safety</a>
                  </div>
                  <Button asChild variant="brand" className="cursor-pointer">
                    <a href="#how-it-works" onClick={(e) => handleSmoothScroll(e, "how-it-works")}>{t("nav.report")}</a>
                  </Button>
                  <Button asChild
                    variant="outline"
                    className="border-[#0078D7] text-[#0078D7] hover:bg-[#0078D7] hover:text-white dark:hover:bg-[#0078D7]"
                  >
                    <Link href="/login/citizen">{t("footer.citizenLogin")}</Link>
                  </Button>
                  <Button asChild
                    variant="outline"
                    className="border-[#F39C12] text-[#F39C12] hover:bg-[#F39C12] hover:text-white dark:hover:bg-[#F39C12]"
                  >
                    <Link href="/login/contractor">{t("footer.contractorLogin")}</Link>
                  </Button>
                  <Button asChild
                    variant="outline"
                    className="border-[#27AE60] text-[#27AE60] hover:bg-[#27AE60] hover:text-white dark:hover:bg-[#27AE60]"
                  >
                    <Link href="/login/admin">{t("footer.adminLogin")}</Link>
                  </Button>
                  <LanguageSwitcher className="mt-2" />
                  <div className="flex space-x-2 pt-4">
                    <Button variant="outline" size="icon" onClick={() => setTheme("light")}>
                      <Sun className="h-5 w-5" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => setTheme("dark")}>
                      <Moon className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  )
}
