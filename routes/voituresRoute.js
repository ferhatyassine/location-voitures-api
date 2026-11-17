import express from "express";

import {
  getVoitures,
  getVoitureById,
  createVoiture,
  updateVoiture,
  deleteVoiture,
} from "../controllers/voituresController.js";

import { voitureValidation } from "../validations/voituresValidate.js";

import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Lire toutes les voitures
router.get("/", getVoitures);

// Lire une voiture par son id
router.get("/:id", getVoitureById);

// Ajouter une voiture
router.post("/", verifyToken, authorizeRoles("admin"), voitureValidation, createVoiture);

// Modifier une voiture
router.put("/:id", verifyToken, authorizeRoles("admin"), voitureValidation, updateVoiture);

// Supprimer une voiture
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteVoiture);

export default router;