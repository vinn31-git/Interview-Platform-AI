const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const prisma = require("../utils/db");


// SIGNUP CONTROLLER

const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    

    // Check if all fields are provided
    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    // Minimum 8-16 chars, common special chars
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
   if (!passwordRegex.test(password)) {
  return res.status(400).json({
    success: false,
    message:
      "Password must contain uppercase, lowercase, special character and be 6-12 characters long",
  });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    // Hash password before storing
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Generate JWT token for signup to auto-login
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production", // Secure in prod (HTTPS)
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Send response without password
    res.status(201).json({
      success: true,
      message: "User created successfully",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        defaultRole: user.defaultRole,
        defaultDifficulty: user.defaultDifficulty,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Signup error:", error.message);
    }
    res.status(500).json({
      success: false,
      message: "Signup failed. An error occurred.",
    });
  }
};

// ====================
// LOGIN CONTROLLER
// ====================
const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if email and password are provided
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    // Find user using email
    const user = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    // User not found
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Compare entered password with hashed password
    const isPasswordCorrect = await bcrypt.compare(
      password,
      user.password
    );

    // Password doesn't match
    if (!isPasswordCorrect) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password",
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user.id,
        email: user.email,
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d",
      }
    );

    // Set JWT in HttpOnly cookie
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    // Login successful
    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        bio: user.bio,
        defaultRole: user.defaultRole,
        defaultDifficulty: user.defaultDifficulty,
        createdAt: user.createdAt,
      },
    });
  } catch (error) {
    if (process.env.NODE_ENV === 'development') {
      console.error("Login error:", error.message);
    }
    res.status(500).json({
      success: false,
      message: "Login failed. An error occurred.",
    });
  }
};

const verifyToken = async (req, res) => {
  try {
    let token = req.cookies?.token;
    
    if (!token) {
      const authHeader = req.headers.authorization;
      if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
      }
    }

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        defaultRole: true,
        defaultDifficulty: true,
        createdAt: true,
      },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, bio, defaultRole, defaultDifficulty } = req.body;
    const userId = req.user.userId;

    const user = await prisma.user.update({
      where: { id: userId },
      data: {
        name,
        bio,
        defaultRole,
        defaultDifficulty,
      },
      select: {
        id: true,
        name: true,
        email: true,
        bio: true,
        defaultRole: true,
        defaultDifficulty: true,
        createdAt: true,
      },
    });

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user,
    });
  } catch (error) {
    console.error("Profile update error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to update profile",
    });
  }
};

module.exports = {
  signup,
  login,
  verifyToken,
  updateProfile,
};