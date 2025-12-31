'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
}

export default function GradientButton({
    children,
    className = '',
    onClick,
}: GradientButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden group ${className}`}
        >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
            <span className="absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <span className="absolute inset-0 bg-black/20 opacity-0 group-active:opacity-100 transition-opacity" />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
