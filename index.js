import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import database from "./config/connection.js";

// creer l'application

const app = express();

//les middlewares
app.use(cors());
app.use(helmet());
app.use(compression());

// tester la connexion a MySQL
try {
  await database.authenticate();
  console.log("connexion a MySQL reussie");
} catch (error) {
  console.log("Erreur de connexion a MySQL", error.message);
}

// demarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`le serveur tourne sur le port ${PORT}`));
