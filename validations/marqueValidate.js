import { body, param, query } from "express-validator";

const marqueValidationRules = [
  body("nom")
    .notEmpty()
    .withMessage("Le nom de la marque est obligatoire")
    .isLength({ max: 50 })
    .withMessage("Le nom ne doit pas depasser 50 caracteres"),

  body("pays")
    .notEmpty()
    .withMessage("Le pays est obligatoire")
    .isLength({ max: 50 })
    .withMessage("Le pays ne doit pas depasser 50 caracteres"),

  body("logo")
    .optional()
    .isLength({ max: 255 })
    .withMessage("Le logo ne doit pas depasser 255 caracteres"),

  // uniquement pour la mise a jour (PUT /:id)
  param("id")
    .optional()
    .isInt({ gt: 0 })
    .withMessage("L'id doit etre un entier positif"),
];

// uniquement pour GET /:id et DELETE /:id
export const idValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
];

// uniquement pour GET / (pagination) : ?page=1&limit=10
export const paginationValidationRules = [
  query("page")
    .optional()
    .isInt({ min: 1 })
    .withMessage("page doit etre un entier superieur ou egal a 1"),
  query("limit")
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage("limit doit etre un entier entre 1 et 100"),
];

export default marqueValidationRules;
