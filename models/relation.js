// Importer les modèles sans relations
import User from "./user.js";
import Role from "./role.js";

// Ajouter les relations
Role.belongsToMany(User, { through: RoleUser});
User.belongsToMany(Role, { through: RoleUser });

export { User, Role, RoleUser };