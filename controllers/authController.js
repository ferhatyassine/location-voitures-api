import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { validationResult } from "express-validator";
import { User, Role } from "../models/relation.js";

// inscription d'un client : POST /api/auth/register
export const register = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { nom, prenom, email, mdp, telephone, naissance, num_permis, expiration_permis } = req.body;
  try {
    const existe = await User.findOne({ where: { email } });
    if (existe) {
      return res.status(400).json({ message: "Cet email est deja utilise" });
    }

    // le mot de passe est toujours enregistre HACHE (jamais en clair)
    const mdpHache = await bcrypt.hash(mdp, 10);
    const user = await User.create({
      nom, prenom, email, mdp: mdpHache, telephone, naissance, num_permis, expiration_permis,
    });

    // un nouvel inscrit recoit le role "client"
    const [roleClient] = await Role.findOrCreate({
      where: { libelle_role: "client" },
      defaults: { description: "Client de l'agence" },
    });
    await user.addRole(roleClient);

    res.status(201).json({
      data: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role: "client" },
      message: "Compte cree avec succes",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// connexion : POST /api/auth/login  →  renvoie le jeton JWT
export const login = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty())
    return res.status(400).json({ errors: errors.array() });

  const { email, mdp } = req.body;
  try {
    const user = await User.findOne({ where: { email }, include: Role });

    // meme message si l'email OU le mot de passe est faux (on ne dit pas lequel)
    if (!user || !(await bcrypt.compare(mdp, user.mdp))) {
      return res.status(401).json({ message: "Email ou mot de passe incorrect" });
    }
    if (!user.actif) {
      return res.status(403).json({ message: "Compte desactive" });
    }

    // role principal : admin > employe > client
    const roles = user.Roles.map((r) => r.libelle_role);
    const role = roles.includes("admin")
      ? "admin"
      : roles.includes("employe")
        ? "employe"
        : "client";

    const token = jwt.sign(
      { id: user.id, email: user.email, role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN || "2h" },
    );

    res.status(200).json({ token, user: { id: user.id, nom: user.nom, prenom: user.prenom, email: user.email, role } });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
