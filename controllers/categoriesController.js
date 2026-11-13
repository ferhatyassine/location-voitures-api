import Categorie from "../models/categorie.js";

// Afficher toutes les catégories
export const getCategories = async (req, res) => {
  try {
    const categories = await Categorie.findAll();

    res.status(200).json(categories);
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