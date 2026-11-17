const Paiement = require('../models/Paiement');

// Créer un paiement
exports.createPaiement = async (req, res) => {
  try {
    const paiement = await Paiement.create(req.body);

    res.status(201).json(paiement);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtenir tous les paiements avec pagination
exports.getAllPaiements = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Paiement.findAndCountAll({
      limit,
      offset,
    });

    res.status(200).json({
      total: count,
      page,
      totalPages: Math.ceil(count / limit),
      data: rows,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtenir un paiement par ID
exports.getPaiementById = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable',
      });
    }

    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Modifier un paiement
exports.updatePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable',
      });
    }

    await paiement.update(req.body);

    res.status(200).json(paiement);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Supprimer un paiement
exports.deletePaiement = async (req, res) => {
  try {
    const paiement = await Paiement.findByPk(req.params.id);

    if (!paiement) {
      return res.status(404).json({
        message: 'Paiement introuvable',
      });
    }

    await paiement.destroy();

    res.status(200).json({
      message: 'Paiement supprimé avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};