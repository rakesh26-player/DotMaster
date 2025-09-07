DotMaster 

DotMaster is a low-latency, strategic Dots & Boxes game built with React, Tailwind CSS, Vite, and a Node.js/Express backend that bridges to a C++ game engine. It features a near-unbeatable algorithmic opponent powered by chain detection, minimax with memoization, and safe-play heuristics.

Overview: DotMaster brings the classic Dots & Boxes game to life with a modern web frontend and a high-performance backend. Players enter moves (row col direction) and compete against a strategic algorithmic opponent.
Optimized backend ensures fast response times for smooth, interactive gameplay.

Backend Setup:

1)Install dependencies:
npm install

2)Compile the C++ engine:
g++ engine.cpp -o engine

3)Start the backend server:
node server.js

Frontend Setup

1)Install dependencies:
npm install

2)Start the development server:
npm run dev


Tech Stack
Frontend: React, Tailwind CSS, Vite
Backend: Node.js, Express
Game Engine: C++ (chain detection, minimax with memoization, safe-play heuristics)
