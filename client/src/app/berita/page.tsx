'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import Image from 'next/image';
import { getImageUrl } from '@/utils/media';

interface News {
    _id: string;
    title: string;
    content: string;
    category: string;
    image: string;
    createdAt: string;
}

export default function BeritaPage() {
    const [news, setNews] = useState<News[]>([]);
    const [loading, setLoading] = useState(true);
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['Semua', 'Inovasi', 'Event', 'Bisnis', 'Tips'];

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data } = await api.get('/news');
                setNews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchNews();
    }, []);

    const filteredNews = news.filter((item) => {
        return selectedCategory === '' || selectedCategory === 'Semua' || item.category === selectedCategory;
    });

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-left mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <BlurText text="Berita" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="Terkini" className="gradient-text" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60 max-w-2xl">
                            Ikuti perkembangan terbaru dari dunia UMKM Sragen. Inspirasi, tips, dan berita terkini untuk pelaku usaha.
                        </p>
                    </div>
                </FadeIn>

                {/* Category Filter */}
                <FadeIn delay={0.2}>
                    <div className="flex gap-2 flex-wrap justify-start mb-10">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setSelectedCategory(cat === 'Semua' ? '' : cat)}
                                className={`px-5 py-2 rounded-lg text-sm font-medium transition ${(cat === 'Semua' && selectedCategory === '') || selectedCategory === cat
                                    ? 'bg-primary text-white'
                                    : 'bg-card border border-border text-foreground/60 hover:border-primary hover:text-primary'
                                    }`}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </FadeIn>

                {/* News Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : filteredNews.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredNews.map((item, index) => (
                            <FadeIn key={item._id} delay={index * 0.05}>
                                <Link href={`/berita/${item._id}`}>
                                    <SpotlightCard className="group cursor-pointer h-full">
                                        <div className="h-48 overflow-hidden rounded-t-2xl relative">
                                            <Image
                                                src={getImageUrl(item.image) || 'https://placehold.co/600x400/f5f0e8/8b5a2b?text=News'}
                                                alt={item.title}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <div className="flex items-center gap-3 mb-3">
                                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                    {item.category}
                                                </span>
                                                <span className="text-foreground/50 text-xs">
                                                    {new Date(item.createdAt).toLocaleDateString('id-ID', {
                                                        day: 'numeric',
                                                        month: 'short',
                                                        year: 'numeric',
                                                    })}
                                                </span>
                                            </div>
                                            <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition line-clamp-2 mb-2">
                                                {item.title}
                                            </h3>
                                            <p className="text-foreground/60 text-sm line-clamp-2">{item.content}</p>
                                        </div>
                                    </SpotlightCard>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">📰</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Tidak Ada Berita</h3>
                        <p className="text-foreground/60">Belum ada berita yang dipublikasikan</p>
                    </div>
                )}
            </div>
        </div>
    );
}
