import { useEffect, useState } from "react";
import { getNotes, deleteNotes, openFile } from "../services/notes";
import { getSubjects } from "../services/subject";
import type { Notes as NoteType } from "../types/notes";
import type { Subject } from "../types/subject";
import { Plus, FileText, Trash } from "lucide-react";
import ConfirmDialog from "../components/ConfirmDialog";
import AddNoteModal from "../components/AddNoteModal";

function getFileExtension(filePath: string): string {
    const parts = filePath.split(".");
    return parts.length > 1 ? parts[parts.length - 1].toUpperCase() : "FILE";
}

function getFileName(filePath: string): string {
    const parts = filePath.split(/[\\/]/); // handles both Windows \ and Unix /
    return parts[parts.length - 1];
}



function groupBySubject(notes: NoteType[]): Map<number, NoteType[]> {
    const groups = new Map<number, NoteType[]>();
    for (const note of notes) {
        if (!groups.has(note.s_id)) groups.set(note.s_id, []);
        groups.get(note.s_id)!.push(note);
    }
    return groups;
}

export default function Notes() {
    const [notes, setNotes] = useState<NoteType[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false);
    const [noteToDelete, setNoteToDelete] = useState<NoteType | null>(null);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const [noteData, subjectData] = await Promise.all([getNotes(), getSubjects()]);
                setNotes(noteData);
                setSubjects(subjectData);
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    async function confirmDelete() {
        if (!noteToDelete) return;
        try {
            await deleteNotes(noteToDelete.n_id);
            setNotes((prev) => prev.filter((n) => n.n_id !== noteToDelete.n_id));
        } catch (err) {
            setError(String(err));
        } finally {
            setNoteToDelete(null);
        }
    }

    async function handleOpenFile(filePath: string) {
        try {
            await openFile(filePath);
        } catch (err) {
            setError(`Couldn't open file: ${String(err)}`);
        }
    }

    if (loading) return <p className="p-8 text-sm text-gray-400">Loading…</p>;
    if (error) return <p className="p-8 text-sm text-red-400">Couldn't load notes: {error}</p>;

    const subjectById = new Map(subjects.map((s) => [s.s_id, s]));
    const groupedNotes = groupBySubject(notes);

    return (
        <main className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Notes</h1>
                    <p className="text-sm text-gray-400">{notes.length} note{notes.length !== 1 ? "s" : ""}</p>
                </div>
                <button className="addButton" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add note
                </button>
            </div>

            {notes.length === 0 && (
                <p className="text-sm text-gray-500">No notes yet — attach your first file.</p>
            )}

            {Array.from(groupedNotes).map(([subjectId, subjectNotes]) => {
                const subject = subjectById.get(subjectId);
                return (
                    <div key={subjectId} className="mb-6">
                        <div className="flex items-center gap-2 mb-2">
                            <div
                                className="h-2 w-2 rounded-full"
                                style={{ backgroundColor: subject?.color ?? "#555" }}
                            />
                            <p className="text-sm font-medium">
                                {subject ? `${subject.code} - ${subject.name}` : "Unknown subject"}
                            </p>
                        </div>
                        <div className="flex flex-col gap-2">
                            {subjectNotes.map((note) => (
                                <div
                                    key={note.n_id}
                                    className="flex items-center gap-3 rounded-lg bg-gray-900 border border-gray-800 p-3 cursor-pointer hover:bg-gray-800 transition-colors"
                                    onClick={() => handleOpenFile(note.file_path)}
                                >
                                    <div className="w-9 h-9 rounded-md bg-gray-800 flex items-center justify-center shrink-0">
                                        <FileText className="w-4 h-4 text-gray-400" />
                                    </div>
                                    <div className="flex-1 ">
                                        <p className="text-sm font-medium">
                                            Chapter {note.chapter} - {note.name}
                                        </p>
                                        <p className="text-xs text-gray-400">
                                            {getFileName(note.file_path)} · {getFileExtension(note.file_path)}
                                        </p>
                                    </div>
                                    <button
                                        onClick={(event) => {
                                            event.stopPropagation();
                                            setNoteToDelete(note);
                                        }}
                                        className="text-gray-500 hover:text-red-400 transition-colors shrink-0"
                                    >
                                        <Trash className="w-4 h-4" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                );
            })}

            {showAddModal && (
                <AddNoteModal
                    subjects={subjects}
                    onClose={() => setShowAddModal(false)}
                    onCreated={(created) => {
                        setNotes((prev) => [...prev, created]);
                        setShowAddModal(false);
                    }}
                />
            )}

            {noteToDelete && (
                <ConfirmDialog
                    title="Delete note"
                    message={`Delete "${noteToDelete.name}"? This can't be undone.`}
                    confirmLabel="Delete"
                    onConfirm={confirmDelete}
                    onCancel={() => setNoteToDelete(null)}
                />
            )}
        </main>
    );
}