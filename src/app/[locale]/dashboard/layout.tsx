import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import DashboardHeader from '@/components/DashboardHeader';
import DashboardSidebar from '@/components/DashboardSidebar';
import DashboardFooter from '@/components/DashboardFooter';

export default async function DashboardLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const messages = await getMessages({ locale });

  return (
    <>
    <NextIntlClientProvider messages={messages}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex flex-col">
        {/* Sticky Header */}
        <DashboardHeader />
        
        <div className="flex flex-1">
          {/* Sidebar - Hidden on mobile, visible on desktop */}
          <DashboardSidebar />
          
          {/* Main Content Area */}
          <main className="flex-1 flex flex-col min-w-0">
            {/* Content Container */}
            <div className="flex-1 p-4 lg:p-6 xl:p-8">
              <div className="max-w-7xl mx-auto">
                {/* Content with proper spacing and background */}
                <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 min-h-[calc(100vh-12rem)]">
                  <div className="p-6 lg:p-8">
                    {children}
                  </div>
                </div>
              </div>
            </div>
            
            {/* Footer */}
            <DashboardFooter />
          </main>
        </div>
      </div>
    </NextIntlClientProvider>
    </>
  );
}
    
