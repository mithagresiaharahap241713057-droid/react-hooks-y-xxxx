'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AuthFromWrapper from '../../../components/AuthFromWrapper';
import Link from 'next/link';
import { toast } from 'react-toastify';

const RegisterPage = () => {
    const router = useRouter();

    const [formData, setFormData] = useState({
        username: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        captchaInput: ''
    });

    const [errors, setErrors] = useState<any>({});
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState('');
    const [captcha, setCaptcha] = useState(generateCaptcha());

    function generateCaptcha() {
        return Math.random().toString(36).substring(2, 8);
    }

    // PASSWORD STRENGTH
    useEffect(() => {
        if (formData.password.length < 6) setStrength('Weak');
        else if (formData.password.length < 10) setStrength('Medium');
        else setStrength('Strong');
    }, [formData.password]);

    const handleChange = (e: any) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: any) => {
        e.preventDefault();
        const newErrors: any = {};

        // USERNAME
        if (!formData.username) newErrors.username = 'Tidak boleh kosong';
        else if (formData.username.length < 3 || formData.username.length > 8)
            newErrors.username = '3-8 karakter';

        // EMAIL
        const emailRegex = /\S+@\S+\.\S+/;
        if (!formData.email) newErrors.email = 'Tidak boleh kosong';
        else if (!emailRegex.test(formData.email))
            newErrors.email = 'Format email salah';

        // PHONE
        if (!formData.phone) newErrors.phone = 'Tidak boleh kosong';
        else if (!/^[0-9]{10,}$/.test(formData.phone))
            newErrors.phone = 'Minimal 10 angka';

        // PASSWORD
        if (!formData.password) newErrors.password = 'Tidak boleh kosong';
        else if (formData.password.length < 8)
            newErrors.password = 'Minimal 8 karakter';

        // CONFIRM PASSWORD
        if (formData.confirmPassword !== formData.password)
            newErrors.confirmPassword = 'Password tidak sama';

        // CAPTCHA
        if (formData.captchaInput !== captcha)
            newErrors.captcha = 'Captcha salah';

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            toast.error("Register gagal!");
            return;
        }

        toast.success("Register berhasil!");
        router.push('/auth/login');
    };

    return (
        <AuthFromWrapper title="Register">
            <form onSubmit={handleSubmit} className="space-y-4">

                <input name="username" placeholder="Username"
                    onChange={handleChange} className="input" />
                <p className="text-red-500">{errors.username}</p>

                <input name="email" placeholder="Email"
                    onChange={handleChange} className="input" />
                <p className="text-red-500">{errors.email}</p>

                <input name="phone" placeholder="No HP"
                    onChange={handleChange} className="input" />
                <p className="text-red-500">{errors.phone}</p>

                <div>
                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Password"
                        onChange={handleChange}
                        className="input"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                        👁️
                    </button>
                    <p>Password Strength: {strength}</p>
                    <p className="text-red-500">{errors.password}</p>
                </div>

                <input
                    type="password"
                    name="confirmPassword"
                    placeholder="Confirm Password"
                    onChange={handleChange}
                    className="input"
                />
                <p className="text-red-500">{errors.confirmPassword}</p>

                <div>
                    <span>{captcha}</span>
                    <button type="button" onClick={() => setCaptcha(generateCaptcha())}>
                        Refresh
                    </button>
                </div>

                <input name="captchaInput" placeholder="Captcha"
                    onChange={handleChange} className="input" />
                <p className="text-red-500">{errors.captcha}</p>

                <button className="bg-blue-500 text-white w-full py-2 rounded">
                    Register
                </button>

                <p>
                    Sudah punya akun? <Link href="/auth/login">Login</Link>
                </p>
            </form>
        </AuthFromWrapper>
    );
};

export default RegisterPage;