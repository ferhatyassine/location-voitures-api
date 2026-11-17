import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import multer from "multer";

import database from "./config/connection.js";
import { Agence } from "./models/relation.js";
import agenceRoute from "./routes/agenceRoute.js";
import categorieRoute from "./routes/categoriesRoute.js";
import voitureRoute from "./routes/voituresRoute.js";
import locationRoute from "./routes/locationRoute.js";

const app = express();

// Middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
// rendre les images du dossier uploads accessibles
app.use("/uploads", express.static("uploads"));

// Tester la connexion MySQL
try {
  await database.authenticate();
  console.log("Connexion a MySQL reussie");

  await database.sync();
  console.log("Tables synchronisees");
} catch (error) {
  console.log("Erreur de connexion à MySQL");
  console.log(error);
}

// Routes
app.use("/api/agences", agenceRoute);
app.use("/api/categories", categorieRoute);
app.use("/api/voitures", voitureRoute);
app.use("/api/locations", locationRoute);
// Route de test
app.get("/", (req, res) => {
  res.json({
    message: "API Location Voitures opérationnelle",
  });
});

// gestion des erreurs : toujours APRES les routes
app.use((err, req, res, next) => {
  // erreurs de Multer : fichier trop gros, mauvais nom de champ...
  if (err instanceof multer.MulterError) {
    const messages = {
      LIMIT_FILE_SIZE: "L'image ne doit pas depasser 2 Mo",
      LIMIT_UNEXPECTED_FILE: "Le fichier doit etre envoye dans le champ 'image'",
    };
    return res.status(400).json({ message: messages[err.code] || err.message });
  }
  // autres erreurs : 400 si on l'a decide (mauvais type de fichier), sinon 500
  res.status(err.status || 500).json({ message: err.message });
});

// Démarrer le serveur
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
