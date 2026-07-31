import express from "express";

import {
  signupUser,
  loginUser,
  getAllUsers,
  updateUser,
  deleteUser
} from "../controllers/userController.js";

const router = express.Router();

router.post("/signup", signupUser);
router.post("/login", loginUser);

router.get("/", getAllUsers);

router.put("/:id", updateUser);

router.delete("/:id", deleteUser);

export default router;