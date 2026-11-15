import { Location, User, Voiture, Agence } from "../models/relation.js";

// liste des locations, avec le client , la voiture et les agences de retrait et de retour
export const LocationList = async (req, res) => {
  try {
    const data = await Location.findAll({
      include: [
        { model: User, attributes: ["id", "nom", "prenom", "email"] },
        { model: Voiture },
        { model: Agence, as: "agenceRetrait" },
        { model: Agence, as: "agenceRetour" },
      ],
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
