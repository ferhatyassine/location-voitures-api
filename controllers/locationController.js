import { Location, User, Voiture, Agence } from "../models/relation.js";
import { validationResult } from "express-validator";

// les tables liees a afficher avec une location (utilise par la liste et le detail)
const includeLocation = [
  { model: User, attributes: ["id", "nom", "prenom", "email"] },
  { model: Voiture },
  { model: Agence, as: "agenceRetrait" },
  { model: Agence, as: "agenceRetour" },
];

// liste des locations (paginee), avec le client, la voiture et les agences
// exemple : GET /api/locations?page=2&limit=10
export const LocationList = async (req, res) => {
  const page = parseInt(req.query.page) || 1; // page 1 par defaut
  const limit = parseInt(req.query.limit) || 10; // 10 locations par page par defaut
  const offset = (page - 1) * limit; // combien de lignes sauter

  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const { count, rows } = await Location.findAndCountAll({
      include: includeLocation,
      limit,
      offset,
      distinct: true, // compter les locations, pas les lignes jointes
      order: [["id", "ASC"]], // toujours le meme ordre d'une page a l'autre
    });
    res.status(200).json({
      data: rows,
      pagination: {
        total: count, // nombre total de locations
        page,
        limit,
        totalPages: Math.ceil(count / limit), // nombre de pages
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ajout d'une location.

export const addLocation = async (req, res) => {
  const location = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const result = await Location.create(location);
    res
      .status(201)
      .json({ message: "Location créée avec succès", data: result });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// detail d'une location
export const LocationDetail = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const location = await Location.findByPk(id, {
      include: includeLocation,
    });
    if (!location) {
      return res.status(404).json({ message: "Location non trouvée" });
    }
    res.status(200).json({ data: location });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modification d'une location
export const updateLocation = async (req, res) => {
  const { id } = req.params;
  const nouvelledonnees = req.body;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const result = await Location.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Location non trouvée" });
    }
    await result.update(nouvelledonnees);
    res
      .status(200)
      .json({ data: result, message: "Location modifiee avec succès" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// suppression d'une location
export const deleteLocation = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });
  try {
    const result = await Location.findByPk(id);
    if (!result) {
      return res.status(404).json({ message: "Location non trouvée" });
    }
    await result.destroy();
    res.status(200).json({ message: "Location supprimée avec succès" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
