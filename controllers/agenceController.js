import { Agence } from "../models/relation.js";

// liste des agences

export const AgenceList = async (req, res) => {
  try {
    const data = await Agence.findAll();
    res.status(200).json({ data });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ajout d'une agence
export const addAgence = async (req, res) => {
  const agence = req.body;
  try {
    const result = await Agence.create(agence);
    res.status(201).json({ data: result, message: "Agence creee avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
