import { body, param } from "express-validator";

const roleValidationRules = [
  body("libelle_role")
    .notEmpty()
    .withMessage("Le libelle du role est obligatoire")
    .isLength({ max: 50 })
    .withMessage("Le libelle ne doit pas depasser 50 caracteres"),

  body("description").notEmpty().withMessage("La description est obligatoire"),

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

export default roleValidationRules;
