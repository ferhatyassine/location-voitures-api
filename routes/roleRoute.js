import { Router } from "express";
import roleValidationRules, { idValidationRules } from "../validations/roleValidate.js";
import {
  RoleList,
  RoleDetail,
  addRole,
  updateRole,
  deleteRole,
} from "../controllers/roleController.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

//  /api/roles : gestion des roles reservee a l'admin
route.get("/", verifyToken, authorizeRoles("admin"), RoleList);
route.get("/:id", verifyToken, authorizeRoles("admin"), idValidationRules, RoleDetail);
route.post("/", verifyToken, authorizeRoles("admin"), roleValidationRules, addRole);
route.put("/:id", verifyToken, authorizeRoles("admin"), roleValidationRules, updateRole);
route.delete("/:id", verifyToken, authorizeRoles("admin"), idValidationRules, deleteRole);

export default route;
