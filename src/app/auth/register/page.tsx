'use client';

import { useState, useEffect } from 'react';
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
    const [strength, setStrength] = useState(0);

    const generateCaptcha = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const [captcha, setCaptcha] = useState(generateCaptcha());

    // 🔥 PASSWORD STRENGTH
    useEffect(() => {
        const password = formData.password;

        const strengthValue = Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
        );

        setStrength(strengthValue);
    }, [formData.password]);

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
        }

        // PASSWORD
        if (!formData.password) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Minimal 8 karakter';
        }

        // CONFIRM PASSWORD
        if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Password tidak sama';
        }

        // CAPTCHA
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha tidak sesuai';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Registrasi gagal!");
            return;
        }

        toast.success("Registrasi berhasil!");
        router.push('/auth/login');
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">

                {/* USERNAME */}
                <div>
                    <label>Username</label>
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
                <div>
                    <label>Email</label>
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
                <div>
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
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
                </div>

                {/* PASSWORD */}
                <div>
                    <label>Password</label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-2.5"
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {/* 🔥 STRENGTH BAR */}
                    <div className="mt-1">
                        <div className="w-full h-2 bg-gray-200 rounded">
                            <div
                                className="h-2 bg-blue-500 rounded"
                                style={{ width: `${strength}%` }}
                            />
                        </div>
                        <p className="text-sm">Strength: {strength}%</p>
                    </div>

                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <label>Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirm(!showConfirm)}
                            className="absolute right-3 top-2.5"
                        >
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>

                {/* CAPTCHA */}
                <div>
                    <div className="flex gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded">{captcha}</span>
                        <button type="button" onClick={() => setCaptcha(generateCaptcha())}>
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
                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
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