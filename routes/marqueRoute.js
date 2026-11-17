import upload from "../middlewares/upload.js";
import { Router } from "express";
import marqueValidationRules, {
  idValidationRules,
  paginationValidationRules,
} from "../validations/marqueValidate.js";
import {
  createMarque,
  getAllMarques,
  getMarqueById,
  updateMarque,
  deleteMarque,
  uploadLogoMarque,
} from "../controllers/marqueController.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

//  /api/marques  (consultation : publique)
route.get("/", paginationValidationRules, getAllMarques);
route.get("/:id", idValidationRules, getMarqueById);

//  gestion des marques : reservee a l'admin
route.post("/", verifyToken, authorizeRoles("admin"), marqueValidationRules, createMarque);
route.put("/:id", verifyToken, authorizeRoles("admin"), marqueValidationRules, updateMarque);
route.delete("/:id", verifyToken, authorizeRoles("admin"), idValidationRules, deleteMarque);

//  /api/marques/:id/image  (logo, form-data, champ "image")
route.put("/:id/image", verifyToken, authorizeRoles("admin"), idValidationRules, upload.single("image"), uploadLogoMarque);

export default route;
