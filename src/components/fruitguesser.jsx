import React, { useState, useEffect, useRef } from "react";
import useEmotionDetection from './EmotionDetection/useEmotionDetection';
import "./fruitguesser.css";

const wordPairs = {
  Apple: "🍎",
  Banana: "🍌",
  Grapes: "🍇",
  Orange: "🍊",
  Strawberry: "🍓",
  Watermelon: "🍉"
};

const words = Object.keys(wordPairs);

function FruitGuesser() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const { emotion } = useEmotionDetection({ videoRef, canvasRef });
  
  const [currentWord, setCurrentWord] = useState("");
  const [score, setScore] = useState(0);
  const [result, setResult] = useState("");
  const [consecutiveErrors, setConsecutiveErrors] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [emotionFeedback, setEmotionFeedback] = useState("");
  const [gameStarted, setGameStarted] = useState(false);

  // Initialize the game with a random word
  useEffect(() => {
    if (gameStarted) {
      getRandomWord();
    }
  }, [gameStarted]);

  // Emotion feedback based on detected emotion
  useEffect(() => {
    if (emotion) {
      switch(emotion) {
        case 'happy':
          setEmotionFeedback("You look happy! Keep going!");
          break;
        case 'sad':
          setEmotionFeedback("Don't be sad! You can do this!");
          break;
        case 'angry':
          setEmotionFeedback("Take a deep breath. You've got this!");
          break;
        default:
          setEmotionFeedback("");
      }
    }
  }, [emotion]);

  const getRandomWord = () => {
    const randomIndex = Math.floor(Math.random() * words.length);
    setCurrentWord(words[randomIndex]);
    setResult("");
  };

  const getThemeClass = () => {
    if (emotion === "sad" || emotion === "angry") {
      if (consecutiveErrors >= 3) return "dark-red-theme";
      if (consecutiveErrors >= 2) return "red-theme";
      return "blue-theme";
    }
    
    if (consecutiveErrors >= 3) return "peach-theme";
    if (consecutiveErrors >= 2) return "orange-theme";
    return "default-theme";
  };

  useEffect(() => {
    document.body.className = `fruit-guesser ${getThemeClass()}`;
    return () => { document.body.className = ''; };
  }, [consecutiveErrors, emotion]);

  const checkGuess = (guess) => {
    setAttempts(attempts + 1);
    
    if (guess === currentWord) {
      setScore(score + 1);
      setResult("Correct! Well done!");
      setConsecutiveErrors(0);
      setTimeout(getRandomWord, 1000);
    } else {
      setResult(`Oops! That's not ${currentWord}. Try again!`);
      setConsecutiveErrors(consecutiveErrors + 1);
    }
  };

  const startGame = () => {
    setGameStarted(true);
    setScore(0);
    setAttempts(0);
    setConsecutiveErrors(0);
  };

  return (
    <div className="fruit-guesser-container">
      {/* Animal Decorations */}
      <div className="animal-decoration animal-1"></div>
      <div className="animal-decoration animal-2"></div>
      
      <h1>Fruit Guesser Game</h1>
      
      {!gameStarted ? (
        <div className="start-screen">
          <p>Can you guess the fruit from the emoji?</p>
          <button onClick={startGame} className="start-button">
            Let's Play!
          </button>
        </div>
      ) : (
        <>
          <div className="game-info">
            <p>⭐ Score: {score}</p>
            <p>🎯 Attempts: {attempts}</p>
            {emotionFeedback && <p className="emotion-feedback">{emotionFeedback}</p>}
          </div>

          <div className="game-area">
            <div className="emoji-display">
              <h2>{wordPairs[currentWord]}</h2>
              <p>What fruit is this?</p>
            </div>

            <div className="buttons-container">
              {words.map((word) => (
                <button
                  key={word}
                  onClick={() => checkGuess(word)}
                  className="fruit-button"
                >
                  {word}
                </button>
              ))}
            </div>

            {result && <p className="result-message">{result}</p>}
          </div>
          
          {/* Hidden camera elements for emotion detection */}
          <video ref={videoRef} autoPlay muted playsInline style={{ display: 'none' }} />
          <canvas ref={canvasRef} style={{ display: 'none' }} />
        </>
      )}
    </div>
  );
}

export default FruitGuesser;