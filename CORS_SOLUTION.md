# Résolution du Problème CORS - Architecture API

## ❌ Problème Initial
L'erreur `TypeError: Failed to fetch` survient lorsque le frontend (port 3001) essaie d'appeler directement le backend (port 3500). C'est un problème **CORS (Cross-Origin Resource Sharing)** car:

- **Frontend**: http://localhost:3001
- **Backend**: http://localhost:3500

Les navigateurs modernes bloquent les requêtes cross-origin pour des raisons de sécurité.

## ✅ Solution Implémentée: API Routes Next.js

Au lieu d'appeler directement le backend depuis le navigateur, nous utilisons les **API Routes Next.js** comme proxy:

```
Client Browser (http://localhost:3001)
         ↓
   API Routes (http://localhost:3001/api/auth/*)
         ↓
   Backend NestJS (http://localhost:3500/v1/api/auth/*)
```

### Avantages:
1. **Pas de CORS** - Les appels API restent sur le même domaine
2. **Sécurité améliorée** - Le token JWT n'est pas exposé au navigateur en première instance
3. **Flexibilité** - Possibilité d'ajouter de la logique côté serveur
4. **Meilleure gestion d'erreurs** - Centralisée dans les routes API

## 📁 Structure des Routes API

```
src/app/api/auth/
├── login/route.ts        → POST /api/auth/login
├── logout/route.ts       → POST /api/auth/logout
├── register/route.ts     → POST /api/auth/register
├── profile/route.ts      → GET /api/auth/profile
└── refresh/route.ts      → POST /api/auth/refresh
```

## 🔄 Flow d'Authentification

### 1. Login
```
Client: POST /api/auth/login { email, password }
   ↓
API Route: Reçoit la requête
   ↓
API Route: Forwarder vers backend: POST http://localhost:3500/v1/api/auth/login
   ↓
Backend: Valide et retourne { access_token, user, ... }
   ↓
API Route: Retourne la réponse au client
   ↓
Client: Stocke le token dans localStorage
```

### 2. Requêtes Authentifiées (Profile, Logout, etc.)
```
Client: GET /api/auth/profile
Header: Authorization: Bearer <token>
   ↓
API Route: Reçoit le token du header
   ↓
API Route: Forwarder vers backend avec le token
   ↓
Backend: Valide le token et traite la requête
   ↓
Réponse retournée au client
```

## 🛡️ Points Importants

### Token Storage
- Le token est stocké dans `localStorage` avec la clé `eschool_token`
- À chaque requête authentifiée, le token est envoyé dans le header `Authorization: Bearer <token>`

### Header Forwarding
Les routes API Next.js extraient et forward les headers importants:
```typescript
'Authorization': token,
'Content-Type': 'application/json',
'Accept': 'application/json'
```

### Gestion d'Erreurs
Chaque route API capture les erreurs et les retourne au client:
```json
{
  "message": "Error description",
  "error": "ERROR_CODE"
}
```

## 🔧 Configuration

### Variables d'Environnement (.env.local)
```
NEXT_PUBLIC_API_URL=http://localhost:3500/v1/api
NEXT_PUBLIC_JWT_STORAGE_KEY=eschool_token
```

### Service d'Authentification (mis à jour)
Le service utilise maintenant les routes locales:
```typescript
const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL;  // URL du vrai backend
const API_URL = '/api/auth';  // Routes locales Next.js
```

## 📊 Endpoints Disponibles

| Méthode | Route Locale | Backend | Description |
|---------|--------------|---------|-------------|
| POST | `/api/auth/login` | `/auth/login` | Connexion |
| POST | `/api/auth/logout` | `/auth/logout` | Déconnexion |
| POST | `/api/auth/register` | `/auth/register` | Inscription |
| GET | `/api/auth/profile` | `/auth/profile` | Profil utilisateur |
| POST | `/api/auth/refresh` | `/auth/refresh` | Rafraîchir token |

## 🚀 Déploiement

Cette architecture fonctionne aussi en production:
- En développement: Routes API sur localhost:3001
- En production: Routes API sur le même domaine que le frontend (pas de CORS)
- Le backend peut être sur un domaine/serveur différent sans problème CORS

## 🔐 Sécurité

### Points positifs:
✅ Token ne traverse pas le navigateur directement
✅ Le backend est caché du client
✅ Possibilité d'ajouter du rate limiting dans les routes API
✅ Validation supplémentaire possible côté serveur

### À considérer:
⚠️ Implémenter HTTPS en production
⚠️ Ajouter le rate limiting sur les routes API
⚠️ Sécuriser les secrets backend
