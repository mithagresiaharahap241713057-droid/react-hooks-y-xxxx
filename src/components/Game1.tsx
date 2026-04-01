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

    useEffect(() => {
        const saved = localStorage.getItem("whack_highscore");
        if (saved) setHighScore(Number(saved));
    }, []);

    useEffect(() => {
        if (!gameActive) return;

        const moleTimer = setInterval(() => {
            const randomIndex = Math.floor(Math.random() * holes.length);
            setMoleIndex(randomIndex);
        }, speed);

        return () => clearInterval(moleTimer);
    }, [gameActive, speed]);

    useEffect(() => {
        if (!gameActive) return;

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
    }, [gameActive]);

    // ❌ TANPA NOTIF HIT
    const hitMole = (index: number) => {
        if (index === moleIndex && gameActive) {
            setScore((prev) => prev + 1);
            setMoleIndex(null);
        }
    };

    const startGame = () => {
        setScore(0);
        setTime(30);
        setSpeed(700);
        setGameActive(true);

        toast.info("⏱️ Waktu dimulai! Kamu punya 30 detik");
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

                {/* ✅ UI SESUAI GAMBAR */}
                <div
                    style={{
                        display: "flex",
                        justifyContent: "center",
                        gap: "15px",
                        marginBottom: "15px"
                    }}
                >
                    <div
                        style={{
                            background: "#43a047",
                            color: "white",
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}
                    >
                        🏆 Score: {score}
                    </div>

                    <div
                        style={{
                            background: "#ff7043",
                            color: "white",
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontWeight: "bold",
                            boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
                        }}
                    >
                        ⏱️ Time: {time}
                    </div>
                </div>

                <div
                    style={{
                        marginBottom: "15px",
                        fontWeight: "600",
                        fontSize: "16px"
                    }}
                >
                    ⭐ High Score: {highScore}
                </div>

                {!gameActive && (
                    <button
                        className="start-btn"
                        style={{
                            background: "linear-gradient(90deg, #5c6bc0, #7e57c2)",
                            color: "white",
                            padding: "12px 25px",
                            borderRadius: "14px",
                            border: "none",
                            fontWeight: "bold",
                            fontSize: "16px",
                            boxShadow: "0 3px 8px rgba(0,0,0,0.3)"
                        }}
                        onClick={startGame}
                    >
                        🚀 Start Game
                    </button>
                )}
            </div>

            {/* ❗ GRID TIDAK DIUBAH */}
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