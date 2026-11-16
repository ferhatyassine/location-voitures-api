import { body, param } from "express-validator";

const roleTitles = ["client", "employe", "administrateur"];

const roleValidationRules = [
  body("titre")
    .notEmpty()
    .withMessage("Le titre du rôle est obligatoire")
    .isString()
    .withMessage("Le titre du rôle doit être une chaîne de caractères")
    .isIn(roleTitles)
    .withMessage(`Le titre doit être l'une des valeurs suivantes : ${roleTitles.join(", ")}`),
];

export const roleIdValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit être un entier positif"),
];

export default roleValidationRules;
