import React, { useState, useEffect } from "react";
import Card from "./Card";

const symbols = ["A", "B", "C", "D", "E", "F", "G", "H"]; // 8 unique symbols
const cardPairs = [...symbols, ...symbols, ...symbols, ...symbols]; // 4 copies of each

const shuffleCards = () => {
  return [...cardPairs].sort(() => Math.random() - 0.5).map((symbol, index) => ({
    id: index,
    symbol,
    isFlipped: false,
    isMatched: false,
  }));
};

const GameBoard = ({ restartGame }) => {
  const [cards, setCards] = useState(shuffleCards());
  const [flippedCards, setFlippedCards] = useState([]);
  const [currentPlayer, setCurrentPlayer] = useState(1);
  const [scores, setScores] = useState({ player1: 0, player2: 0 });

  useEffect(() => {
    if (flippedCards.length === 2) {
      const [firstIndex, secondIndex] = flippedCards;
      const newCards = [...cards];

      if (newCards[firstIndex].symbol === newCards[secondIndex].symbol) {
        // Match found
        newCards[firstIndex].isMatched = true;
        newCards[secondIndex].isMatched = true;

        setScores((prevScores) => ({
          ...prevScores,
          [`player${currentPlayer}`]: prevScores[`player${currentPlayer}`] + 1,
        }));
      } else {
        // No match, flip back after a delay
        setTimeout(() => {
          newCards[firstIndex].isFlipped = false;
          newCards[secondIndex].isFlipped = false;
          setCards([...newCards]);
        }, 1000);
      }

      setTimeout(() => {
        setFlippedCards([]);
        setCurrentPlayer((prevPlayer) => (prevPlayer === 1 ? 2 : 1)); // Switch turns
      }, 1000);
    }
  }, [flippedCards, cards, currentPlayer]);

  const handleCardClick = (index) => {
    if (flippedCards.length < 2 && !cards[index].isFlipped && !cards[index].isMatched) {
      const newCards = [...cards];
      newCards[index].isFlipped = true;
      setCards(newCards);
      setFlippedCards([...flippedCards, index]);
    }
  };

  const isGameOver = cards.every((card) => card.isMatched);

  return (
    <div>
      <div className="scoreboard">
        <h2>Player 1: {scores.player1} </h2>
        <h2>Player 2: {scores.player2} </h2>
        <h3>Current Turn: Player {currentPlayer}</h3>
      </div>
      
      <div className="game-board">
        {cards.map((card, index) => (
          <Card 
            key={card.id} 
            symbol={card.symbol} 
            isFlipped={card.isFlipped || card.isMatched} 
            onClick={() => handleCardClick(index)} 
          />
        ))}
      </div>

      {isGameOver && (
        <div className="winner-message">
          <h2>
            {scores.player1 > scores.player2
              ? "Player 1 Wins! 🏆"
              : scores.player2 > scores.player1
              ? "Player 2 Wins! 🏆"
              : "It's a Tie! 🎉"}
          </h2>
          <button className="restart-button" onClick={restartGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default GameBoard;
