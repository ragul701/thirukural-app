const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors());
app.use(express.json());

/* =========================
   MongoDB Connection
========================= */

mongoose
  .connect("mongodb://127.0.0.1:27017/thirukuralDB")
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

/* =========================
   User Schema
========================= */

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

/* =========================
   Home Route
========================= */

app.get("/", (req, res) => {
  res.send("Thirukural Backend is running");
});

/* =========================
   REGISTER
========================= */

app.post("/api/register", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Check existing user
    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({
        message: "Username already exists",
      });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      username,
      password: hashedPassword,
    });

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log("Register error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   LOGIN
========================= */

app.post("/api/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    // Check empty fields
    if (!username || !password) {
      return res.status(400).json({
        message: "Username and password are required",
      });
    }

    // Find user
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    // Compare password
    const passwordMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!passwordMatch) {
      return res.status(401).json({
        message: "Invalid username or password",
      });
    }

    res.json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.log("Login error:", error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   GET ALL USERS
   (Testing purpose)
========================= */

app.get("/api/users", async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    console.log(error);

    res.status(500).json({
      message: "Server error",
    });
  }
});

/* =========================
   START SERVER
========================= */

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});