import fs from "node:fs/promises";
import { Marque } from "../models/relation.js";
import { validationResult } from "express-validator";

// Creer une marque : POST /api/marques
export const createMarque = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const marque = await Marque.create(req.body);
    res.status(201).json({ data: marque, message: "Marque creee avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtenir toutes les marques avec pagination : GET /api/marques?page=1&limit=10
export const getAllMarques = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await Marque.findAndCountAll({
      limit,
      offset,
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

// Obtenir une marque par ID : GET /api/marques/:id
export const getMarqueById = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) {
      return res.status(404).json({ message: "Marque introuvable" });
    }
    res.status(200).json({ data: marque });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une marque : PUT /api/marques/:id
export const updateMarque = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) {
      return res.status(404).json({ message: "Marque introuvable" });
    }
    await marque.update(req.body);
    res.status(200).json({ data: marque, message: "Marque modifiee avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Supprimer une marque : DELETE /api/marques/:id
export const deleteMarque = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const marque = await Marque.findByPk(req.params.id);
    if (!marque) {
      return res.status(404).json({ message: "Marque introuvable" });
    }
    await marque.destroy();
    res.status(200).json({ message: "Marque supprimee avec succes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// envoi de l'image : PUT /:id/image (form-data, champ "image")
export const uploadLogoMarque = async (req, res) => {
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
    const element = await Marque.findByPk(id);
    if (!element) {
      await fs.unlink(req.file.path); // on supprime le fichier inutile
      return res.status(404).json({ message: "Marque introuvable" });
    }
    await element.update({ logo: `uploads/${req.file.filename}` });
    res.status(200).json({ data: element, message: "Image enregistree" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
