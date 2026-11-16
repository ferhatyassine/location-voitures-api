import { Router } from "express";
import {
  addUser,
  assignRoleToUser,
  deleteUser,
  removeRoleFromUser,
  updateUser,
  UserDetail,
  UserList,
} from "../controllers/userController.js";
import {
  roleAssignmentValidationRules,
  userCreateValidationRules,
  userIdValidationRules,
  userUpdateValidationRules,
} from "../validations/userValidate.js";

const route = Router();

route.get("/", UserList);
route.post("/", userCreateValidationRules, addUser);

route.get("/:id", userIdValidationRules, UserDetail);
route.put("/:id", userIdValidationRules, userUpdateValidationRules, updateUser);
route.delete("/:id", userIdValidationRules, deleteUser);

route.post(
  "/:userId/roles/:roleId",
  roleAssignmentValidationRules,
  assignRoleToUser,
);
route.delete(
  "/:userId/roles/:roleId",
  roleAssignmentValidationRules,
  removeRoleFromUser,
);

export default route;
