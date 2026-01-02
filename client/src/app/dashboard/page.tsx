'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/utils/api';
import FadeIn from '@/components/reactbits/FadeIn';
import BlurText from '@/components/reactbits/BlurText';
import GradientButton from '@/components/reactbits/GradientButton';
import SpotlightCard from '@/components/reactbits/SpotlightCard';

export default function DashboardPage() {
    const [user, setUser] = useState<any>(null);
    const [shop, setShop] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const router = useRouter();

    const [formData, setFormData] = useState({
        name: '',
        category: 'Kuliner',
        description: '',
        location: '',
        image: '',
        whatsapp: '',
        email: '',
    });

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (!userData) {
            router.push('/login');
            return;
        }
        const parsedUser = JSON.parse(userData);
        setUser(parsedUser);

        if (parsedUser.shop_details) {
            fetchShop(parsedUser.shop_details);
        } else {
            setLoading(false);
        }
    }, [router]);

    const fetchShop = async (shopId: string) => {
        try {
            const { data } = await api.get(`/shops/${shopId}`);
            setShop(data);
            setFormData({
                name: data.name || '',
                category: data.category || 'Kuliner',
                description: data.description || '',
                location: data.location || '',
                image: data.image || '',
                whatsapp: data.contact?.whatsapp || '',
                email: data.contact?.email || '',
            });
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setMessage('');
        try {
            const payload = {
                name: formData.name,
                category: formData.category,
                description: formData.description,
                location: formData.location,
                image: formData.image,
                contact: {
                    whatsapp: formData.whatsapp,
                    email: formData.email,
                },
            };

            if (shop) {
                await api.put(`/shops/${shop._id}`, payload);
                setMessage('Toko berhasil diperbarui!');
            } else {
                const { data } = await api.post('/shops', payload);
                setShop(data);
                const updatedUser = { ...user, shop_details: data._id };
                localStorage.setItem('user', JSON.stringify(updatedUser));
                setUser(updatedUser);
                setMessage('Toko berhasil dibuat!');
            }
        } catch (error: any) {
            setMessage(error.response?.data?.message || 'Gagal menyimpan toko');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center pt-20">
                <div className="text-foreground/60">Loading...</div>
            </div>
        );
    }

    return (
        <div className="pt-24 pb-20">
            <div className="container mx-auto px-4 max-w-4xl">
                <FadeIn>
                    <div className="mb-8">
                        <h1 className="text-3xl md:text-4xl font-bold mb-2">
                            <BlurText text="Dashboard" className="text-foreground" />
                        </h1>
                        <p className="text-foreground/60">
                            Selamat datang, <span className="text-primary">{user?.name}</span>
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
                        <h2 className="text-xl font-bold text-foreground mb-6">
                            {shop ? '✏️ Edit Toko Anda' : '🏪 Buat Toko Baru'}
                        </h2>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">Nama Toko</label>
                                    <input
                                        type="text"
                                        value={formData.name}
                                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                        placeholder="Nama toko Anda"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">Kategori</label>
                                    <select
                                        value={formData.category}
                                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground focus:border-primary focus:outline-none transition"
                                    >
                                        <option value="Kuliner">Kuliner</option>
                                        <option value="Kerajinan">Kerajinan</option>
                                        <option value="Fashion">Fashion</option>
                                        <option value="Pertanian">Pertanian</option>
                                        <option value="Jasa">Jasa</option>
                                        <option value="Lainnya">Lainnya</option>
                                    </select>
                                </div>
                            </div>

                            <div>
                                <label className="block text-foreground/80 text-sm font-medium mb-2">Deskripsi</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    rows={4}
                                    className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition resize-none"
                                    placeholder="Deskripsikan bisnis Anda..."
                                    required
                                />
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">Lokasi</label>
                                    <input
                                        type="text"
                                        value={formData.location}
                                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                        placeholder="Alamat atau kecamatan"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">URL Gambar Banner</label>
                                    <input
                                        type="text"
                                        value={formData.image}
                                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                        placeholder="https://..."
                                    />
                                </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">WhatsApp</label>
                                    <input
                                        type="text"
                                        value={formData.whatsapp}
                                        onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                        placeholder="628123456789"
                                    />
                                </div>

                                <div>
                                    <label className="block text-foreground/80 text-sm font-medium mb-2">Email Bisnis</label>
                                    <input
                                        type="email"
                                        value={formData.email}
                                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                        className="w-full px-4 py-3 rounded-xl bg-muted border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                                        placeholder="bisnis@email.com"
                                    />
                                </div>
                            </div>

                            <div className="flex justify-end">
                                <GradientButton className="px-8 py-3">
                                    {saving ? 'Menyimpan...' : shop ? 'Simpan Perubahan' : 'Buat Toko Sekarang'}
                                </GradientButton>
                            </div>
                        </form>
                    </SpotlightCard>
                </FadeIn>

                {/* Product Management Section - Only show if shop exists */}
                {shop && (
                    <FadeIn delay={0.2}>
                        <SpotlightCard className="p-8 mt-8">
                            <h2 className="text-xl font-bold text-foreground mb-6">
                                📦 Kelola Produk
                            </h2>

                            {/* Add Product Form */}
                            <ProductForm shopId={shop._id} onProductAdded={() => fetchShop(shop._id)} />

                            {/* Product List */}
                            <div className="mt-8">
                                <h3 className="text-lg font-semibold text-foreground mb-4">
                                    Daftar Produk ({shop.products?.length || 0})
                                </h3>
                                {shop.products && shop.products.length > 0 ? (
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        {shop.products.map((product: any) => (
                                            <ProductCard
                                                key={product._id}
                                                product={product}
                                                shopId={shop._id}
                                                onDelete={() => fetchShop(shop._id)}
                                            />
                                        ))}
                                    </div>
                                ) : (
                                    <div className="text-center py-10 bg-muted/30 rounded-2xl border border-dashed border-border">
                                        <p className="text-foreground/40">Belum ada produk. Tambahkan produk pertama Anda!</p>
                                    </div>
                                )}
                            </div>
                        </SpotlightCard>
                    </FadeIn>
                )}
            </div>
        </div>
    );
}

// Product Form Component
function ProductForm({ shopId, onProductAdded }: { shopId: string; onProductAdded: () => void }) {
    const [productForm, setProductForm] = useState({
        name: '',
        price: '',
        description: '',
        image: ''
    });
    const [saving, setSaving] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            await api.post(`/shops/${shopId}/products`, {
                ...productForm,
                price: Number(productForm.price)
            });
            setProductForm({ name: '', price: '', description: '', image: '' });
            onProductAdded();
        } catch (error) {
            console.error(error);
            alert('Gagal menambah produk');
        } finally {
            setSaving(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-4 bg-muted/30 rounded-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                    type="text"
                    placeholder="Nama Produk"
                    value={productForm.name}
                    onChange={(e) => setProductForm({ ...productForm, name: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                    required
                />
                <input
                    type="number"
                    placeholder="Harga (Rp)"
                    value={productForm.price}
                    onChange={(e) => setProductForm({ ...productForm, price: e.target.value })}
                    className="px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
                    required
                />
            </div>
            <textarea
                placeholder="Deskripsi Produk"
                rows={3}
                value={productForm.description}
                onChange={(e) => setProductForm({ ...productForm, description: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition resize-none"
            />
            <input
                type="text"
                placeholder="URL Gambar Produk"
                value={productForm.image}
                onChange={(e) => setProductForm({ ...productForm, image: e.target.value })}
                className="w-full px-4 py-3 rounded-xl bg-card border border-border text-foreground placeholder-foreground/40 focus:border-primary focus:outline-none transition"
            />
            <GradientButton className="w-full py-3">
                {saving ? 'Menambahkan...' : '+ Tambah Produk'}
            </GradientButton>
        </form>
    );
}

// Product Card Component
function ProductCard({ product, shopId, onDelete }: { product: any; shopId: string; onDelete: () => void }) {
    const [deleting, setDeleting] = useState(false);

    const handleDelete = async () => {
        if (!confirm('Yakin hapus produk ini?')) return;
        setDeleting(true);
        try {
            await api.delete(`/shops/${shopId}/products/${product._id}`);
            onDelete();
        } catch (error) {
            console.error(error);
            alert('Gagal menghapus produk');
        } finally {
            setDeleting(false);
        }
    };

    return (
        <div className="p-4 bg-card border border-border rounded-xl hover:border-primary/50 transition">
            {product.image && (
                <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-32 object-cover rounded-lg mb-3"
                />
            )}
            <h4 className="font-bold text-foreground">{product.name}</h4>
            <p className="text-primary font-semibold text-lg">Rp {product.price?.toLocaleString('id-ID')}</p>
            <p className="text-foreground/60 text-sm mt-1 line-clamp-2">{product.description}</p>
            <button
                onClick={handleDelete}
                disabled={deleting}
                className="mt-3 text-red-500 hover:text-red-600 text-sm font-medium transition disabled:opacity-50"
            >
                {deleting ? 'Menghapus...' : '🗑️ Hapus'}
            </button>
        </div>
    );
}
