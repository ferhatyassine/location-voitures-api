const Marque = require('../models/Marque');

// Créer une marque
exports.createMarque = async (req, res) => {
  try {
    const marque = new Marque(req.body);
    const savedMarque = await marque.save();

    res.status(201).json(savedMarque);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir toutes les marques
exports.getAllMarques = async (req, res) => {
  try {
    const marques = await Marque.find();

    res.status(200).json(marques);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir une marque par ID
exports.getMarqueById = async (req, res) => {
  try {
    const marque = await Marque.findById(req.params.id);

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable'
      });
    }

    res.status(200).json(marque);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier une marque
exports.updateMarque = async (req, res) => {
  try {
    const marque = await Marque.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable'
      });
    }

    res.status(200).json(marque);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer une marque
exports.deleteMarque = async (req, res) => {
  try {
    const marque = await Marque.findByIdAndDelete(req.params.id);

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable'
      });
    }

    res.status(200).json({
      message: 'Marque supprimée avec succès'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};