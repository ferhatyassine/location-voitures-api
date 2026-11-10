// importer les modeles (sans relations)
import Agence from "./Agence.js";
import Location from "./Location.js";

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

// exporter tous les modeles
export { Agence, Location };
