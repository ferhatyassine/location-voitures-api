import { body, param, query } from "express-validator";
import { Location } from "../models/relation.js";

const paiementValidationRules = [
  body("montant")
    .notEmpty()
    .withMessage("Le montant est obligatoire")
    .isFloat({ gt: 0 })
    .withMessage("Le montant doit etre un nombre positif"),

  body("date_paiement")
    .notEmpty()
    .withMessage("La date de paiement est obligatoire")
    .isISO8601()
    .withMessage("La date de paiement doit etre une date valide (AAAA-MM-JJ)"),

  body("type")
    .isIn(["location", "caution", "penalite", "remboursement"])
    .withMessage("Le type doit etre : location, caution, penalite ou remboursement"),

  body("methode")
    .isIn(["carte", "especes", "virement", "paypal"])
    .withMessage("La methode doit etre : carte, especes, virement ou paypal"),

  body("statut")
    .optional()
    .isIn(["en_attente", "paye", "annule", "rembourse"])
    .withMessage("Le statut doit etre : en_attente, paye, annule ou rembourse"),

  body("reference")
    .optional()
    .isLength({ max: 50 })
    .withMessage("La reference ne doit pas depasser 50 caracteres"),

  // la location doit exister
  body("locationId")
    .isInt({ gt: 0 })
    .withMessage("locationId doit etre un entier positif")
    .bail()
    .custom(async (value) => {
      const location = await Location.findByPk(value);
      if (!location) throw new Error("Location introuvable");
      return true;
    }),

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

export default paiementValidationRules;
