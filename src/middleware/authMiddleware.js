import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.js";

dotenv.config();

export const verifyToken = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ error: "No token proporcionado" });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    const user = await User.findById(decoded.userId);
    if (!user) {
      return res.status(401).json({ error: "Usuario no encontrado" });
    }
    req.user = user; // guardamos el usuario en la request
    next();
  } catch (error) {
    return res.status(401).json({ error: "Token inválido" });
  }
};
