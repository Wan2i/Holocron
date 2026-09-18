import { useEffect, useState } from "react";
import { getSubjects, deleteSubject } from "../services/subject";
import { getTask, deleteTask } from "../services/task";
import { deleteNotes, getNotes } from "../services/notes";
import type { Subject } from "../types/subject";
import type { Task } from "../types/task";
import type { Notes } from "../types/notes";
import { Plus, Trash } from "lucide-react";
import AddSubjectModal from "../components/AddSubjectModal";
import ConfirmDialog from "../components/ConfirmDialog";

function getInitials(code: string): string {
    return code.slice(0, 2).toUpperCase();
}

export default function Subjects() {
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [tasks, setTasks] = useState<Task[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [subjectToDelete, setSubjectToDelete] = useState<Subject | null>(null);
    const [notes, setNotes] = useState<Notes[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const [subjectData, taskData, noteData] = await Promise.all([
                    getSubjects(), getTask(), getNotes(),
                ]);
                setSubjects(subjectData);
                setTasks(taskData);
                setNotes(noteData);
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    async function confirmDelete() {
        if (!subjectToDelete) return;
        try {
            const tasksToDelete = tasks.filter((t) => t.s_id === subjectToDelete.s_id);
            const notesToDelete = notes.filter((n) => n.s_id === subjectToDelete.s_id);

            await Promise.all([
                ...tasksToDelete.map((t) => deleteTask(t.t_id)),
                ...notesToDelete.map((n) => deleteNotes(n.n_id)),
            ]);

            await deleteSubject(subjectToDelete.s_id);

            setTasks((prev) => prev.filter((t) => t.s_id !== subjectToDelete.s_id));
            setNotes((prev) => prev.filter((n) => n.s_id !== subjectToDelete.s_id));
            setSubjects((prev) => prev.filter((s) => s.s_id !== subjectToDelete.s_id));
        } catch (err) {
            setError(String(err));
        } finally {
            setSubjectToDelete(null);
        }
    }

    function getDeleteMessage(subject: Subject, taskCount: number, noteCount: number): string {
        const parts: string[] = [];
        if (taskCount > 0) parts.push(`${taskCount} task${taskCount === 1 ? "" : "s"}`);
        if (noteCount > 0) parts.push(`${noteCount} note${noteCount === 1 ? "" : "s"}`);

        const base = `Delete ${subject.code} — ${subject.name}?`;

        if (parts.length === 0) return `${base} This can't be undone.`;
        return `${base} This subject has ${parts.join(" and ")}. This can't be undone.`;
    }

    const noteCountBySubject = new Map<number, number>();
    for (const note of notes) {
        noteCountBySubject.set(note.s_id, (noteCountBySubject.get(note.s_id) ?? 0) + 1);
    }

    if (loading) return <p className="p-8 text-sm text-gray-400">Loading…</p>;
    if (error) return <p className="p-8 text-sm text-red-400">Couldn't load subjects: {error}</p>;


    const taskCountBySubject = new Map<number, number>();
    for (const task of tasks) {
        if (task.completed === 0) {
            taskCountBySubject.set(task.s_id, (taskCountBySubject.get(task.s_id) ?? 0) + 1);
        }
    }

    const totalTaskCountBySubject = new Map<number, number>();
    for (const task of tasks) {
        totalTaskCountBySubject.set(task.s_id, (totalTaskCountBySubject.get(task.s_id) ?? 0) + 1);
    }



    return (
        <main className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Subjects</h1>
                    <p className="text-sm text-gray-400">{subjects.length} subjects</p>
                </div>
                <button className="addButton" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add subject
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                {subjects.map((subject) => (
                    <div
                        key={subject.s_id}
                        className="flex items-center justify-between rounded-lg bg-gray-900 border border-gray-800 p-4"
                    >
                        <div className="flex items-center gap-3">
                            <div
                                className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold"
                                style={{ backgroundColor: subject.color }}
                            >
                                {getInitials(subject.code)}
                            </div>
                            <div>
                                <p className="text-sm font-medium">{subject.code}</p>
                                <p className="text-xs text-gray-400">{subject.name}</p>
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            <p className="text-xs text-gray-400">
                                {taskCountBySubject.get(subject.s_id) ?? 0} tasks
                            </p>
                            <button
                                onClick={() => setSubjectToDelete(subject)}
                                className="text-transparent hover:text-red-400 transition-colors"
                            >
                                <Trash className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && <AddSubjectModal onClose={() => setShowAddModal(false)} onCreated={(created) => {
                setSubjects((prev) => [...prev, created]);
                setShowAddModal(false);
            }} />}

            {subjectToDelete && (
                <ConfirmDialog
                    title="Delete subject"
                    message={getDeleteMessage(
                        subjectToDelete,
                        totalTaskCountBySubject.get(subjectToDelete.s_id) ?? 0,
                        noteCountBySubject.get(subjectToDelete.s_id) ?? 0
                    )}
                    confirmLabel="Delete"
                    onConfirm={confirmDelete}
                    onCancel={() => setSubjectToDelete(null)}
                />
            )}
        </main>
    );
}