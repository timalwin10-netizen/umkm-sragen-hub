'use client';
import { useEffect, useState } from 'react';
import api from '@/utils/api';
import SpotlightCard from '@/components/reactbits/SpotlightCard';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import GradientButton from '@/components/reactbits/GradientButton';

interface Challenge {
    _id: string;
    title: string;
    description: string;
    deadline: string;
    image: string;
    participants: any[];
}

export default function TantanganPage() {
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchChallenges = async () => {
            try {
                const { data } = await api.get('/challenges');
                setChallenges(data);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };
        fetchChallenges();
    }, []);

    const isExpired = (deadline: string) => new Date(deadline) < new Date();

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4">
                {/* Header */}
                <FadeIn>
                    <div className="text-center mb-12">
                        <h1 className="text-4xl md:text-5xl font-bold mb-4">
                            <BlurText text="Tantangan" className="text-foreground" />
                            <span className="mx-2"> </span>
                            <BlurText text="UMKM" className="gradient-text" delay={0.1} />
                        </h1>
                        <p className="text-foreground/60 max-w-2xl mx-auto">
                            Ikuti berbagai tantangan dan kompetisi untuk mengembangkan bisnis Anda. Menangkan hadiah menarik!
                        </p>
                    </div>
                </FadeIn>

                {/* Challenges Grid */}
                {loading ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {[1, 2, 3, 4].map((i) => (
                            <div key={i} className="h-64 rounded-2xl bg-muted animate-pulse" />
                        ))}
                    </div>
                ) : challenges.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {challenges.map((challenge, index) => (
                            <FadeIn key={challenge._id} delay={index * 0.1}>
                                <SpotlightCard className="p-6">
                                    <div className="flex flex-col md:flex-row gap-6">
                                        <div className="w-full md:w-48 h-48 rounded-xl overflow-hidden flex-shrink-0">
                                            <img
                                                src={challenge.image || 'https://placehold.co/400x400/f5f0e8/8b5a2b?text=Challenge'}
                                                alt={challenge.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center gap-3 mb-3">
                                                {isExpired(challenge.deadline) ? (
                                                    <span className="px-3 py-1 rounded-full bg-red-500/10 text-red-500 text-xs font-medium">
                                                        Berakhir
                                                    </span>
                                                ) : (
                                                    <span className="px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-medium">
                                                        Aktif
                                                    </span>
                                                )}
                                                <span className="text-foreground/50 text-sm">
                                                    {challenge.participants?.length || 0} peserta
                                                </span>
                                            </div>
                                            <h3 className="text-xl font-bold text-foreground mb-2">{challenge.title}</h3>
                                            <p className="text-foreground/60 text-sm line-clamp-2 mb-4">{challenge.description}</p>
                                            <div className="flex items-center justify-between">
                                                <div className="text-sm">
                                                    <span className="text-foreground/50">Deadline: </span>
                                                    <span className={isExpired(challenge.deadline) ? 'text-red-500' : 'text-primary font-bold'}>
                                                        {new Date(challenge.deadline).toLocaleDateString('id-ID', {
                                                            day: 'numeric',
                                                            month: 'long',
                                                            year: 'numeric',
                                                        })}
                                                    </span>
                                                </div>
                                                {!isExpired(challenge.deadline) && (
                                                    <GradientButton className="text-sm px-4 py-2">
                                                        Ikuti
                                                    </GradientButton>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                </SpotlightCard>
                            </FadeIn>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-4">🏆</div>
                        <h3 className="text-xl font-bold text-foreground mb-2">Belum Ada Tantangan</h3>
                        <p className="text-foreground/60">Tantangan baru akan segera hadir. Nantikan!</p>
                    </div>
                )}
            </div>
        </div>
    );
}
