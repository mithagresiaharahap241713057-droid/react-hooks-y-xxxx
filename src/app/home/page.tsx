'use client';

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Game1 from "../../components/Game1";

export default function Home() {
    const router = useRouter();

    useEffect(() => {
        const isLogin = localStorage.getItem("isLogin");

        if (!isLogin) {
            router.push("/auth/not-authorized");
        }
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen">
            <h1 className="text-4xl font-bold mb-4">Selamat Datang!</h1>
            <Game1 />
        </div>
    );
}