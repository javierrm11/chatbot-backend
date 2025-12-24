import { Router } from "express";
import Conversation from "../models/Conversation.js";
import { verifyToken } from "../middleware/authMiddleware.js";

const router = Router();

/**
 * GET /conversation
 * Obtener todas las conversaciones del usuario
 */
router.get("/", verifyToken, async (req, res) => {
  try {
    const conversations = await Conversation.find({
      userId: req.user._id,
    }).sort({ createdAt: -1 });

    res.json(conversations);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * POST /conversation
 * Crear nueva conversación
 */
router.post("/", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.create({
      userId: req.user._id,
      title: req.body.title || "Nueva conversación",
    });

    res.status(201).json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * Rename a conversation
 * PUT /conversation/:id
 */
router.put("/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      { title: req.body.title },
      { new: true }
    );

    if (!conversation) {
      return res.status(404).json({ error: "Conversación no encontrada" });
    }

    res.json(conversation);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/**
 * DELETE /conversation/:id
 * Eliminar conversación
 */

router.delete("/:id", verifyToken, async (req, res) => {
  try {
    const conversation = await Conversation.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!conversation) {
      return res.status(404).json({ error: "Conversación no encontrada" });
    }

    res.json({ message: "Conversación eliminada" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  } 
});

export default router;
