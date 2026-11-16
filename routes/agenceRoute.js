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

const route = Router();

//  /api/agences
route.get("/", paginationValidationRules, AgenceList);
route.post("/", agenceValidationRules, addAgence);

//  /api/agences/:id
route.get("/:id", idValidationRules, AgenceDetail);
route.put("/:id", agenceValidationRules, updateAgence);
route.delete("/:id", idValidationRules, deleteAgence);
// /api/agences/:id/image (envoi de l'image , en form-data)
route.put(
  "/:id/image",
  idValidationRules,
  upload.single("image"),
  uploadImageAgence,
);

export default route;
