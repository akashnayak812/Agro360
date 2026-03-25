import React, { Suspense } from 'react';
import AnimatedBackground from './AnimatedBackground';
import Sidebar from './Sidebar';
import LanguageSelector from './LanguageSelector';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen relative font-sans overflow-hidden">
            <AnimatedBackground />
            <Sidebar />
            <main className="flex-1 relative z-10 ml-0 lg:ml-20 transition-[margin] duration-300 flex flex-col">
                {/* Top Header Bar */}
                <header className="sticky top-0 z-30 flex items-center justify-end px-4 lg:px-8 py-3 bg-white/40 backdrop-blur-md border-b border-white/30">
                    <Suspense fallback={<div className="w-20 h-9 rounded-xl bg-gray-100 animate-pulse" />}>
                        <LanguageSelector />
                    </Suspense>
                </header>

                {/* Page Content */}
                <div className="flex-1 p-4 lg:p-8">
                    <div className="h-full w-full max-w-[1600px] mx-auto">
                        {children}
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Layout;
