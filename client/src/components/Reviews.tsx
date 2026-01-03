'use client';
import { useState, useEffect } from 'react';
import { Rating } from 'react-simple-star-rating';
import api from '@/utils/api';
import GradientButton from './reactbits/GradientButton';

interface Review {
    _id: string;
    user: {
        _id: string;
        name: string;
    };
    rating: number;
    comment: string;
    createdAt: string;
}

interface ReviewsProps {
    shopId: string;
    isLoggedIn: boolean;
}

export default function Reviews({ shopId, isLoggedIn }: ReviewsProps) {
    const [reviews, setReviews] = useState<Review[]>([]);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    useEffect(() => {
        const fetchReviews = async () => {
            try {
                const { data } = await api.get(`/reviews/${shopId}`);
                setReviews(data);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        fetchReviews();
    }, [shopId]);

    const handleRating = (rate: number) => {
        setRating(rate);
    };

    const submitHandler = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (rating === 0) {
            setError('Silakan pilih jumlah bintang');
            return;
        }

        try {
            const { data } = await api.post('/reviews', {
                shopId,
                rating,
                comment
            });
            setReviews([...reviews, { ...data, user: { name: 'Anda (Baru)' } } as any]); // Optimistic update
            setSuccess('Ulasan berhasil dikirim!');
            setComment('');
            setRating(0);
        } catch (err: any) {
            setError(err.response?.data?.message || 'Gagal mengirim ulasan');
        }
    };

    return (
        <div className="mt-8 pt-8 border-t border-border/50">
            <h2 className="text-2xl font-bold mb-6">Ulasan Pengunjung ({reviews.length})</h2>

            {/* List Reviews */}
            <div className="space-y-4 mb-8">
                {reviews.length === 0 && !loading && (
                    <p className="text-foreground/50 italic">Belum ada ulasan. Jadilah yang pertama!</p>
                )}
                {reviews.map((review) => (
                    <div key={review._id} className="bg-muted/30 p-4 rounded-xl border border-border/50">
                        <div className="flex justify-between items-start mb-2">
                            <span className="font-bold text-foreground">{review.user?.name}</span>
                            <span className="text-xs text-foreground/40">{new Date(review.createdAt).toLocaleDateString()}</span>
                        </div>
                        <div className="mb-2">
                            <Rating
                                readonly
                                initialValue={review.rating}
                                size={16}
                                SVGstyle={{ display: 'inline' }}
                            />
                        </div>
                        <p className="text-foreground/80 text-sm">{review.comment}</p>
                    </div>
                ))}
            </div>

            {/* Add Review Form */}
            {isLoggedIn ? (
                <div className="bg-card border border-border p-6 rounded-2xl shadow-sm">
                    <h3 className="text-lg font-bold mb-4">Tulis Ulasan</h3>
                    {error && <div className="text-red-500 text-sm mb-3 bg-red-50 p-2 rounded">{error}</div>}
                    {success && <div className="text-green-500 text-sm mb-3 bg-green-50 p-2 rounded">{success}</div>}
                    <form onSubmit={submitHandler}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Rating</label>
                            <Rating
                                onClick={handleRating}
                                initialValue={rating}
                                size={24}
                                transition
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium mb-2">Komentar</label>
                            <textarea
                                className="w-full p-3 rounded-xl bg-background border border-border focus:ring-2 focus:ring-primary/50 outline-none transition"
                                rows={3}
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                placeholder="Bagaimana pengalaman Anda belanja di sini?"
                                required
                            ></textarea>
                        </div>
                        <GradientButton className="w-full">
                            Kirim Ulasan
                        </GradientButton>
                    </form>
                </div>
            ) : (
                <div className="bg-muted/50 p-6 rounded-2xl text-center">
                    <p className="text-foreground/60 mb-3">Silakan login untuk menulis ulasan.</p>
                </div>
            )}
        </div>
    );
}
