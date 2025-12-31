'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import GradientButton from '@/components/reactbits/GradientButton';

export default function RegisterPage() {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            const { data } = await api.post('/auth/register', { name, email, password });
            localStorage.setItem('token', data.token);
            localStorage.setItem('user', JSON.stringify(data));
            router.push('/dashboard');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Registrasi gagal');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center pt-20 pb-10 relative">
            <div className="relative z-10 w-full max-w-md px-4">
                <FadeIn>
                    <div className="glass rounded-2xl p-8 shadow-xl">
                        <div className="text-center mb-8">
                            <h1 className="text-3xl font-bold mb-2">
                                <BlurText text="Daftar Akun" className="text-foreground" />
                            </h1>
                            <p className="text-foreground/60">Bergabunglah dengan UMKM Sragen</p>
                        </div>

                        {error && (
                            <div className="bg-red-500/10 border border-red-500/30 text-red-500 px-4 py-3 rounded-xl mb-6">
                                {error}
                            </div>
                        )}

                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                    placeholder="Nama Anda"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                    placeholder="nama@email.com"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Password</label>
                                <input
                                    type="password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                    placeholder="••••••••"
                                    required
                                />
                            </div>

                            <GradientButton className="w-full py-3">
                                {loading ? 'Memproses...' : 'Daftar Sekarang'}
                            </GradientButton>
                        </form>

                        <p className="text-center text-foreground/60 mt-6">
                            Sudah punya akun?{' '}
                            <Link href="/login" className="text-primary hover:text-secondary transition">
                                Masuk di sini
                            </Link>
                        </p>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
