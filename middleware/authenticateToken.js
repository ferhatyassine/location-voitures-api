import jwt from "jsonwebtoken";
import { getJwtSecret } from "../config/jwt.js";

const invalidTokenResponse = (res) =>
  res.status(401).json({ message: "Jeton manquant, invalide ou expiré" });

export const authenticateToken = (req, res, next) => {
  const secret = getJwtSecret();
  if (!secret) {
    return res.status(500).json({
      message: "JWT_SECRET doit être configuré avec au moins 32 caractères",
    });
  }

  const authorization = req.get("authorization") ?? "";
  const match = /^Bearer\s+(\S+)$/i.exec(authorization);
  if (!match) return invalidTokenResponse(res);

  let payload;
  try {
    payload = jwt.verify(match[1], secret, { algorithms: ["HS256"] });
  } catch {
    return invalidTokenResponse(res);
  }

  const subject =
    typeof payload === "object" && payload !== null ? payload.sub : null;
  const userId = typeof subject === "string" ? Number(subject) : null;
  if (
    typeof subject !== "string" ||
    !/^[1-9]\d*$/.test(subject) ||
    !Number.isSafeInteger(userId)
  ) {
    return invalidTokenResponse(res);
  }

  req.auth = { userId };
  return next();
};
