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

// detail d'une agence
export const AgenceDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const agence = await Agence.findByPk(id);
    if (!agence) {
      return res.status(404).json({ message: "Agence introuvable" });
    }
    res.status(200).json({ data: agence });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//suppression d'une agence

export const deleteAgence = async (req, res) => {
  const { id } = req.params;
  try {
    const agence = await Agence.findByPk(id);
    if (!agence) {
      return res.status(404).json({ message: "Agence introuvable" });
    }
    await agence.destroy();
    res.status(200).json({ message: "Agence supprimee avec succes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modification d'une agence
export const updateAgence = async (req, res) => {
  const { id } = req.params;
  const nouvellesDonnees = req.body;
  try {
    const agence = await Agence.findByPk(id);
    if (!agence) {
      return res.status(404).json({ message: "Agence introuvable" });
    }
    await agence.update(nouvellesDonnees);
    res
      .status(200)
      .json({ data: agence, message: "Agence modifiee avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
