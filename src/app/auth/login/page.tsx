"use client";

import { useState, useEffect } from "react";

export default function LoginPage() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [captcha, setCaptcha] = useState("");
    const [inputCaptcha, setInputCaptcha] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [attempts, setAttempts] = useState(3);
    const [error, setError] = useState("");

    const generateCaptcha = () => {
        return Math.random().toString(36).substring(2, 8);
    };

    useEffect(() => {
        setCaptcha(generateCaptcha());
    }, []);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        const emailRegex = /^[0-9]+@gmail\.com$/;
        const passwordRegex = /^[0-9]+$/;

        if (!emailRegex.test(email)) {
            setError("Email harus sesuai format npm kalian (cth. 1905@gmail.com)");
            return;
        }

        if (!passwordRegex.test(password)) {
            setError("Password harus sesuai format npm kalian (cth. 220711905)");
            return;
        }

        if (inputCaptcha !== captcha) {
            setError("Captcha tidak valid");
            return;
        }

        setError("");
        alert("Login berhasil!");
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Login</h2>

            <p className="text-sm text-gray-500 mb-3">
                Sisa Kesempatan: {attempts}
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Email"
                    className="w-full border p-2"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        className="w-full border p-2"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    <span
                        className="absolute right-2 top-2 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        👁️
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="bg-gray-200 px-3 py-1 rounded font-mono">
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
                    type="text"
                    placeholder="Masukkan captcha"
                    className="w-full border p-2"
                    value={inputCaptcha}
                    onChange={(e) => setInputCaptcha(e.target.value)}
                />

                {error && <p className="text-red-500">{error}</p>}

                <button className="bg-blue-500 text-white px-4 py-2">
                    Login
                </button>
            </form>
        </div>
    );
}