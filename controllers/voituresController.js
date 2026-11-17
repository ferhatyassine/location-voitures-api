import fs from "node:fs/promises";
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
// envoi de l'image : PUT /:id/image (form-data, champ "image")
export const uploadPhotoVoiture = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) await fs.unlink(req.file.path); // id invalide : on supprime le fichier
    return res.status(400).json({ errors: errors.array() });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Aucune image envoyee (champ 'image')" });
  }

  try {
    const element = await Voiture.findByPk(id);
    if (!element) {
      await fs.unlink(req.file.path); // on supprime le fichier inutile
      return res.status(404).json({ message: "Voiture introuvable" });
    }
    await element.update({ photo: `uploads/${req.file.filename}` });
    res.status(200).json({ data: element, message: "Image enregistree" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
