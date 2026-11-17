import express from "express";

import {
  getCategories,
  getCategorieById,
  createCategorie,
  updateCategorie,
  deleteCategorie,
} from "../controllers/categoriesController.js";

import { categorieValidation } from "../validations/categorieValidate.js";

import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const router = express.Router();

// Lire toutes les catégories
router.get("/", getCategories);

// Lire une catégorie par son id
router.get("/:id", getCategorieById);

// Créer une catégorie
router.post("/", verifyToken, authorizeRoles("admin"), categorieValidation, createCategorie);

// Modifier une catégorie
router.put("/:id", verifyToken, authorizeRoles("admin"), categorieValidation, updateCategorie);

// Supprimer une catégorie
router.delete("/:id", verifyToken, authorizeRoles("admin"), deleteCategorie);

export default router;