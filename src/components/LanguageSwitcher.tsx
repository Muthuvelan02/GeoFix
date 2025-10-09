"use client";
import { useLocale } from "next-intl";
import { usePathname, useRouter } from "@/i18n/navigation";
import { cn } from "@/lib/utils";
import { locales } from "@/i18n";

const langs: { code: string; label: string }[] = [
    { code: "en", label: "EN" },
    { code: "hi", label: "HI" },
    { code: "mr", label: "MR" },
    { code: "ta", label: "TA" },
];

export default function LanguageSwitcher({ className }: { className?: string }) {
    const locale = useLocale();
    const router = useRouter();
    const pathname = usePathname();

    const onSwitch = (code: string) => {
        console.log('Switching from locale:', locale, 'to:', code, 'pathname:', pathname); // Debug log

        // Get the current pathname and replace/add locale
        const currentPath = window.location.pathname;
        let newPath;

        if (currentPath.startsWith('/en') || currentPath.startsWith('/hi') || currentPath.startsWith('/mr') || currentPath.startsWith('/ta')) {
            // Replace existing locale
            newPath = currentPath.replace(/^\/[a-z]{2}/, `/${code}`);
        } else {
            // Add locale prefix
            newPath = `/${code}${currentPath}`;
        }

        console.log('Navigating to:', newPath);

        // Use replace to force a clean navigation without adding to history
        window.location.replace(newPath);
    };

    return (
        <div className={cn("inline-flex items-center gap-1 rounded-md bg-gray-100 dark:bg-gray-800 p-1", className)}>
            {langs.map((l) => (
                <button
                    key={l.code}
                    onClick={() => onSwitch(l.code)}
                    className={cn(
                        "px-2 py-1 text-xs font-semibold rounded-sm transition-colors",
                        l.code === locale
                            ? "cursor-pointer bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow"
                            : "cursor-pointer text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white"
                    )}
                    type="button"
                    aria-pressed={l.code === locale}
                >
                    {l.label}
                </button>
            ))}
        </div>
    );
}
