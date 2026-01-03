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

interface Shop {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    latitude?: number;
    longitude?: number;
    openingHours?: string;
    image: string;
    contact: {
        whatsapp?: string;
        email?: string;
    };
    products: any[];
}

export default function ShopDetailPage() {
    const { id } = useParams();
    const [shop, setShop] = useState<Shop | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchShop = async () => {
            try {
                const { data } = await api.get(`/shops/${id}`);
                setShop(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchShop();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-foreground/60">Loading...</div>
            </div>
        );
    }

    if (!shop) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center pt-20">
                <div className="text-6xl mb-4">😢</div>
                <h2 className="text-2xl font-bold text-foreground mb-2">Toko Tidak Ditemukan</h2>
                <p className="text-foreground/60 mb-6">Toko yang Anda cari tidak tersedia</p>
                <Link href="/toko">
                    <GradientButton>← Kembali ke Daftar Toko</GradientButton>
                </Link>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <FadeIn>
                    <div className="flex items-center gap-2.5 text-sm text-foreground/40 mb-8">
                        <Link href="/" className="hover:text-primary transition-colors">Beranda</Link>
                        <span className="opacity-40">/</span>
                        <Link href="/toko" className="hover:text-primary transition-colors">Toko</Link>
                        <span className="opacity-40">/</span>
                        <span className="text-foreground/80 font-semibold">{shop.name}</span>
                    </div>
                </FadeIn>

                {/* Banner */}
                <FadeIn>
                    <div className="relative h-64 md:h-80 rounded-2xl overflow-hidden mb-8 border border-border">
                        <Image
                            src={getImageUrl(shop.image) || 'https://placehold.co/1200x400/f5f0e8/8b5a2b?text=UMKM'}
                            alt={shop.name}
                            fill
                            className="object-cover"
                            priority
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />
                    </div>
                </FadeIn>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        <FadeIn delay={0.1}>
                            <SpotlightCard className="p-8 mb-6">
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                                            {shop.category}
                                        </span>
                                        <h1 className="text-3xl font-bold text-foreground">{shop.name}</h1>
                                        <p className="text-foreground/60 mt-1">📍 {shop.location}</p>
                                    </div>
                                </div>
                                <p className="text-foreground/80 leading-relaxed whitespace-pre-line">{shop.description}</p>
                            </SpotlightCard>
                        </FadeIn>

                        {/* Products */}
                        <FadeIn delay={0.2}>
                            <SpotlightCard className="p-8">
                                <h2 className="text-xl font-bold text-foreground mb-6">Produk</h2>
                                {shop.products && shop.products.length > 0 ? (
                                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                        {shop.products.map((product: any, index: number) => (
                                            <div key={index} className="bg-muted/50 rounded-xl p-4 border border-border">
                                                <div className="h-32 rounded-lg bg-card mb-3 overflow-hidden relative">
                                                    <Image
                                                        src={getImageUrl(product.image) || 'https://placehold.co/200x200/f5f0e8/8b5a2b?text=Produk'}
                                                        alt={product.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                </div>
                                                <h3 className="font-medium text-foreground text-sm">{product.name}</h3>
                                                <p className="text-primary font-bold">
                                                    Rp {product.price?.toLocaleString('id-ID')}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 text-foreground/40">
                                        <div className="text-4xl mb-2">📦</div>
                                        <p>Belum ada produk ditampilkan</p>
                                    </div>
                                )}
                            </SpotlightCard>
                        </FadeIn>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        <FadeIn delay={0.3}>
                            <SpotlightCard className="p-6 sticky top-28">
                                <h3 className="text-lg font-bold text-foreground mb-4">Hubungi Penjual</h3>
                                <div className="space-y-3">
                                    {shop.contact?.whatsapp && (
                                        <a
                                            href={`https://wa.me/${shop.contact.whatsapp}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-primary/10 border border-primary/30 text-primary hover:bg-primary/20 transition font-medium"
                                        >
                                            <span className="text-xl">📱</span>
                                            <span>WhatsApp</span>
                                        </a>
                                    )}
                                    {shop.contact?.email && (
                                        <a
                                            href={`mailto:${shop.contact.email}`}
                                            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl bg-foreground/5 border border-foreground/10 text-foreground/70 hover:bg-foreground/10 transition font-medium"
                                        >
                                            <span className="text-xl">✉️</span>
                                            <span>Email</span>
                                        </a>
                                    )}
                                    {!shop.contact?.whatsapp && !shop.contact?.email && (
                                        <p className="text-foreground/40 text-sm italic">Tidak ada kontak tersedia</p>
                                    )}
                                </div>

                                <div className="mt-8 pt-6 border-t border-border">
                                    <h3 className="text-lg font-bold text-foreground mb-4">Informasi Toko</h3>

                                    <div className="mb-4">
                                        <div className="text-sm text-foreground/60 mb-1">🕒 Jam Operasional</div>
                                        <div className="font-medium">{shop.openingHours || '08:00 - 17:00'}</div>
                                    </div>

                                    {shop.latitude && shop.longitude && (
                                        <a
                                            href={`https://www.google.com/maps/dir/?api=1&destination=${shop.latitude},${shop.longitude}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="flex items-center justify-center gap-2 w-full px-4 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white transition font-medium shadow-lg shadow-blue-600/20"
                                        >
                                            <span className="text-xl">🗺️</span>
                                            <span>Petunjuk Arah</span>
                                        </a>
                                    )}
                                </div>
                            </SpotlightCard>
                        </FadeIn>
                    </div>
                </div>
            </div>
        </div>
    );
}
