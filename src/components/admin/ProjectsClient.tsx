"use client";

import { useState, useTransition } from "react";
import { Pencil, Trash2, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { deleteProjectAction } from "@/app/actions/admin";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface ProjectsClientProps {
  projects: any[];
}

export function ProjectsClient({ projects: initialProjects }: ProjectsClientProps) {
  const [showCreate, setShowCreate] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (id: number) => {
    startTransition(async () => {
      await deleteProjectAction(id);
    });
  };

  return (
    <div className="space-y-6">
      {/* Create form */}
      {showCreate ? (
        <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-slate-950">New Project</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowCreate(false)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <ProjectForm onSuccess={() => setShowCreate(false)} onCancel={() => setShowCreate(false)} />
        </div>
      ) : (
        <Button
          className="rounded-full bg-slate-950 text-white hover:bg-slate-800 gap-2"
          onClick={() => setShowCreate(true)}
        >
          <Plus className="h-4 w-4" /> New Project
        </Button>
      )}

      {/* Project list */}
      {initialProjects.length === 0 ? (
        <div className="rounded-xl border border-dashed border-gray-200 bg-white py-20 text-center text-gray-400">
          No projects yet. Create your first project above.
        </div>
      ) : (
        <div className="space-y-4">
          {initialProjects.map((project) => (
            <div key={project.id} className="rounded-[24px] border border-slate-200 bg-white p-5 shadow-sm">
              {editingId === project.id ? (
                <>
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="font-semibold text-slate-950">Edit Project</h3>
                    <Button variant="ghost" size="sm" onClick={() => setEditingId(null)}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                  <ProjectForm
                    project={project}
                    onSuccess={() => setEditingId(null)}
                    onCancel={() => setEditingId(null)}
                  />
                </>
              ) : (
                <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                  <div className="flex gap-4">
                    {project.image_url && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={project.image_url}
                        alt={project.name}
                        className="h-16 w-24 shrink-0 rounded-xl object-cover"
                      />
                    )}
                    <div>
                      <div className="font-semibold text-slate-950">{project.name}</div>
                      {project.developer && (
                        <div className="text-sm text-slate-500">by {project.developer}</div>
                      )}
                      <div className="text-sm text-slate-500">
                        {project.city}{project.locality ? ` · ${project.locality}` : ""}
                      </div>
                      {project.description && (
                        <div className="mt-1 text-xs text-slate-400 line-clamp-2">{project.description}</div>
                      )}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-2">
                    <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      project.status === "published"
                        ? "bg-green-100 text-green-700"
                        : "bg-gray-100 text-gray-600"
                    }`}>
                      {project.status}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      className="rounded-full"
                      onClick={() => setEditingId(project.id)}
                    >
                      <Pencil className="h-3.5 w-3.5" />
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="outline" size="sm" className="rounded-full text-red-600 border-red-200 hover:bg-red-50">
                          <Trash2 className="h-3.5 w-3.5" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete "{project.name}"?</AlertDialogTitle>
                          <AlertDialogDescription>
                            This project will be permanently deleted and removed from the public site.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            className="bg-red-600 hover:bg-red-700"
                            onClick={() => handleDelete(project.id)}
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
