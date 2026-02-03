const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/Users.js");

const router = express.Router();

/* REGISTER */
// routes/auth.js
router.post("/register", async (req, res) => {
  try {
    const { name, email, password } = req.body

    // 1️⃣ Validate input
    if (!name || !email || !password) {
      return res.status(400).json({
        message: "All fields are required",
      })
    }

    // 2️⃣ Check if user already exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(409).json({
        message: "User already exists with this email",
      })
    }

    // 3️⃣ Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // 4️⃣ Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    })

    // 5️⃣ Success response
    return res.status(201).json({
      message: "User registered successfully",
      user: user,
    })
  } catch (error) {
    console.error("Register error:", error)

    // 6️⃣ Fallback server error
    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    })
  }
})

/* LOGIN */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      })
    }

    const user = await User.findOne({ email })
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(401).json({
        message: "Invalid email or password",
      })
    }

    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "6d" }
    )

    return res.status(200).json({ token })
  } catch (error) {
    console.error("Login error:", error)

    return res.status(500).json({
      message: "Something went wrong. Please try again later.",
    })
  }
})


router.get("/decode", async (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(400).json({ message: "Token missing" });
  }

  try {
    // Decode & verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Get user from DB (optional but useful)
    const user = await User.findById(decoded.userId).select("-password");

    res.json({
      user,
    });
  } catch (err) {
    res.status(401).json({ message: "Invalid token" });
  }
});


module.exports = router;
