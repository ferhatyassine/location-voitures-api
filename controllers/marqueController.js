const Marque = require('../models/Marque');

// Créer une marque
exports.createMarque = async (req, res) => {
  try {
    const marque = await Marque.create(req.body);

    res.status(201).json(marque);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Obtenir toutes les marques avec pagination
exports.getAllMarques = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const offset = (page - 1) * limit;

    const { count, rows } = await Marque.findAndCountAll({
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

// Obtenir une marque par ID
exports.getMarqueById = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable',
      });
    }

    res.status(200).json(marque);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Modifier une marque
exports.updateMarque = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable',
      });
    }

    await marque.update(req.body);

    res.status(200).json(marque);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// Supprimer une marque
// Supprimer une marque
exports.deleteMarque = async (req, res) => {
  try {
    const marque = await Marque.findByPk(req.params.id);

    if (!marque) {
      return res.status(404).json({
        message: 'Marque introuvable',
      });
    }

    await marque.destroy();

    res.status(200).json({
      message: 'Marque supprimée avec succès',
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};