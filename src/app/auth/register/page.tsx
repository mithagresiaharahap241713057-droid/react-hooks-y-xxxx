'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import Link from 'next/link';
import { toast } from 'react-toastify';
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface FormData {
    username: string;
    email: string;
    phone: string;
    password: string;
    confirmPassword: string;
    captchaInput: string;
}

interface Errors {
    username?: string;
    email?: string;
    phone?: string;
    password?: string;
    confirmPassword?: string;
    captcha?: string;
}

const RegisterPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        captchaInput: ''
    });

    const [errors, setErrors] = useState<Errors>({});
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const generateCaptcha = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const [captcha, setCaptcha] = useState(generateCaptcha());

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {};

        // USERNAME
        if (!formData.username.trim()) {
            newErrors.username = 'Username wajib diisi';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Minimal 3 karakter';
        }

        // EMAIL
        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!formData.email.includes('@')) {
            newErrors.email = 'Format email tidak valid';
        }

        // PHONE
        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (!/^[0-9]+$/.test(formData.phone)) {
            newErrors.phone = 'Harus angka';
        }

        // PASSWORD
        if (!formData.password) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Minimal 6 karakter';
        }

        // CONFIRM PASSWORD
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Password tidak sama';
        }

        // CAPTCHA
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha salah';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Registrasi gagal, cek input!");
            return;
        }

        toast.success("Registrasi berhasil!");
        router.push('/auth/login');
    };

    return (
        <AuthFromWrapper title="Register">

            <form onSubmit={handleSubmit} className="space-y-4 w-full">

                {/* USERNAME */}
                <div className="space-y-1">
                    <label className="text-sm">Username</label>
                    <input
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Masukkan username"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/* EMAIL */}
                <div className="space-y-1">
                    <label className="text-sm">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Masukkan email"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                {/* PHONE */}
                <div className="space-y-2">
                    <label>Nomor Telepon</label>
                    <input
                    name="phone"
                inputMode="numeric"
                value={formData.phone}
                onChange={(e) => {
                    const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                    setFormData(prev => ({ ...prev, phone: onlyNumbers }));
                    setErrors(prev => ({ ...prev, phone: undefined }));
                }}
                className="w-full px-4 py-2 border rounded-lg"
                placeholder="Masukkan nomor telepon"
                />
                </div>

                {/* PASSWORD */}
                <div className="space-y-1">
                    <label className="text-sm">Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg"
                            placeholder="Masukkan password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                        >
                            {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div className="space-y-1">
                    <label className="text-sm">Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg"
                            placeholder="Ulangi password"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute inset-y-0 right-3 flex items-center text-gray-400"
                        >
                            {showConfirm ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                {/* CAPTCHA */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded font-mono">{captcha}</span>
                        <button
                            type="button"
                            onClick={() => setCaptcha(generateCaptcha())}
                            className="text-blue-500"
                        >
                            ⟳
                        </button>
                    </div>

                    <input
                        name="captchaInput"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                        placeholder="Masukkan captcha"
                    />
                    {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
                </div>

                {/* BUTTON */}
                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700"
                >
                    Register
                </button>

                <p className="text-center text-sm">
                    Sudah punya akun?{' '}
                    <Link href="/auth/login" className="text-blue-600">
                        Login
                    </Link>
                </p>

            </form>
        </AuthFromWrapper>
    );
};

export default RegisterPage;