import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
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
route.post("/", authenticateToken, agenceValidationRules, addAgence);

//  /api/agences/:id
route.get("/:id", idValidationRules, AgenceDetail);
route.put("/:id", authenticateToken, agenceValidationRules, updateAgence);
route.delete("/:id", authenticateToken, idValidationRules, deleteAgence);

export default route;
