import Categorie from "../models/Categorie.js";
import { validationResult } from "express-validator";

// Afficher toutes les catégories
export const getCategories = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Categorie.findAndCountAll({
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
    res.status(500).json({
      message: error.message,
    });
  }
};

// Afficher une catégorie par son id
export const getCategorieById = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Ajouter une catégorie
export const createCategorie = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const categorie = await Categorie.create(req.body);

    res.status(201).json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Modifier une catégorie
export const updateCategorie = async (req, res) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      errors: errors.array(),
    });
  }

  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    await categorie.update(req.body);

    res.status(200).json(categorie);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Supprimer une catégorie
export const deleteCategorie = async (req, res) => {
  try {
    const categorie = await Categorie.findByPk(req.params.id);

    if (!categorie) {
      return res.status(404).json({
        message: "Catégorie introuvable",
      });
    }

    await categorie.destroy();

    res.status(200).json({
      message: "Catégorie supprimée avec succès",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};