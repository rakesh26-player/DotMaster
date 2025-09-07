import React, { useState } from "react";
// import DotGrid from "./DotGrid";
import DotGrid from './components/DotGrid';

const App = () => {
  const [playerName, setPlayerName] = useState("");
  const [rows, setRows] = useState(5);
  const [cols, setCols] = useState(5);
  const [startGame, setStartGame] = useState(false);

  const handleStart = () => {
    if (!playerName) {
      alert("Enter your name!");
      return;
    }
    if (rows < 3 || cols < 3 || rows > 10 || cols > 10) {
      alert("Grid size must be between 3 and 10");
      return;
    }
    setStartGame(true);
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      {!startGame ? (
        <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
          <h1 className="text-2xl font-bold mb-4 text-center">Dots & Boxes</h1>
          <div className="mb-4">
            <label className="block mb-1">Your Name:</label>
            <input
              type="text"
              value={playerName}
              onChange={(e) => setPlayerName(e.target.value)}
              className="w-full border p-2 rounded"
              placeholder="Enter your name"
            />
          </div>
          <div className="mb-4 flex gap-4">
            <div>
              <label className="block mb-1">Rows (3-10)</label>
              <input
                type="number"
                value={rows}
                onChange={(e) => setRows(Number(e.target.value))}
                className="border p-2 rounded w-20"
                min="3"
                max="10"
              />
            </div>
            <div>
              <label className="block mb-1">Columns (3-10)</label>
              <input
                type="number"
                value={cols}
                onChange={(e) => setCols(Number(e.target.value))}
                className="border p-2 rounded w-20"
                min="3"
                max="10"
              />
            </div>
          </div>
          <button
            onClick={handleStart}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 w-full"
          >
            Start Game
          </button>
        </div>
      ) : (
        <div className="w-full max-w-xl">
          <h2 className="text-xl font-semibold mb-4 text-center">
            Player: {playerName} (Initial: {playerName[0].toUpperCase()})
          </h2>
          <DotGrid rows={rows} cols={cols} playerInitial={playerName[0].toUpperCase()} />
        </div>
      )}
    </div>
  );
};

export default App;
