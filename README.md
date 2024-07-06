# Frienddly Backend avec AdonisJS et PostgreSQL
![Version](https://img.shields.io/badge/version-1.0.0-blue)

Backend de l'application Frienddly développé avec AdonisJS et utilisant PostgreSQL comme base de données.

## Fonctionnalités

Ce backend fournit une API pour gérer les données nécessaires à l'application mobile Frienddly, y compris les utilisateurs, les lieux, les événements et les messages.

## Technologies Utilisées

- **AdonisJS**: Framework Node.js pour le développement d'applications web robustes et évolutives.
  
- **PostgreSQL**: Système de gestion de base de données relationnelle pour stocker les données de l'application.

## Prérequis

Assurez-vous d'avoir installé Node.js, npm et PostgreSQL sur votre machine.

## Installation

Pour lancer le backend de Frienddly localement, suivez ces étapes :

1. Clonez le dépôt :

```bash
git clone https://github.com/ton_nom_utilisateur/frienddly-backend.git
cd frienddly-backend
```

2. Installez les dépendances :

```bash
npm install 
```

3. Lancez le serveur de développement :

```bash
npm run dev
```

4. Configurez les variables d'environnement :

```bash
DB_CONNECTION=pg
DB_HOST=your_db_host
DB_PORT=your_db_port
DB_USER=your_db_user
DB_PASSWORD=your_db_password
DB_DATABASE=frienddly
```
