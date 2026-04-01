"use client";

import { useState, useEffect } from "react";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Game1() {
    const holes = Array.from({ length: 9 });

    const [moleIndex, setMoleIndex] = useState<number | null>(null);
    const [score, setScore] = useState(0);
    const [time, setTime] = useState(30);
    const [gameActive, setGameActive] = useState(false);
    const [highScore, setHighScore] = useState(0);
    const [speed, setSpeed] = useState(700);

    // LOAD HIGHSCORE
    useEffect(() => {
        const saved = localStorage.getItem("whack_highscore");
        if (saved) setHighScore(Number(saved));
    }, []);

    // MOLE SPAWN
    useEffect(() => {
        if (!gameActive) return;

        const moleTimer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * holes.length);
            setMoleIndex(randomIndex);
        }, speed);

        return () => clearInterval(moleTimer);
    }, [gameActive, speed]);

    // TIMER
    useEffect(() => {
        if (!gameActive) return;

        const countdown = setInterval(() => {
            setTime((prev) => {
                if (prev <= 1) {
                    clearInterval(countdown);
                    endGame();
                    return 0;
                }

                // 🔥 speed makin cepat tiap 5 detik
                if (prev % 5 === 0) {
                    setSpeed((s) => Math.max(300, s - 50));
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(countdown);
    }, [gameActive]);

    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);

            toast.success("🎯 Hit!", { autoClose: 500 });
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(30);
        setSpeed(700);
        setGameActive(true);

        toast.info("⏱️ Game dimulai!");
    };

    const endGame = () => {
        setGameActive(false);
        setMoleIndex(null);

        toast.info("⏰ Waktu habis!");

        if (score > highScore) {
            localStorage.setItem("whack_highscore", score.toString());
            setHighScore(score);
            toast.success("🔥 New High Score!");
        }
    };

    return (
        <div className="game-container">
            <div className="game-panel">
                <h1 className="game-title">🎮 Tap the Mouse</h1>

                <div className="game-stats">
                    <div>🏆 Score: {score}</div>
                    <div>⏱️ Time: {time}</div>
                </div>

                <div>⭐ High Score: {highScore}</div>

                {!gameActive && (
                    <button className="start-btn" onClick={startGame}>
                        🚀 Start Game
                    </button>
                )}
            </div>

            <div className="game-grid">
                {holes.map((_, index) => (
                    <div
                        key={index}
                        onClick={() => hitMole(index)}
                        className="hole"
                    >
                        {moleIndex === index && (
                            <div className="mole">🐹</div>
                        )}
                    </div>
                ))}
            </div>

            <ToastContainer position="top-center" autoClose={1000} />
        </div>
    );
}