import { Location, User, Voiture, Agence } from "../models/relation.js";

// les tables liees a afficher avec une location (utilise par la liste et le detail)
const includeLocation = [
  { model: User, attributes: ["id", "nom", "prenom", "email"] },
  { model: Voiture },
  { model: Agence, as: "agenceRetrait" },
  { model: Agence, as: "agenceRetour" },
];

// liste des locations, avec le client , la voiture et les agences de retrait et de retour
export const LocationList = async (req, res) => {
  try {
    const data = await Location.findAll({
      include: includeLocation,
    });
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ajout d'une location.

export const addLocation = async (req, res) => {
  const location = req.body;
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
