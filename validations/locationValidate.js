// importer les fonctions de validation et les modeles a verifier
import { body, param, query } from "express-validator";
import { User, Voiture } from "../models/relation.js";

const locationValidationRules = [
  body("numero_contrat")
    .notEmpty()
    .withMessage("Le numero de contrat est obligatoire")
    .isLength({ max: 20 })
    .withMessage("Le numero de contrat ne doit pas depasser 20 caracteres"),

  // les dates
  body("date_retrait")
    .isISO8601()
    .withMessage(
      "La date de retrait doit etre une date valide (AAAA-MM-JJ HH:MM:SS)",
    ),
  body("date_retour_prevue")
    .isISO8601()
    .withMessage("La date de retour prevue doit etre une date valide")
    .custom((value, { req }) => {
      if (new Date(value) <= new Date(req.body.date_retrait)) {
        throw new Error(
          "La date de retour prevue doit etre apres la date de retrait",
        );
      }
      return true;
    }),

  // les nombres
  body("montant_total")
    .isFloat({ min: 0 })
    .withMessage("Le montant total doit etre un nombre positif"),
  body("km_depart")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le km de depart doit etre un entier positif"),
  body("km_retour")
    .optional()
    .isInt({ min: 0 })
    .withMessage("Le km de retour doit etre un entier positif"),
  body("frais_retard")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Les frais de retard doivent etre positifs"),
  body("statut")
    .optional()
    .isIn(["reservee", "en_cours", "terminee", "annulee"])
    .withMessage("Statut invalide (reservee, en_cours, terminee ou annulee)"),

  // les cles etrangeres : le client et la voiture doivent EXISTER
  body("userId")
    .isInt({ gt: 0 })
    .withMessage("userId doit etre un entier positif")
    .custom(async (value) => {
      const user = await User.findByPk(value);
      if (!user) throw new Error("Client introuvable");
      return true;
    }),
  body("voitureId")
    .isInt({ gt: 0 })
    .withMessage("voitureId doit etre un entier positif")
    .custom(async (value) => {
      const voiture = await Voiture.findByPk(value);
      if (!voiture) throw new Error("Voiture introuvable");
      return true;
    }),
  body("agenceRetraitId")
    .isInt({ gt: 0 })
    .withMessage("agenceRetraitId doit etre un entier positif"),
  body("agenceRetourId")
    .isInt({ gt: 0 })
    .withMessage("agenceRetourId doit etre un entier positif"),

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

export default locationValidationRules;
