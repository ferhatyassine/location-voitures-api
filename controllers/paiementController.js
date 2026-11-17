import { Paiement, Location } from "../models/relation.js";
import { validationResult } from "express-validator";

// Creer un paiement : POST /api/paiements
export const createPaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const paiement = await Paiement.create(req.body);
    res.status(201).json({ data: paiement, message: "Paiement cree avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir tous les paiements avec pagination : GET /api/paiements?page=1&limit=10
export const getAllPaiements = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Paiement.findAndCountAll({
      include: [{ model: Location }],
      limit,
      offset,
      distinct: true,
      order: [["id", "ASC"]],
    });

    res.status(200).json({
      data: rows,
      pagination: {
        total: count,
        page,
        limit,
        totalPages: Math.ceil(count / limit),
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un paiement par ID : GET /api/paiements/:id
export const getPaiementById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const paiement = await Paiement.findByPk(req.params.id, {
      include: [{ model: Location }],
    });
    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    res.status(200).json({ data: paiement });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un paiement : PUT /api/paiements/:id
export const updatePaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    await paiement.update(req.body);
    res.status(200).json({ data: paiement, message: "Paiement modifie avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer un paiement : DELETE /api/paiements/:id
export const deletePaiement = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const paiement = await Paiement.findByPk(req.params.id);
    if (!paiement) {
      return res.status(404).json({ message: "Paiement introuvable" });
    }
    await paiement.destroy();
    res.status(200).json({ message: "Paiement supprime avec succes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
