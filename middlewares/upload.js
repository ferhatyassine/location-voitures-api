import multer from "multer";
import path from "node:path";
// 1) ou et sous quel nom enregistrer les fichiers
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase(); // ".jpg"
    cb(null, `agence-${Date.now()}${extension}`); //
  },
});

// 2) QUELS fichiers accepter : seulement des images
const fileFilter = (req, file, cb) => {
  const typesAcceptes = ["image/jpeg", "image/png", "image/webp"];
  if (typesAcceptes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    const erreur = new Error("Seules les images JPG, PNG ou WEBP sont acceptees");
    erreur.status = 400; // c'est la faute du client, pas du serveur
    cb(erreur);
  }
};

// 3) QUELLE taille maximum : 2 Mo
const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
});

export default upload;
