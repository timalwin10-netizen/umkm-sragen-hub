'use client';
import { useRef, useEffect, useState } from 'react';
import { motion, useInView, useAnimation, Variant } from 'framer-motion';
import { useIsMobile } from '@/hooks/useIsMobile';

interface BlurTextProps {
    text: string;
    delay?: number;
    className?: string;
    animateBy?: 'words' | 'letters';
    direction?: 'top' | 'bottom';
    threshold?: number;
    rootMargin?: string;
    animationFrom?: { filter: string; opacity: number; y: number };
    animationTo?: { filter: string; opacity: number; y: number };
}

export default function BlurText({
    text,
    delay = 0.05,
    className = '',
    animateBy = 'words',
    direction = 'bottom',
    threshold = 0.1,
    rootMargin = '0px',
    animationFrom,
    animationTo,
}: BlurTextProps) {
    const elements = animateBy === 'words' ? text.split(' ') : text.split('');
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true, amount: threshold });
    const controls = useAnimation();
    const isMobile = useIsMobile();

    const defaultFrom = {
        filter: isMobile ? 'blur(0px)' : 'blur(10px)',
        opacity: 0,
        y: direction === 'top' ? -20 : 20,
    };

    const defaultTo = {
        filter: 'blur(0px)',
        opacity: 1,
        y: 0,
    };

    const from = animationFrom || defaultFrom;
    const to = animationTo || defaultTo;

    useEffect(() => {
        if (isInView) {
            controls.start('visible');
        }
    }, [isInView, controls]);

    return (
        <span ref={ref} className={`inline-flex flex-wrap ${className}`}>
            {elements.map((element, index) => (
                <motion.span
                    key={index}
                    initial="hidden"
                    animate={controls}
                    variants={{
                        hidden: from,
                        visible: to,
                    }}
                    transition={{
                        duration: 0.5,
                        delay: index * delay,
                        ease: [0.25, 0.1, 0.25, 1],
                    }}
                    className="inline-block"
                    style={{ marginRight: animateBy === 'words' ? '0.25em' : '0' }}
                >
                    {element}
                </motion.span>
            ))}
        </span>
    );
}
