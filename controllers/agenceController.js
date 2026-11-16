import { Agence } from "../models/relation.js";
import { validationResult } from "express-validator";
import fs from "node:fs/promises";

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

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

// envoi de l'image d'une agence
export const uploadImageAgence = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) await fs.unlink(req.file.path); // id invalide : on supprime le fichier deja enregistre
    return res.status(400).json({ errors: errors.array() });
  }

  // Multer a deja range le fichier : ses infos sont dans req.file
  if (!req.file) {
    return res
      .status(400)
      .json({ message: "Aucune image envoyee (champ 'image')" });
  }

  try {
    const agence = await Agence.findByPk(id);
    if (!agence) {
      await fs.unlink(req.file.path); // on supprime le fichier inutile
      return res.status(404).json({ message: "Agence introuvable" });
    }
    await agence.update({ image: `uploads/${req.file.filename}` });
    res
      .status(200)
      .json({ data: agence, message: "Image de l'agence enregistree" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
