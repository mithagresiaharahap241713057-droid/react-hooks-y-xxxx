"use client";

import { useState, useEffect } from "react";

export default function RegisterPage() {
    const [username, setUsername] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [strength, setStrength] = useState(0);
    const [error, setError] = useState("");

    useEffect(() => {
        const val = Math.min(
            (password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(password) ? 25 : 0) +
            (/[0-9]/.test(password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(password) ? 25 : 0)
        );
        setStrength(val);
    }, [password]);

    const handleSubmit = (e: any) => {
        e.preventDefault();

        if (!username || username.length < 3 || username.length > 8) {
            setError("Username harus 3-8 karakter");
            return;
        }

        if (!phone || phone.length < 10 || !/^[0-9]+$/.test(phone)) {
            setError("Nomor HP minimal 10 digit & hanya angka");
            return;
        }

        if (password !== confirmPassword) {
            setError("Konfirmasi password harus sama");
            return;
        }

        setError("");
        alert("Register berhasil!");
    };

    return (
        <div className="max-w-md mx-auto mt-10">
            <h2 className="text-xl font-bold mb-4">Register</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border p-2"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="text"
                    placeholder="Nomor HP"
                    className="w-full border p-2"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
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

                {/* Strength */}
                <div className="w-full bg-gray-200 h-2">
                    <div
                        className="bg-yellow-400 h-2"
                        style={{ width: `${strength}%` }}
                    />
                </div>
                <p>Strength: {strength}%</p>

                <input
                    type="password"
                    placeholder="Confirm Password"
                    className="w-full border p-2"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                />

                {error && <p className="text-red-500">{error}</p>}

                <button className="bg-green-500 text-white px-4 py-2">
                    Register
                </button>
            </form>
        </div>
    );
}