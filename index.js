import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";

import database from "./config/connection.js";
import { Agence } from "./models/relation.js";
import agenceRoute from "./routes/agenceRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// Tester la connexion MySQL
try {
  await database.authenticate();
  console.log("connexion a MySQL reussie");
} catch (error) {
  console.log("Erreur de connexion à MySQL", error.message);
}

// Routes
app.use("/api/agences", agenceRoute);

// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "API Location Voitures opérationnelle"
  });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});