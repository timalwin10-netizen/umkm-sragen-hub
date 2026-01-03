'use client';
import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import api from '@/utils/api';
import FadeIn from '@/components/reactbits/FadeIn';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import GradientButton from '@/components/reactbits/GradientButton';
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

export default function NewsDetailPage() {
    const { id } = useParams();
    const [news, setNews] = useState<News | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNews = async () => {
            try {
                const { data } = await api.get(`/news/${id}`);
                setNews(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchNews();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-foreground/60">Loading...</div>
            </div>
        );
    }

    if (!news) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="text-6xl mb-4">📰</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Berita Tidak Ditemukan</h2>
                <p className="text-foreground/60 mb-6">Artikel yang Anda cari tidak tersedia</p>
                <Link href="/berita">
                    <GradientButton>← Kembali ke Daftar Berita</GradientButton>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Breadcrumb */}
                <FadeIn>
                    <div className="flex items-center gap-2.5 text-sm text-foreground/40 mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <span className="opacity-40">/</span>
                        <Link href="/berita" className="hover:text-primary transition-colors">Berita</Link>
                        <span className="opacity-40">/</span>
                        <span className="text-foreground/80 font-semibold line-clamp-1">{news.title}</span>
                    </div>
                </FadeIn>

                {/* Article */}
                <FadeIn>
                    <article>
                        {/* Header */}
                        <div className="mb-8">
                            <div className="flex items-center gap-3 mb-4">
                                <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                    {news.category}
                                </span>
                                <span className="text-foreground/50 text-sm">
                                    {new Date(news.createdAt).toLocaleDateString('id-ID', {
                                        weekday: 'long',
                                        day: 'numeric',
                                        month: 'long',
                                        year: 'numeric',
                                    })}
                                </span>
                            </div>
                            <h1 className="text-3xl md:text-4xl font-bold text-foreground leading-tight">
                                {news.title}
                            </h1>
                        </div>

                        {/* Featured Image */}
                        <div className="relative h-64 md:h-96 rounded-2xl overflow-hidden mb-8 border border-border mt-4">
                            <Image
                                src={getImageUrl(news.image) || 'https://placehold.co/1200x600/f5f0e8/8b5a2b?text=News'}
                                alt={news.title}
                                fill
                                className="object-cover"
                                priority
                            />
                        </div>

                        {/* Content */}
                        <SpotlightCard className="p-8">
                            <div className="max-w-none">
                                <p className="text-foreground/80 leading-relaxed whitespace-pre-line text-lg">
                                    {news.content}
                                </p>
                            </div>
                        </SpotlightCard>

                        {/* Share */}
                        <div className="mt-8 flex items-center justify-between border-t border-border pt-8">
                            <Link href="/berita" className="text-foreground/50 hover:text-primary transition font-medium">
                                ← Kembali ke Daftar Berita
                            </Link>
                            <div className="flex items-center gap-3">
                                <span className="text-foreground/50 text-sm">Bagikan:</span>
                                <button className="w-10 h-10 rounded-full bg-card border border-border flex items-center justify-center text-foreground/40 hover:text-primary hover:border-primary transition shadow-sm">
                                    📋
                                </button>
                            </div>
                        </div>
                    </article>
                </FadeIn>
            </div>
        </div>
    );
}
