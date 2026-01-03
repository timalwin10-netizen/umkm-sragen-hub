'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import Image from 'next/image';
import { getImageUrl } from '@/utils/media';
import dynamic from 'next/dynamic';

const MapViewer = dynamic(() => import('@/components/MapViewer'), {
    ssr: false,
    loading: () => <div className="h-[600px] w-full bg-muted animate-pulse rounded-2xl" />
});

interface Shop {
    _id: string;
    name: string;
    description: string;
    category: string;
    location: string;
    latitude?: number;
    longitude?: number;
    image: string;
}

export default function TokoPage() {
    const [shops, setShops] = useState<Shop[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

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
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4 flex justify-center flex-wrap items-center">
                            <BlurText text="Toko" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="UMKM" className="text-primary" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60 max-w-2xl mx-auto">
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

                {/* View Toggle */}
                <FadeIn delay={0.3}>
                    <div className="flex justify-end mb-6">
                        <div className="bg-muted p-1 rounded-lg flex gap-1">
                            <button
                                onClick={() => setViewMode('list')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'list' ? 'bg-white shadow-sm text-primary' : 'text-foreground/60 hover:text-foreground'}`}
                            >
                                <span className="mr-2">📋</span>
                                Daftar
                            </button>
                            <button
                                onClick={() => setViewMode('map')}
                                className={`px-4 py-2 rounded-md text-sm font-medium transition ${viewMode === 'map' ? 'bg-white shadow-sm text-primary' : 'text-foreground/60 hover:text-foreground'}`}
                            >
                                <span className="mr-2">🗺️</span>
                                Peta
                            </button>
                        </div>
                    </div>
                </FadeIn>

                {/* Content */}
                {viewMode === 'list' ? (
                    <>
                        {loading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {[1, 2, 3, 4, 5, 6].map((i) => (
                                    <div key={i} className="h-72 rounded-2xl bg-muted animate-pulse" />
                                ))}
                            </div>
                        ) : filteredShops.length > 0 ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredShops.map((shop, index) => (
                                    <Link key={shop._id} href={`/toko/${shop._id}`} className="block h-full">
                                        <SpotlightCard className="h-full flex flex-col group cursor-pointer">
                                            <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-muted">
                                                {shop.image ? (
                                                    <Image
                                                        src={getImageUrl(shop.image)}
                                                        alt={shop.name}
                                                        fill
                                                        className="object-cover group-hover:scale-105 transition duration-500"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-foreground/20 text-4xl font-bold bg-muted">
                                                        {shop.name.charAt(0)}
                                                    </div>
                                                )}
                                                <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold text-primary shadow-sm">
                                                    {shop.category}
                                                </div>
                                            </div>
                                            <h3 className="text-xl font-bold mb-2 group-hover:text-primary transition">{shop.name}</h3>
                                            <p className="text-foreground/60 text-sm line-clamp-2 mb-4 flex-grow">{shop.description}</p>
                                            <div className="flex items-center text-xs text-foreground/50 mt-auto">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                {shop.location}
                                            </div>
                                        </SpotlightCard>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-20">
                                <p className="text-foreground/40 text-lg">Tidak ada toko yang ditemukan.</p>
                            </div>
                        )}
                    </>
                ) : (
                    <FadeIn>
                        <MapViewer shops={filteredShops} />
                    </FadeIn>
                )}
            </div>
        </div >
    );
}
