import bcrypt from "bcrypt";
import { randomUUID } from "node:crypto";
import { mkdir, unlink } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { validationResult } from "express-validator";
import { Agence, Role, RoleUser, User } from "../models/relation.js";
import { getPagination, paginationMetadata } from "../utils/pagination.js";

const userPhotoDirectory = path.resolve(
  path.dirname(fileURLToPath(import.meta.url)),
  "../uploads/users",
);
const photoExtensions = {
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
};

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

const storeUserPhoto = async (req, res) => {
  if (!req.files) return null;

  const fileFields = Object.keys(req.files);
  const file = req.files.photo;
  if (fileFields.length !== 1 || fileFields[0] !== "photo" || Array.isArray(file)) {
    res.status(400).json({ message: "Un seul fichier photo peut être envoyé" });
    return false;
  }
  if (file.truncated) {
    res.status(413).json({ message: "La photo ne doit pas dépasser 5 Mo" });
    return false;
  }

  const extension = photoExtensions[file.mimetype];
  if (!extension) {
    res.status(400).json({ message: "La photo doit être au format JPEG, PNG ou WebP" });
    return false;
  }

  const filename = `${randomUUID()}${extension}`;
  try {
    await mkdir(userPhotoDirectory, { recursive: true });
    await file.mv(path.join(userPhotoDirectory, filename));
    return `/uploads/users/${filename}`;
  } catch {
    res.status(500).json({ message: "Erreur lors de l'enregistrement de la photo" });
    return false;
  }
};

const removeStoredUserPhoto = async (photo) => {
  if (!photo) return;
  try {
    await unlink(path.join(userPhotoDirectory, path.basename(photo)));
  } catch (error) {
    console.error("Erreur lors du nettoyage de la photo utilisateur", error.message);
  }
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

export const UserList = async (req, res) => {
  const pagination = getPagination(req, res);
  if (!pagination) return;

  const { page, limit, offset } = pagination;
  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: { exclude: ["mdp"] },
      include: userIncludes,
      limit,
      offset,
      order: [["id", "ASC"]],
      distinct: true,
    });
    res.status(200).json({
      data: rows,
      pagination: paginationMetadata(page, limit, count),
    });
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

  let uploadedPhoto;
  try {
    const photo = await storeUserPhoto(req, res);
    if (photo === false) return;
    if (photo) {
      uploadedPhoto = photo;
      data.photo = photo;
    }
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
    await removeStoredUserPhoto(uploadedPhoto);
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
  if (!req.files && Object.keys(data).length === 0 && mdp === undefined) {
    return res.status(400).json({ message: "Aucune donnée valide à modifier" });
  }

  let uploadedPhoto;
  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const photo = await storeUserPhoto(req, res);
    if (photo === false) return;
    if (photo) {
      uploadedPhoto = photo;
      data.photo = photo;
    }
    if (Object.keys(data).length === 0 && mdp === undefined) {
      return res.status(400).json({ message: "Aucune donnée valide à modifier" });
    }
    if (mdp !== undefined) data.mdp = await bcrypt.hash(mdp, 10);
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
    await removeStoredUserPhoto(uploadedPhoto);
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
