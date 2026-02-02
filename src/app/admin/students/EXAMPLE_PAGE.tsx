/**
 * Exemple d'utilisation - Page des élèves
 * À adapter et utiliser comme base pour les autres pages
 */

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Plus, Search, Download, Eye, Edit, Trash2, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { studentsService, StudentsListResponse } from "@/services";
import { ErrorHandler } from "@/lib/error-handler";
import { useApiCall } from "@/hooks/use-api-call";

export default function ExampleStudentsPage() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [students, setStudents] = useState<StudentsListResponse | null>(null);
  
  const { loading, error, execute } = useApiCall<StudentsListResponse>();

  // Charger les élèves au montage et quand la page change
  useEffect(() => {
    loadStudents();
  }, [currentPage]);

  const loadStudents = async () => {
    try {
      const result = await execute(() =>
        studentsService.getStudents(currentPage, 20, searchTerm || undefined)
      );
      setStudents(result);
    } catch (err) {
      ErrorHandler.showErrorToast(err, "Erreur lors du chargement des élèves");
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
    loadStudents();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Êtes-vous sûr de vouloir supprimer cet élève?")) return;

    try {
      await studentsService.deleteStudent(id);
      ErrorHandler.showSuccessToast("Élève supprimé avec succès");
      loadStudents();
    } catch (err) {
      ErrorHandler.showErrorToast(err);
    }
  };

  const handleExport = async () => {
    try {
      // À implémenter: export CSV/PDF
      ErrorHandler.showInfoToast("Export en cours...");
    } catch (err) {
      ErrorHandler.showErrorToast(err);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500 pb-12">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Gestion des Élèves</h1>
          <p className="text-slate-500 mt-1">
            Gérez tous les élèves de votre établissement
          </p>
        </div>

        <div className="flex gap-2">
          <Button onClick={handleExport} variant="outline" className="gap-2">
            <Download size={18} />
            Exporter
          </Button>
          <Button onClick={() => router.push("/admin/students/new")} className="gap-2">
            <Plus size={18} />
            Ajouter
          </Button>
        </div>
      </div>

      {/* Search & Filter */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex gap-2">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
              <Input
                placeholder="Rechercher par nom ou email..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button onClick={handleSearch}>Rechercher</Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading State */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <Loader2 className="animate-spin text-primary-blue" size={32} />
        </div>
      )}

      {/* Error State */}
      {error && (
        <div className="bg-error-red-50 border border-error-red-200 rounded-lg p-4 text-error-red-800">
          <p>Erreur: {error.message}</p>
        </div>
      )}

      {/* Students Table */}
      {!loading && students && students.data.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Liste des élèves ({students.total})</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Nom</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Email</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Classe</th>
                    <th className="text-left py-3 px-4 font-semibold text-slate-600">Statut</th>
                    <th className="text-right py-3 px-4 font-semibold text-slate-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {students.data.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b border-slate-100 hover:bg-slate-50 transition-colors"
                    >
                      <td className="py-3 px-4 font-medium text-slate-900">
                        {student.prenom} {student.nom}
                      </td>
                      <td className="py-3 px-4 text-slate-600">{student.email}</td>
                      <td className="py-3 px-4 text-slate-600">{student.classeId || "-"}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold ${
                            student.estActif
                              ? "bg-success-green-50 text-success-green-700"
                              : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {student.estActif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex gap-2 justify-end">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/students/${student.id}`)}
                          >
                            <Eye size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => router.push(`/admin/students/${student.id}/edit`)}
                          >
                            <Edit size={16} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(student.id)}
                            className="text-error-red-600 hover:bg-error-red-50"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-6 pt-4 border-t border-slate-200">
              <p className="text-sm text-slate-600">
                Page {students.page} sur {Math.ceil(students.total / students.limit)}
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                  disabled={currentPage === 1}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  onClick={() =>
                    setCurrentPage(
                      Math.min(Math.ceil(students.total / students.limit), currentPage + 1)
                    )
                  }
                  disabled={currentPage === Math.ceil(students.total / students.limit)}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Empty State */}
      {!loading && students && students.data.length === 0 && (
        <Card>
          <CardContent className="py-12">
            <div className="text-center">
              <p className="text-slate-500 mb-4">Aucun élève trouvé</p>
              <Button onClick={() => router.push("/admin/students/new")}>
                <Plus size={18} className="mr-2" />
                Créer un nouvel élève
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

/**
 * Utilisation:
 * 
 * 1. Les données sont chargées automatiquement au montage
 * 2. La pagination gère le changement de page
 * 3. La recherche filtre les élèves
 * 4. Les erreurs sont affichées avec un toast
 * 5. Le loading state montre un spinner
 * 
 * À adapter pour d'autres ressources en changeant le service
 */
