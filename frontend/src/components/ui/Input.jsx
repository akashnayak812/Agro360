import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Input = React.forwardRef(({ className, type, icon: Icon, error, ...props }, ref) => {
    return (
        <div className="relative group">
            {Icon && (
                <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-agro-green transition-colors">
                    <Icon className="h-5 w-5" />
                </div>
            )}
            <motion.input
                ref={ref}
                type={type}
                whileFocus={{ scale: 1.01 }}
                className={cn(
                    'flex h-12 w-full rounded-xl border border-gray-200 bg-white/50 px-4 py-2 text-sm ring-offset-white file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agro-green/50 focus-visible:border-agro-green transition-all duration-300',
                    Icon && 'pl-10',
                    error && 'border-red-500 focus-visible:ring-red-500',
                    className
                )}
                {...props}
            />
            {error && (
                <span className="mt-1 text-xs text-red-500 block animate-fade-in">
                    {error}
                </span>
            )}
        </div>
    );
});

Input.displayName = 'Input';

export { Input };
