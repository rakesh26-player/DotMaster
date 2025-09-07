import React, { useState, useEffect } from "react";

const DotGrid = ({ rows, cols, playerInitial }) => {
  const [lines, setLines] = useState([]); // all drawn lines
  const [boxes, setBoxes] = useState({}); // completed boxes: { "r,c": "P" or "A" }
  const [firstDot, setFirstDot] = useState(null);
  const boardSize = { n: rows, m: cols };

  // Draw line
  const drawLine = (dot1, dot2, player) => {
    setLines(prev => [...prev, [dot1, dot2]]);
    checkCompletedBoxes(player);
  };

  // Check completed boxes
  const checkCompletedBoxes = (player) => {
    let newBoxes = { ...boxes };
    for (let r = 0; r < rows - 1; r++) {
      for (let c = 0; c < cols - 1; c++) {
        const key = `${r},${c}`;
        if (newBoxes[key]) continue;

        const top = lines.some(l => (l[0][0]===r && l[0][1]===c && l[1][0]===r && l[1][1]===c+1) || (l[1][0]===r && l[1][1]===c && l[0][0]===r && l[0][1]===c+1));
        const bottom = lines.some(l => (l[0][0]===r+1 && l[0][1]===c && l[1][0]===r+1 && l[1][1]===c+1) || (l[1][0]===r+1 && l[1][1]===c && l[0][0]===r+1 && l[0][1]===c+1));
        const left = lines.some(l => (l[0][0]===r && l[0][1]===c && l[1][0]===r+1 && l[1][1]===c) || (l[1][0]===r && l[1][1]===c && l[0][0]===r+1 && l[0][1]===c));
        const right = lines.some(l => (l[0][0]===r && l[0][1]===c+1 && l[1][0]===r+1 && l[1][1]===c+1) || (l[1][0]===r && l[1][1]===c+1 && l[0][0]===r+1 && l[0][1]===c+1));

        if (top && bottom && left && right) newBoxes[key] = player;
      }
    }
    setBoxes(newBoxes);
    return Object.keys(newBoxes).length;
  };

  // Click handler for dots
  const handleDotClick = (r, c) => {
    if (!firstDot) {
      setFirstDot([r, c]);
      return;
    }

    const [r1, c1] = firstDot;
    // Check adjacency
    if ((Math.abs(r1 - r) === 1 && c1 === c) || (Math.abs(c1 - c) === 1 && r1 === r)) {
      drawLine([r1, c1], [r, c], "P");
      setFirstDot(null);
      handleAIMove(); // trigger AI turn
    } else {
      // If not adjacent, treat clicked as first dot
      setFirstDot([r, c]);
    }
  };

  // AI move function
  const handleAIMove = async () => {
    const response = await fetch("http://localhost:5000/ai-move", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ n: rows, m: cols, lines }),
    });
    const data = await response.json();
    const aiMove = data.move;
    if (!aiMove) return;

    drawLine(aiMove[0], aiMove[1], "A");

    // Check if AI completed box and gets extra turn
    const aiBoxes = checkCompletedBoxes("A");
    if (aiBoxes > 0) {
      handleAIMove(); // AI gets extra turn recursively
    }
  };

  return (
    <div className="grid gap-4">
      {Array.from({ length: rows }).map((_, r) => (
        <div className="flex" key={r}>
          {Array.from({ length: cols }).map((_, c) => (
            <div
              key={c}
              onClick={() => handleDotClick(r, c)}
              className="w-6 h-6 bg-black rounded-full cursor-pointer m-2"
            ></div>
          ))}
        </div>
      ))}
      <div className="mt-4">
        {Object.keys(boxes).map(key => (
          <span key={key} className="mr-2">
            {boxes[key]}
          </span>
        ))}
      </div>
    </div>
  );
};

export default DotGrid;
