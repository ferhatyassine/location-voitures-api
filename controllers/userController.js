import fs from "node:fs/promises";
import bcrypt from "bcrypt";
import { User, Role } from "../models/relation.js";
import { validationResult } from "express-validator";

// on ne renvoie jamais le mot de passe
const sansMdp = { exclude: ["mdp"] };
const includeRoles = [
  { model: Role, attributes: ["id", "libelle_role"], through: { attributes: [] } },
];

// un client ne peut voir / modifier que son propre compte
const estAutorise = (req, id) =>
  req.user.role === "admin" || req.user.id === parseInt(id);

// liste des utilisateurs (paginee) : GET /api/users?page=1&limit=10
export const UserList = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  try {
    const { count, rows } = await User.findAndCountAll({
      attributes: sansMdp,
      include: includeRoles,
      limit,
      offset,
      distinct: true,
      order: [["id", "ASC"]],
    });
    res.status(200).json({
      data: rows,
      pagination: { total: count, page, limit, totalPages: Math.ceil(count / limit) },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// detail d'un utilisateur : GET /api/users/:id
export const UserDetail = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  if (!estAutorise(req, id))
    return res.status(403).json({ message: "Acces refuse: vous ne pouvez voir que votre compte" });

  try {
    const user = await User.findByPk(id, { attributes: sansMdp, include: includeRoles });
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    res.status(200).json({ data: user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// modification d'un utilisateur : PUT /api/users/:id
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  if (!estAutorise(req, id))
    return res.status(403).json({ message: "Acces refuse: vous ne pouvez modifier que votre compte" });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const donnees = { ...req.body };
    // seul l'admin peut activer / desactiver un compte
    if (req.user.role !== "admin") delete donnees.actif;
    // le mot de passe est toujours hache
    if (donnees.mdp) donnees.mdp = await bcrypt.hash(donnees.mdp, 10);

    await user.update(donnees);
    const resultat = user.toJSON();
    delete resultat.mdp;
    res.status(200).json({ data: resultat, message: "Utilisateur modifie avec succes" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// suppression d'un utilisateur : DELETE /api/users/:id
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    await user.destroy();
    res.status(200).json({ message: "Utilisateur supprime avec succes" });
  } catch (error) {
    // un client qui a des locations ne peut pas etre supprime (RESTRICT)
    res.status(400).json({ message: "Suppression impossible: cet utilisateur a des locations" });
  }
};

// attribuer un role a un utilisateur : POST /api/users/:id/roles
export const addRoleUser = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });

    const role = await Role.findOne({ where: { libelle_role: req.body.libelle_role } });
    if (!role) return res.status(404).json({ message: "Role introuvable" });

    await user.addRole(role);
    res.status(200).json({ message: `Role ${role.libelle_role} attribue a l'utilisateur ${user.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// retirer un role : DELETE /api/users/:id/roles/:roleId
export const removeRoleUser = async (req, res) => {
  const { id, roleId } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  try {
    const user = await User.findByPk(id);
    if (!user) return res.status(404).json({ message: "Utilisateur introuvable" });
    const role = await Role.findByPk(roleId);
    if (!role) return res.status(404).json({ message: "Role introuvable" });

    await user.removeRole(role);
    res.status(200).json({ message: `Role ${role.libelle_role} retire de l'utilisateur ${user.id}` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// envoi de l'image : PUT /:id/image (form-data, champ "image")
export const uploadPhotoUser = async (req, res) => {
  const { id } = req.params;
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    if (req.file) await fs.unlink(req.file.path); // id invalide : on supprime le fichier
    return res.status(400).json({ errors: errors.array() });
  }
  if (!estAutorise(req, id)) {
    if (req.file) await fs.unlink(req.file.path);
    return res.status(403).json({ message: "Acces refuse: vous ne pouvez modifier que votre compte" });
  }

  if (!req.file) {
    return res.status(400).json({ message: "Aucune image envoyee (champ 'image')" });
  }

  try {
    const element = await User.findByPk(id);
    if (!element) {
      await fs.unlink(req.file.path); // on supprime le fichier inutile
      return res.status(404).json({ message: "Utilisateur introuvable" });
    }
    await element.update({ photo: `uploads/${req.file.filename}` });
    const resultat = element.toJSON();
    delete resultat.mdp;
    res.status(200).json({ data: resultat, message: "Image enregistree" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
