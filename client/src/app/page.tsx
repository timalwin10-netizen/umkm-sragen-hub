'use client';
import { useEffect, useState } from 'react';
import Link from 'next/link';
import api from '@/utils/api';
import { AuroraSection } from '@/components/reactbits/Aurora';
import BlurText from '@/components/reactbits/BlurText';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import FadeIn from '@/components/reactbits/FadeIn';
import MagneticButton from '@/components/reactbits/MagneticButton';
import GradientButton from '@/components/reactbits/GradientButton';
import Image from 'next/image';
import Aurora from '@/components/reactbits/Aurora';

interface Shop {
  _id: string;
  name: string;
  category: string;
  image: string;
  location: string;
}

interface News {
  _id: string;
  title: string;
  category: string;
  image: string;
  createdAt: string;
}

export default function Home() {
  const [shops, setShops] = useState<Shop[]>([]);
  const [news, setNews] = useState<News[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [shopsRes, newsRes] = await Promise.all([
          api.get('/shops?limit=6'),
          api.get('/news?limit=3'),
        ]);
        setShops(shopsRes.data.slice(0, 6));
        setNews(newsRes.data.slice(0, 3));
      } catch (error) {
        console.error('Error fetching home data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="relative">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden -mt-20 pt-20">
        {/* Dynamic Background for Hero only */}
        <Aurora speed={0.4} intensity={0.1} />

        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto">
          <FadeIn>
            <span className="inline-block px-4 py-2 rounded-full bg-primary/10 border border-primary/30 text-primary text-sm font-medium mb-6">
              🚀 Platform Digital UMKM Sragen
            </span>
          </FadeIn>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
            <BlurText text="Majukan UMKM" className="text-foreground" />
            <br />
            <BlurText text="Sragen Bersama" className="gradient-text" delay={0.1} />
          </h1>

          <FadeIn delay={0.3}>
            <p className="text-xl text-foreground/60 max-w-2xl mx-auto mb-10">
              Temukan produk lokal terbaik, dukung UMKM daerah, dan jadilah bagian dari
              pertumbuhan ekonomi Sragen.
            </p>
          </FadeIn>

          <FadeIn delay={0.5}>
            <div className="flex flex-wrap gap-4 justify-center">
              <MagneticButton>
                <Link href="/toko">
                  <GradientButton>
                    Jelajahi Toko →
                  </GradientButton>
                </Link>
              </MagneticButton>
              <MagneticButton>
                <Link
                  href="/register"
                  className="px-6 py-3 rounded-xl border border-border text-foreground font-semibold hover:bg-muted transition"
                >
                  Daftarkan UMKM
                </Link>
              </MagneticButton>
            </div>
          </FadeIn>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce">
          <div className="w-6 h-10 rounded-full border-2 border-foreground/30 flex items-start justify-center p-1">
            <div className="w-1.5 h-3 bg-primary rounded-full animate-pulse" />
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 relative">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { value: '500+', label: 'UMKM Terdaftar' },
              { value: '1000+', label: 'Produk Lokal' },
              { value: '50+', label: 'Kategori' },
              { value: '10K+', label: 'Pengguna Aktif' },
            ].map((stat, index) => (
              <FadeIn key={index} delay={index * 0.1}>
                <div className="text-center">
                  <div className="text-4xl md:text-5xl font-bold gradient-text mb-2">
                    {stat.value}
                  </div>
                  <div className="text-foreground/60">{stat.label}</div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Shops */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Toko <span className="gradient-text">Pilihan</span>
                </h2>
                <p className="text-foreground/60">UMKM unggulan Sragen</p>
              </div>
              <Link
                href="/toko"
                className="text-primary hover:text-secondary transition hidden md:block"
              >
                Lihat Semua →
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : shops.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {shops.map((shop, index) => (
                <FadeIn key={shop._id} delay={index * 0.1}>
                  <Link href={`/toko/${shop._id}`}>
                    <SpotlightCard className="group cursor-pointer">
                      <div className="h-48 overflow-hidden rounded-t-2xl relative">
                        <Image
                          src={shop.image || 'https://placehold.co/600x400/f5f0e8/8b5a2b?text=UMKM'}
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
                        <h3 className="text-xl font-bold text-foreground group-hover:text-primary transition">
                          {shop.name}
                        </h3>
                        <p className="text-foreground/60 text-sm mt-1">📍 {shop.location}</p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/50">
              <p>Belum ada toko terdaftar</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest News */}
      <section className="py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="flex justify-between items-center mb-12">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  Berita <span className="gradient-text">Terkini</span>
                </h2>
                <p className="text-foreground/60">Update terbaru dari UMKM Sragen</p>
              </div>
              <Link
                href="/berita"
                className="text-primary hover:text-secondary transition hidden md:block"
              >
                Lihat Semua →
              </Link>
            </div>
          </FadeIn>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-muted animate-pulse" />
              ))}
            </div>
          ) : news.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {news.map((item, index) => (
                <FadeIn key={item._id} delay={index * 0.1}>
                  <Link href={`/berita/${item._id}`}>
                    <SpotlightCard className="group cursor-pointer h-full">
                      <div className="h-48 overflow-hidden rounded-t-2xl relative">
                        <Image
                          src={item.image || 'https://placehold.co/600x400/f5f0e8/8b5a2b?text=News'}
                          alt={item.title}
                          fill
                          className="object-cover group-hover:scale-110 transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      </div>
                      <div className="p-5">
                        <span className="inline-block px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium mb-3">
                          {item.category}
                        </span>
                        <h3 className="text-lg font-bold text-foreground group-hover:text-primary transition line-clamp-2">
                          {item.title}
                        </h3>
                        <p className="text-foreground/50 text-sm mt-2">
                          {new Date(item.createdAt).toLocaleDateString('id-ID', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </SpotlightCard>
                  </Link>
                </FadeIn>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 text-foreground/50">
              <p>Belum ada berita</p>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <FadeIn>
            <div className="relative rounded-3xl overflow-hidden border border-border">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/10 to-secondary/10" />
              <AuroraSection speed={0.8} />
              <div className="relative z-10 text-center py-20 px-4">
                <h2 className="text-3xl md:text-5xl font-bold text-foreground mb-6">
                  Siap Memajukan <span className="gradient-text">Bisnis Anda?</span>
                </h2>
                <p className="text-xl text-foreground/70 max-w-2xl mx-auto mb-10">
                  Bergabunglah dengan ribuan UMKM lainnya dan nikmati kemudahan berjualan online.
                </p>
                <MagneticButton>
                  <Link href="/register">
                    <GradientButton className="text-lg px-8 py-4">
                      Daftar Sekarang – Gratis!
                    </GradientButton>
                  </Link>
                </MagneticButton>
              </div>
            </div>
          </FadeIn>
        </div>
      </section>
    </div>
  );
}
