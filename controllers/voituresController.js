import Voiture from "../models/Voitures.js";
import { validationResult } from "express-validator";

// Afficher toutes les voitures
export const getVoitures = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    const { count, rows } = await Voiture.findAndCountAll({
      limit,
      offset,
    });

    res.status(200).json({
      totalItems: count,
      totalPages: Math.ceil(count / limit),
      currentPage: page,
      voitures: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Afficher une voiture par son id
export const getVoitureById = async (req, res) => {
  try {
    const voiture = await Voiture.findByPk(req.params.id);

    if (!voiture) {
      return res.status(404).json({
        message: "Voiture introuvable",
      });
    }

    res.status(200).json(voiture);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Ajouter une voiture
export const createVoiture = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const voiture = await Voiture.create(req.body);

    res.status(201).json(voiture);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Modifier une voiture
export const updateVoiture = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const voiture = await Voiture.findByPk(req.params.id);

    if (!voiture) {
      return res.status(404).json({
        message: "Voiture introuvable",
      });
    }

    await voiture.update(req.body);

    res.status(200).json(voiture);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Supprimer une voiture
export const deleteVoiture = async (req, res) => {
  try {
    const voiture = await Voiture.findByPk(req.params.id);

    if (!voiture) {
      return res.status(404).json({
        message: "Voiture introuvable",
      });
    }

    await voiture.destroy();

    res.status(200).json({
      message: "Voiture supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};