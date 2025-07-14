# Image Node.js "alpine" (minimal) de base
FROM node:24-alpine3.21 AS base
# Placement dans le dossier de l'application
WORKDIR /app
# Copie du code dans le dossier
COPY . .

# Image secondaire depuis l'image de base pour l'environnement de dev
FROM base AS development
# Téléchargement des dépendances Node
RUN npm i
# Port 5173 ouvert
EXPOSE 5173
# Lancement du profil de developpement avec Vite (hot reload)
CMD ["npm", "run", "dev"]

# Image secondaire depuis l'image de base pour l'environnement de prod
FROM development as production
#FROM base AS production
# Téléchargement d'un serveur web statique pour lancer notre site
#RUN npm i -g http-server
# Téléchargement des dépendances Node uniquement pour la production
#RUN npm i # --only=production Étrangement, les dépendances de dev sont nécessaire pour la prod...
# Compilation des fichiers source du site
#RUN npm run build
# On ne log uniquement les erreurs dans la console
ENV LOG_LEVEL=error
# Port 8080 ouvert
#EXPOSE 8080
# On lance le serveur web statique sans Vite (donc sans hot reload)
#CMD ["http-server", "dist"]