"use client";

import React, { useState, useEffect } from "react";
import { Form, Button, ProgressBar, Container, Row, Col } from "react-bootstrap";

interface FormDataType {
  username: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  captcha: string;
}

interface ErrorType {
  username?: string;
  email?: string;
  phone?: string;
  password?: string;
  confirmPassword?: string;
  captcha?: string;
}

const RegisterPage = () => {
  const [formData, setFormData] = useState<FormDataType>({
    username: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    captcha: "",
  });

  const [errors, setErrors] = useState<ErrorType>({});
  const [captchaText, setCaptchaText] = useState<string>("");
  const [passwordStrength, setPasswordStrength] = useState<number>(0);

  // 🔥 Generate captcha (AMAN dari hydration)
  const generateCaptcha = () => {
    const chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < 6; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCaptchaText(result);
  };

  useEffect(() => {
    generateCaptcha();
  }, []);

  // 🔥 Password strength
  const calculatePasswordStrength = (password: string): number => {
    let strength = 0;
    if (password.length > 7) strength += 25;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength += 25;
    if (/[0-9]/.test(password)) strength += 25;
    if (/[^A-Za-z0-9]/.test(password)) strength += 25;
    return strength;
  };

  useEffect(() => {
    setPasswordStrength(calculatePasswordStrength(formData.password));
  }, [formData.password]);

  // 🔥 Handle input
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name === "phone") {
      const onlyNumber = value.replace(/\D/g, "");
      setFormData({ ...formData, phone: onlyNumber });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  // 🔥 Validasi
  const validate = () => {
    const newErrors: ErrorType = {};

    if (!formData.username) {
      newErrors.username = "Username wajib diisi";
    } else if (formData.username.length < 3) {
      newErrors.username = "Username minimal 3 karakter";
    } else if (formData.username.length > 8) {
      newErrors.username = "Username maksimal 8 karakter";
    }

    if (!formData.email) {
      newErrors.email = "Email wajib diisi";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Format email tidak valid";
    }

    if (!formData.phone) {
      newErrors.phone = "Nomor telepon wajib diisi";
    } else if (formData.phone.length < 10) {
      newErrors.phone = "Nomor telepon minimal 10 karakter";
    }

    if (!formData.password) {
      newErrors.password = "Password wajib diisi";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password minimal 8 karakter";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Konfirmasi password wajib diisi";
    } else if (formData.confirmPassword !== formData.password) {
      newErrors.confirmPassword = "Konfirmasi password tidak cocok";
    }

    if (!formData.captcha) {
      newErrors.captcha = "Captcha wajib diisi";
    } else if (formData.captcha !== captchaText) {
      newErrors.captcha = "Captcha tidak valid";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // 🔥 Submit
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (validate()) {
      const userData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
      };

      localStorage.setItem("user", JSON.stringify(userData));

      alert("Register Berhasil!");

      setFormData({
        username: "",
        email: "",
        phone: "",
        password: "",
        confirmPassword: "",
        captcha: "",
      });

      generateCaptcha();

      window.location.href = "/auth/login";
    }
  };

  return (
    <Container className="p-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Form onSubmit={handleSubmit} className="p-4 border rounded shadow-sm">
            <h2 className="text-center mb-4">Register</h2>

            <Form.Group className="mb-3">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">{errors.username}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                isInvalid={!!errors.email}
              />
              <Form.Control.Feedback type="invalid">{errors.email}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Nomor Telepon</Form.Label>
              <Form.Control
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                isInvalid={!!errors.phone}
              />
              <Form.Control.Feedback type="invalid">{errors.phone}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                isInvalid={!!errors.password}
              />
              <ProgressBar now={passwordStrength} className="mt-2" label={`${passwordStrength}%`} />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Konfirmasi Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                isInvalid={!!errors.confirmPassword}
              />
              <Form.Control.Feedback type="invalid">{errors.confirmPassword}</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Captcha: {captchaText}</Form.Label>
              <Form.Control
                type="text"
                name="captcha"
                value={formData.captcha}
                onChange={handleInputChange}
                isInvalid={!!errors.captcha}
              />
              <Form.Control.Feedback type="invalid">{errors.captcha}</Form.Control.Feedback>
            </Form.Group>

            <Button type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default RegisterPage;