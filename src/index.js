import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRoutes from "./routes/chat.js";
import connectDB from "./db/db.js";
import authRoutes from "./routes/auth.js";


connectDB();

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// Endpoint raíz de prueba
app.get("/", (req, res) => {
  res.send("Servidor Node funcionando ✅");
});

// Rutas de ChatGPT
app.use("/chat", chatRoutes);
// Rutas de auth
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor escuchando en puerto ${PORT}`));
