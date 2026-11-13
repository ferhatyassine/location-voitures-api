import Voiture from "../models/Voitures.js";

// Afficher toutes les voitures
export const getVoitures = async (req, res) => {
  try {
    const voitures = await Voiture.findAll();

    res.status(200).json(voitures);
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