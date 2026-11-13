import express from "express";

import {
  getCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} from "../controllers/categoriesController.js";

const router = express.Router();

// Lire toutes les catégories
router.get("/", getCategories);

// Lire une catégorie par son id
router.get("/:id", getCategorieById);

// Créer une catégorie
router.post("/", createCategorie);

// Modifier une catégorie
router.put("/:id", updateCategorie);

// Supprimer une catégorie
router.delete("/:id", deleteCategorie);

export default router;