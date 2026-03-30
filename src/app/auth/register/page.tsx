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
    captchaInput: ""
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [strength, setStrength] = useState(0);

  const staticCaptcha = "MDhrNL";

  // Hitung Strength Meter (Hint dari gambar)
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
    const { name, value } = e.target;
    
    // c. Hanya angka untuk nomor telepon
    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    // Hapus error saat user mulai ngetik lagi
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    // a. Username: 3-8 karakter
    if (!formData.username) newErrors.username = "Username wajib diisi";
    else if (formData.username.length < 3) newErrors.username = "Username minimal 3 karakter";
    else if (formData.username.length > 8) newErrors.username = "Username maksimal 8 karakter";

    // b. Email: Pattern @ dan .com/.net/.co
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/;
    if (!formData.email) newErrors.email = "Email wajib diisi";
    else if (!emailPattern.test(formData.email)) newErrors.email = "Format email tidak valid (@ dan .com/.net/.co)";

    // c. Phone: Min 10 karakter & angka
    if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi";
    else if (formData.phone.length < 10) newErrors.phone = "Nomor telepon minimal 10 karakter";

    // d. Password: Min 8 karakter
    if (!formData.password) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";

    // Confirm Password
    if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Konfirmasi password tidak cocok";

    // e. Captcha
    if (!formData.captchaInput) newErrors.captchaInput = "Captcha wajib diisi";
    else if (formData.captchaInput !== staticCaptcha) newErrors.captchaInput = "Captcha tidak sesuai";

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
    } else {
      alert("Register Berhasil!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6 font-sans">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Input Field Template */}
          {[
            { label: "Username (3-8 karakter)", name: "username", type: "text", placeholder: "Masukkan username" },
            { label: "Email", name: "email", type: "text", placeholder: "Masukkan email" },
            { label: "Nomor Telepon", name: "phone", type: "text", placeholder: "Masukkan nomor telepon" }
          ].map((field) => (
            <div key={field.name}>
              <label className="block text-xs font-semibold text-gray-600 mb-1">{field.label}</label>
              <input
                name={field.name}
                type={field.type}
                placeholder={field.placeholder}
                className={`w-full border rounded-md p-2 text-sm focus:outline-none transition-all ${
                  errors[field.name] ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                }`}
                value={(formData as any)[field.name]}
                onChange={handleChange}
              />
              {errors[field.name] && <p className="text-[10px] text-red-500 mt-1">{errors[field.name]}</p>}
            </div>
          ))}

          {/* Password Field */}
          <div className="relative">
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password (Min 8 char)</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className={`w-full border rounded-md p-2 text-sm pr-10 focus:outline-none transition-all ${
                  errors.password ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                }`}
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-[10px] text-red-500 mt-1">{errors.password}</p>}
            
            {/* Strength Bar */}
            {formData.password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 h-1.5 rounded-full overflow-hidden">
                  <div 
                    className={`h-full transition-all duration-300 ${strength < 50 ? 'bg-red-500' : strength < 100 ? 'bg-yellow-500' : 'bg-green-500'}`} 
                    style={{ width: `${strength}%` }} 
                  />
                </div>
                <p className="text-[9px] text-gray-500 mt-1 text-right italic">Strength: {strength}%</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Konfirmasi Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan ulang password"
                className={`w-full border rounded-md p-2 text-sm pr-10 focus:outline-none ${
                  errors.confirmPassword ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
                }`}
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-[10px] text-red-500 mt-1">{errors.confirmPassword}</p>}
          </div>

          {/* Captcha */}
          <div>
            <div className="flex items-center space-x-2 mb-1">
              <div className="bg-gray-100 px-3 py-1 rounded border border-gray-200 select-none font-bold italic text-gray-700">
                {staticCaptcha}
              </div>
              <FaSyncAlt className="text-blue-500 text-xs cursor-pointer hover:rotate-180 transition-all" />
            </div>
            <input
              name="captchaInput"
              type="text"
              placeholder="Masukkan captcha"
              className={`w-full border rounded-md p-2 text-sm focus:outline-none ${
                errors.captchaInput ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
              }`}
              value={formData.captchaInput}
              onChange={handleChange}
            />
            {errors.captchaInput && <p className="text-[10px] text-red-500 mt-1 italic font-medium">{errors.captchaInput}</p>}
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-2 rounded-md hover:bg-blue-700 transition duration-200 mt-4 shadow-lg active:scale-95">
            Register
          </button>
        </form>

        {/* Footer & Socials */}
        <div className="relative flex items-center py-5">
          <div className="flex-grow border-t border-gray-200"></div>
          <span className="flex-shrink mx-4 text-gray-400 text-[10px]">Atau masuk dengan</span>
          <div className="flex-grow border-t border-gray-200"></div>
        </div>
        <div className="flex justify-center space-x-6 mb-4">
          <FaGoogle className="text-red-500 text-xl cursor-pointer" />
          <FaGithub className="text-gray-800 text-xl cursor-pointer" />
          <FaFacebook className="text-blue-700 text-xl cursor-pointer" />
        </div>
        <p className="text-center text-xs text-gray-600">Sudah punya akun? <span className="text-blue-600 font-bold cursor-pointer">Login</span></p>
      </div>
    </div>
  );
}