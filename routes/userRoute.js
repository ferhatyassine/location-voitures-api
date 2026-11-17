import { Router } from "express";
import { param } from "express-validator";
import userValidationRules, {
  roleUserValidationRules,
  idValidationRules,
  paginationValidationRules,
} from "../validations/userValidate.js";
import {
  UserList,
  UserDetail,
  updateUser,
  deleteUser,
  addRoleUser,
  removeRoleUser,
} from "../controllers/userController.js";
import { verifyToken, authorizeRoles } from "../middlewares/auth.js";

const route = Router();

// l'inscription et la connexion sont dans /api/auth

//  /api/users : liste reservee a l'admin
route.get("/", verifyToken, authorizeRoles("admin"), paginationValidationRules, UserList);

//  detail et modification : l'admin, ou l'utilisateur pour son propre compte
route.get("/:id", verifyToken, idValidationRules, UserDetail);
route.put("/:id", verifyToken, userValidationRules, updateUser);

//  suppression : admin seulement
route.delete("/:id", verifyToken, authorizeRoles("admin"), idValidationRules, deleteUser);

//  roles d'un utilisateur : admin seulement
route.post("/:id/roles", verifyToken, authorizeRoles("admin"), roleUserValidationRules, addRoleUser);
route.delete(
  "/:id/roles/:roleId",
  verifyToken,
  authorizeRoles("admin"),
  [
    param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
    param("roleId").isInt({ gt: 0 }).withMessage("roleId doit etre un entier positif"),
  ],
  removeRoleUser,
);

export default route;
