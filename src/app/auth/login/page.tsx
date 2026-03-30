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

  // 🔥 Strength + harus cocok untuk 100%
  useEffect(() => {
    let calculatedStrength =
      (formData.password.length > 7 ? 25 : 0) +
      (/[A-Z]/.test(formData.password) ? 25 : 0) +
      (/[0-9]/.test(formData.password) ? 25 : 0) +
      (/[^A-Za-z0-9]/.test(formData.password) ? 25 : 0);

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

    // 🔥 REAL-TIME EMAIL VALIDATION
    if (name === "email") {
      const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/;

      if (value && !emailPattern.test(value)) {
        setErrors((prev) => ({
          ...prev,
          email: "Format email tidak valid"
        }));
      } else {
        setErrors((prev) => {
          const newErrors = { ...prev };
          delete newErrors.email;
          return newErrors;
        });
      }

      emailRef.current?.setCustomValidity("");
    }

    if (errors[name] && name !== "email") {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/;

    // Username
    if (!formData.username) newErrors.username = "Username wajib diisi";
    else if (formData.username.length < 3) newErrors.username = "Username minimal 3 karakter";
    else if (formData.username.length > 8) newErrors.username = "Username maksimal 8 karakter";

    // Email
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
      emailRef.current?.setCustomValidity("Email wajib diisi");
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      emailRef.current?.setCustomValidity(
        `Sertakan '@' dan domain (.com/.net/.co). '${formData.email}' tidak valid.`
      );
    } else {
      emailRef.current?.setCustomValidity("");
    }

    // Phone
    if (!formData.phone) newErrors.phone = "Nomor telepon wajib diisi";
    else if (formData.phone.length < 10) newErrors.phone = "Nomor telepon minimal 10 karakter";

    // Password
    if (!formData.password) newErrors.password = "Password wajib diisi";
    else if (formData.password.length < 8) newErrors.password = "Password minimal 8 karakter";

    // Confirm Password
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    // Captcha
    if (!formData.captchaInput) {
      newErrors.captchaInput = "Captcha wajib diisi";
    } else if (formData.captchaInput !== staticCaptcha) {
      newErrors.captchaInput = "Harus sesuai dengan captcha yang ditampilkan";
    }

    return newErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const validationErrors = validateForm();

    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);

      // 🔥 Popup browser + fokus ke email
      if (validationErrors.email) {
        emailRef.current?.reportValidity();
        emailRef.current?.focus();
      }
    } else {
      alert("Register Berhasil!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4 font-sans">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">

        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">
          Register
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="text-xs font-semibold text-gray-600">
              Username <span className="text-gray-400">(max 8 karakter)</span>
            </label>
            <input
              name="username"
              placeholder="Masukkan username"
              className="w-full border rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Email</label>
            <input
              ref={emailRef}
              name="email"
              type="email"
              required
              placeholder="Masukkan email"
              className="w-full border rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Nomor Telepon</label>
            <input
              name="phone"
              placeholder="Masukkan nomor telepon"
              className="w-full border rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={formData.phone}
              onChange={handleChange}
            />
            {errors.phone && <p className="text-red-500 text-xs">{errors.phone}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Password</label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="Masukkan password"
                className="w-full border rounded-md p-2 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={formData.password}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

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
                <p className="text-[10px] text-right text-gray-500">
                  Strength: {strength}%
                </p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold text-gray-600">Konfirmasi Password</label>
            <div className="relative">
              <input
                name="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Masukkan ulang password"
                className="w-full border rounded-md p-2 pr-10 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
                value={formData.confirmPassword}
                onChange={handleChange}
              />
              <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-2.5 text-gray-400">
                {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
              </button>
            </div>
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          {/* Captcha */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="bg-gray-100 px-3 py-1 rounded font-bold italic">
                {staticCaptcha}
              </div>
              <FaSyncAlt className="cursor-pointer text-blue-500" />
            </div>
            <input
              name="captchaInput"
              placeholder="Masukkan captcha"
              className="w-full border rounded-md p-2 text-sm placeholder-gray-400 focus:outline-none focus:border-blue-500"
              value={formData.captchaInput}
              onChange={handleChange}
            />
            {errors.captchaInput && <p className="text-red-500 text-xs">{errors.captchaInput}</p>}
          </div>

          <button className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition">
            Register
          </button>

        </form>
      </div>
    </div>
  );
}