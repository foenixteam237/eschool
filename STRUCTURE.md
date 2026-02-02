# Structure eSchool - Guide de développement

## 📁 Architecture

### `/src/services/` - Couche métier
Services API centralisés pour chaque module du système. Chaque service encapsule la logique métier.

#### Services disponibles:
- **`auth.service.ts`** - Authentification et gestion des tokens
- **`students.service.ts`** - Gestion des élèves
- **`grades.service.ts`** - Gestion des notes
- **`attendance.service.ts`** - Gestion des présences
- **`payments.service.ts`** - Gestion des paiements
- **`classes.service.ts`** - Gestion des classes

### `/src/lib/` - Utilitaires et configuration

- **`api-client.ts`** - Client HTTP centralisé avec gestion des erreurs, retry automatique
- **`constants.ts`** - Constantes globales (routes API, énums)
- **`error-handler.ts`** - Gestion centralisée des erreurs avec toast notifications
- **`api-middleware.ts`** - Intercepteurs, logging, batch requests

### `/src/hooks/` - Hooks React personnalisés

- **`use-api-call.ts`** - Hook pour gérer les appels API (loading, error, data)
- **`use-fetch.ts`** - Hook simplifié pour GET requests
- **`use-async.ts`** - Hook pour les opérations async complexes
- **`use-auth-store.ts`** - Zustand store pour l'authentification

## 🚀 Utilisation

### 1. Appeler une API avec un service

```typescript
import { studentsService } from '@/services';

// Dans un composant
const handleFetchStudents = async () => {
  try {
    const students = await studentsService.getStudents(1, 20);
    console.log(students);
  } catch (error) {
    ErrorHandler.showErrorToast(error, 'Erreur lors du chargement des élèves');
  }
};
```

### 2. Utiliser le hook useApiCall

```typescript
import { useApiCall } from '@/hooks/use-api-call';
import { studentsService } from '@/services';

export function StudentsList() {
  const { data, loading, error, execute } = useApiCall();

  const fetchStudents = async () => {
    await execute(() => studentsService.getStudents());
  };

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>{data.length} élèves</p>}
      <button onClick={fetchStudents}>Charger</button>
    </div>
  );
}
```

### 3. Utiliser le hook useFetch

```typescript
import { useFetch } from '@/hooks/use-api-call';
import { studentsService } from '@/services';

export function StudentsList() {
  const { data, loading, error } = useFetch(
    () => studentsService.getStudents(),
    [] // dependencies
  );

  return (
    <div>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur</p>}
      {data && data.map(student => <div key={student.id}>{student.nom}</div>)}
    </div>
  );
}
```

## 🎨 Configuration Tailwind

### Couleurs disponibles:

```css
/* Primary */
primary-blue-50 à primary-blue-950

/* Success */
success-green-50 à success-green-950

/* Alert/Warning */
alert-orange-50 à alert-orange-950

/* Error */
error-red-50 à error-red-950

/* Info */
info-cyan-50 à info-cyan-950

/* Pending */
pending-purple-50 à pending-purple-950
```

### Animations:

```css
animate-fade-in
animate-slide-in-left
animate-slide-in-right
animate-slide-in-top
```

### Ombres:

```css
shadow-soft
shadow-base
shadow-md
shadow-lg
shadow-xl
```

## 📊 Gestion des erreurs

```typescript
import { ErrorHandler } from '@/lib/error-handler';

// Afficher une erreur
ErrorHandler.showErrorToast(error);

// Afficher un succès
ErrorHandler.showSuccessToast('Élève créé avec succès!');

// Afficher une info
ErrorHandler.showInfoToast('Information');

// Afficher un warning
ErrorHandler.showWarningToast('Attention!');

// Récupérer le message d'erreur
const message = ErrorHandler.handle(error, 'Message par défaut');
```

## 🔄 Retry automatique

Le client API effectue automatiquement des retry pour les erreurs 5xx et erreurs réseau.

Configuration:
- **RETRY_ATTEMPTS**: 3
- **RETRY_DELAY**: 1000ms (augmente exponentiellement)

## 🔐 Authentification

Les tokens sont automatiquement ajoutés à chaque requête:

```typescript
// Token stocké dans localStorage
const token = authService.getToken();

// Logout
authService.logout();

// Vérifier si authentifié
if (authService.isAuthenticated()) {
  // ...
}
```

## 📝 Ajouter un nouveau service

```typescript
// src/services/example.service.ts
import { apiClient } from '@/lib/api-client';
import { ROUTES } from '@/lib/constants';

class ExampleService {
  async getExamples(): Promise<Example[]> {
    return apiClient.get<Example[]>(ROUTES.EXAMPLES);
  }

  async createExample(data: CreateExampleRequest): Promise<Example> {
    return apiClient.post<Example>(ROUTES.EXAMPLES, data);
  }
}

export const exampleService = new ExampleService();
```

## 🛠️ Configuration variables d'environnement

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 📚 Références

- [Services Pattern](https://angular.io/guide/architecture-services)
- [API Client Best Practices](https://github.com/axios/axios)
- [React Hooks](https://react.dev/reference/react/hooks)
- [Tailwind CSS](https://tailwindcss.com)
- [React Toastify](https://fkhadra.github.io/react-toastify)

---

**Prochaine étape**: Créer les API routes dans `/src/app/api/`
