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

  // 🔥 Strength + harus cocok
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

      if (emailRef.current) {
        emailRef.current.setCustomValidity("");
      }
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

    // Username
    if (!formData.username) newErrors.username = "Username wajib diisi";
    else if (formData.username.length < 3) newErrors.username = "Username minimal 3 karakter";
    else if (formData.username.length > 8) newErrors.username = "Username maksimal 8 karakter";

    // Email (popup + error text)
    const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)$/;
    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
      emailRef.current?.setCustomValidity("Email wajib diisi");
    } else if (!emailPattern.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
      emailRef.current?.setCustomValidity(
        `Sertakan '@' pada alamat email. '${formData.email}' tidak memiliki '@'.`
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

      // 🔥 TRIGGER POPUP EMAIL
      if (emailRef.current && validationErrors.email) {
        emailRef.current.reportValidity();
        emailRef.current.focus();
      }
    } else {
      alert("Register Berhasil!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-xl shadow-2xl p-8">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* Username */}
          <div>
            <label className="text-xs font-semibold">
              Username <span className="text-gray-400">(max 8 karakter)</span>
            </label>
            <input
              name="username"
              placeholder="Masukkan username"
              className="w-full border p-2 text-sm placeholder-gray-400"
              value={formData.username}
              onChange={handleChange}
            />
            {errors.username && <p className="text-red-500 text-xs">{errors.username}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="text-xs font-semibold">Email</label>
            <input
              ref={emailRef}
              name="email"
              type="email"
              required
              pattern="[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.(com|net|co)"
              placeholder="Masukkan email"
              className="w-full border p-2 text-sm placeholder-gray-400"
              value={formData.email}
              onChange={handleChange}
            />
            {errors.email && <p className="text-red-500 text-xs">{errors.email}</p>}
          </div>

          {/* Password */}
          <div>
            <label className="text-xs font-semibold">Password</label>
            <input
              name="password"
              type="password"
              placeholder="Masukkan password"
              className="w-full border p-2 text-sm placeholder-gray-400"
              value={formData.password}
              onChange={handleChange}
            />
            {errors.password && <p className="text-red-500 text-xs">{errors.password}</p>}

            {formData.password && (
              <div className="mt-2">
                <div className="bg-gray-200 h-1.5">
                  <div
                    className={`h-full ${
                      strength < 50 ? "bg-red-500" : strength < 100 ? "bg-yellow-500" : "bg-green-500"
                    }`}
                    style={{ width: `${strength}%` }}
                  />
                </div>
                <p className="text-[10px] text-right">Strength: {strength}%</p>
              </div>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-xs font-semibold">Konfirmasi Password</label>
            <input
              name="confirmPassword"
              type="password"
              placeholder="Masukkan ulang password"
              className="w-full border p-2 text-sm placeholder-gray-400"
              value={formData.confirmPassword}
              onChange={handleChange}
            />
            {errors.confirmPassword && <p className="text-red-500 text-xs">{errors.confirmPassword}</p>}
          </div>

          {/* Captcha */}
          <div>
            <div className="flex gap-2">
              <div className="bg-gray-200 px-3 py-1">{staticCaptcha}</div>
              <FaSyncAlt />
            </div>
            <input
              name="captchaInput"
              placeholder="Masukkan captcha"
              className="w-full border p-2 text-sm placeholder-gray-400"
              value={formData.captchaInput}
              onChange={handleChange}
            />
            {errors.captchaInput && <p className="text-red-500 text-xs">{errors.captchaInput}</p>}
          </div>

          <button className="w-full bg-blue-600 text-white p-2">Register</button>
        </form>
      </div>
    </div>
  );
}