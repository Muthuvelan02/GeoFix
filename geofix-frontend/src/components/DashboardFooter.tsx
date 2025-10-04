'use client';

import React from 'react';
import Link from 'next/link';

const DashboardFooter: React.FC = () => {
    return (
        <footer className="bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 py-4">
            <div className="container mx-auto px-4">
                <div className="flex flex-col sm:flex-row justify-between items-center text-sm text-muted-foreground">
                    <div className="flex items-center space-x-4">
                        <p>© 2025 GeoFix. All rights reserved.</p>
                    </div>
                    <div className="flex items-center space-x-6 mt-2 sm:mt-0">
                        <Link href="/privacy" className="hover:text-primary transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/terms" className="hover:text-primary transition-colors">
                            Terms of Service
                        </Link>
                        <Link href="/support" className="hover:text-primary transition-colors">
                            Support
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default DashboardFooter;