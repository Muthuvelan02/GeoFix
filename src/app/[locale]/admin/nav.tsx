"use client"
import * as React from "react"
import { useTranslations } from "next-intl"
import { Moon, Sun, Menu, ArrowLeft, Shield, Globe } from "lucide-react"
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

export default function AdminNav() {
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
        import('../../../lib/smoothScroll').then(({ smoothScrollToElement }) => {
            const headerHeight = 80
            smoothScrollToElement(targetId, headerHeight, 1000)
        })
    }

    return (
        <nav
            className={`sticky top-0 z-50 transition-all duration-300 border-b ${scrolled
                ? "glass border-red-200 dark:border-red-800"
                : "bg-white dark:bg-gray-950 border-transparent"
                }`}
        >
            {/* Scroll progress bar */}
            <div
                className="absolute left-0 top-0 h-0.5 bg-[linear-gradient(90deg,#DC2626,#EF4444)] transition-[width] duration-200"
                style={{ width: `${progress}%` }}
                aria-hidden
            />
            <div className="container-max">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex items-center">
                        <Link href="/admin" className="flex items-center gap-2">
                            <Shield className="h-6 w-6 text-red-600" />
                            <h1 className="text-2xl font-bold text-red-600 tracking-tight transition-transform will-change-transform hover:scale-[1.01]">
                                GeoFix Admin
                            </h1>
                        </Link>
                    </div>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center gap-6">
                        {/* Primary nav links */}
                        <div className="flex items-center gap-2 text-sm">
                            {[
                                { id: "features", label: "Features" },
                                { id: "system-status", label: "System Status" },
                                { href: "/", label: "Public Portal", icon: Globe },
                            ].map((item) => (
                                item.href ? (
                                    <Link
                                        key={item.id || item.label}
                                        href={item.href}
                                        className="relative px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group cursor-pointer flex items-center gap-2"
                                    >
                                        {item.icon && <item.icon className="h-4 w-4" />}
                                        {item.label}
                                        <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-red-600 to-red-400 opacity-80 transition-transform duration-300 group-hover:scale-x-100" />
                                    </Link>
                                ) : (
                                    <a
                                        key={item.id}
                                        href={`#${item.id}`}
                                        onClick={(e) => handleSmoothScroll(e, item.id!)}
                                        className="relative px-3 py-1.5 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors group cursor-pointer"
                                    >
                                        {item.label}
                                        <span className="pointer-events-none absolute inset-x-2 -bottom-0.5 h-px scale-x-0 bg-gradient-to-r from-red-600 to-red-400 opacity-80 transition-transform duration-300 group-hover:scale-x-100" />
                                    </a>
                                )
                            ))}
                        </div>

                        {/* Login Button */}
                        <Button asChild className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800">
                            <Link href="/admin/login">
                                <Shield className="mr-2 h-4 w-4" />
                                Admin Login
                            </Link>
                        </Button>

                        {/* Theme Toggle */}
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                    <span className="sr-only">Toggle theme</span>
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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

                        {/* Language Switcher */}
                        <LanguageSwitcher />
                    </div>

                    {/* Mobile Menu */}
                    <div className="md:hidden flex items-center gap-2">
                        <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                                </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
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

                        <LanguageSwitcher />

                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="h-[1.2rem] w-[1.2rem]" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                                <SheetHeader>
                                    <SheetTitle className="flex items-center gap-2">
                                        <Shield className="h-5 w-5 text-red-600" />
                                        GeoFix Admin Portal
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-4 mt-8">
                                    <Link
                                        href="/"
                                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <Globe className="h-5 w-5" />
                                        Public Portal
                                    </Link>
                                    <Link
                                        href="/admin/login"
                                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        <Shield className="h-5 w-5" />
                                        Admin Login
                                    </Link>
                                    <a
                                        href="#features"
                                        onClick={(e) => handleSmoothScroll(e, "features")}
                                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        Features
                                    </a>
                                    <a
                                        href="#system-status"
                                        onClick={(e) => handleSmoothScroll(e, "system-status")}
                                        className="flex items-center gap-2 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                                    >
                                        System Status
                                    </a>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </nav>
    )
}
