import { Router } from "express";
import { authenticateToken } from "../middleware/authenticateToken.js";
import {
  addRole,
  deleteRole,
  RoleDetail,
  RoleList,
  updateRole,
} from "../controllers/roleController.js";
import roleValidationRules, {
  roleIdValidationRules,
} from "../validations/roleValidate.js";

const route = Router();

route.get("/", RoleList);
route.post("/", authenticateToken, roleValidationRules, addRole);

route.get("/:id", roleIdValidationRules, RoleDetail);
route.put("/:id", authenticateToken, roleIdValidationRules, roleValidationRules, updateRole);
route.delete("/:id", authenticateToken, roleIdValidationRules, deleteRole);

export default route;
