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
