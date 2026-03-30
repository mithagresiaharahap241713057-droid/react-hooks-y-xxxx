"use client";

import { useState, useEffect, useRef } from "react";
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

  const emailRef = useRef<HTMLInputElement>(null);
  const staticCaptcha = "MDhrNL";

  // ✅ Strength + harus cocok untuk 100%
  useEffect(() => {
    let calculatedStrength =
      (formData.password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(formData.password) ? 25 : 0) +
      (/[0-9]/.test(formData.password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(formData.password) ? 25 : 0);

    // kalau belum cocok, max 75%
    if (formData.confirmPassword !== formData.password) {
      calculatedStrength = Math.min(calculatedStrength, 75);
    }

    setStrength(calculatedStrength);
  }, [formData.password, formData.confirmPassword]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNums = value.replace(/\D/g, "");
      setFormData({ ...formData, [name]: onlyNums });
    } else {
      setFormData({ ...formData, [name]: value });
    }

    if (name === "email" && emailRef.current) {
      emailRef.current.setCustomValidity("");
    }

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

    // Username
    if (!formData.username) newErrors.username = "Username wajib diisi";
    else if (formData.username.length < 3) newErrors.username = "Username minimal 3 karakter";
    else if (formData.username.length > 8) newErrors.username = "Username maksimal 8 karakter";

    // Email
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/;
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      if (emailRef.current) {
        emailRef.current.setCustomValidity("Format email tidak valid");
        emailRef.current.reportValidity();
      }
    }

    // Phone
    if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi";
    else if (formData.phone.length < 10) newErrors.phone = "Nomor telepon minimal 10 karakter";

    // Password
    if (!formData.password) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";

    // Confirm Password
    if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    // Captcha
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
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4" noValidate={false}>

          {/* Username */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">
              Username <span className="text-gray-400 text-[10px]">(max 8 karakter)</span>
            </label>
            <input
              name="username"
              type="text"
              placeholder="Masukkan username"
              className={`w-full border rounded-md p-2 text-sm ${
                errors.username ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
              }`}
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-[10px] text-red-500">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Email</label>
            <input
              ref={emailRef}
              name="email"
              type="email"
              placeholder="Masukkan email"
              onInvalid={(e) => e.preventDefault()}
              className={`w-full border rounded-md p-2 text-sm ${
                errors.email ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
              }`}
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-[10px] text-red-500">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Nomor Telepon</label>
            <input
              name="phone"
              type="text"
              placeholder="Masukkan nomor telepon"
              className={`w-full border rounded-md p-2 text-sm ${
                errors.phone ? "border-red-500 bg-red-50" : "border-gray-300 focus:border-blue-500"
              }`}
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-[10px] text-red-500">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full border rounded-md p-2 pr-10"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>

            {formData.password && (
              <div className="mt-2">
                <div className="w-full bg-gray-200 h-1.5 rounded-full">
                  <div
                    className={`h-full ${
                      strength < 50 ? "bg-red-500" : strength < 100 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-[9px] text-right">Strength: {strength}%</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1">Konfirmasi Password</label>
            <input
              name="confirmPassword"
              type="password"
              className="w-full border rounded-md p-2"
              value={formData.confirmPassword}
              onChange={handleChange}
            />

            {formData.confirmPassword && (
              <p className={`text-[10px] mt-1 ${
                formData.confirmPassword === formData.password ? "text-green-500" : "text-red-500"
              }`}>
                {formData.confirmPassword === formData.password
                  ? "Password cocok"
                  : "Password tidak cocok"}
              </p>
            )}
          </div>

          {/* Captcha */}
          <div>
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 px-3 py-1 rounded">{staticCaptcha}</div>
              <FaSyncAlt />
            </div>
            <input
              name="captchaInput"
              type="text"
              className="w-full border rounded-md p-2"
              value={formData.captchaInput}
              onChange={handleChange}
            />
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white py-2 rounded">
            Register
          </button>
        </form>
      </div>
    </div>
  );
}