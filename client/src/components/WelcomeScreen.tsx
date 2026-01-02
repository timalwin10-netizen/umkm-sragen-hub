'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';
import { Moon, Sun, Volume2, VolumeX } from 'lucide-react';

export default function WelcomeScreen() {
    const isMobile = useIsMobile();
    const [isVisible, setIsVisible] = useState(true);
    const [isHolding, setIsHolding] = useState(false);
    const [progress, setProgress] = useState(0);
    const [isDarkMode, setIsDarkMode] = useState(false); // Default Light
    const [isMuted, setIsMuted] = useState(false);

    // Audio ref
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const requestRef = useRef<number | null>(null);

    // Setup Audio
    useEffect(() => {
        audioRef.current = new Audio('https://blackbirdawards.com/assets/audio/BB-Loop-V10-64.mp3');
        audioRef.current.loop = true;
        audioRef.current.volume = 0.5;

        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    // Toggle Theme (Hanya untuk halaman ini)
    const toggleTheme = () => setIsDarkMode(!isDarkMode);

    // Toggle Audio
    const toggleMute = () => {
        if (!audioRef.current) return;
        if (isMuted) {
            audioRef.current.muted = false;
            setIsMuted(false);
        } else {
            audioRef.current.muted = true;
            setIsMuted(true);
        }
    };

    // Hold Logic
    const startHold = () => {
        setIsHolding(true);
        // Start audio on first interaction if not playing
        if (audioRef.current && audioRef.current.paused && !isMuted) {
            audioRef.current.play().catch(() => { });
        }
    };

    const endHold = () => {
        setIsHolding(false);
        setProgress(0); // Reset progress immediately on release
    };

    // Animation Loop for Progress
    useEffect(() => {
        const animate = () => {
            if (isHolding) {
                setProgress((prev) => {
                    if (prev >= 100) {
                        setIsVisible(false); // Selesai
                        return 100;
                    }
                    return prev + 1.5; // Kecepatan loading (makin besar makin cepat)
                });
            } else {
                setProgress((prev) => Math.max(0, prev - 5)); // Decay logic
            }
            requestRef.current = requestAnimationFrame(animate);
        };

        requestRef.current = requestAnimationFrame(animate);
        return () => cancelAnimationFrame(requestRef.current!);
    }, [isHolding]);

    // Cleanup when component unmounts
    useEffect(() => {
        if (!isVisible && audioRef.current) {
            // Fade out audio
            const fadeOut = setInterval(() => {
                if (audioRef.current!.volume > 0.05) {
                    audioRef.current!.volume -= 0.05;
                } else {
                    audioRef.current!.pause();
                    clearInterval(fadeOut);
                }
            }, 100);
        }
    }, [isVisible]);

    // Desktop Only Check (DEBUG: Commented out to force show)
    console.log('WelcomeScreen Rendered. Mobile:', isMobile, 'Visible:', isVisible);
    // if (isMobile) return null;

    // Removed from DOM after animation
    if (!isVisible) return null;

    return (
        <AnimatePresence>
            {isVisible && (
                <motion.div
                    initial={{ opacity: 1 }}
                    exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
                    transition={{ duration: 0.8, ease: "easeInOut" }}
                    className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center cursor-none select-none transition-colors duration-500 ${isDarkMode ? 'bg-black text-white' : 'bg-[#f5f5f5] text-black'
                        }`}
                    onMouseDown={startHold}
                    onMouseUp={endHold}
                    onMouseLeave={endHold}
                >
                    {/* --- Controls (Top Right) --- */}
                    <div className="absolute top-8 right-8 flex gap-4 z-10">
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleMute(); }}
                            className="p-2 rounded-full border border-current hover:opacity-50 transition-opacity"
                        >
                            {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
                        </button>
                        <button
                            onClick={(e) => { e.stopPropagation(); toggleTheme(); }}
                            className="p-2 rounded-full border border-current hover:opacity-50 transition-opacity"
                        >
                            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
                        </button>
                    </div>

                    {/* --- Main Content --- */}
                    <div className="relative z-10 text-center space-y-8">
                        {/* Title */}
                        <motion.h1
                            className="text-6xl md:text-8xl font-black tracking-tighter"
                            style={{ fontFamily: 'var(--font-geist-sans), sans-serif' }}
                        >
                            MAJUKAN
                            <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">
                                UMKM SRAGEN
                            </span>
                            <br />
                            BERSAMA
                        </motion.h1>

                        <p className={`text-lg tracking-widest uppercase opacity-60 ${isDarkMode ? 'text-gray-400' : 'text-gray-600'}`}>
                            Hold to Explore
                        </p>
                    </div>

                    {/* --- Interaction Circle (Hold Trigger) --- */}
                    <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                        {/* Static Circle */}
                        <div className={`w-32 h-32 rounded-full border border-opacity-20 ${isDarkMode ? 'border-white' : 'border-black'}`} />

                        {/* Filling Circle */}
                        <motion.div
                            className="absolute w-32 h-32 rounded-full bg-orange-600 mix-blend-difference"
                            initial={{ scale: 0 }}
                            animate={{ scale: progress / 100 }}
                            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                        />

                        {/* Cursor Follower (Optional - simple version) */}
                        <motion.div
                            className={`hidden md:block absolute w-4 h-4 rounded-full ${isDarkMode ? 'bg-white' : 'bg-black'}`}
                            animate={{
                                scale: isHolding ? 0.5 : 1,
                            }}
                        />
                    </div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
