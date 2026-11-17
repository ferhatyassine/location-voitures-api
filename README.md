# API de la location de voitures

API REST de gestion d'une agence de location de voitures : clients,vehicules, agences ,reservations et paiements.
Projet de session - Introduction à la programmation de serveurs Web

## Technologies

- Node.js et express
- Sequelize (ORM) et MySQL (XAMPP)
- express-validator, JWT, express-fileupload
- Postman pour les tests

## Diagrammes

- [Modele entite-association](docs/mcd.jpg)
- [Modele physique](docs/modele-physique.jpg)

## Installation

1. cloner le depot et installer les modules:

```
git clone https://github.com/ferhatyassine/location-voitures-api.git
cd location-voitures-api
npm install
```

2. demarrer MySQL dans XAMPP, puis creer une base vide 'location_voitures' dans phpMyAdmin (interclassement `utf8mb4_unicode_ci`).
3. copier `.env.example` en `.env`, puis adapter `DB_PASSWORD` et `DB_PORT` si besoin :

```
copy .env.example  .env
```

Définir également `JWT_SECRET` dans `.env` avec une valeur aléatoire d'au moins
32 caractères. Par exemple :

```
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

4. lancer le serveur

```
npm start
```

le terminal doit afficher "connexion a MySQL reussie" puis "le serveur tourne sur le port 5000"

## Authentification JWT

L'inscription `POST /api/users` et les lectures `GET` restent publiques.
Pour se connecter, envoyer le courriel et le mot de passe à
`POST /api/auth/login` :

```json
{
  "email": "client@example.com",
  "mdp": "votre-mot-de-passe"
}
```

La réponse contient un jeton Bearer valable une heure. Les autres écritures
requièrent l'en-tête `Authorization: Bearer <jeton>` : créations, modifications
et suppressions d'agences et de rôles, modifications et suppressions
d'utilisateurs, et attributions ou retraits de rôles. Pour l'inscription, le
mot de passe est stocké sous forme hachée.

## Photo de profil utilisateur

Pour créer ou modifier un utilisateur avec une photo, envoyer la requête vers
`POST /api/users` ou `PUT /api/users/:id` en `multipart/form-data`. Le fichier
doit être envoyé dans le champ `photo` (JPEG, PNG ou WebP, maximum 5 Mo).
Les autres champs de l'utilisateur, dont `mdp` lors de la création, restent
des champs du formulaire. L'API enregistre le chemin de la photo dans la
colonne `photo` et les fichiers sont accessibles sous `/uploads/users/...`.

## Pagination des listes

Les routes de liste `GET /api/users`, `GET /api/agences` et `GET /api/roles`
acceptent les paramètres de requête `page` et `limit`. Par défaut, l'API
retourne la première page de 10 éléments; `limit` doit être inférieur ou égal à 100.

Exemple : `GET /api/users?page=2&limit=5`

La réponse contient `data` et les métadonnées `pagination` (`page`, `limit`,
`total` et `totalPages`). Les paramètres invalides retournent une réponse HTTP
400.

## regle Git de l'equipe

- Ne jamais pousser directement sur `main`
- Message de commit : `feat`,`fix`,`docs`,`chore`.
