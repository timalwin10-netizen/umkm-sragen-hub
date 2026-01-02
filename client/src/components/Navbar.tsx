'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { useTheme } from './ThemeProvider';

export default function Navbar() {
    const [user, setUser] = useState<any>(null);
    const [scrolled, setScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }

        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/';
    };

    return (
        <motion.nav
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
            className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-background/80 backdrop-blur-md border-b border-border py-4' : 'bg-transparent py-5'}`}
        >
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link href="/" className="flex items-center gap-3 group">
                    <img
                        src="/logo-gerai-umkm.png"
                        alt="Gerai UMKM Sragen"
                        className="h-10 w-auto object-contain"
                    />
                </Link>

                <div className="hidden md:flex items-center gap-8">
                    <NavLink href="/toko">Toko UMKM</NavLink>
                    <NavLink href="/berita">Berita</NavLink>
                    <NavLink href="/tantangan">Tantangan</NavLink>
                </div>

                <div className="flex items-center gap-4">
                    {/* Theme Toggle Button */}
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={toggleTheme}
                        className="p-2.5 rounded-xl bg-muted border border-border hover:border-primary transition-colors flex items-center justify-center shadow-sm"
                        aria-label="Toggle theme"
                    >
                        <motion.div
                            initial={false}
                            animate={{ rotate: theme === 'light' ? 0 : 180, scale: [0.5, 1] }}
                            transition={{ type: "spring", stiffness: 200, damping: 10 }}
                        >
                            {theme === 'light' ? (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                                </svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary">
                                    <circle cx="12" cy="12" r="5"></circle>
                                    <line x1="12" y1="1" x2="12" y2="3"></line>
                                    <line x1="12" y1="21" x2="12" y2="23"></line>
                                    <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
                                    <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
                                    <line x1="1" y1="12" x2="3" y2="12"></line>
                                    <line x1="21" y1="12" x2="23" y2="12"></line>
                                    <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
                                    <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
                                </svg>
                            )}
                        </motion.div>
                    </motion.button>

                    {/* Mobile Menu Button */}
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="md:hidden p-2 rounded-lg bg-muted border border-border hover:border-primary transition-colors"
                        aria-label="Toggle mobile menu"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            className="text-foreground"
                        >
                            {isMobileMenuOpen ? (
                                <path d="M18 6L6 18M6 6l12 12" />
                            ) : (
                                <>
                                    <line x1="4" y1="12" x2="20" y2="12" />
                                    <line x1="4" y1="6" x2="20" y2="6" />
                                    <line x1="4" y1="18" x2="20" y2="18" />
                                </>
                            )}
                        </svg>
                    </button>

                    {user ? (
                        <>
                            <span className="text-sm text-muted-foreground hidden md:block">
                                Halo, <span className="text-primary">{user.name}</span>
                            </span>
                            <Link
                                href="/dashboard"
                                className="px-4 py-2 rounded-lg bg-primary/10 text-primary border border-primary/30 hover:bg-primary/20 transition font-medium"
                            >
                                Dashboard
                            </Link>
                            <button
                                onClick={logout}
                                className="text-muted-foreground hover:text-red-500 text-sm transition"
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link
                                href="/login"
                                className="px-4 py-2 text-foreground/70 hover:text-foreground transition"
                            >
                                Masuk
                            </Link>
                            <Link
                                href="/register"
                                className="px-5 py-2 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-semibold hover:shadow-lg hover:shadow-primary/25 transition"
                            >
                                Daftar
                            </Link>
                        </>
                    )}
                </div>
            </div>

            {/* Mobile Menu Overlay */}
            {isMobileMenuOpen && (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="md:hidden fixed inset-0 top-16 bg-background/95 backdrop-blur-sm z-40"
                    onClick={() => setIsMobileMenuOpen(false)}
                >
                    <motion.div
                        initial={{ y: -20, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="container mx-auto px-4 py-6"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex flex-col gap-2">
                            <MobileNavLink href="/toko" onClick={() => setIsMobileMenuOpen(false)}>Toko UMKM</MobileNavLink>
                            <MobileNavLink href="/berita" onClick={() => setIsMobileMenuOpen(false)}>Berita</MobileNavLink>
                            <MobileNavLink href="/tantangan" onClick={() => setIsMobileMenuOpen(false)}>Tantangan</MobileNavLink>

                            <div className="border-t border-border my-4"></div>

                            {user ? (
                                <>
                                    <div className="px-4 py-2 text-sm text-muted-foreground">
                                        Halo, <span className="text-primary font-medium">{user.name}</span>
                                    </div>
                                    <MobileNavLink href="/dashboard" onClick={() => setIsMobileMenuOpen(false)}>Dashboard</MobileNavLink>
                                    <button
                                        onClick={() => {
                                            logout();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block w-full text-left py-3 px-4 text-red-500 hover:bg-red-500/5 rounded-lg transition-colors text-lg font-medium"
                                    >
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <MobileNavLink href="/login" onClick={() => setIsMobileMenuOpen(false)}>Masuk</MobileNavLink>
                                    <MobileNavLink href="/register" onClick={() => setIsMobileMenuOpen(false)}>Daftar</MobileNavLink>
                                </>
                            )}
                        </div>
                    </motion.div>
                </motion.div>
            )}
        </motion.nav>
    );
}

function NavLink({ href, children }: { href: string; children: React.ReactNode }) {
    return (
        <Link
            href={href}
            className="text-foreground/70 hover:text-primary transition relative group"
        >
            {children}
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full" />
        </Link>
    );
}

function MobileNavLink({ href, children, onClick }: { href: string; children: React.ReactNode; onClick: () => void }) {
    return (
        <Link
            href={href}
            onClick={onClick}
            className="block py-3 px-4 text-foreground/80 hover:text-primary hover:bg-primary/5 rounded-lg transition-colors text-lg font-medium"
        >
            {children}
        </Link>
    );
}
