require('dotenv').config();
require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const fs = require("fs");
const path = require("path");
const multer = require("multer");
const axios = require("axios");

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

// Simple JSON-based "database"
const USERS_FILE = path.join(__dirname, "users.json");
const QUESTIONS_FILE = path.join(__dirname, "questions.json");

// Ensure files exist
if (!fs.existsSync(USERS_FILE)) fs.writeFileSync(USERS_FILE, "[]");
if (!fs.existsSync(QUESTIONS_FILE)) fs.writeFileSync(QUESTIONS_FILE, "{}");

// File upload (for profile pictures)
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// ------------------- STUDENT ROUTES -------------------

// Register
app.post("/api/register", (req, res) => {
  const newUser = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  if (users.find((u) => u.email === newUser.email)) {
    return res.status(400).json({ message: "Email already registered" });
  }

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Registration successful", user: newUser });
});

// Login
app.post("/api/login", (req, res) => {
  const { email, password } = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  const found = users.find((u) => u.email === email && u.password === password);
  if (!found) return res.status(401).json({ message: "Invalid credentials" });

  res.json({ message: "Login successful", user: found });
});

// Get profile
app.get("/api/profile/:email", (req, res) => {
  let users = JSON.parse(fs.readFileSync(USERS_FILE));
  const found = users.find((u) => u.email === req.params.email);

  if (!found) return res.status(404).json({ message: "User not found" });
  res.json(found);
});

// Update profile
app.put("/api/profile/:email", (req, res) => {
  let users = JSON.parse(fs.readFileSync(USERS_FILE));
  const idx = users.findIndex((u) => u.email === req.params.email);

  if (idx === -1) return res.status(404).json({ message: "User not found" });

  users[idx] = { ...users[idx], ...req.body };
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Profile updated", user: users[idx] });
});

// Upload profile picture
app.post("/api/upload/:email", upload.single("profilePic"), (req, res) => {
  let users = JSON.parse(fs.readFileSync(USERS_FILE));
  const idx = users.findIndex((u) => u.email === req.params.email);

  if (idx === -1) return res.status(404).json({ message: "User not found" });

  users[idx].profilePic = `/uploads/${req.file.filename}`;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Profile picture uploaded", file: req.file.filename });
});

// ------------------- EXAM ROUTES -------------------

// Get questions for category + round
app.get("/api/questions/:category/:round", (req, res) => {
  let questions = JSON.parse(fs.readFileSync(QUESTIONS_FILE));
  const { category, round } = req.params;

  if (!questions[category] || !questions[category][round]) {
    return res.status(404).json({ message: "No questions found" });
  }

  res.json(questions[category][round]);
});

// Submit exam answers
app.post("/api/submit/:email", (req, res) => {
  const { answers, score } = req.body;
  let users = JSON.parse(fs.readFileSync(USERS_FILE));

  const idx = users.findIndex((u) => u.email === req.params.email);
  if (idx === -1) return res.status(404).json({ message: "User not found" });

  if (!users[idx].scores) users[idx].scores = [];
  users[idx].scores.push({ round: users[idx].scores.length + 1, score });

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({ message: "Exam submitted", score });
});

// ------------------- PAYSTACK PAYMENT -------------------

app.post("/api/pay", async (req, res) => {
  const { email, amount } = req.body;

  try {
    const response = await axios.post(
      "https://api.paystack.co/transaction/initialize",
      {
        email,
        amount: amount * 100, // convert to kobo
        callback_url: "http://localhost:5000/payment-success.html",
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.PAYSTACK_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err.message);
    res.status(500).json({ message: "Payment initialization failed" });
  }
});

// ------------------- ADMIN ROUTES -------------------

// Admin login
app.post("/api/admin/login", (req, res) => {
  const { password } = req.body;
  if (password !== "SGE2025") {
    return res.status(401).json({ message: "Invalid admin password" });
  }
  res.json({ message: "Admin access granted" });
});

// View all users
app.get("/api/admin/users", (req, res) => {
  let users = JSON.parse(fs.readFileSync(USERS_FILE));
  res.json(users);
});

// Add questions (category + round)
app.post("/api/admin/questions", (req, res) => {
  const { category, round, questions } = req.body;
  let qdb = JSON.parse(fs.readFileSync(QUESTIONS_FILE));

  if (!qdb[category]) qdb[category] = {};
  qdb[category][round] = questions;

  fs.writeFileSync(QUESTIONS_FILE, JSON.stringify(qdb, null, 2));
  res.json({ message: "Questions saved successfully" });
});

// ------------------- START SERVER -------------------

app.listen(PORT, () => {
  console.log(`🚀 SGE Maths Challenge server running at http://localhost:${PORT}`);
});