import Categorie from "./Categorie.js";
import Voiture from "./Voitures.js";

// Une catégorie possède plusieurs voitures
Categorie.hasMany(Voiture, {
    foreignKey: "id_categorie"
});

// Une voiture appartient à une catégorie
Voiture.belongsTo(Categorie, {
    foreignKey: "id_categorie"
});

export { Categorie, Voiture };