import bcrypt from "bcrypt";
import { validationResult } from "express-validator";
import { Agence, Role, RoleUser, User } from "../models/relation.js";

const userFields = [
  "nom",
  "prenom",
  "email",
  "telephone",
  "naissance",
  "num_permis",
  "expiration_permis",
  "photo",
  "actif",
  "AgenceId",
];

const userIncludes = [
  { model: Agence, as: "agence" },
  { model: Role },
];

const publicUser = (user) => {
  const data = user.toJSON();
  delete data.mdp;
  return data;
};

const validatedBody = (req, res) => {
  const errors = validationResult(req);
  if (errors.isEmpty()) return true;
  res.status(400).json({ errors: errors.array() });
  return false;
};

const getPositiveId = (value) => {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
};

const handleUserError = (res, error) => {
  if (error.name === "SequelizeUniqueConstraintError") {
    return res.status(409).json({ message: "Cette adresse courriel est déjà utilisée" });
  }
  if (
    error.name === "SequelizeValidationError" ||
    error.name === "SequelizeForeignKeyConstraintError"
  ) {
    return res.status(400).json({ message: "Les données fournies sont invalides" });
  }
  return res.status(500).json({ message: "Erreur lors de la gestion de l'utilisateur" });
};

export const UserList = async (_req, res) => {
  try {
    const data = await User.findAll({
      attributes: { exclude: ["mdp"] },
      include: userIncludes,
    });
    res.status(200).json({ data });
  } catch {
    res.status(500).json({ message: "Erreur lors de la récupération des utilisateurs" });
  }
};

export const UserDetail = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });

  try {
    const user = await User.findByPk(id, {
      attributes: { exclude: ["mdp"] },
      include: userIncludes,
    });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json({ data: user });
  } catch {
    res.status(500).json({ message: "Erreur lors de la récupération de l'utilisateur" });
  }
};

export const addUser = async (req, res) => {
  if (!validatedBody(req, res)) return;
  const { mdp, ...body } = req.body ?? {};
  if (typeof mdp !== "string" || mdp.length === 0) {
    return res.status(400).json({ message: "Le mot de passe est obligatoire" });
  }

  const data = Object.fromEntries(
    Object.entries(body).filter(([field]) => userFields.includes(field)),
  );

  try {
    const user = await User.create({ ...data, mdp: await bcrypt.hash(mdp, 10) });
    const createdUser = await User.findByPk(user.id, {
      attributes: { exclude: ["mdp"] },
      include: userIncludes,
    });
    res.status(201).json({
      data: publicUser(createdUser),
      message: "Utilisateur créé avec succès",
    });
  } catch (error) {
    handleUserError(res, error);
  }
};

export const updateUser = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });
  if (!validatedBody(req, res)) return;

  const { mdp, ...body } = req.body ?? {};
  const data = Object.fromEntries(
    Object.entries(body).filter(([field]) => userFields.includes(field)),
  );
  if (mdp !== undefined) {
    if (typeof mdp !== "string" || mdp.length === 0) {
      return res.status(400).json({ message: "Le mot de passe ne peut pas être vide" });
    }
  }
  if (Object.keys(data).length === 0 && mdp === undefined) {
    return res.status(400).json({ message: "Aucune donnée valide à modifier" });
  }

  try {
    if (mdp !== undefined) data.mdp = await bcrypt.hash(mdp, 10);
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await user.update(data);
    const updatedUser = await User.findByPk(id, {
      attributes: { exclude: ["mdp"] },
      include: userIncludes,
    });
    res.status(200).json({
      data: publicUser(updatedUser),
      message: "Utilisateur modifié avec succès",
    });
  } catch (error) {
    handleUserError(res, error);
  }
};

export const deleteUser = async (req, res) => {
  const id = getPositiveId(req.params.id);
  if (!id) return res.status(400).json({ message: "L'id doit être un entier positif" });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await user.destroy();
    res.status(200).json({ message: "Utilisateur supprimé avec succès" });
  } catch {
    res.status(500).json({ message: "Erreur lors de la suppression de l'utilisateur" });
  }
};

export const assignRoleToUser = async (req, res) => {
  const userId = getPositiveId(req.params.userId);
  const roleId = getPositiveId(req.params.roleId);
  if (!userId || !roleId) {
    return res.status(400).json({ message: "Les identifiants doivent être des entiers positifs" });
  }

  try {
    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Rôle introuvable" });

    const assignment = await RoleUser.findOne({ where: { RoleId: roleId, UserId: userId } });
    if (assignment) {
      return res.status(409).json({ message: "Ce rôle est déjà attribué à l'utilisateur" });
    }

    await user.addRole(role);
    res.status(201).json({ message: "Rôle attribué avec succès" });
  } catch (error) {
    handleUserError(res, error);
  }
};

export const removeRoleFromUser = async (req, res) => {
  const userId = getPositiveId(req.params.userId);
  const roleId = getPositiveId(req.params.roleId);
  if (!userId || !roleId) {
    return res.status(400).json({ message: "Les identifiants doivent être des entiers positifs" });
  }

  try {
    const assignment = await RoleUser.findOne({ where: { RoleId: roleId, UserId: userId } });
    if (!assignment) {
      return res.status(404).json({ message: "Attribution de rôle introuvable" });
    }
    await assignment.destroy();
    res.status(200).json({ message: "Rôle retiré avec succès" });
  } catch {
    res.status(500).json({ message: "Erreur lors du retrait du rôle" });
  }
};
