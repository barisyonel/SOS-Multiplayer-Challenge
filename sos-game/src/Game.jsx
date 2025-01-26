import React, { useState } from "react";
import Cell from "./Cell";
import "./App.css";

function Game() {
  const [grid, setGrid] = useState(Array(7).fill(Array(7).fill(""))); // 7x7 izgarası
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1. oyuncu veya 2. oyuncu
  const [winner, setWinner] = useState(null); // Kazanan oyuncu (null, 1, 2 veya "draw")
  const [playerNames, setPlayerNames] = useState({ player1: "", player2: "" }); // Oyuncu isimleri
  const [gameStarted, setGameStarted] = useState(false); // Oyun başlama durumu
  const [scores, setScores] = useState({ player1: 0, player2: 0 }); // Oyuncu puanları
  const [round, setRound] = useState(1); // Hangi turda olduğumuzu takip eder

  const playerColors = {
    1: "green",
    2: "red",
  };

  // SOS kontrol fonksiyonu
  const checkWinner = (grid) => {
    const size = grid.length;

    // Satır ve sütun kontrolü
    for (let i = 0; i < size; i++) {
      for (let j = 0; j < size - 2; j++) {
        if (grid[i][j] === "S" && grid[i][j + 1] === "O" && grid[i][j + 2] === "S") {
          return true;
        }
        if (
          grid[j][i] === "S" &&
          grid[j + 1][i] === "O" &&
          grid[j + 2][i] === "S"
        ) {
          return true;
        }
      }
    }

    // Çapraz kontrol
    for (let i = 0; i < size - 2; i++) {
      for (let j = 0; j < size - 2; j++) {
        if (
          grid[i][j] === "S" &&
          grid[i + 1][j + 1] === "O" &&
          grid[i + 2][j + 2] === "S"
        ) {
          return true;
        }
        if (
          grid[i][j + 2] === "S" &&
          grid[i + 1][j + 1] === "O" &&
          grid[i + 2][j] === "S"
        ) {
          return true;
        }
      }
    }

    return false; // SOS bulunamadı
  };

  // Hücre tıklama işlemi
  const handleClick = (row, col) => {
    if (grid[row][col] !== "" || winner) return; // Hücre doluysa veya oyun bittiyse işlem yapma

    const newGrid = grid.map((r, i) =>
      r.map((cell, j) => (i === row && j === col ? (currentPlayer === 1 ? "S" : "O") : cell))
    );

    if (checkWinner(newGrid)) {
      setWinner(currentPlayer); // Kazananı belirle
      // Puan güncelleme
      if (currentPlayer === 1) {
        setScores((prevScores) => ({ ...prevScores, player1: prevScores.player1 + 100 }));
      } else {
        setScores((prevScores) => ({ ...prevScores, player2: prevScores.player2 + 100 }));
      }
    } else if (newGrid.flat().every((cell) => cell !== "")) {
      setWinner("draw"); // Beraberlik durumu
    }

    setGrid(newGrid);
    setCurrentPlayer(currentPlayer === 1 ? 2 : 1); // Sıra değişimi
  };

  // Sonraki tura geçiş
  const nextRound = () => {
    setGrid(Array(7).fill(Array(7).fill("")));
    setWinner(null);
    setCurrentPlayer(1);
    setRound((prevRound) => prevRound + 1);
  };

  // Oyunu sıfırlama
  const resetGame = () => {
    setGrid(Array(7).fill(Array(7).fill("")));
    setCurrentPlayer(1);
    setWinner(null);
    setScores({ player1: 0, player2: 0 });
    setRound(1);
    setGameStarted(false);
    setPlayerNames({ player1: "", player2: "" });
  };

  // Oyun başlangıç ekranı
  if (!gameStarted) {
    return (
      <div className="game">
        <h1>SOS Oyunu</h1>
        <div className="name-inputs">
          <div>
            <label>1. Oyuncu Adı:</label>
            <input
            placeholder="Adınızı Giriniz"
              type="text"
              value={playerNames.player1}
              onChange={(e) => setPlayerNames({ ...playerNames, player1: e.target.value })}
            />
          </div>
          <div>
            <label>2. Oyuncu Adı:</label>
            <input
            placeholder="Adınızı Giriniz"
              type="text"
              value={playerNames.player2}
              onChange={(e) => setPlayerNames({ ...playerNames, player2: e.target.value })}
            />
          </div>
        </div>
        <button
          className="start-button"
          onClick={() => setGameStarted(true)}
          disabled={!playerNames.player1 || !playerNames.player2}
        >
          Oyuna Başla
        </button>
      </div>
    );
  }

  // Oyun bitim ekranı
  if (round > 3) {
    const winnerMessage =
      scores.player1 > scores.player2
        ? `Tebrikler! ${playerNames.player1} kazandı!`
        : scores.player2 > scores.player1
        ? `Tebrikler! ${playerNames.player2} kazandı!`
        : "Berabere!";
    return (
      <div className="game">
        <h1>Oyun Bitti!</h1>
        <h2>{winnerMessage}</h2>
        <h3>
          Skorlar: {playerNames.player1}: {scores.player1} - {playerNames.player2}: {scores.player2}
        </h3>
        <button className="reset-button" onClick={resetGame}>
          Yeni Oyun
        </button>
      </div>
    );
  }

  // Oyun ekranı
  return (
    <div className="game">
      <h1>SOS Oyunu</h1>
      <h2>Tur: {round}/3</h2>
      <h2>
        Sıra: {currentPlayer === 1 ? playerNames.player1 : playerNames.player2} (
        {currentPlayer === 1 ? "Yeşil" : "Kırmızı"})
      </h2>
      <h3>
        Skor: {playerNames.player1}: {scores.player1} - {playerNames.player2}: {scores.player2}
      </h3>
      <div className="grid">
        {grid.map((row, i) =>
          row.map((cell, j) => (
            <Cell
              key={`${i}-${j}`}
              value={cell}
              color={cell === "S" ? playerColors[1] : cell === "O" ? playerColors[2] : ""}
              onClick={() => handleClick(i, j)}
            />
          ))
        )}
      </div>
      {winner && (
        <button className="next-round-button" onClick={nextRound}>
          Sonraki Tur
        </button>
      )}
      <button className="reset-button" onClick={resetGame}>
        Oyunu Sıfırla
      </button>
    </div>
  );
}

export default Game;
