import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

const Card = React.forwardRef(({ className, glass = false, hover = false, children, ...props }, ref) => {
    return (
        <motion.div
            ref={ref}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            whileHover={hover ? { y: -5, transition: { duration: 0.2 } } : {}}
            className={cn(
                'rounded-2xl border bg-white p-6 text-gray-950 shadow-sm',
                glass && 'glass-card border-white/40 bg-white/60',
                hover && 'hover:shadow-xl hover:shadow-agro-green/10 cursor-pointer',
                className
            )}
            {...props}
        >
            {children}
        </motion.div>
    );
});

Card.displayName = 'Card';

export { Card };
