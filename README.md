# TRÔVE — App Brocante 

<p align="center">
  <img src="images/trove.png" alt="Logo TRÔVE" width="180">
</p>
Prototype d’application mobile “TRÔVE” réalisé en **HTML / CSS / JavaScript** avec une **carte Leaflet** pour afficher des brocantes et un mode “amis” (avatars).  
Le projet est pensé pour être ouvert dans un navigateur (format mobile).

---

## Liens
- **Figma (prototype, components, design system, wireframes)** : [lien](https://www.figma.com/design/M1pyMKRS4EGjv9De36gdmd/Tr%C5%8Dve---Project?node-id=90-131&t=Wk1eS1qAnvduhG9d-1)
- **Dossier du projet** : [lien pas encore](https://www.figma.com/slides/MwMuCk0kAWRLPNET6nK3cM/Tr%C5%8Dve---Dossier?node-id=71-4684&t=e0NbW5AwTfgbQJU5-0)
- **Présentation** : [lien](https://www.figma.com/slides/71CIiOKnciPfwmV7Y3N7a3/Tr%C5%8Dve---Pr%C3%A9sentation?node-id=1-122&t=9xvWWhVMM3egVPt5-0)

---

## Sommaire
- [TRÔVE — App Brocante](#trôve--app-brocante)
  - [Liens](#liens)
  - [Sommaire](#sommaire)
  - [Fonctionnalités](#fonctionnalités)
  - [Langages \& outils](#langages--outils)
  - [Pages](#pages)
  - [Données (brocantes / amis)](#données-brocantes--amis)
    - [Brocantes (ex : `data/localisation.json`)](#brocantes-ex--datalocalisationjson)

---

## Fonctionnalités
- **Onboarding** (écrans d’introduction)
- **Connexion** 
- **Carte interactive Leaflet**
  - affichage de **points “brocantes”**
  - bascule “brocantes ↔ amis” via un bouton 
  - ouverture d’une **fiche détail** au clic sur un point
- **Recherche + filtre** 
- **Popup autorisation localisation** 
- **Flux** (posts de la brocante)
- **Forum / Annonces**, **Messages**, **Agenda**, **Profil**, **Réglages**
- **Navbar**

---

## Langages & outils
- **HTML / CSS / JavaScript**
- **Leaflet** (carte)

---

## Pages
- `index.html` : page d’accueil / onboarding / entrée app 
- `map.html` : carte Leaflet + points + recherche + bascule brocantes/amis
- `profil.html` : profil utilisateur + trouvailles + catégories
- `messages.html` : liste des messages
- `messages_lea.html` : conversation (exemple)
- `annonces.html` : forum / annonces
- `agenda.html` : liste/agenda des événements
- `reglages.html` : paramètres

---

## Données (brocantes / amis)

### Brocantes (ex : `data/localisation.json`)
Le plus simple : **1 objet = 1 brocante**, avec tout ce qu’il faut pour la fiche.

Exemple de structure (à adapter à ton code) :

```json
[
  {
    "id": "broc_001",
    "nom": "Marché aux Puces de Saint-Ouen",
    "lieu": "Saint-Ouen",
    "date": "Tous les samedis",
    "description": "Texte descriptif…",
    "tags": ["permanente", "puces", "vintage"],
    "coords": [48.9021, 2.3443],
    "live": true,
    "markerImage": "./images/broc1.png",
    "presentationImage": "./images/presentation1.png"
  }
]
