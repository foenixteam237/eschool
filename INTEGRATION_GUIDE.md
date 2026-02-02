# 🚀 Guide d'intégration des Services

## Étape 1: Initialiser l'environnement

```bash
# Copier le fichier .env.example
cp .env.example .env.local

# Éditer avec votre configuration
nano .env.local
```

```env
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## Étape 2: Utiliser un service dans une page

### Exemple simple - Charger des élèves

```typescript
"use client";

import { useEffect, useState } from "react";
import { studentsService } from "@/services";
import { Student } from "@/types";
import { ErrorHandler } from "@/lib/error-handler";

export default function StudentPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudents();
  }, []);

  const loadStudents = async () => {
    try {
      setLoading(true);
      const data = await studentsService.getStudents(1, 20);
      setStudents(data.data);
    } catch (error) {
      ErrorHandler.showErrorToast(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <div>Chargement...</div>;

  return (
    <div>
      {students.map(student => (
        <div key={student.id}>{student.prenom} {student.nom}</div>
      ))}
    </div>
  );
}
```

### Avec le hook useApiCall (recommandé)

```typescript
"use client";

import { useEffect } from "react";
import { studentsService } from "@/services";
import { useApiCall } from "@/hooks/use-api-call";
import { ErrorHandler } from "@/lib/error-handler";

export default function StudentPage() {
  const { data, loading, error, execute } = useApiCall();

  useEffect(() => {
    const loadStudents = async () => {
      try {
        await execute(() => studentsService.getStudents(1, 20));
      } catch (err) {
        ErrorHandler.showErrorToast(err);
      }
    };

    loadStudents();
  }, [execute]);

  if (loading) return <div>Chargement...</div>;
  if (error) return <div>Erreur: {error.message}</div>;
  if (!data) return <div>Pas de données</div>;

  return (
    <div>
      {data.data.map(student => (
        <div key={student.id}>{student.prenom} {student.nom}</div>
      ))}
    </div>
  );
}
```

## Étape 3: Créer une nouvelle action

### Créer un élève

```typescript
import { studentsService } from "@/services";
import { ErrorHandler } from "@/lib/error-handler";

async function createStudent() {
  try {
    const newStudent = await studentsService.createStudent({
      email: "etudiant@example.com",
      password: "password123",
      nom: "Dupont",
      prenom: "Jean",
      dateNaissance: "2008-05-15",
      genre: "M",
      classeId: "class-123"
    });

    ErrorHandler.showSuccessToast("Élève créé avec succès!");
    return newStudent;
  } catch (error) {
    ErrorHandler.showErrorToast(error);
  }
}
```

### Mettre à jour un élève

```typescript
async function updateStudent(id: string) {
  try {
    const updated = await studentsService.updateStudent(id, {
      nom: "Martin",
      classeId: "class-456"
    });

    ErrorHandler.showSuccessToast("Élève modifié!");
    return updated;
  } catch (error) {
    ErrorHandler.showErrorToast(error);
  }
}
```

### Supprimer un élève

```typescript
async function deleteStudent(id: string) {
  if (!confirm("Êtes-vous sûr?")) return;

  try {
    await studentsService.deleteStudent(id);
    ErrorHandler.showSuccessToast("Élève supprimé!");
  } catch (error) {
    ErrorHandler.showErrorToast(error);
  }
}
```

## Étape 4: Gestion des erreurs

### Types d'erreurs gérant automatiquement

```typescript
// Les erreurs suivantes sont traduites automatiquement:
// 400 - Données invalides
// 401 - Authentification requise
// 403 - Accès refusé
// 404 - Ressource non trouvée
// 409 - Ressource existe déjà
// 422 - Données invalides
// 429 - Trop de requêtes
// 500 - Erreur serveur

import { ErrorHandler } from "@/lib/error-handler";

try {
  // Votre code
} catch (error) {
  // Affiche le message d'erreur avec traduction
  ErrorHandler.showErrorToast(error);
  
  // Ou récupérer le message
  const message = ErrorHandler.handle(error);
  console.log(message);
}
```

## Étape 5: Travailler avec la pagination

```typescript
import { PAGINATION } from "@/lib/constants";
import { studentsService } from "@/services";

const [page, setPage] = useState(PAGINATION.DEFAULT_PAGE);
const [limit] = useState(PAGINATION.DEFAULT_LIMIT);

const loadStudents = async () => {
  const response = await studentsService.getStudents(page, limit);
  
  console.log(`Page ${response.page}/${Math.ceil(response.total / response.limit)}`);
  console.log(`Total: ${response.total} élèves`);
};

// Aller à la page suivante
const nextPage = () => {
  if (page < Math.ceil(response.total / limit)) {
    setPage(page + 1);
  }
};
```

## Étape 6: Recherche et filtrage

```typescript
const [search, setSearch] = useState("");

const handleSearch = async () => {
  const results = await studentsService.getStudents(1, 20, search);
  setStudents(results.data);
};

// Ou par classe
const handleFilterByClass = async (classId: string) => {
  const results = await studentsService.getStudentsByClass(classId);
  setStudents(results);
};
```

## Étape 7: Utiliser les statistiques

```typescript
import { gradesService } from "@/services";

async function displayGradeStats(studentId: string) {
  try {
    const stats = await gradesService.getGradeStats(
      studentId,
      undefined,
      undefined
    );

    console.log(`Moyenne: ${stats.moyenne}/20`);
    console.log(`Min: ${stats.min}, Max: ${stats.max}`);
  } catch (error) {
    ErrorHandler.showErrorToast(error);
  }
}
```

## Étape 8: Authentification

```typescript
import { authService } from "@/services";
import { useRouter } from "next/navigation";

async function handleLogin(email: string, password: string) {
  try {
    const response = await authService.login({ email, password });
    
    // Token est automatiquement sauvegardé
    console.log("Utilisateur connecté:", response.user);
    
    // Rediriger selon le rôle
    router.push(`/${response.user.role.toLowerCase()}/dashboard`);
  } catch (error) {
    ErrorHandler.showErrorToast(error, "Identifiants invalides");
  }
}

async function handleLogout() {
  await authService.logout();
  router.push("/login");
}
```

## Étape 9: Batch operations

```typescript
import { gradesService } from "@/services";

async function uploadMultipleGrades(grades: CreateGradeRequest[]) {
  try {
    const results = await gradesService.bulkCreateGrades(grades);
    ErrorHandler.showSuccessToast(`${results.length} notes créées!`);
  } catch (error) {
    ErrorHandler.showErrorToast(error);
  }
}
```

## Checklist - Avant de créer une page

- ✅ Importer le service nécessaire
- ✅ Utiliser useApiCall ou useFetch hook
- ✅ Gérer les états: loading, error, data
- ✅ Afficher les erreurs avec ErrorHandler
- ✅ Implémenter la pagination si nécessaire
- ✅ Ajouter validation des entrées utilisateur
- ✅ Tester avec le mock data

## Services disponibles

| Service | Méthodes principales |
|---------|----------------------|
| **authService** | login, register, logout, refreshToken |
| **studentsService** | getStudents, getStudent, createStudent, updateStudent, deleteStudent |
| **gradesService** | getGrades, getGradesByStudent, createGrade, updateGrade, deleteGrade |
| **attendanceService** | getAttendance, getAttendanceByStudent, createAttendance, updateAttendance |
| **paymentsService** | getPayments, getPaymentsByStudent, createPayment, updatePayment |
| **classesService** | getClasses, getClass, createClass, updateClass, deleteClass |

---

Pour plus de détails, consultez [STRUCTURE.md](./STRUCTURE.md) et [CHANGELOG.md](./CHANGELOG.md)
