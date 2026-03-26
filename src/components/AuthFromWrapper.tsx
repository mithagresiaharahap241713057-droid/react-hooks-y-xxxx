import React, { ReactNode } from 'react';

interface AuthFormWrapperProps {
    title: string;
    children: ReactNode;
}

const AuthFromWrapper = ({ title, children }: AuthFormWrapperProps) => {
    return (
        // TAMBAHKAN DIV INI SEBAGAI PEMBUNGKUS LUAR
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500 to-indigo-600 p-4">
            
            {/* Kotak Putih Form kamu */}
            <div className="w-full md:w-[700px] lg:w-[900px] bg-white rounded-2xl shadow-2xl p-10">
                <h2 className="text-3xl font-bold text-center mb-8 text-primary">
                    {title}
                </h2>
                {children}
            </div>

        </div>
    );
};

export default AuthFromWrapper;
