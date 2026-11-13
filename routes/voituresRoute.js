import express from "express";

import {
  getVoitures,
  getVoitureById,
  createVoiture,
  updateVoiture,
  deleteVoiture,
} from "../controllers/voituresController.js";

const router = express.Router();

// Lire toutes les voitures
router.get("/", getVoitures);

// Lire une voiture par son id
router.get("/:id", getVoitureById);

// Ajouter une voiture
router.post("/", createVoiture);

// Modifier une voiture
router.put("/:id", updateVoiture);

// Supprimer une voiture
router.delete("/:id", deleteVoiture);

export default router;