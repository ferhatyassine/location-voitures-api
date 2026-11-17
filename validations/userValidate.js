import { body, param, query } from "express-validator";

// modification d'un utilisateur : PUT /api/users/:id
const userValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),

  body("nom").optional().notEmpty().withMessage("Le nom ne peut pas etre vide"),
  body("prenom").optional().notEmpty().withMessage("Le prenom ne peut pas etre vide"),
  body("email").optional().isEmail().withMessage("L'email n'est pas valide"),
  body("mdp")
    .optional()
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres"),
  body("telephone").optional().isLength({ max: 20 }).withMessage("Le telephone ne doit pas depasser 20 caracteres"),
  body("naissance").optional().isISO8601().withMessage("La date de naissance doit etre une date valide (AAAA-MM-JJ)"),
  body("expiration_permis").optional().isISO8601().withMessage("La date d'expiration du permis doit etre une date valide (AAAA-MM-JJ)"),
  body("actif").optional().isBoolean().withMessage("actif doit etre true ou false"),
];

// attribuer un role : POST /api/users/:id/roles
export const roleUserValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
  body("libelle_role").notEmpty().withMessage("Le libelle du role est obligatoire"),
];

// uniquement pour GET /:id et DELETE /:id
export const idValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit etre un entier positif"),
];

// uniquement pour GET / (pagination) : ?page=1&limit=10
export const paginationValidationRules = [
  query("page").optional().isInt({ min: 1 }).withMessage("page doit etre un entier superieur ou egal a 1"),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit doit etre un entier entre 1 et 100"),
];

export default userValidationRules;
