import { useState } from "react";
import { open } from "@tauri-apps/plugin-dialog";
import { createNotes } from "../services/notes";
import type { Subject } from "../types/subject";
import type { Notes } from "../types/notes";

interface AddNoteModalProps {
    subjects: Subject[];
    onClose: () => void;
    onCreated: (note: Notes) => void;
}

export default function AddNoteModal({ subjects, onClose, onCreated }: AddNoteModalProps) {
    const [subjectId, setSubjectId] = useState<number | "">("");
    const [chapter, setChapter] = useState("");
    const [name, setName] = useState("");
    const [filePath, setFilePath] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const trimmedName = name.trim();
    const canSubmit =
        subjectId !== "" &&
        chapter.trim() !== "" &&
        trimmedName.length >= 35 &&
        trimmedName.length <= 70 &&
        filePath !== null;

    async function handlePickFile() {
        const selected = await open({
            multiple: false,
            filters: [{ name: "Documents", extensions: ["pdf", "pptx", "txt", "doc", "docx"] }],
        });
        if (typeof selected === "string") {
            setFilePath(selected);
        }
    }

    async function handleSubmit() {
        if (!canSubmit) return;
        try {
            setSubmitting(true);
            setError(null);
            const created = await createNotes(
                Number(subjectId),
                Number(chapter),
                trimmedName,
                filePath as string
            );
            onCreated(created);
            onClose();
        } catch (err) {
            setError(String(err));
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 text-white">
            <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 w-full max-w-md">
                <div className="flex items-center justify-between mb-4">
                    <h2 className="text-lg font-semibold">Add note</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <label className="block text-sm mb-1">Subject</label>
                <select
                    value={subjectId}
                    onChange={(e) => setSubjectId(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                >
                    <option value="" disabled>Select a subject</option>
                    {subjects.map((s) => (
                        <option key={s.s_id} value={s.s_id}>{s.code} - {s.name}</option>
                    ))}
                </select>

                <label className="block text-sm mb-1">Chapter</label>
                <input
                    type="number"
                    value={chapter}
                    onChange={(e) => setChapter(e.target.value)}
                    placeholder="e.g. 1"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                    min="1"
                    onKeyDown={(e) => {
                        if (e.key === "-") e.preventDefault();
                    }}
                />

                <label className="block text-sm mb-1">Note name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value.slice(0, 70))}
                    placeholder="35-70 characters"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                    minLength={15}
                    maxLength={50}
                />

                <p className="text-[11px] text-gray-400 -mt-3 mb-4">
                    {trimmedName.length}/50 characters
                </p>

                <label className="block text-sm mb-1">File</label>
                <button
                    onClick={handlePickFile}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm text-left text-gray-300 hover:border-gray-600"
                >
                    {filePath ? filePath.split(/[\\/]/).pop() : "Choose a file…"}
                </button>

                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-800 text-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || submitting}
                        className="px-4 py-2 rounded-md bg-blue-600 text-sm disabled:opacity-50"
                    >
                        {submitting ? "Adding…" : "Add note"}
                    </button>
                </div>
            </div>
        </div>
    );
}