import QRCode from 'react-qr-code';
import { useRef, useState, useEffect } from 'react';
import GradientButton from './reactbits/GradientButton';

interface ShopQRCodeProps {
    shopId: string;
    shopName: string;
}

export default function ShopQRCode({ shopId, shopName }: ShopQRCodeProps) {
    const qrRef = useRef<HTMLDivElement>(null);
    const [shopUrl, setShopUrl] = useState('');

    useEffect(() => {
        setShopUrl(`${window.location.origin}/toko/${shopId}`);
    }, [shopId]);

    const downloadQRCode = () => {
        const svg = qrRef.current?.querySelector('svg');
        if (svg) {
            const svgData = new XMLSerializer().serializeToString(svg);
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const img = new Image();

            img.onload = () => {
                canvas.width = img.width + 40; // Add padding
                canvas.height = img.height + 40;

                if (ctx) {
                    ctx.fillStyle = 'white';
                    ctx.fillRect(0, 0, canvas.width, canvas.height);
                    ctx.drawImage(img, 20, 20);

                    const pngFile = canvas.toDataURL('image/png');
                    const downloadLink = document.createElement('a');
                    downloadLink.download = `QR-${shopName.replace(/\s+/g, '-')}.png`;
                    downloadLink.href = pngFile;
                    downloadLink.click();
                }
            };

            img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
        }
    };

    return (
        <div className="flex flex-col items-center p-6 bg-white rounded-2xl shadow-sm border border-border">
            <h3 className="text-lg font-bold text-gray-900 mb-4">QR Code Toko Anda</h3>
            <div className="bg-white p-4 rounded-xl border-2 border-dashed border-gray-200 mb-6" ref={qrRef}>
                <QRCode
                    value={shopUrl}
                    size={200}
                    level="H"
                />
            </div>
            <p className="text-sm text-gray-500 mb-4 text-center max-w-xs">
                Scan untuk langsung membuka halaman toko Anda. Cetak dan tempel di toko fisik Anda!
            </p>
            <GradientButton onClick={downloadQRCode} className="w-full">
                Download QR Code
            </GradientButton>
        </div>
    );
}
