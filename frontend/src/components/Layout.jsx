import React from 'react';
import AnimatedBackground from './AnimatedBackground';
import Sidebar from './Sidebar';

const Layout = ({ children }) => {
    return (
        <div className="flex min-h-screen relative font-sans overflow-hidden">
            <AnimatedBackground />
            <Sidebar />
            <main className="flex-1 relative z-10 p-4 lg:p-8 ml-0 lg:ml-20 transition-[margin] duration-300">
                <div className="h-full w-full max-w-[1600px] mx-auto">
                    {children}
                </div>
            </main>
        </div>
    );
};

export default Layout;
