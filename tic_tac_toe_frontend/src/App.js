import React, { useState, useEffect } from "react";
import "./App.css";

/**
 * Modern, minimalistic Tic Tac Toe React app.
 *
 * Features:
 * - Turn-based gameplay (X and O players)
 * - Centered, responsive layout
 * - Game status info, reset button
 * - Win/draw detection and display
 * - Modern minimal design, light theme, custom colors
 *
 * Color scheme: accent: #FFC107, primary: #1976D2, secondary: #424242
 */

// Styling vars for usage in inline style (complement App.css and theme)
const COLORS = {
  accent: "#FFC107",
  primary: "#1976D2",
  secondary: "#424242",
  lightBG: "#fff",
  lightBoard: "#f8f9fa",
  border: "#e9ecef",
};

const BOARD_SIZE = 3;

// PUBLIC_INTERFACE
function App() {
  // 0..8 board, each cell is "X", "O", or ""
  const [board, setBoard] = useState(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
  const [isX, setIsX] = useState(true); // true: X's turn, false: O's turn
  const [winner, setWinner] = useState(null);
  const [status, setStatus] = useState("X's turn");
  const [isDraw, setIsDraw] = useState(false);

  // Centered minimal style on body
  useEffect(() => {
    document.body.style.background = COLORS.lightBG;
  }, []);

  // Calculate game status after every move
  useEffect(() => {
    const win = calculateWinner(board);
    if (win) {
      setWinner(win);
      setStatus(`${win} wins!`);
      setIsDraw(false);
    } else if (board.every((cell) => cell)) {
      setWinner(null);
      setStatus("It's a draw!");
      setIsDraw(true);
    } else {
      setWinner(null);
      setStatus(`${isX ? "X" : "O"}'s turn`);
      setIsDraw(false);
    }
  }, [board, isX]);

  // PUBLIC_INTERFACE
  function handleCellClick(idx) {
    // No move if won or occupied
    if (winner || board[idx]) return;
    const next = [...board];
    next[idx] = isX ? "X" : "O";
    setBoard(next);
    setIsX((prev) => !prev);
  }

  // PUBLIC_INTERFACE
  function handleReset() {
    setBoard(Array(BOARD_SIZE * BOARD_SIZE).fill(""));
    setIsX(true);
    setWinner(null);
    setStatus("X's turn");
    setIsDraw(false);
  }

  // PUBLIC_INTERFACE
  // Calculate winning pattern
  function calculateWinner(cells) {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8], // rows
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8], // cols
      [0, 4, 8],
      [2, 4, 6], // diags
    ];
    for (let line of lines) {
      const [a, b, c] = line;
      if (
        cells[a] &&
        cells[a] === cells[b] &&
        cells[a] === cells[c]
      ) {
        return cells[a];
      }
    }
    return null;
  }

  return (
    <div
      className="App"
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <main>
        {/* Game Info */}
        <section
          style={{
            textAlign: "center",
            marginBottom: "2rem",
          }}
        >
          <h1
            style={{
              fontWeight: 700,
              fontSize: "2.5rem",
              color: COLORS.primary,
              marginBottom: "0.4em",
              letterSpacing: ".08em",
            }}
          >
            Tic Tac Toe
          </h1>
          <div
            style={{
              margin: "0.5em auto",
              fontSize: "1.2rem",
              color:
                winner
                  ? COLORS.accent
                  : isDraw
                  ? COLORS.secondary
                  : COLORS.primary,
              fontWeight: 600,
              minHeight: "1.4em",
              letterSpacing: ".04em",
            }}
            role="status"
            data-testid="game-status"
          >
            {status}
          </div>
        </section>

        {/* Tic Tac Toe Board */}
        <section
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${BOARD_SIZE}, 1fr)`,
              gridTemplateRows: `repeat(${BOARD_SIZE}, 1fr)`,
              gap: "12px",
              background: COLORS.lightBoard,
              padding: "24px",
              borderRadius: "16px",
              boxShadow: "0 2px 24px rgba(50,70,130,0.08)",
              border: `1px solid ${COLORS.border}`,
              marginBottom: "2rem",
              maxWidth: "310px",
            }}
          >
            {board.map((cell, idx) => (
              <button
                key={idx}
                aria-label={`cell ${idx}`}
                className="ttt-cell"
                onClick={() => handleCellClick(idx)}
                style={{
                  width: "80px",
                  height: "80px",
                  fontSize: "2.5rem",
                  fontWeight: 700,
                  background: COLORS.lightBG,
                  color:
                    cell === "X"
                      ? COLORS.primary
                      : cell === "O"
                      ? COLORS.secondary
                      : COLORS.secondary,
                  border: `2px solid ${COLORS.border}`,
                  borderRadius: "12px",
                  outline:
                    // highlight last move or win
                    winner &&
                    [0, 1, 2, 3, 4, 5, 6, 7, 8].some(
                      (j) => board[j] && cell && board[j] === winner && idx === j
                    )
                      ? `2px solid ${COLORS.accent}`
                      : "2px solid " + COLORS.border,
                  cursor: board[idx] || winner ? "default" : "pointer",
                  transition: "background 0.13s, color 0.13s",
                  boxShadow:
                    board[idx] && !winner
                      ? "0 0 0 2px rgba(33,150,243,0.08)"
                      : "none",
                  userSelect: "none",
                  outlineOffset: "2px",
                }}
                disabled={!!board[idx] || !!winner}
                data-testid={`cell-${idx}`}
              >
                {cell}
              </button>
            ))}
          </div>
        </section>

        {/* Controls */}
        <section style={{ textAlign: "center", marginBottom: "10px" }}>
          <button
            onClick={handleReset}
            style={{
              background: COLORS.accent,
              color: "#fff",
              padding: "10px 28px",
              fontWeight: 600,
              fontSize: "1.06rem",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              boxShadow: "0 1px 8px rgba(0,0,0,0.06)",
              transition: "background 0.18s, color 0.18s",
              letterSpacing: ".05em",
            }}
            aria-label="Reset the game"
            data-testid="reset-button"
          >
            Reset
          </button>
        </section>
        <footer style={{ textAlign: "center", color: "#b0b0b0", fontSize: ".98rem" }}>
          <span>
            Modern Tic Tac Toe &mdash; <span style={{ color: COLORS.primary }}>React</span>
          </span>
        </footer>
      </main>
    </div>
  );
}

export default App;
