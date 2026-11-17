import { body } from "express-validator";

// inscription : POST /api/auth/register
export const registerValidationRules = [
  body("nom").notEmpty().withMessage("Le nom est obligatoire"),
  body("prenom").notEmpty().withMessage("Le prenom est obligatoire"),
  body("email").isEmail().withMessage("L'email doit etre valide"),
  body("mdp")
    .isLength({ min: 6 })
    .withMessage("Le mot de passe doit contenir au moins 6 caracteres"),
  body("naissance")
    .isISO8601()
    .withMessage("La date de naissance doit etre une date valide (AAAA-MM-JJ)"),
];

// connexion : POST /api/auth/login
export const loginValidationRules = [
  body("email").isEmail().withMessage("L'email doit etre valide"),
  body("mdp").notEmpty().withMessage("Le mot de passe est obligatoire"),
];
