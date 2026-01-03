'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import Image from 'next/image';
import { getImageUrl } from '@/utils/media';

interface Shop {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    image: string;
}

export default function TokoPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');

    const categories = ['Semua', 'Kuliner', 'Kerajinan', 'Fashion', 'Pertanian', 'Jasa', 'Lainnya'];

    useEffect(() => {
        const fetchShops = async () => {
            try {
                const { data } = await api.get('/shops');
                setShops(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchShops();
    }, []);

    const filteredShops = shops.filter((shop) => {
        const matchesSearch = shop.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === '' || selectedCategory === 'Semua' || shop.category === selectedCategory;
        return matchesSearch && matchesCategory;
    });

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-left mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <BlurText text="Toko" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="UMKM" className="gradient-text" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60 max-w-2xl">
                            Temukan berbagai produk dan jasa dari UMKM Sragen. Dukung ekonomi lokal dengan berbelanja dari pelaku usaha daerah.
                        </p>
                    </div>
                </FadeIn>

                {/* Search & Filter */}
                <FadeIn delay={0.2}>
                    <div className="flex flex-col md:flex-row gap-4 mb-10">
                        <div className="flex-1 relative">
                            <input
                                type="text"
                                placeholder="Cari toko..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-5 py-3 rounded-xl bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                            />
                            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-foreground/40">🔍</span>
                        </div>
                        <div className="flex gap-2 flex-wrap">
                            {categories.map((cat) => (
                                <button
                                    key={cat}
                                    onClick={() => setSelectedCategory(cat === 'Semua' ? '' : cat)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition ${(cat === 'Semua' && selectedCategory === '') || selectedCategory === cat
                                        ? 'bg-primary text-white'
                                        : 'bg-card border border-border text-foreground/60 hover:border-primary hover:text-primary'
                                        }`}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                </FadeIn>

                {/* Shop Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : filteredShops.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredShops.map((shop, index) => (
                            <FadeIn key={shop._id} delay={index * 0.05}>
                                <Link href={`/toko/${shop._id}`}>
                                    <SpotlightCard className="group cursor-pointer h-full">
                                        <div className="h-48 overflow-hidden rounded-t-2xl relative">
                                            <Image
                                                src={getImageUrl(shop.image) || 'https://placehold.co/600x400/f5f0e8/8b5a2b?text=UMKM'}
                                                alt={shop.name}
                                                fill
                                                className="object-cover group-hover:scale-110 transition-transform duration-500"
                                                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                            />
                                        </div>
                                        <div className="p-5">
                                            <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                                                {shop.category}
                                            </span>
                                            <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition mb-2">
                                                {shop.name}
                                            </h3>
                                            <p className="text-foreground/60 text-sm line-clamp-2 mb-2">{shop.description}</p>
                                            <p className="text-foreground/50 text-sm">📍 {shop.location}</p>
                                        </div>
                                    </SpotlightCard>
                                </Link>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏪</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Tidak Ada Toko</h3>
                        <p className="text-foreground/60">
                            {searchTerm || selectedCategory
                                ? 'Tidak ditemukan toko dengan kriteria tersebut'
                                : 'Belum ada toko yang terdaftar'}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
