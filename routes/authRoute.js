import { Router } from "express";
import { register, login } from "../controllers/authController.js";
import { registerValidationRules, loginValidationRules } from "../validations/authValidate.js";

const route = Router();

//  /api/auth  (publiques : on n'a pas encore de jeton)
route.post("/register", registerValidationRules, register);
route.post("/login", loginValidationRules, login);

export default route;
