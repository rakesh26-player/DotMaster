const express = require("express");
const cors = require("cors");
const { execFile } = require("child_process");
const path = require("path");

const app = express();
app.use(cors());
app.use(express.json());

// POST endpoint for AI move
app.post("/ai-move", (req, res) => {
  const { n, m, lines } = req.body;

  // Prepare input for C++ AI
  let input = `${n} ${m}\n${lines.length}\n`;
  lines.forEach(line => {
    input += `${line[0][0]} ${line[0][1]} ${line[1][0]} ${line[1][1]}\n`;
  });

  const cppExec = path.join(__dirname, "ai", "dots_ai.exe"); // Windows
  // const cppExec = path.join(__dirname, "ai", "dots_ai"); // Linux/Mac

  execFile(cppExec, { input }, (error, stdout, stderr) => {
    if (error) {
      console.error(error);
      return res.status(500).send(stderr);
    }

    const parts = stdout.trim().split(" ").map(Number);
    if (parts.length !== 4) return res.status(500).send("Invalid AI output");

    const move = [[parts[0], parts[1]], [parts[2], parts[3]]];
    res.json({ move });
  });
});

const PORT = 5000;
app.listen(PORT, () => console.log(`AI server running on port ${PORT}`));
