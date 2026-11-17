import { Router } from "express";
import paiementValidationRules, {
  idValidationRules,
  paginationValidationRules,
} from "../validations/paiementValidate.js";
import {
  createPaiement,
  getAllPaiements,
  getPaiementById,
  updatePaiement,
  deletePaiement,
} from "../controllers/paiementController.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

//  /api/paiements : reserve au personnel (admin, employe)
route.get("/", verifyToken, authorizeRoles("admin", "employe"), paginationValidationRules, getAllPaiements);
route.get("/:id", verifyToken, authorizeRoles("admin", "employe"), idValidationRules, getPaiementById);
route.post("/", verifyToken, authorizeRoles("admin", "employe"), paiementValidationRules, createPaiement);
route.put("/:id", verifyToken, authorizeRoles("admin", "employe"), paiementValidationRules, updatePaiement);

//  suppression : admin seulement
route.delete("/:id", verifyToken, authorizeRoles("admin"), idValidationRules, deletePaiement);

export default route;
