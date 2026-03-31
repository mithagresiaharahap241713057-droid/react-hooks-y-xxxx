'use client';

import { useState, useEffect, useRef } from 'react';
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
    const emailRef = useRef<HTMLInputElement>(null);

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
        return (
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

        if (name === "phone") {
            const onlyNumber = value.replace(/\D/g, "");
            setFormData(prev => ({ ...prev, phone: onlyNumber }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }

        // 🔥 REAL-TIME EMAIL VALIDATION
        if (name === "email") {
            const emailPattern = /^[^\s@]+@[^\s@]+\.(com|net|co)$/;

            if (value && !emailPattern.test(value)) {
                setErrors(prev => ({
                    ...prev,
                    email: "Format email tidak valid"
                }));
            } else {
                setErrors(prev => {
                    const newErr = { ...prev };
                    delete newErr.email;
                    return newErr;
                });
            }

            emailRef.current?.setCustomValidity("");
        }

        if (errors[name as keyof Errors] && name !== "email") {
            setErrors(prev => {
                const newErr = { ...prev };
                delete newErr[name as keyof Errors];
                return newErr;
            });
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        const newErrors: Errors = {};

        if (!formData.username.trim()) {
            newErrors.username = 'Username wajib diisi';
        }

        // EMAIL VALIDATION + HTML5 TOOLTIP
        if (!formData.email) {
            newErrors.email = "Email wajib diisi";
            emailRef.current?.setCustomValidity("Email wajib diisi");
        } else if (!/^[^\s@]+@[^\s@]+\.(com|net|co)$/.test(formData.email)) {
            newErrors.email = "Format email tidak valid";
            emailRef.current?.setCustomValidity(
                `Sertakan '@' pada alamat email. "${formData.email}" tidak valid`
            );
        } else {
            emailRef.current?.setCustomValidity("");
        }

        // 🔥 PHONE MIN 10 DIGIT
        if (!formData.phone) {
            newErrors.phone = 'Nomor telepon wajib diisi';
        } else if (formData.phone.length < 10) {
            newErrors.phone = 'Nomor telepon minimal 10 karakter';
        }

        if (!formData.password) {
            newErrors.password = 'Password wajib diisi';
        }

        if (!formData.confirmPassword) {
            newErrors.confirmPassword = 'Konfirmasi password wajib diisi';
        } else if (formData.confirmPassword !== formData.password) {
            newErrors.confirmPassword = 'Password tidak sama';
        }

        if (!formData.captchaInput) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha tidak sesuai';
        }

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            // 🔥 TRIGGER HTML5 TOOLTIP
            if (newErrors.email) {
                emailRef.current?.reportValidity();
                emailRef.current?.focus();
            }

            toast.error("Registrasi gagal!");
            return;
        }

        toast.success("Registrasi berhasil!");
        router.push('/auth/login');
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleSubmit} className="space-y-4 w-full">

                <div>
                    <label>Email</label>
                    <input
                        ref={emailRef}
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div>
                    <label>Nomor Telepon</label>
                    <input
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg"
                    />
                    {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
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