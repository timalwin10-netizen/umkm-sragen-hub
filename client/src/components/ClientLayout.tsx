'use client';

import WelcomeScreen from '@/components/WelcomeScreen';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ReactNode } from 'react';

export default function ClientLayout({ children }: { children: ReactNode }) {
    return (
        <ThemeProvider>
            <WelcomeScreen />
            <Navbar />
            <main className="flex-grow relative z-10">
                {children}
            </main>
            <Footer />
        </ThemeProvider>
    );
}
