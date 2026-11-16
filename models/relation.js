// importer les modeles (sans relations)
import Agence from "./Agence.js";
import Location from "./Location.js";
import User from "./user.js";
import Role from "./role.js";
import RoleUser from "./roleUser.js";

// ajouter les relations (hasMany/belongsTo)
// Agence (1,1)--- retrait ---(0,n) Location
Agence.hasMany(Location, {
  as: "retraits",
  foreignKey: { name: "agenceRetraitId", allowNull: false },
  onDelete: "RESTRICT",
});
Location.belongsTo(Agence, {
  as: "agenceRetrait",
  foreignKey: { name: "agenceRetraitId", allowNull: false },
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

Agence.hasMany(User, {
  as: "utilisateurs",
  foreignKey: { name: "AgenceId", allowNull: true },
  onDelete: "SET NULL",
});
User.belongsTo(Agence, {
  as: "agence",
  foreignKey: { name: "AgenceId", allowNull: true },
});

Role.belongsToMany(User, {
  through: RoleUser,
  foreignKey: "RoleId",
  otherKey: "UserId",
});
User.belongsToMany(Role, {
  through: RoleUser,
  foreignKey: "UserId",
  otherKey: "RoleId",
});

// exporter tous les modeles
export { Agence, Location, User, Role, RoleUser };
