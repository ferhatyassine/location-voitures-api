import { body, param } from "express-validator";

const passwordRules = (field) =>
  body(field)
    .isString()
    .withMessage("Le mot de passe doit être une chaîne de caractères")
    .bail()
    .isLength({ min: 8 })
    .withMessage("Le mot de passe doit contenir au moins 8 caractères")
    .custom((value) => Buffer.byteLength(value, "utf8") <= 72)
    .withMessage("Le mot de passe ne doit pas dépasser 72 octets");

const nameRules = (field, label, required) => {
  const rule = body(field);
  if (!required) rule.optional();
  return rule
    .isString()
    .withMessage(`${label} doit être une chaîne de caractères`)
    .notEmpty()
    .withMessage(`${label} est obligatoire`)
    .isLength({ max: 50 })
    .withMessage(`${label} ne doit pas dépasser 50 caractères`);
};

const optionalString = (field, label, maxLength) =>
  body(field)
    .optional({ values: "null" })
    .isString()
    .withMessage(`${label} doit être une chaîne de caractères`)
    .isLength({ max: maxLength })
    .withMessage(`${label} ne doit pas dépasser ${maxLength} caractères`);

const emailRules = (required) => {
  const rule = body("email");
  if (!required) rule.optional();
  return rule
    .isEmail()
    .withMessage("L'adresse courriel est invalide")
    .isLength({ max: 100 })
    .withMessage("L'adresse courriel ne doit pas dépasser 100 caractères");
};

const dateRules = (field, label, required, nullable = false) => {
  const rule = body(field);
  if (!required) {
    if (nullable) rule.optional({ values: "null" });
    else rule.optional();
  }
  return rule
    .isISO8601({ strict: true })
    .withMessage(`${label} doit être une date valide au format AAAA-MM-JJ`);
};

const agenceIdRules = () =>
  body("AgenceId")
    .optional({ values: "null" })
    .isInt({ gt: 0 })
    .withMessage("AgenceId doit être un entier positif");

const actifRules = () =>
  body("actif")
    .optional()
    .isBoolean({ strict: true })
    .withMessage("actif doit être un booléen");

const createUserRules = [
  nameRules("nom", "Le nom", true),
  nameRules("prenom", "Le prénom", true),
  emailRules(true),
  passwordRules("mdp"),
  body("telephone")
    .optional({ values: "null" })
    .isString()
    .withMessage("Le téléphone doit être une chaîne de caractères")
    .isLength({ max: 20 })
    .withMessage("Le téléphone ne doit pas dépasser 20 caractères"),
  dateRules("naissance", "La date de naissance", true),
  optionalString("num_permis", "Le numéro de permis", 30),
  dateRules("expiration_permis", "La date d'expiration du permis", false, true),
  optionalString("photo", "La photo", 255),
  actifRules(),
  agenceIdRules(),
];

const updateUserRules = [
  nameRules("nom", "Le nom", false),
  nameRules("prenom", "Le prénom", false),
  emailRules(false),
  passwordRules("mdp").optional(),
  body("telephone")
    .optional({ values: "null" })
    .isString()
    .withMessage("Le téléphone doit être une chaîne de caractères")
    .isLength({ max: 20 })
    .withMessage("Le téléphone ne doit pas dépasser 20 caractères"),
  dateRules("naissance", "La date de naissance", false),
  optionalString("num_permis", "Le numéro de permis", 30),
  dateRules("expiration_permis", "La date d'expiration du permis", false, true),
  optionalString("photo", "La photo", 255),
  actifRules(),
  agenceIdRules(),
];

export const userIdValidationRules = [
  param("id").isInt({ gt: 0 }).withMessage("L'id doit être un entier positif"),
];

export const roleAssignmentValidationRules = [
  param("userId")
    .isInt({ gt: 0 })
    .withMessage("L'identifiant de l'utilisateur doit être un entier positif"),
  param("roleId")
    .isInt({ gt: 0 })
    .withMessage("L'identifiant du rôle doit être un entier positif"),
];

export { createUserRules as userCreateValidationRules };
export { updateUserRules as userUpdateValidationRules };
