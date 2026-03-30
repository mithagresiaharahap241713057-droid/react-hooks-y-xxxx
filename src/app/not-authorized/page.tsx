'use client';

import Link from 'next/link';

export default function NotAuthorized() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-3xl font-bold text-red-600">
                ❌ Akses Ditolak
            </h1>

            <p className="mt-4">
                Kamu harus login dulu untuk mengakses halaman ini.
            </p>

            <Link
                href="/auth/login"
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded"
            >
                Kembali ke Login
            </Link>
        </div>
    );
}