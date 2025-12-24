import { Router } from "express";
import OpenAI from "openai";
import dotenv from "dotenv";
import Message from "../models/Messaje.js";
import { verifyToken } from "../middleware/authMiddleware.js";

dotenv.config();

const router = Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// POST /chat
router.post("/", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id; // Obtenemos el userId desde el token
    const { messages } = req.body;

    if (!messages || messages.length === 0) {
      return res.status(400).json({ error: "No se enviaron mensajes" });
    }

    // Guardar mensajes del usuario en MongoDB
    for (const m of messages) {
      await Message.create({
        userId,
        role: m.role,
        content: m.content
      });
    }

    // Transformar mensajes a input de GPT-5
    const inputText = messages.map(m => `${m.role}: ${m.content}`).join("\n");

    const response = await openai.responses.create({
      model: "gpt-5-nano",
      input: inputText,
    });

    // Guardar respuesta del bot en MongoDB
    await Message.create({
      userId,
      role: "bot",
      content: response.output_text
    });

    res.json({
      reply: response.output_text
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

router.get("/history", verifyToken, async (req, res) => {
  try {
    const userId = req.user._id;

    const messages = await Message
      .find({ userId })
      .sort({ timestamp: 1 });

    res.json({ messages });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});


export default router;
