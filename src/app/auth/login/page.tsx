'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import SocialAuth from '../../../components/SocialAuth';
import Link from 'next/link';
import { toast } from 'react-toastify';

interface LoginFormData {
    email: string;
    password: string;
    captchaInput: string;
    remberMe?: boolean;
}

interface ErrorObject {
    email?: string;
    password?: string;
    captcha?: string;
}

const LoginPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState<LoginFormData>({
        email: '',
        password: '',
        captchaInput: ''
    });

    const [errors, setErrors] = useState<ErrorObject>({});
    const [attempts, setAttempts] = useState(3);

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

        const newErrors: ErrorObject = {};

        // VALIDASI EMAIL
        if (!formData.email.trim()) {
            newErrors.email = 'Email tidak boleh kosong';
        } else if (formData.email !== "NPMKAMU@gmail.com") {
            newErrors.email = 'Email harus sesuai NPM';
        }

        // VALIDASI PASSWORD
        if (!formData.password.trim()) {
            newErrors.password = 'Password tidak boleh kosong';
        } else if (formData.password !== "NPMKAMU") {
            newErrors.password = 'Password harus sesuai NPM';
        }

        // VALIDASI CAPTCHA
        if (!formData.captchaInput.trim()) {
            newErrors.captcha = 'Captcha belum diisi';
        } else if (formData.captchaInput !== captcha) {
            newErrors.captcha = 'Captcha salah';
        }

        // JIKA ERROR
        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);

            if (attempts > 0) {
                setAttempts(prev => Math.max(prev - 1, 0));
            }

            toast.error(`Login gagal! Sisa kesempatan: ${attempts - 1}`, {
                position: 'top-right'
            });

            if (attempts - 1 === 0) {
                toast.error("Kesempatan login habis!", {
                    position: 'top-right'
                });
            }

            return;
        }

        // LOGIN BERHASIL
        localStorage.setItem("isLogin", "true");

        toast.success('Login Berhasil!', {
            position: 'top-right'
        });

        router.push('/home');
    };

    return (
        <AuthFromWrapper title="Login">
            <form onSubmit={handleSubmit} className="space-y-5 w-full">

                {/* EMAIL */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <input
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan email"
                    />
                    {errors.email && <p className="text-red-600 text-sm italic">{errors.email}</p>}
                </div>

                {/* PASSWORD */}
                <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan password"
                    />
                    {errors.password && <p className="text-red-600 text-sm italic">{errors.password}</p>}
                </div>

                {/* REMEMBER */}
                <div className="flex justify-between">
                    <label className="text-sm">
                        <input
                            type="checkbox"
                            name="remberMe"
                            checked={formData.remberMe || false}
                            onChange={(e) =>
                                setFormData(prev => ({ ...prev, remberMe: e.target.checked }))
                            }
                        /> Ingat Saya
                    </label>
                    <Link href="/auth/forgot-password" className="text-blue-600 text-sm">
                        Forgot Password?
                    </Link>
                </div>

                {/* CAPTCHA */}
                <div className="space-y-2">
                    <div className="flex items-center gap-2">
                        <span className="bg-gray-200 px-3 py-1 rounded font-mono">
                            {captcha}
                        </span>
                        <button
                            type="button"
                            onClick={() => setCaptcha(generateCaptcha())}
                            className="text-blue-500 text-sm"
                        >
                            Refresh
                        </button>
                    </div>

                    <input
                        name="captchaInput"
                        value={formData.captchaInput}
                        onChange={handleChange}
                        className={`w-full px-4 py-2.5 rounded-lg border ${errors.captcha ? 'border-red-500' : 'border-gray-300'}`}
                        placeholder="Masukan captcha"
                    />
                    {errors.captcha && <p className="text-red-600 text-sm italic">{errors.captcha}</p>}
                </div>

                {/* SIGN IN */}
                <button
                    type="submit"
                    disabled={attempts === 0}
                    className={`w-full py-2.5 rounded-lg text-white font-semibold 
                    ${attempts === 0 ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
                >
                    Sign In
                </button>

                {/* RESET */}
                <button
                    type="button"
                    disabled={attempts !== 0}
                    onClick={() => {
                        setAttempts(3);
                        setCaptcha(generateCaptcha());
                        toast.info("Kesempatan direset!");
                    }}
                    className={`w-full py-2.5 rounded-lg mt-2 font-semibold
                    ${attempts === 0 ? 'bg-green-600 text-white' : 'bg-gray-400 text-white'}`}
                >
                    Reset Kesempatan
                </button>

                <SocialAuth />

                <p className="text-center text-sm">
                    Tidak punya akun?{' '}
                    <Link href="/auth/register" className="text-blue-600">
                        Daftar
                    </Link>
                </p>
            </form>
        </AuthFromWrapper>
    );
};

export default LoginPage;