import { Role } from "../models/relation.js";
import { validationResult } from "express-validator";

// liste des roles : GET /api/roles
export const RoleList = async (req, res) => {
  try {
    const roles = await Role.findAll({ order: [["id", "ASC"]] });
    res.status(200).json({ data: roles });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// detail d'un role : GET /api/roles/:id
export const RoleDetail = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role introuvable" });
    res.status(200).json({ data: role });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ajout d'un role : POST /api/roles
export const addRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const role = await Role.create(req.body);
    res.status(201).json({ data: role, message: "Role cree avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// modification d'un role : PUT /api/roles/:id
export const updateRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role introuvable" });
    await role.update(req.body);
    res.status(200).json({ data: role, message: "Role modifie avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// suppression d'un role : DELETE /api/roles/:id
export const deleteRole = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const role = await Role.findByPk(req.params.id);
    if (!role) return res.status(404).json({ message: "Role introuvable" });
    await role.destroy();
    res.status(200).json({ message: "Role supprime avec succes" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
