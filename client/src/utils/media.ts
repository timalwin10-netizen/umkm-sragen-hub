export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return '';
    if (path.startsWith('http')) return path;

    // In production, we assume relative paths work via rewrites/proxy
    // In development, we default to localhost:5000
    const isProd = process.env.NODE_ENV === 'production';
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || (isProd ? '' : 'http://localhost:5000');

    // Ensure path starts with /
    const cleanPath = path.startsWith('/') ? path : `/${path}`;

    return `${backendUrl}${cleanPath}`;
};
