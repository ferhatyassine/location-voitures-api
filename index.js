import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import database from "./config/connection.js";

const app = express();

app.use(cors());
app.use(helmet());
app.use(compression());

try {
  await database.authenticate();
  console.log("connexion a MySQL reussie");
} catch (error) {
  console.log("Erreur de connexion a MySQL", error.message);
}

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`le serveur tourne sur le port ${PORT}`)
);