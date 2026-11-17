import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import { fileURLToPath } from "node:url";
import database from "./config/connection.js";
import { Agence } from "./models/relation.js";
import agenceRoute from "./routes/agenceRoute.js";
import authRoute from "./routes/authRoute.js";
import userRoute from "./routes/userRoute.js";
import roleRoute from "./routes/roleRoute.js";

// creer l'application

const app = express();

//les middlewares
app.use(cors());
app.use(helmet());
app.use(compression());
app.use(express.json());
app.use("/uploads", express.static(fileURLToPath(new URL("./uploads/", import.meta.url))));

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
app.use("/api/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/roles", roleRoute);

// demarrer le serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`le serveur tourne sur le port ${PORT}`));
