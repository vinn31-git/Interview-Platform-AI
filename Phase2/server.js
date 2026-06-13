const express = require("express");
const cors = require("cors");
require("dotenv").config();
const interviewRoutes = require("./routes/interviewRoutes");
const authRoutes = require("./routes/authRoutes");
const groqRoutes = require("./routes/groqRoutes");
const judge0Routes = require("./routes/judge0Routes");
const app = express();
const evaluationRoutes = require(
  "./routes/evaluationRoutes"
);

app.use(cors());
app.use(express.json());

app.use("/api/interviews", interviewRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/groq", groqRoutes);
app.use(
  "/api/evaluation",
  evaluationRoutes
);
app.use("/api/judge0", judge0Routes);
app.get("/", (req, res) => {
  res.send("InterviewMate AI Backend Running");
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});