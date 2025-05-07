import React, { useState, useEffect, useRef } from 'react';
import './MemorySequence.css';

const colors = [
  { name: 'Red', value: '#FF7F7F' },
  { name: 'Blue', value: '#87CEEB' },
  { name: 'Green', value: '#90EE90' },
  { name: 'Yellow', value: '#FFFACD' }
];

const themes = {
  default: { bg: '#BFD8E5', text: '#000000', name: 'Default' },
  happy: { bg: '#FFD700', text: '#000000', name: 'Happy' },
  sad: { bg: '#87CEEB', text: '#FFFFFF', name: 'Sad' },
  angry: { bg: '#FF7F7F', text: '#FFFFFF', name: 'Angry' }
};

function MemorySequenceGame() {
  const [gameState, setGameState] = useState({
    sequence: [],
    playerSequence: [],
    score: 0,
    isPlaying: false,
    message: 'Press Start to Play!',
    attemptsLeft: 3,
    showSequence: false
  });

  const [currentTheme, setCurrentTheme] = useState(themes.default);
  const timeoutRef = useRef(null);

  const startGame = () => {
    generateSequence();
  };

  const generateSequence = () => {
    const newSequence = Array.from({ length: 4 }, () => 
      colors[Math.floor(Math.random() * colors.length)]
    );

    setGameState(prev => ({
      ...prev,
      sequence: newSequence,
      playerSequence: [],
      isPlaying: true,
      showSequence: true,
      attemptsLeft: 3,
      message: 'Watch the sequence...'
    }));

    // Change theme randomly for demonstration
    const themeKeys = Object.keys(themes);
    const randomTheme = themes[themeKeys[Math.floor(Math.random() * themeKeys.length)]];
    setCurrentTheme(randomTheme);

    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    timeoutRef.current = setTimeout(() => {
      setGameState(prev => ({
        ...prev,
        showSequence: false,
        message: 'Your turn! Repeat the sequence.'
      }));
    }, 3000);
  };

  const handleColorClick = (color) => {
    if (!gameState.isPlaying || gameState.showSequence) return;

    const newPlayerSequence = [...gameState.playerSequence, color];
    setGameState(prev => ({ ...prev, playerSequence: newPlayerSequence }));

    if (color.value !== gameState.sequence[newPlayerSequence.length - 1]?.value) {
      const newAttempts = gameState.attemptsLeft - 1;
      setGameState(prev => ({ 
        ...prev, 
        attemptsLeft: newAttempts,
        playerSequence: [],
        message: newAttempts > 0 
          ? `Wrong! ${newAttempts} attempt(s) left.` 
          : `Game Over! Score: ${gameState.score}. Press Restart.`,
        isPlaying: newAttempts > 0
      }));
    } else if (newPlayerSequence.length === gameState.sequence.length) {
      const newScore = gameState.score + 1;
      setGameState(prev => ({
        ...prev,
        score: newScore,
        message: 'Correct! Next round...',
        attemptsLeft: 3
      }));

      setTimeout(generateSequence, 1000);
    }
  };

  const restartGame = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setGameState({
      sequence: [],
      playerSequence: [],
      score: 0,
      isPlaying: false,
      message: 'Press Start to Play!',
      attemptsLeft: 3,
      showSequence: false
    });
    setCurrentTheme(themes.default);
  };

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  return (
    <div className="App" style={{ backgroundColor: currentTheme.bg, color: currentTheme.text }}>
      <h1>Memory Sequence Game</h1>
      
      <div className="game-info">
        <p className="message">{gameState.message}</p>
        <div className="stats">
          <span>Score: {gameState.score}</span>
          <span>Attempts: {gameState.attemptsLeft}</span>
          <span>Theme: {currentTheme.name}</span>
        </div>
      </div>

      {gameState.showSequence && (
        <div className="sequence-display">
          <p>Remember:</p>
          <p>{gameState.sequence.map(color => color.name).join(' → ')}</p>
        </div>
      )}

      <div className="color-buttons">
        {colors.map(color => (
          <button
            key={color.value}
            style={{ 
              backgroundColor: color.value,
              color: currentTheme.text,
              border: `2px solid ${currentTheme.text}`
            }}
            onClick={() => handleColorClick(color)}
            disabled={gameState.showSequence || !gameState.isPlaying}
          >
            {color.name}
          </button>
        ))}
      </div>

      <div className="controls">
        <button 
          onClick={startGame} 
          disabled={gameState.isPlaying}
        >
          Start Game
        </button>
        <button onClick={restartGame}>Restart</button>
      </div>
    </div>
  );
}

export default MemorySequenceGame;