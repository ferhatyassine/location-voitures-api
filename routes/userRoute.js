import { Router } from "express";
import fileUpload from "express-fileupload";
import { authenticateToken } from "../middleware/authenticateToken.js";
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
const uploadUserPhoto = fileUpload({
  limits: { files: 1, fileSize: 5 * 1024 * 1024 },
});

route.get("/", UserList);
route.post("/", uploadUserPhoto, userCreateValidationRules, addUser);

route.get("/:id", userIdValidationRules, UserDetail);
route.put(
  "/:id",
  authenticateToken,
  uploadUserPhoto,
  userIdValidationRules,
  userUpdateValidationRules,
  updateUser,
);
route.delete("/:id", authenticateToken, userIdValidationRules, deleteUser);

route.post(
  "/:userId/roles/:roleId",
  authenticateToken,
  roleAssignmentValidationRules,
  assignRoleToUser,
);
route.delete(
  "/:userId/roles/:roleId",
  authenticateToken,
  roleAssignmentValidationRules,
  removeRoleFromUser,
);

export default route;
