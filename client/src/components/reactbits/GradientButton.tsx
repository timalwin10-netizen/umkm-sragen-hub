'use client';
import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface GradientButtonProps {
    children: ReactNode;
    className?: string;
    onClick?: () => void;
    disabled?: boolean;
}

export default function GradientButton({
    children,
    className = '',
    onClick,
    disabled = false,
}: GradientButtonProps) {
    return (
        <motion.button
            onClick={onClick}
            disabled={disabled}
            whileHover={disabled ? {} : { scale: 1.02 }}
            whileTap={disabled ? {} : { scale: 0.98 }}
            className={`relative px-6 py-3 rounded-xl font-semibold text-white overflow-hidden group ${disabled ? 'opacity-50 cursor-not-allowed' : ''} ${className}`}
        >
            <span className="absolute inset-0 bg-gradient-to-r from-primary via-secondary to-accent" />
            <span className={`absolute inset-0 bg-gradient-to-r from-accent via-secondary to-primary opacity-0 ${!disabled && 'group-hover:opacity-100'} transition-opacity duration-500`} />
            <span className={`absolute inset-0 bg-black/20 opacity-0 ${!disabled && 'group-active:opacity-100'} transition-opacity`} />
            <span className="relative z-10 flex items-center justify-center gap-2">
                {children}
            </span>
        </motion.button>
    );
}
