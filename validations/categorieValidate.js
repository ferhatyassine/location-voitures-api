import { body } from "express-validator";

export const categorieValidation = [
  body("nom")
    .notEmpty()
    .withMessage("Le nom de la catégorie est obligatoire"),

  body("prix_jour_base")
    .notEmpty()
    .withMessage("Le prix journalier est obligatoire")
    .isNumeric()
    .withMessage("Le prix journalier doit être un nombre"),

  body("caution")
    .notEmpty()
    .withMessage("La caution est obligatoire")
    .isNumeric()
    .withMessage("La caution doit être un nombre"),

  body("age_minimum")
    .notEmpty()
    .withMessage("L'âge minimum est obligatoire")
    .isInt({ min: 18 })
    .withMessage("L'âge minimum doit être supérieur ou égal à 18 ans"),
];