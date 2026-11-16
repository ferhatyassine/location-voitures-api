import { Router } from "express";
import {
  LocationList,
  addLocation,
  LocationDetail,
  updateLocation,
  deleteLocation,
} from "../controllers/locationController.js";

const route = Router();

//   /api/locations
route.get("/", LocationList);
route.post("/", addLocation);
route.get("/:id", LocationDetail);
route.put("/:id", updateLocation);
route.delete("/:id", deleteLocation);
export default route;
