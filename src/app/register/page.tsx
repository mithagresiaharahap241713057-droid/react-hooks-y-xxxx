"use client";

import { useState, useEffect } from "react";
import { FaGoogle, FaGithub, FaFacebook, FaEye, FaEyeSlash, FaSyncAlt } from "react-icons/fa";

export default function RegisterPage() {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        captcha: ""
    });
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [strength, setStrength] = useState(0);

    // Update Strength Meter
    useEffect(() => {
        const val = Math.min(
            (formData.password.length > 7 ? 25 : 0) +
            (/[A-Z]/.test(formData.password) ? 25 : 0) +
            (/[0-9]/.test(formData.password) ? 25 : 0) +
            (/[^A-Za-z0-9]/.test(formData.password) ? 25 : 0)
        );
        setStrength(val);
    }, [formData.password]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
                <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

                <form className="space-y-4">
                    {/* Username */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Username (max 8 karakter)</label>
                        <input
                            name="username"
                            type="text"
                            className="w-full border border-red-400 rounded-md p-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                            value={formData.username}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-red-500 mt-1">Username maksimal 8 karakter</p>
                    </div>

                    {/* Email */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
                        <input
                            name="email"
                            type="email"
                            className="w-full border border-red-400 rounded-md p-2 text-sm focus:outline-none"
                            value={formData.email}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-red-500 mt-1">Format email tidak valid</p>
                    </div>

                    {/* Nomor Telepon */}
                    <div>
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Telepon</label>
                        <input
                            name="phone"
                            type="text"
                            placeholder="Masukkan nomor telepon"
                            className="w-full border border-red-400 rounded-md p-2 text-sm"
                            value={formData.phone}
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-red-500 mt-1">Nomor telepon wajib diisi</p>
                    </div>

                    {/* Password */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
                        <div className="relative">
                            <input
                                name="password"
                                type={showPassword ? "text" : "password"}
                                placeholder="Masukkan password"
                                className="w-full border border-red-400 rounded-md p-2 text-sm pr-10"
                                value={formData.password}
                                onChange={handleChange}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-2.5 text-gray-400"
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className="text-[10px] text-red-500 mt-1">Password wajib diisi</p>
                        
                        {/* Strength Meter */}
                        <div className="mt-2 w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-300 ${
                                    strength <= 25 ? "bg-red-500" : strength <= 50 ? "bg-orange-500" : "bg-green-500"
                                }`}
                                style={{ width: `${strength}%` }}
                            />
                        </div>
                        <p className="text-[10px] text-gray-500 mt-1 text-right">Strength: {strength}%</p>
                    </div>

                    {/* Konfirmasi Password */}
                    <div className="relative">
                        <label className="block text-xs font-semibold text-gray-600 mb-1">Konfirmasi Password</label>
                        <div className="relative">
                            <input
                                name="confirmPassword"
                                type={showConfirmPassword ? "text" : "password"}
                                placeholder="Masukkan ulang password"
                                className="w-full border border-red-400 rounded-md p-2 text-sm pr-10"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                            />
                            <button 
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="absolute right-3 top-2.5 text-gray-400"
                            >
                                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                            </button>
                        </div>
                        <p className="text-[10px] text-red-500 mt-1">Konfirmasi password wajib diisi</p>
                    </div>

                    {/* Captcha */}
                    <div>
                        <div className="flex items-center space-x-2 bg-gray-50 p-2 rounded border border-gray-200 mb-1 w-fit">
                            <span className="text-sm font-bold tracking-widest text-gray-600 italic">b33BVJ</span>
                            <FaSyncAlt className="text-blue-500 text-xs cursor-pointer" />
                        </div>
                        <input
                            name="captcha"
                            type="text"
                            placeholder="Masukkan captcha"
                            className="w-full border border-gray-800 rounded-md p-2 text-sm"
                            onChange={handleChange}
                        />
                        <p className="text-[10px] text-red-500 mt-1 italic font-medium">Harus sesuai dengan captcha yang ditampilkan</p>
                    </div>

                    <button className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200 mt-4 shadow-lg">
                        Register
                    </button>
                </form>

                {/* Divider */}
                <div className="relative flex items-center py-5">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink mx-4 text-gray-400 text-[10px]">Atau masuk dengan</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                </div>

                {/* Social Login */}
                <div className="flex justify-center space-x-6 mb-6">
                    <button className="text-red-500 text-xl hover:scale-110 transition-transform"><FaGoogle /></button>
                    <button className="text-gray-800 text-xl hover:scale-110 transition-transform"><FaGithub /></button>
                    <button className="text-blue-700 text-xl hover:scale-110 transition-transform"><FaFacebook /></button>
                </div>

                <p className="text-center text-xs text-gray-600">
                    Sudah punya akun? <a href="#" className="text-blue-600 font-bold hover:underline">Login</a>
                </p>
            </div>
        </div>
    );
}