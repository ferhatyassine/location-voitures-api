import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { User } from "../models/relation.js";
import { getJwtSecret } from "../config/jwt.js";

const TOKEN_EXPIRATION_SECONDS = 60 * 60;

export const login = async (req, res) => {
  const { email, mdp } = req.body ?? {};
  if (
    typeof email !== "string" ||
    email.trim().length === 0 ||
    typeof mdp !== "string" ||
    mdp.length === 0
  ) {
    return res.status(400).json({ message: "Le courriel et le mot de passe sont obligatoires" });
  }

  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      message: "JWT_SECRET doit être configuré avec au moins 32 caractères",
    });
  }

  try {
    const user = await User.findOne({ where: { email: email.trim() } });
    if (!user || !user.actif || !(await bcrypt.compare(mdp, user.mdp))) {
      return res.status(401).json({ message: "Identifiants invalides" });
    }

    const token = jwt.sign({ sub: String(user.id) }, secret, {
      algorithm: "HS256",
      expiresIn: TOKEN_EXPIRATION_SECONDS,
    });

    return res.status(200).json({
      data: {
        token,
        tokenType: "Bearer",
        expiresIn: TOKEN_EXPIRATION_SECONDS,
        user: {
          id: user.id,
          nom: user.nom,
          prenom: user.prenom,
          email: user.email,
        },
      },
    });
  } catch {
    return res.status(500).json({ message: "Erreur lors de l'authentification" });
  }
};
