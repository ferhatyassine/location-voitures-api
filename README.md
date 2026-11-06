# API de la location de voitures

API REST de gestion d'une agence de location de voitures : clients,vehicules, agences ,reservations et paiements.
Projet de session - Introduction à la programmation de serveurs Web

## Technologies

- Node.js et express
- Sequelize (ORM) et MySQL (XAMPP)
- express-validator, JWT, Multer
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

4. lancer le serveur

```
npm start
```

le terminal doit afficher "connexion a MySQL reussie" puis "le serveur tourne sur le port 5000"

## regle Git de l'equipe

- Ne jamais pousser directement sur `main`
- Message de commit : `feat`,`fix`,`docs`,`chore`.
