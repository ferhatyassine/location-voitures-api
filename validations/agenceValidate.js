import { body, param, query } from "express-validator";

const agenceValidationRules = [
  body("nom")
    .notEmpty()
    .withMessage("Le nom est obligatoire")
    .isLength({ max: 100 })
    .withMessage("Le nom ne doit pas depasser 100 caracteres"),

  body("adresse").notEmpty().withMessage("L'adresse est obligatoire"),

  body("ville")
    .notEmpty()
    .withMessage("La ville est obligatoire")
    .isLength({ max: 50 })
    .withMessage("La ville ne doit pas depasser 50 caracteres"),

  body("code_postal")
    .notEmpty()
    .withMessage("Le code postal est obligatoire")
    .isLength({ max: 10 })
    .withMessage("Le code postal ne doit pas depasser 10 caracteres"),

  body("telephone")
    .optional()
    .isLength({ max: 20 })
    .withMessage("Le telephone ne doit pas depasser 20 caracteres"),

  body("heure_ouverture")
    .notEmpty()
    .withMessage("L'heure d'ouverture est obligatoire"),

  body("heure_fermeture")
    .notEmpty()
    .withMessage("L'heure de fermeture est obligatoire"),

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

export default agenceValidationRules;
