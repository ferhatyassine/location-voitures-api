import Categorie from "./Categorie.js";
import Voiture from "./Voitures.js";
import Agence from "./Agence.js";
import Location from "./Location.js";
import User from "./user.js";
import Role from "./role.js";
import RoleUser from "./roleUser.js";
import Marque from "./Marque.js";


// Une catégorie possède plusieurs voitures
Categorie.hasMany(Voiture, {
  foreignKey: "id_categorie"
});

// Une voiture appartient à une catégorie
Voiture.belongsTo(Categorie, {
  foreignKey: "id_categorie"
});

// Agence (1,1) --- retrait --- (0,n) Location
Agence.hasMany(Location, {
  as: "retraits",
  foreignKey: { name: "agenceRetraitId", allowNull: false },
  onDelete: "RESTRICT",
});
Location.belongsTo(Agence, {
  as: "agenceRetrait",
  foreignKey: { name: "agenceRetraitId", allowNull: false },
});

// Une marque possède plusieurs voitures
Marque.hasMany(Voiture, {
  foreignKey: "id_marque",
});

// Une voiture appartient à une marque
Voiture.belongsTo(Marque, {
  foreignKey: "id_marque",
});

// Agence (1,1) --- retour --- (0,n) Location
Agence.hasMany(Location, {
  as: "retours",
  foreignKey: { name: "agenceRetourId", allowNull: false },
  onDelete: "RESTRICT",
});
Location.belongsTo(Agence, {
  as: "agenceRetour",
  foreignKey: { name: "agenceRetourId", allowNull: false },
});

Role.belongsToMany(User, { through: RoleUser });
User.belongsToMany(Role, { through: RoleUser });

// exporter tous les modeles
export { Agence, Location, User, Role, RoleUser, Categorie, Voiture };