import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen relative text-gray-900 font-sans">
            <AnimatedBackground />
            <Sidebar />
            <main className="flex-1 relative z-10 p-4 lg:p-6 lg:ml-0 overflow-x-hidden">
                <div className="h-full w-full max-w-7xl mx-auto rounded-3xl lg:p-8">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
