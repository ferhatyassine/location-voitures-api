import express from "express";

import {
  getVoitures,
  getVoitureById,
  createVoiture,
  updateVoiture,
  deleteVoiture,
} from "../controllers/voituresController.js";

import { voitureValidation } from "../validations/voituresValidate.js";

const router = express.Router();

// Lire toutes les voitures
router.get("/", getVoitures);

// Lire une voiture par son id
router.get("/:id", getVoitureById);

// Ajouter une voiture
router.post("/", voitureValidation, createVoiture);

// Modifier une voiture
router.put("/:id", voitureValidation, updateVoiture);

// Supprimer une voiture
router.delete("/:id", deleteVoiture);

export default router;