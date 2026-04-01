'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import Link from 'next/link';
import { toast } from 'react-toastify';
import SocialAuth from '../../../components/SocialAuth';
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
    const [confirmStrength, setConfirmStrength] = useState(0);

    const generateCaptcha = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    const [captcha, setCaptcha] = useState(generateCaptcha());

    const calculateStrength = (password: string) => {
        return Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
        );
    };

    useEffect(() => {
        setStrength(calculateStrength(formData.password));
        setConfirmStrength(calculateStrength(formData.confirmPassword));
    }, [formData.password, formData.confirmPassword]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        setErrors(prev => ({ ...prev, [name]: undefined }));

        // realtime error text (tetap ada)
        if (name === "email") {
            if (value && !/\S+@\S+\.(com|net|co)/.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    email: "Format email tidak valid"
                }));
            }
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username wajib diisi';
        } else if (formData.username.length < 3) {
            newErrors.username = 'Username minimal 3 karakter';
        } else if (formData.username.length > 8) {
            newErrors.username = 'Username maksimal 8 karakter';
        }

        // 🔥 EMAIL VALIDATION + TOOLTIP HTML
        if (!formData.email.trim()) {
            newErrors.email = 'Email wajib diisi';
        } else if (!/\S+@\S+\.(com|net|co)/.test(formData.email)) {
            newErrors.email = 'Format email tidak valid';

            const emailInput = document.querySelector<HTMLInputElement>('input[name="email"]');
            if (emailInput) {
                emailInput.setCustomValidity("Sertakan '@' pada alamat email dan domain (.com/.net/.co)");
                emailInput.reportValidity(); 
            }
        }

        if (!formData.phone.trim()) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Nomor telepon minimal 10 karakter';
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        } else if (formData.password.length < 8) {
            newErrors.password = 'Password Minimal 8 karakter';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Password tidak sama';
        }

        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Harus sesuai dengan captcha yang ditampilkan';
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
            <form onSubmit={handleSubmit} noValidate className="space-y-4 w-full">

                {/* USERNAME */}
                <div>
                    <label>Username</label>
                    <input
                        name="username"
                        placeholder="Masukkan username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg placeholder-gray-400"
                    />
                    {errors.username && <p className="text-red-500 text-sm">{errors.username}</p>}
                </div>

                {/* EMAIL */}
                <div>
                    <label>Email</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Masukkan email"
                        value={formData.email}
                        onChange={handleChange}
                        onInput={(e) => e.currentTarget.setCustomValidity("")} // reset tooltip
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {errors.email && (
                        <p className="text-red-500 text-sm">{errors.email}</p>
                    )}
                </div>

                {/* PHONE */}
                <div>
                    <label>Nomor Telepon</label>
                    <input
                        name="phone"
                        placeholder="Masukkan nomor telepon"
                        inputMode="numeric"
                        value={formData.phone}
                        onChange={(e) => {
                            const onlyNumbers = e.target.value.replace(/[^0-9]/g, '');
                            setFormData(prev => ({ ...prev, phone: onlyNumbers }));
                            setErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        className="w-full px-4 py-2 border rounded-lg placeholder-gray-400"
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
                            placeholder="Masukkan password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg placeholder-gray-400"
                        />
                        <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="mt-1">
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-500 rounded" style={{ width: `${strength}%` }} />
                            </div>
                            <p className="text-sm">Strength: {strength}%</p>
                        </div>
                    )}

                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                {/* CONFIRM PASSWORD */}
                <div>
                    <label>Konfirmasi Password</label>
                    <div className="relative">
                        <input
                            type={showConfirm ? "text" : "password"}
                            name="confirmPassword"
                            placeholder="Masukkan ulang password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            className="w-full px-4 py-2 pr-10 border rounded-lg placeholder-gray-400"
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-2.5">
                            {showConfirm ? <FaEyeSlash /> : <FaEye />}
                        </button>
                    </div>

                    {formData.password && (
                        <div className="mt-1">
                            <div className="w-full h-2 bg-gray-200 rounded">
                                <div className="h-2 bg-blue-500 rounded" style={{ width: `${confirmStrength}%` }} />
                            </div>
                            <p className="text-sm">Strength: {confirmStrength}%</p>
                        </div>
                    )}

                    {errors.confirmPassword && <p className="text-red-500 text-sm mt-1">{errors.confirmPassword}</p>}
                </div>

                {/* CAPTCHA */}
                <div>
                    <div className="flex items-center gap-2">
                        <label>Captcha:</label>
                        <span className="bg-gray-200 px-3 py-1 rounded">
                            {captcha}
                            </span>
                            <button
                            type="button"
                            onClick={() => setCaptcha(generateCaptcha())}
                            >
                                ⟳
                                </button>
                                </div>
                                <input
                                name="captchaInput"
                                placeholder="Masukkan captcha"
                                value={formData.captchaInput}
                                onChange={handleChange}
                                className="w-full px-4 py-2 border rounded-lg placeholder-gray-400 mt-2"
                                />
                    {errors.captcha && <p className="text-red-500 text-sm">{errors.captcha}</p>}
                </div>

                <button className="w-full bg-blue-600 text-white py-2 rounded-lg">
                    Register
                </button>

                <SocialAuth />

                <p className="text-center text-sm">
                    Sudah punya akun? <Link href="/auth/login" className="text-blue-600">Login</Link>
                </p>

            </form>
        </AuthFromWrapper>
    );
};

export default RegisterPage;