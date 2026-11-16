import { Router } from "express";
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
route.post("/", roleValidationRules, addRole);

route.get("/:id", roleIdValidationRules, RoleDetail);
route.put("/:id", roleIdValidationRules, roleValidationRules, updateRole);
route.delete("/:id", roleIdValidationRules, deleteRole);

export default route;
