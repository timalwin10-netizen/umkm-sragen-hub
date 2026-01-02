import Link from 'next/link';

export default function Footer() {
    return (
        <footer className="border-t border-border bg-card/50 mt-20">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="col-span-1 md:col-span-2">
                        <h3 className="text-2xl font-bold mb-4">
                            <span className="gradient-text">UMKM</span>
                            <span className="text-foreground"> Sragen</span>
                        </h3>
                        <p className="text-foreground/60 max-w-md">
                            Platform digital untuk memajukan UMKM Sragen. Temukan produk lokal berkualitas dan dukung ekonomi daerah.
                        </p>
                    </div>

                    <div>
                        <h4 className="text-foreground font-semibold mb-4">Navigasi</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link href="/toko" className="text-foreground/60 hover:text-primary transition">
                                    Toko UMKM
                                </Link>
                            </li>
                            <li>
                                <Link href="/berita" className="text-foreground/60 hover:text-primary transition">
                                    Berita
                                </Link>
                            </li>
                            <li>
                                <Link href="/tantangan" className="text-foreground/60 hover:text-primary transition">
                                    Tantangan
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-foreground font-semibold mb-4">Kontak</h4>
                        <ul className="space-y-2 text-foreground/60">
                            <li>📍 Sragen, Jawa Tengah</li>
                            <li>📧 info@umkmsragen.id</li>
                            <li>📞 +62 812 3456 7890</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border mt-8 pt-8 text-center text-foreground/50">
                    <p>&copy; {new Date().getFullYear()} UMKM Sragen Hub. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
