'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import { motion } from 'framer-motion';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import GradientButton from '@/components/reactbits/GradientButton';
import ImageUpload from '@/components/ImageUpload';
import Image from 'next/image';
import { getImageUrl } from '@/utils/media';

export default function AdminDashboard() {
    const [user, setUser] = useState<any>(null);
    const [activeTab, setActiveTab] = useState('stats');
    const [stats, setStats] = useState({ users: 0, shops: 0, news: 0 });
    const [newsList, setNewsList] = useState([]);
    const [shops, setShops] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const [newsForm, setNewsForm] = useState({ title: '', content: '', category: '', image: '' });
    const [message, setMessage] = useState('');

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        if (parsedUser.role !== 'admin') {
            router.push('/');
            return;
        }
        setUser(parsedUser);
        fetchData();
    }, [router]);

    const fetchData = async () => {
        try {
            const [newsRes, shopsRes, statsRes] = await Promise.all([
                api.get('/news'),
                api.get('/shops'),
                api.get('/admin/stats')
            ]);
            setNewsList(newsRes.data);
            setShops(shopsRes.data);
            setStats(statsRes.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleCreateNews = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await api.post('/news', newsForm);
            setMessage('Berita berhasil ditambahkan!');
            setNewsForm({ title: '', content: '', category: '', image: '' });
            fetchData();
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Gagal menambah berita');
        }
    };

    const handleDeleteNews = async (id: string) => {
        if (!confirm('Yakin hapus berita ini?')) return;
        try {
            await api.delete(`/news/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    const handleDeleteShop = async (id: string) => {
        if (!confirm('Yakin hapus toko ini?')) return;
        try {
            await api.delete(`/shops/${id}`);
            fetchData();
        } catch (error) {
            console.error(error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-foreground/60 font-medium">Loading...</div>
            </div>
        );
    }

    if (!user) return null;

    const tabs = [
        { id: 'stats', label: 'Ringkasan', icon: '📊' },
        { id: 'news', label: 'Kelola Berita', icon: '📰' },
        { id: 'shops', label: 'Kelola Toko', icon: '🏪' },
    ];

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4">
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <BlurText text="Panel Admin" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="Sragen Hub" className="gradient-text" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60">Kelola konten UMKM Sragen Hub</p>
                    </div>
                </FadeIn>

                {message && (
                    <FadeIn>
                        <div
                            className={`px-4 py-3 rounded-xl mb-6 shadow-sm ${message.includes('berhasil')
                                ? 'bg-primary/10 border border-primary/30 text-primary font-medium'
                                : 'bg-red-500/10 border border-red-500/30 text-red-500 font-medium'
                                }`}
                        >
                            {message}
                        </div>
                    </FadeIn>
                )}

                {/* Tabs */}
                <FadeIn delay={0.1}>
                    <div className="flex gap-2 mb-8 overflow-x-auto pb-2 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`group relative flex items-center gap-2 px-5 py-3 rounded-xl font-semibold transition whitespace-nowrap shadow-sm ${activeTab === tab.id
                                    ? 'text-white'
                                    : 'bg-card border border-border text-foreground/60 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTab"
                                        className="absolute inset-0 bg-primary rounded-xl shadow-md shadow-primary/20"
                                        initial={false}
                                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                    />
                                )}
                                <span className="relative z-10">{tab.icon}</span>
                                <span className="relative z-10">{tab.label}</span>
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* Stats Tab */}
                {activeTab === 'stats' && (
                    <FadeIn delay={0.2}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                            <SpotlightCard className="p-8 text-center border-b-4 border-primary">
                                <div className="text-4xl mb-2">👥</div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-1">
                                    {stats.users}
                                </div>
                                <div className="text-foreground/60 font-medium uppercase tracking-wider text-sm">Total Akun</div>
                            </SpotlightCard>

                            <SpotlightCard className="p-8 text-center border-b-4 border-secondary">
                                <div className="text-4xl mb-2">🏪</div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent mb-1">
                                    {stats.shops}
                                </div>
                                <div className="text-foreground/60 font-medium uppercase tracking-wider text-sm">Total Toko</div>
                            </SpotlightCard>

                            <SpotlightCard className="p-8 text-center border-b-4 border-accent">
                                <div className="text-4xl mb-2">📰</div>
                                <div className="text-4xl font-bold bg-gradient-to-r from-accent to-primary bg-clip-text text-transparent mb-1">
                                    {stats.news}
                                </div>
                                <div className="text-foreground/60 font-medium uppercase tracking-wider text-sm">Total Berita</div>
                            </SpotlightCard>
                        </div>

                        <div className="rounded-3xl p-8 bg-gradient-to-br from-primary/5 to-secondary/5 border border-border/50">
                            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
                                <span>🚀</span> Dashboard Admin Sragen Hub
                            </h3>
                            <p className="text-foreground/70 leading-relaxed mb-4">
                                Selamat datang di panel administrasi UMKM Sragen Hub. Gunakan tab di atas untuk mengelola berita terbaru atau mengawasi toko-toko yang terdaftar di platform.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <div className="px-4 py-2 bg-background/50 rounded-xl border border-border text-xs text-foreground/50">
                                    Status Server: <span className="text-green-500 font-bold ml-1">Aktif</span>
                                </div>
                                <div className="px-4 py-2 bg-background/50 rounded-xl border border-border text-xs text-foreground/50">
                                    Database: <span className="text-primary font-bold ml-1">Terhubung</span>
                                </div>
                            </div>
                        </div>
                    </FadeIn>
                )}

                {/* News Tab */}
                {activeTab === 'news' && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <FadeIn delay={0.2}>
                            <SpotlightCard className="p-6">
                                <h2 className="text-xl font-bold text-foreground mb-6">Tambah Berita Baru</h2>
                                <form onSubmit={handleCreateNews} className="space-y-4">
                                    <input
                                        type="text"
                                        placeholder="Judul Berita"
                                        value={newsForm.title}
                                        onChange={(e) => setNewsForm({ ...newsForm, title: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:ring-1 focus:ring-primary/20 focus:outline-none transition shadow-sm"
                                        required
                                    />
                                    <select
                                        value={newsForm.category}
                                        onChange={(e) => setNewsForm({ ...newsForm, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground focus:border-primary focus:outline-none transition"
                                        required
                                    >
                                        <option value="">Pilih Kategori</option>
                                        <option value="Inovasi">Inovasi</option>
                                        <option value="Event">Event</option>
                                        <option value="Bisnis">Bisnis</option>
                                        <option value="Tips">Tips</option>
                                    </select>
                                    <textarea
                                        placeholder="Konten Berita"
                                        rows={5}
                                        value={newsForm.content}
                                        onChange={(e) => setNewsForm({ ...newsForm, content: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted/50 border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition resize-none"
                                        required
                                    />
                                    <ImageUpload
                                        label="Gambar Berita"
                                        currentImage={newsForm.image}
                                        onUploadSuccess={(url) => setNewsForm({ ...newsForm, image: url })}
                                    />
                                    <GradientButton className="w-full py-3">Tambah Berita</GradientButton>
                                </form>
                            </SpotlightCard>
                        </FadeIn>

                        <FadeIn delay={0.3}>
                            <div>
                                <h2 className="text-xl font-bold text-foreground mb-4">Daftar Berita ({newsList.length})</h2>
                                <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                                    {newsList.map((news: any) => (
                                        <SpotlightCard key={news._id} className="p-4 flex justify-between items-center bg-card/60">
                                            <div>
                                                <h3 className="font-semibold text-foreground">{news.title}</h3>
                                                <span className="text-xs text-primary font-medium">{news.category}</span>
                                            </div>
                                            <button
                                                onClick={() => handleDeleteNews(news._id)}
                                                className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                                            >
                                                Hapus
                                            </button>
                                        </SpotlightCard>
                                    ))}
                                    {newsList.length === 0 && (
                                        <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border opacity-50">
                                            <p className="text-foreground/40">Belum ada berita</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </FadeIn>
                    </div>
                )}

                {/* Shops Tab */}
                {activeTab === 'shops' && (
                    <FadeIn delay={0.2}>
                        <div>
                            <h2 className="text-xl font-bold text-foreground mb-4">Daftar Toko ({shops.length})</h2>
                            {shops.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {shops.map((shop: any) => (
                                        <SpotlightCard key={shop._id} className="p-4">
                                            <h3 className="font-bold text-lg text-foreground">{shop.name}</h3>
                                            <p className="text-sm text-foreground/50">{shop.category} - {shop.location}</p>
                                            <div className="mt-4 flex justify-end">
                                                <button
                                                    onClick={() => handleDeleteShop(shop._id)}
                                                    className="text-red-500 hover:text-red-600 text-sm font-medium transition"
                                                >
                                                    Hapus Toko
                                                </button>
                                            </div>
                                        </SpotlightCard>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-20 bg-muted/30 rounded-2xl border border-dashed border-border opacity-50">
                                    <p className="text-foreground/40 font-medium">Belum ada toko terdaftar</p>
                                </div>
                            )}
                        </div>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}
