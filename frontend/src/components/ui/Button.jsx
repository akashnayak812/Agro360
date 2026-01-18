import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';
import { Loader2 } from 'lucide-react';

const Button = React.forwardRef(({ className, variant = 'primary', size = 'md', isLoading, children, ...props }, ref) => {
    const variants = {
        primary: 'bg-agro-green hover:bg-agro-darkGreen text-white shadow-lg shadow-agro-green/30',
        secondary: 'bg-white text-agro-darkGreen border border-agro-green/20 hover:bg-agro-green/5 shadow-sm',
        outline: 'border-2 border-agro-green text-agro-green hover:bg-agro-green hover:text-white',
        ghost: 'hover:bg-agro-green/10 text-agro-darkGreen',
        danger: 'bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/30',
    };

    const sizes = {
        sm: 'h-9 px-3 text-sm',
        md: 'h-11 px-6 text-base',
        lg: 'h-14 px-8 text-lg',
        icon: 'h-10 w-10 p-2',
    };

    return (
        <motion.button
            ref={ref}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn(
                'relative inline-flex items-center justify-center rounded-xl font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-agro-green/50 disabled:pointer-events-none disabled:opacity-50',
                variants[variant],
                sizes[size],
                className
            )}
            disabled={isLoading}
            {...props}
        >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {children}
        </motion.button>
    );
});

Button.displayName = 'Button';

export { Button };
