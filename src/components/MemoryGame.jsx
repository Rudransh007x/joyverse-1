/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */

import { useState, useEffect } from "react";
import "./MemoryGame.css";
import { useNavigate } from "react-router-dom";
import Confetti from "react-confetti";

const gameId = "3";
const colors = [
  "#FF5733",
  "#33FF57",
  "#3357FF",
  "#FF33A6",
  "#F3FF33",
  "#33FFF6",
  "#A6FF33",
  "#33A6FF",
];

function MemoryGame({ onFinish, childName, sessionId }) {
  const navigate = useNavigate();
  const [grid, setGrid] = useState(Array(16).fill(null));
  const [selectedBoxes, setSelectedBoxes] = useState([]);
  const [attemptsLeft, setAttemptsLeft] = useState(15);
  const [matchedPairs, setMatchedPairs] = useState([]);
  const [revealed, setRevealed] = useState(true);
  const [gameWon, setGameWon] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [alert, setAlert] = useState({ show: false, variant: "", message: "" });

  // Get window dimensions for confetti
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    initializeGrid();

    // Reveal grid colors for 5 seconds
    const revealTimeout = setTimeout(() => {
      setRevealed(false);
    }, 5000);

    return () => clearTimeout(revealTimeout);
  }, []);

  function initializeGrid() {
    let tempGrid = Array(16).fill(null);
    let pairs = [...colors, ...colors];
    pairs = pairs.sort(() => Math.random() - 0.5);

    pairs.forEach((color, index) => {
      tempGrid[index] = color;
    });

    setGrid(tempGrid);
  }

  function handleBoxClick(index) {
    if (
      !gameWon &&
      selectedBoxes.length < 2 &&
      !selectedBoxes.includes(index) &&
      !matchedPairs.includes(grid[index])
    ) {
      const newSelected = [...selectedBoxes, index];
      setSelectedBoxes(newSelected);

      // Delay the match check to allow the color to be revealed
      if (newSelected.length === 2) {
        setTimeout(() => checkMatch(newSelected), 300);
      }
    }
  }

  function checkMatch(newSelected) {
    const [first, second] = newSelected;

    if (grid[first] === grid[second]) {
      setMatchedPairs([...matchedPairs, grid[first]]);
      setSelectedBoxes([]);
    } else {
      setTimeout(() => setSelectedBoxes([]), 1000);
    }

    const newAttemptsLeft = attemptsLeft - 1;
    setAttemptsLeft(newAttemptsLeft);

    if (matchedPairs.length + 1 === 8) {
      handleGameEnd(true, newAttemptsLeft);
    } else if (newAttemptsLeft === 0) {
      handleGameEnd(false, newAttemptsLeft);
    }
  }

  function handleGameEnd(success, movesRemaining) {
    setGameWon(true);
    setShowConfetti(true);
    const finalScore = calculateScore(movesRemaining);

    setAlert({
      show: true,
      variant: success ? "success" : "danger",
      message: success
        ? "Congratulations! You've matched all pairs!"
        : "Game Over! Try again!",
    });

    if (onFinish) onFinish(finalScore);

    setTimeout(() => {
      setShowConfetti(false);
      navigate("/");
    }, 5000);
  }

  function calculateScore(movesRemaining) {
    if (movesRemaining >= 5) return 10;
    if (movesRemaining >= 4) return 8;
    if (movesRemaining >= 3) return 6;
    if (movesRemaining >= 1) return 4;
    return 2;
  }

  return (
    <div className="memory-game-container">
      {showConfetti && <Confetti width={windowSize.width} height={windowSize.height} />}
      
      <h1>Memory Game</h1>
      <div className="game-info">
        <h2>Score: {calculateScore(attemptsLeft)}</h2>
        <h2>Attempts Left: {attemptsLeft}</h2>
      </div>

      {alert.show && (
        <div className={`alert-message ${alert.variant}`}>
          {alert.message}
        </div>
      )}

      <div className="grid-container">
        {grid.map((color, index) => (
          <div
            key={index}
            className={`box ${
              revealed || selectedBoxes.includes(index) || matchedPairs.includes(color)
                ? "revealed"
                : ""
            }`}
            style={{
              backgroundColor:
                revealed || selectedBoxes.includes(index) || matchedPairs.includes(color)
                  ? color
                  : undefined,
            }}
            onClick={() => handleBoxClick(index)}
          ></div>
        ))}
      </div>
    </div>
  );
}

export default MemoryGame;