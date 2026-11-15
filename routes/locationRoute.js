import { Router } from "express";
import {
  LocationList,
  addLocation,
} from "../controllers/locationController.js";

const route = Router();

//   /api/locations
route.get("/", LocationList);
route.post("/", addLocation);

export default route;
