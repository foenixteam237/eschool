# 🚀 Quick Start - eSchool

## Installation rapide

```bash
# 1. Cloner/accéder au projet
cd /home/ramseys/Documents/DEV/web/eschool

# 2. Installer les dépendances (si pas déjà fait)
npm install

# 3. Copier les variables d'environnement
cp .env.example .env.local

# 4. Lancer le serveur dev
npm run dev
```

L'app sera disponible à: **http://localhost:3000**

---

## Utiliser les services - 3 exemples simples

### 1️⃣ Charger des élèves

```typescript
import { studentsService } from "@/services"

// Dans un composant React
async function loadStudents() {
  try {
    const result = await studentsService.getStudents(1, 20)
    console.log(`${result.total} élèves trouvés`)
  } catch (error) {
    console.error(error)
  }
}
```

### 2️⃣ Créer un élève

```typescript
import { studentsService } from "@/services"
import { ErrorHandler } from "@/lib/error-handler"

async function createStudent() {
  try {
    const student = await studentsService.createStudent({
      email: "nouveau@example.com",
      password: "password123",
      nom: "Dupont",
      prenom: "Jean",
      genre: "M",
      classeId: "class-1"
    })
    
    ErrorHandler.showSuccessToast("Élève créé!")
    return student
  } catch (error) {
    ErrorHandler.showErrorToast(error)
  }
}
```

### 3️⃣ Utiliser le hook useApiCall

```typescript
import { useApiCall } from "@/hooks/use-api-call"
import { studentsService } from "@/services"

export default function MyComponent() {
  const { data, loading, error, execute } = useApiCall()

  const handleLoad = async () => {
    await execute(() => studentsService.getStudents())
  }

  return (
    <div>
      <button onClick={handleLoad}>Charger</button>
      {loading && <p>Chargement...</p>}
      {error && <p>Erreur: {error.message}</p>}
      {data && <p>{data.data.length} élèves</p>}
    </div>
  )
}
```

---

## Fichiers importants à connaître

| Fichier | Utilité |
|---------|---------|
| `src/lib/api-client.ts` | Client HTTP centralisé |
| `src/lib/constants.ts` | Routes et énumérations |
| `src/services/` | Services métier (6 services) |
| `src/hooks/use-api-call.ts` | Hooks pour appels API |
| `src/lib/error-handler.ts` | Gestion des erreurs |
| `src/types/index.ts` | Types TypeScript |
| `tailwind.config.ts` | Configuration Tailwind |
| `STRUCTURE.md` | Documentation architecture |
| `INTEGRATION_GUIDE.md` | Guide d'intégration |

---

## Services disponibles

### 1. Authentication
```typescript
import { authService } from "@/services"

authService.login({ email, password })
authService.register({ email, password, nom, prenom, role })
authService.logout()
authService.refreshToken()
authService.getToken()
authService.isAuthenticated()
```

### 2. Students
```typescript
import { studentsService } from "@/services"

studentsService.getStudents(page, limit, search)
studentsService.getStudent(id)
studentsService.createStudent(data)
studentsService.updateStudent(id, data)
studentsService.deleteStudent(id)
```

### 3. Grades
```typescript
import { gradesService } from "@/services"

gradesService.getGrades(page, limit)
gradesService.getGradesByStudent(studentId)
gradesService.createGrade(data)
gradesService.getGradeStats(studentId)
```

### 4. Attendance
```typescript
import { attendanceService } from "@/services"

attendanceService.getAttendance()
attendanceService.getAttendanceByStudent(studentId)
attendanceService.createAttendance(data)
attendanceService.getAttendanceStats()
```

### 5. Payments
```typescript
import { paymentsService } from "@/services"

paymentsService.getPayments()
paymentsService.getPaymentsByStudent(studentId)
paymentsService.createPayment(data)
paymentsService.generateInvoice(paymentId)
```

### 6. Classes
```typescript
import { classesService } from "@/services"

classesService.getClasses()
classesService.getClass(id)
classesService.createClass(data)
classesService.addStudentToClass(classId, studentId)
```

---

## Gestion des erreurs

```typescript
import { ErrorHandler } from "@/lib/error-handler"

// Afficher une erreur
ErrorHandler.showErrorToast(error)

// Afficher un succès
ErrorHandler.showSuccessToast("Succès!")

// Afficher une info
ErrorHandler.showInfoToast("Information")

// Afficher un warning
ErrorHandler.showWarningToast("Attention!")

// Récupérer le message
const message = ErrorHandler.handle(error, "Message par défaut")
```

---

## Constantes à utiliser

```typescript
import { USER_ROLES, GRADE_TYPES, ATTENDANCE_STATUS, PAYMENT_STATUS } from "@/lib/constants"

// Rôles
USER_ROLES.ADMIN
USER_ROLES.ENSEIGNANT
USER_ROLES.PARENT
USER_ROLES.ELEVE

// Types de notes
GRADE_TYPES.DEVOIR
GRADE_TYPES.CONTROLE
GRADE_TYPES.COMPOSITION
GRADE_TYPES.TRIMESTRE

// Statuts présence
ATTENDANCE_STATUS.PRESENT
ATTENDANCE_STATUS.ABSENT
ATTENDANCE_STATUS.RETARD
ATTENDANCE_STATUS.JUSTIFIE

// Statuts paiement
PAYMENT_STATUS.PAYE
PAYMENT_STATUS.EN_ATTENTE
PAYMENT_STATUS.PARTIEL
```

---

## Couleurs Tailwind disponibles

```html
<!-- Primary Blue -->
<div class="text-primary-blue-600 bg-primary-blue-50"></div>

<!-- Success Green -->
<div class="text-success-green-600 bg-success-green-50"></div>

<!-- Alert Orange -->
<div class="text-alert-orange-600 bg-alert-orange-50"></div>

<!-- Error Red -->
<div class="text-error-red-600 bg-error-red-50"></div>

<!-- Info Cyan -->
<div class="text-info-cyan-600 bg-info-cyan-50"></div>

<!-- Pending Purple -->
<div class="text-pending-purple-600 bg-pending-purple-50"></div>
```

---

## Animations Tailwind

```html
<div class="animate-fade-in">Fade in</div>
<div class="animate-slide-in-left">Slide left</div>
<div class="animate-slide-in-right">Slide right</div>
<div class="animate-slide-in-top">Slide top</div>
```

---

## Développement

```bash
# Lancer en dev
npm run dev

# Vérifier les erreurs
npm run lint

# Builder pour production
npm run build

# Lancer la build prod
npm start
```

---

## Ressources

- 📖 [STRUCTURE.md](./STRUCTURE.md) - Architecture complète
- 📚 [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) - Guide d'intégration
- 📋 [CHANGELOG.md](./CHANGELOG.md) - Historique modifications
- ✅ [CHECKLIST.md](./CHECKLIST.md) - Checklist complète
- 💡 [EXAMPLE_PAGE.tsx](./src/app/admin/students/EXAMPLE_PAGE.tsx) - Exemple complet

---

## ⚠️ À retenir

1. **Toujours utiliser les services** - Ne pas faire de fetch direct
2. **Utiliser ErrorHandler** - Pour les messages d'erreur
3. **Utiliser useApiCall** - Pour les appels dans les composants
4. **TypeScript strict** - Toujours typer les variables
5. **Variables d'env** - Utiliser NEXT_PUBLIC_ pour le client

---

## 🎯 Prochaines étapes

1. Consultez [INTEGRATION_GUIDE.md](./INTEGRATION_GUIDE.md) pour des exemples détaillés
2. Voyez [EXAMPLE_PAGE.tsx](./src/app/admin/students/EXAMPLE_PAGE.tsx) pour une page complète
3. Commencez à adapter les pages existantes

---

**Besoin d'aide?** Consultez les fichiers de documentation ou regardez le code d'exemple.

Bon développement! 🚀
