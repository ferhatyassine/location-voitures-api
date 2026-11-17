import { Router } from "express";
import agenceValidationRules, {
  idValidationRules,
  paginationValidationRules,
} from "../validations/agenceValidate.js";
import {
  addAgence,
  AgenceDetail,
  deleteAgence,
  updateAgence,
  AgenceList,
  uploadImageAgence,
} from "../controllers/agenceController.js";
import upload from "../middlewares/upload.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

//  /api/agences  (consultation : publique)
route.get("/", paginationValidationRules, AgenceList);
route.get("/:id", idValidationRules, AgenceDetail);

//  gestion des agences : reservee a l'admin
route.post(
  "/",
  verifyToken,
  authorizeRoles("admin"),
  agenceValidationRules,
  addAgence,
);
route.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  agenceValidationRules,
  updateAgence,
);
route.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  idValidationRules,
  deleteAgence,
);

//  /api/agences/:id/image  (envoi de l'image, en form-data)
route.put(
  "/:id/image",
  verifyToken,
  authorizeRoles("admin"),
  idValidationRules,
  upload.single("image"),
  uploadImageAgence,
);

export default route;
