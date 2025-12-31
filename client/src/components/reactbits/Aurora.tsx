'use client';
import { motion } from 'framer-motion';

interface AuroraProps {
    colorStops?: string[];
    speed?: number;
    intensity?: number;
}

export default function Aurora({
    colorStops = ['#8b5a2b', '#a0522d', '#cd853f', '#deb887', '#d2691e'],
    speed = 1,
    intensity = 0.15,
}: AuroraProps) {
    return (
        <div className="fixed inset-0 overflow-hidden pointer-events-none z-0">
            {/* Main Aurora Blobs */}
            {colorStops.map((color, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full"
                    style={{
                        background: `radial-gradient(ellipse, ${color} 0%, transparent 70%)`,
                        width: `${50 + index * 15}%`,
                        height: `${50 + index * 15}%`,
                        filter: 'blur(80px)',
                        opacity: intensity,
                    }}
                    animate={{
                        x: [
                            `${-30 + index * 15}%`,
                            `${30 - index * 10}%`,
                            `${-20 + index * 5}%`,
                            `${10 - index * 8}%`,
                            `${-30 + index * 15}%`,
                        ],
                        y: [
                            `${-20 + index * 10}%`,
                            `${40 - index * 15}%`,
                            `${-10 + index * 5}%`,
                            `${20 - index * 10}%`,
                            `${-20 + index * 10}%`,
                        ],
                        scale: [1, 1.3, 0.9, 1.2, 1],
                        rotate: [0, 45, -30, 60, 0],
                    }}
                    transition={{
                        duration: (20 + index * 5) / speed,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}

            {/* Secondary floating orbs */}
            <motion.div
                className="absolute w-96 h-96 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(139,90,43,0.3) 0%, transparent 70%)',
                    filter: 'blur(60px)',
                    top: '20%',
                    left: '60%',
                }}
                animate={{
                    x: [0, 100, -50, 80, 0],
                    y: [0, -80, 60, -40, 0],
                    scale: [1, 1.5, 0.8, 1.3, 1],
                }}
                transition={{
                    duration: 25 / speed,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            <motion.div
                className="absolute w-80 h-80 rounded-full"
                style={{
                    background: 'radial-gradient(circle, rgba(205,133,63,0.25) 0%, transparent 70%)',
                    filter: 'blur(50px)',
                    bottom: '10%',
                    right: '20%',
                }}
                animate={{
                    x: [0, -120, 60, -80, 0],
                    y: [0, 60, -100, 40, 0],
                    scale: [1, 0.7, 1.4, 0.9, 1],
                }}
                transition={{
                    duration: 30 / speed,
                    repeat: Infinity,
                    ease: 'easeInOut',
                }}
            />

            {/* Subtle grain overlay */}
            <div
                className="absolute inset-0 opacity-[0.02] dark:opacity-[0.03]"
                style={{
                    backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E")`,
                }}
            />
        </div>
    );
}

// Lightweight aurora for specific sections (not fixed)
export function AuroraSection({
    colorStops = ['#8b5a2b', '#a0522d', '#cd853f', '#deb887'],
    speed = 1,
}: AuroraProps) {
    return (
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {colorStops.map((color, index) => (
                <motion.div
                    key={index}
                    className="absolute rounded-full opacity-20 dark:opacity-30"
                    style={{
                        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
                        width: `${40 + index * 10}%`,
                        height: `${40 + index * 10}%`,
                        filter: 'blur(60px)',
                    }}
                    animate={{
                        x: [
                            `${-20 + index * 10}%`,
                            `${20 - index * 5}%`,
                            `${-20 + index * 10}%`,
                        ],
                        y: [
                            `${-10 + index * 5}%`,
                            `${30 - index * 10}%`,
                            `${-10 + index * 5}%`,
                        ],
                        scale: [1, 1.2, 1],
                    }}
                    transition={{
                        duration: (10 + index * 2) / speed,
                        repeat: Infinity,
                        ease: 'easeInOut',
                    }}
                />
            ))}
        </div>
    );
}
