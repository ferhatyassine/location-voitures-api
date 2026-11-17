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

export default route;
