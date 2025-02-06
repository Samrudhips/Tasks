import React, { useState } from "react";
import GameBoard from "./components/GameBoard";
import "./styles.css";

const App = () => {
  const [gameKey, setGameKey] = useState(0);

  const restartGame = () => {
    setGameKey((prevKey) => prevKey + 1); // Change key to reset game
  };

  return (
    <div className="app">
      <h1>Flip Card Match Game</h1>
      <GameBoard key={gameKey} restartGame={restartGame} />
      <button className="restart-button" onClick={restartGame}>Restart Game</button>
    </div>
  );
};

export default App;
