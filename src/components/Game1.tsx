"use client";

import { useState, useEffect } from "react";

export default function Game1() {
    const holes = Array.from({ length: 9 });

    const [moleIndex, setMoleIndex] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [gameActive, setGameActive] = useState(false);
    const [paused, setPaused] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [speed, setSpeed] = useState(700);

    // LOAD HIGHSCORE
    useEffect(() => {
        const saved = localStorage.getItem("whack_highscore");
        if (saved) setHighScore(Number(saved));
    }, []);

    // MOLE SPAWN
    useEffect(() => {
        if (!gameActive || paused) return;

        const moleTimer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * holes.length);
            setMoleIndex(randomIndex);
        }, speed);

        return () => clearInterval(moleTimer);
    }, [gameActive, paused, speed]);

    // TIMER
    useEffect(() => {
        if (!gameActive || paused) return;

        const countdown = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    endGame();
                    return 0;
                }

                if (prev % 5 === 0) {
                    setSpeed((s) => Math.max(300, s - 50));
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [gameActive, paused]);

    // ❌ HIT TANPA TOAST
    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive && !paused) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(30);
        setSpeed(700);
        setGameActive(true);
        setPaused(false);
    };

    const endGame = () => {
        setGameActive(false);
        setPaused(false);

        if (score > highScore) {
            localStorage.setItem("whack_highscore", score.toString());
            setHighScore(score);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-400 to-blue-600">
            
            <h1 className="text-4xl font-bold mb-6">Selamat Datang!</h1>

            <div className="bg-gray-200 p-8 rounded-3xl shadow-lg text-center w-[350px]">
                
                <h2 className="text-2xl font-bold mb-4">🎮 Tap the Mouse</h2>

                {/* STATS */}
                <div className="flex justify-center gap-4 mb-4">
                    <div className="bg-green-500 text-white px-4 py-2 rounded-lg font-semibold">
                        🏆 Score: {score}
                    </div>
                    <div className="bg-orange-500 text-white px-4 py-2 rounded-lg font-semibold">
                        ⏱️ Time: {time}
                    </div>
                </div>

                <div className="mb-4 font-semibold">
                    ⭐ High Score: {highScore}
                </div>

                {!gameActive && (
                    <button
                        onClick={startGame}
                        className="bg-gradient-to-r from-purple-500 to-indigo-500 text-white px-6 py-2 rounded-xl font-semibold"
                    >
                        🚀 Start Game
                    </button>
                )}
            </div>

            {/* GRID */}
            {gameActive && (
                <div className="grid grid-cols-3 gap-4 mt-6">
                    {holes.map((_, index) => (
                        <div
                            key={index}
                            onClick={() => hitMole(index)}
                            className="w-20 h-20 bg-gray-300 rounded-full flex items-center justify-center cursor-pointer"
                        >
                            {moleIndex === index && !paused && (
                                <span className="text-2xl">🐹</span>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}