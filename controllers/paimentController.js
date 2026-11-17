const Paiement = require('../models/Paiement');

// Créer un paiement
exports.createPaiement = async (req, res) => {
  try {
    const paiement = new Paiement(req.body);
    const savedPaiement = await paiement.save();

    res.status(201).json(savedPaiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir tous les paiements
exports.getAllPaiements = async (req, res) => {
  try {
    const paiements = await Paiement.find();

    res.status(200).json(paiements);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtenir un paiement par ID
exports.getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findById(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable'
      });
    }

    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Modifier un paiement
exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable'
      });
    }

    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Supprimer un paiement
exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByIdAndDelete(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable'
      });
    }

    res.status(200).json({
      message: 'Paiement supprimé avec succès'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};