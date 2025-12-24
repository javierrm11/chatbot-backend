import { Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

const router = Router();

// Registro de usuario
router.post("/register", async (req, res) => {
  try {
    const { username, password, email } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son requeridos" });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ error: "El usuario ya existe" });
    }

    // Hashear la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crear el usuario
    const user = await User.create({
      username,
      password: hashedPassword,
      email,
    });

    res.status(201).json({ message: "Usuario creado exitosamente", userId: user._id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

// Login de usuario
router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username y password son requeridos" });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ error: "Usuario no encontrado" });
    }

    // Verificar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Contraseña incorrecta" });
    }

    // Crear token JWT (opcional)
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET || "secretkey", {
      expiresIn: "7d",
    });

    res.json({ message: "Login exitoso", token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

export default router;
