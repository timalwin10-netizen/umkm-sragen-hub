'use client';

interface SkeletonProps {
    className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
    return (
        <div className={`animate-pulse bg-muted rounded-xl ${className}`} />
    );
}

export function ShopCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Skeleton className="h-48 rounded-none" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-20" />
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
            </div>
        </div>
    );
}

export function NewsCardSkeleton() {
    return (
        <div className="bg-card border border-border rounded-2xl overflow-hidden">
            <Skeleton className="h-48 rounded-none" />
            <div className="p-5 space-y-3">
                <Skeleton className="h-5 w-16" />
                <Skeleton className="h-6 w-full" />
                <Skeleton className="h-4 w-1/3" />
            </div>
        </div>
    );
}
