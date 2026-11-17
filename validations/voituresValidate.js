import { body } from "express-validator";

export const voitureValidation = [
  body("modele")
    .notEmpty()
    .withMessage("Le modèle est obligatoire"),

  body("annee")
    .notEmpty()
    .withMessage("L'année est obligatoire")
    .isInt()
    .withMessage("L'année doit être un entier"),

  body("immatriculation")
    .notEmpty()
    .withMessage("L'immatriculation est obligatoire"),

  body("vin")
    .notEmpty()
    .withMessage("Le VIN est obligatoire")
    .isLength({ min: 17, max: 17 })
    .withMessage("Le VIN doit contenir 17 caractères"),

  body("prix_jour")
    .optional()
    .isNumeric()
    .withMessage("Le prix journalier doit être un nombre"),

  body("nb_places")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Le nombre de places doit être un entier positif"),

  body("id_categorie")
    .notEmpty()
    .withMessage("La catégorie est obligatoire"),

  body("id_marque")
    .notEmpty()
    .withMessage("La marque est obligatoire"),
];