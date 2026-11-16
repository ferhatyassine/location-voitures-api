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
} from "../validations/locationValidate.js";
const route = Router();

//   /api/locations
route.get("/", LocationList);
route.post("/", locationValidationRules, addLocation);
route.get("/:id", idValidationRules, LocationDetail);
route.put("/:id", locationValidationRules, updateLocation);
route.delete("/:id", idValidationRules, deleteLocation);

export default route;
