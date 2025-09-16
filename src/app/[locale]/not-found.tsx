import { useTranslations } from "next-intl";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFoundPage() {
  const t = useTranslations();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <h1 className="text-6xl font-bold text-[#0078D7]">404</h1>
        <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
          Page Not Found
        </h2>
        <p className="text-gray-600 dark:text-gray-300 max-w-md">
          The page you are looking for doesn't exist or has been moved.
        </p>
        <Link href="/">
          <Button variant="brand" size="lg">
            Go Home
          </Button>
        </Link>
      </div>
    </div>
  );
}