// src/components/GameSelection.jsx
import { Link } from 'react-router-dom';
import './GameSelection.css';

export function GameSelection() {
  return (
    <div className="selection-container">
      <h2 className="selection-title">Choose Your Game</h2>
      
      <div className="games-grid">
        {/* Boggle with Koala */}
        <div className="game-holder">
          <div className="animal koala">
            <div className="head">
              <div className="ears">
                <div className="ear left"></div>
                <div className="ear right"></div>
              </div>
              <div className="face">
                <div className="eyes"></div>
                <div className="nose"></div>
              </div>
            </div>
            <div className="arms">
              <div className="arm left"></div>
              <div className="arm right"></div>
            </div>
          </div>
          <Link to="/boggle" className="game-card boggle-card">
            <h3>Boggle Word Hunt</h3>
            <p>Find hidden words in the letter grid!</p>
          </Link>
        </div>

        {/* Fruit Guesser with Panda */}
        <div className="game-holder">
          <div className="animal panda">
            <div className="head">
              <div className="ears">
                <div className="ear left"></div>
                <div className="ear right"></div>
              </div>
              <div className="face">
                <div className="eyes"></div>
                <div className="nose"></div>
              </div>
            </div>
            <div className="arms">
              <div className="arm left"></div>
              <div className="arm right"></div>
            </div>
          </div>
          <Link to="/fruit-guesser" className="game-card fruit-card">
            <h3>Fruit Guesser</h3>
            <p>Identify fruits and vegetables!</p>
          </Link>
        </div>
        <div>
        {/* Fruit Guesser with Panda */}
        <div className="game-holder">
          <div className="animal panda">
            <div className="head">
              <div className="ears">
                <div className="ear left"></div>
                <div className="ear right"></div>
              </div>
              <div className="face">
                <div className="eyes"></div>
                <div className="nose"></div>
              </div>
            </div>
            <div className="arms">
              <div className="arm left"></div>
              <div className="arm right"></div>
            </div>
          </div>
          <Link to="/memory-game" className="game-card fruit-card">
            <h3>Memory Game</h3>
            <p>Identify fruits and vegetables!</p>
          </Link>
        </div>
      </div>
      {/* Fruit Guesser with Panda */}
      <div className="game-holder">
          <div className="animal panda">
            <div className="head">
              <div className="ears">
                <div className="ear left"></div>
                <div className="ear right"></div>
              </div>
              <div className="face">
                <div className="eyes"></div>
                <div className="nose"></div>
              </div>
            </div>
            <div className="arms">
              <div className="arm left"></div>
              <div className="arm right"></div>
            </div>
          </div>
          <Link to="/memorys-game" className="game-card fruit-card">
            <h3>Memory Sequence Game</h3>
            <p>Identify fruits and vegetables!</p>
          </Link>
        </div>
      </div>
      
    </div>
  );
}