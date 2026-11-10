import { Router } from "express";
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
route.post("/", addAgence);

//  /api/agences/:id
route.get("/:id", AgenceDetail);
route.put("/:id", updateAgence);
route.delete("/:id", deleteAgence);

export default route;
