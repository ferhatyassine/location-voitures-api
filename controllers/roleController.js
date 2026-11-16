import { validationResult } from "express-validator";
import { Role } from "../models/relation.js";

const getPositiveId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const validatedBody = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400).json({ errors: errors.array() });
  return false;
};

const handleRoleError = (res, error) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Ce rôle existe déjà" });
  }
  if (error.name === "SequelizeValidationError") {
    return res.status(400).json({ message: "Le titre du rôle est invalide" });
  }
  return res.status(500).json({ message: "Erreur lors de la gestion du rôle" });
};

export const RoleList = async (_req, res) => {
  try {
    const data = await Role.findAll();
    res.status(200).json({ data });
  } catch {
    res.status(500).json({ message: "Erreur lors de la récupération des rôles" });
  }
};

export const RoleDetail = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });

  try {
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    res.status(200).json({ data: role });
  } catch {
    res.status(500).json({ message: "Erreur lors de la récupération du rôle" });
  }
};

export const addRole = async (req, res) => {
  if (!validatedBody(req, res)) return;
  const { titre } = req.body ?? {};

  try {
    const role = await Role.create({ titre });
    res.status(201).json({ data: role, message: "Rôle créé avec succès" });
  } catch (error) {
    handleRoleError(res, error);
  }
};

export const updateRole = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });
  if (!validatedBody(req, res)) return;
  const body = req.body ?? {};
  if (!Object.hasOwn(body, "titre")) {
    return res.status(400).json({ message: "Le titre du rôle est obligatoire" });
  }

  try {
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    await role.update({ titre: body.titre });
    res.status(200).json({ data: role, message: "Rôle modifié avec succès" });
  } catch (error) {
    handleRoleError(res, error);
  }
};

export const deleteRole = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });

  try {
    const role = await Role.findByPk(id);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });
    await role.destroy();
    res.status(200).json({ message: "Rôle supprimé avec succès" });
  } catch {
    res.status(500).json({ message: "Erreur lors de la suppression du rôle" });
  }
};
