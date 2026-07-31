import User from "../models/UserModel.js";
import bcrypt from "bcryptjs";


// SIGNUP
export const signupUser = async (req, res) => {
  try {
    const { fullName, email, username, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await User.create({
      fullName,
      email,
      username,
      password: hashedPassword
    });

    res.status(201).json({
      message: "Signup Successful",
      user: newUser
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};

// LOGIN
export const loginUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const user = await User.findOne({
      $or: [
        { username: username },
        { email: email }
      ]
    });

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({
        message: "Invalid Password"
      });
    }

    res.status(200).json({
      message: "Login Successful",
      user: {
        id: user._id,
        fullName: user.fullName,
        username: user.username,
        email: user.email
      }
    });

  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      error: error.message
    });
  }
};


// GET ALL USERS
export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();

    res.status(200).json(users);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.status(200).json(updatedUser);

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};


// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);

    res.status(200).json({
      message: "User Deleted Successfully"
    });

  } catch (error) {
    res.status(500).json({
      error: error.message
    });
  }
};