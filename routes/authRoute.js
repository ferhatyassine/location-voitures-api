import { Router } from "express";
import { login } from "../controllers/authController.js";

const route = Router();

route.post("/login", login);

export default route;
