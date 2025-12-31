'use client';
import { useRef, useState, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
    children: ReactNode;
    className?: string;
    tiltAmount?: number;
}

export default function TiltCard({
    children,
    className = '',
    tiltAmount = 10,
}: TiltCardProps) {
    const ref = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const rect = ref.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = e.clientX - centerX;
        const y = e.clientY - centerY;

        const rotateXVal = (y / (rect.height / 2)) * -tiltAmount;
        const rotateYVal = (x / (rect.width / 2)) * tiltAmount;

        setRotateX(rotateXVal);
        setRotateY(rotateYVal);
    };

    const handleMouseLeave = () => {
        setRotateX(0);
        setRotateY(0);
    };

    return (
        <motion.div
            ref={ref}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            animate={{ rotateX, rotateY }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            style={{ transformStyle: 'preserve-3d' }}
            className={className}
        >
            {children}
        </motion.div>
    );
}
