'use client';

import { FaGoogle, FaGithub, FaFacebook, FaCheck } from 'react-icons/fa';
import { toast } from 'react-toastify';

const SocialAuth = () => {

    const handleSocialLogin = (provider: string) => {
        // 🔥 Pesan sesuai provider
        let message = '';

        if (provider === 'Google') {
            message = 'Google Login Berhasil!';
        } else if (provider === 'Github') {
            message = 'Github Login Berhasil!';
        } else if (provider === 'Facebook') {
            message = 'Facebook Login Berhasil!';
        }

        // 🔥 Toast
        toast.success(message, {
            position: 'top-right',
            icon: <FaCheck className="text-green-400" />,
        });

        // 🔥 OPTIONAL (biar dianggap login)
        localStorage.setItem("isLogin", "true");
    };

    return (
        <div className="space-y-4 mt-4">

            {/* Divider */}
            <div className="relative">
                <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-300"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-gray-500">
                        Atau masuk dengan
                    </span>
                </div>
            </div>

            {/* Buttons */}
            <div className="flex space-x-4 justify-center">

                <button
                    type="button"
                    onClick={() => handleSocialLogin('Google')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <FaGoogle className="text-xl text-red-600" />
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialLogin('Github')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <FaGithub className="text-xl text-gray-800" />
                </button>

                <button
                    type="button"
                    onClick={() => handleSocialLogin('Facebook')}
                    className="p-3 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                >
                    <FaFacebook className="text-xl text-blue-600" />
                </button>

            </div>
        </div>
    );
};

export default SocialAuth;