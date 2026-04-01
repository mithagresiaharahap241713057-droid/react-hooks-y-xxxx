<div className="game-panel">
    <h1 className="game-title">🎮 Tap the Mouse</h1>

    {/* STATS BARU */}
    <div className="game-stats" style={{ display: "flex", gap: "10px", justifyContent: "center", marginBottom: "10px" }}>
        <div style={{
            background: "#2e7d32",
            color: "white",
            padding: "8px 12px",
            borderRadius: "10px",
            fontWeight: "bold"
        }}>
            🏆 Score: {score}
        </div>

        <div style={{
            background: "#ef6c00",
            color: "white",
            padding: "8px 12px",
            borderRadius: "10px",
            fontWeight: "bold"
        }}>
            ⏱️ Time: {time}
        </div>
    </div>

    {/* HIGH SCORE */}
    <div style={{ marginBottom: "10px", fontWeight: "600" }}>
        ⭐ High Score: {highScore}
    </div>

    {/* BUTTON */}
    {!gameActive && (
        <button
            className="start-btn"
            style={{
                background: "linear-gradient(90deg, #6a5acd, #7b1fa2)",
                color: "white",
                padding: "10px 20px",
                borderRadius: "12px",
                border: "none",
                fontWeight: "bold"
            }}
            onClick={startGame}
        >
            🚀 Start Game
        </button>
    )}

    {gameActive && (
        <div className="flex gap-2 mt-4">
            <button onClick={togglePause}>
                {paused ? "▶️ Resume" : "⏸️ Pause"}
            </button>

            <button onClick={resetGame}>
                🔄 Reset
            </button>
        </div>
    )}
</div>