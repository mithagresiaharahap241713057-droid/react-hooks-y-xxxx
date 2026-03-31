'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const LoginPage = () => {
    const router = useRouter();
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Validasi Sederhana (Sebelum ada logika sisa kesempatan)
        if (formData.email === "admin@gmail.com" && formData.password === "admin123") {
            localStorage.setItem("isLogin", "true");
            toast.success('Login Berhasil!');
            router.push('/home');
        } else {
            toast.error('Email atau Password salah!');
        }
    };

    return (
        <AuthFromWrapper title="Login">
            <form onSubmit={handleSubmit} className="space-y-5 w-full">
                {/* EMAIL */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                        placeholder="Masukan email"
                        required
                    />
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-400"
                            placeholder="Masukan password"
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                </div>

                <button
                    type="submit"
                    className="w-full py-2.5 rounded-lg text-white font-semibold bg-blue-600 hover:bg-blue-700"
                >
                    Sign In
                </button>
            </form>
        </AuthFromWrapper>
    );
};

export default LoginPage;