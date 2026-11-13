import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import "./models/relation.js";

import database from "./config/connection.js";
import Categorie from "./models/Categorie.js";
import Voiture from "./models/Voitures.js";


const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

try {
  await database.authenticate();
  console.log("Connexion a MySQL reussie");

  await database.sync();
  console.log("Tables synchronisees");
} catch (error) {
  console.log("Erreur de connexion a MySQL", error.message);
}

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Le serveur tourne sur le port ${PORT}`);
});
