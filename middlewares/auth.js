import jwt from "jsonwebtoken";

// verifier le jeton JWT envoye dans l'entete: authorization : bearer <jeton>
export const verifyToken = (req, res, next) => {
  const entete = req.headers.authorization;

  // 1- pas de jeton ==> 401 Unauthorized
  if (!entete || !entete.startsWith("Bearer ")) {
    return res
      .status(401)
      .json({ message: "Jeton manquant: connectez-vous d'abord" });
  }

  // 2- on garde seulement le jeton (apres "Bearer")
  const jeton = entete.split(" ")[1];

  // 3- verifier la signature et la date d'expiration du jeton
  try {
    const contenu = jwt.verify(jeton, process.env.JWT_SECRET);
    req.user = contenu; // { id,email,role} : utilisable dans les controleurs
    next(); // jeton valide --> on passe au controleur suivant
  } catch (error) {
    return res.status(401).json({ message: "Jeton invalide ou expire" });
  }
};

// verifier que l'utilisateur a le bon role ( a placer APRES verifyToken)
export const authorizeRoles = (...rolesAutorises) => {
  return (req, res, next) => {
    // verifytoken doit etre appele avant pour que req.user soit defini
    if (!req.user) {
      return res
        .status(401)
        .json({ message: "jeton manquant : connectez vous d'abord" });
    }
    // le role du jeton est il dans la liste ?
    if (!rolesAutorises.includes(req.user.role)) {
      return res
        .status(403)
        .json({ message: "Acces refuse: role non autorise" });
    }
    next();
  };
};
