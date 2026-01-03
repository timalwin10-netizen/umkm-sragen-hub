'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import GradientButton from '@/components/reactbits/GradientButton';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function AkunPage() {
    const [user, setUser] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);
        setFormData({
            name: parsedUser.name || '',
            email: parsedUser.email || '',
            password: '',
            confirmPassword: '',
        });
        setLoading(false);
    }, [router]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage('');

        if (formData.password && formData.password !== formData.confirmPassword) {
            setMessage('Error: Password tidak cocok');
            return;
        }

        setSaving(true);
        try {
            const payload: any = {
                name: formData.name,
                email: formData.email,
            };
            if (formData.password) {
                payload.password = formData.password;
            }

            const { data } = await api.put('/auth/profile', payload);

            // Update local storage and state
            const updatedUser = { ...user, name: data.name, email: data.email };
            localStorage.setItem('user', JSON.stringify(updatedUser));
            if (data.token) {
                localStorage.setItem('token', data.token);
            }
            setUser(updatedUser);

            setMessage('Profil berhasil diperbarui!');
            setFormData(prev => ({ ...prev, password: '', confirmPassword: '' }));

            // Redirect after success or just stay
            setTimeout(() => setMessage(''), 3000);
        } catch (error: any) {
            setMessage('Error: ' + (error.response?.data?.message || 'Gagal memperbarui profil'));
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-foreground/60">Memuat...</div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-2xl">
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <BlurText text="Pengaturan" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="Akun" className="gradient-text" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60">
                            Kelola informasi profil dan keamanan akun Anda.
                        </p>
                    </div>
                </FadeIn>

                {message && (
                    <FadeIn>
                        <div
                            className={`px-4 py-3 rounded-xl mb-6 ${message.includes('berhasil')
                                ? 'bg-primary/10 border border-primary/30 text-primary'
                                : 'bg-red-500/10 border border-red-500/30 text-red-500'
                                }`}
                        >
                            {message}
                        </div>
                    </FadeIn>
                )}

                <FadeIn delay={0.1}>
                    <SpotlightCard className="p-8">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Nama Lengkap</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                    placeholder="Nama Anda"
                                    required
                                />
                            </div>

                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Email</label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                    placeholder="email@contoh.com"
                                    required
                                />
                            </div>

                            <hr className="border-border opacity-50 my-6" />

                            <div>
                                <h3 className="text-lg font-semibold text-foreground mb-4">Ubah Kata Sandi</h3>
                                <p className="text-sm text-foreground/50 mb-4 italic">Biarkan kosong jika tidak ingin mengubah kata sandi.</p>

                                <div className="space-y-4">
                                    <div>
                                        <label className="block text-foreground/80 text-sm font-medium mb-2">Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            value={formData.password}
                                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-foreground/80 text-sm font-medium mb-2">Konfirmasi Kata Sandi Baru</label>
                                        <input
                                            type="password"
                                            value={formData.confirmPassword}
                                            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                            className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                            placeholder="••••••••"
                                        />
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-end pt-4">
                                <GradientButton className="px-8 py-3" disabled={saving}>
                                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                                </GradientButton>
                            </div>
                        </form>
                    </SpotlightCard>
                </FadeIn>

                <FadeIn delay={0.2}>
                    <div className="mt-8 p-6 rounded-2xl border border-red-500/20 bg-red-500/5">
                        <h3 className="text-lg font-bold text-red-500 mb-2">Zona Berbahaya</h3>
                        <p className="text-sm text-foreground/60 mb-4">
                            Menghapus akun Anda bersifat permanen dan tidak dapat dibatalkan. Semua data toko dan berita Anda akan ikut terhapus.
                        </p>
                        <button className="px-4 py-2 rounded-lg border border-red-500 text-red-500 hover:bg-red-500 hover:text-white transition font-medium text-sm">
                            Hapus Akun
                        </button>
                    </div>
                </FadeIn>
            </div>
        </div>
    );
}
