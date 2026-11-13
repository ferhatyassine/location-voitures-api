import { Router } from "express";
import agenceValidationRules, {
  idValidationRules,
} from "../validations/agenceValidate.js";
import {
  addAgence,
  AgenceDetail,
  deleteAgence,
  updateAgence,
  AgenceList,
} from "../controllers/agenceController.js";

const route = Router();

//  /api/agences
route.get("/", AgenceList);
route.post("/", agenceValidationRules, addAgence);

//  /api/agences/:id
route.get("/:id", idValidationRules, AgenceDetail);
route.put("/:id", agenceValidationRules, updateAgence);
route.delete("/:id", idValidationRules, deleteAgence);

export default route;
