import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import database from "./config/connection.js";
import { Agence } from "./models/relation.js";
import agenceRoute from "./routes/agenceRoute.js";

// creer l'application

const app = express();

//les middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());

// tester la connexion a MySQL
try {
  await database.authenticate();
  console.log("connexion a MySQL reussie");
  await database.sync();
  console.log("table synchronisees");
} catch (error) {
  console.log("Erreur de connexion a MySQL", error.message);
}
// les routes
app.use("/api/agences", agenceRoute);

// demarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`le serveur tourne sur le port ${PORT}`));
