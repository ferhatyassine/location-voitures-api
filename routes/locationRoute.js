import { Router } from "express";
import {
  LocationList,
  addLocation,
  LocationDetail,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";
import locationValidationRules, {
  idValidationRules,
  paginationValidationRules,
} from "../validations/locationValidate.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

//  toutes les routes des locations exigent d'etre connecte
//  /api/locations
route.get(
  "/",
  verifyToken,
  authorizeRoles("admin", "employe"),
  paginationValidationRules,
  LocationList,
);
route.post("/", verifyToken, locationValidationRules, addLocation);

//  /api/locations/:id
route.get("/:id", verifyToken, idValidationRules, LocationDetail);
route.put(
  "/:id",
  verifyToken,
  authorizeRoles("admin", "employe"),
  locationValidationRules,
  updateLocation,
);
route.delete(
  "/:id",
  verifyToken,
  authorizeRoles("admin"),
  idValidationRules,
  deleteLocation,
);

export default route;
