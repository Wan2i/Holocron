import { useState } from "react";
import { createTask } from "../services/task";
import type { Subject } from "../types/subject";
import type { Category } from "../types/category";
import type { Task } from "../types/task";

interface AddTaskModalProps {
    subjects: Subject[];
    categories: Category[];
    onClose: () => void;
    onCreated: (task: Task) => void;
}

export default function AddTaskModal({ subjects, categories, onClose, onCreated }: AddTaskModalProps) {
    const [title, setTitle] = useState("");
    const [categoryId, setCategoryId] = useState<number | "">("");
    const [subjectId, setSubjectId] = useState<number | "">("");
    const [date, setDate] = useState("");
    const [time, setTime] = useState("23:59");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = title.trim() !== "" && categoryId !== "" && subjectId !== "" && date !== "";

    async function handleSubmit() {
        if (!canSubmit) return;
        try {
            setSubmitting(true);
            setError(null);
            const dueDate = `${date}T${time}:00`;
            const created = await createTask(title.trim(), dueDate, 0, Number(subjectId), Number(categoryId));
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
                    <h2 className="text-lg font-semibold">Add task</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <label className="block text-sm mb-1">Task name</label>
                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Chapter 5 problem set"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                />

                <label className="block text-sm mb-1">Category</label>
                <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                >
                    <option value="" disabled>Select a category</option>
                    {categories.map((c) => (
                        <option key={c.c_id} value={c.c_id}>{c.category}</option>
                    ))}
                </select>

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

                <div className="flex gap-3 mb-4">
                    <div className="flex-1">
                        <label className="block text-sm mb-1">Due date</label>
                        <input
                            type="date"
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm"
                        />
                    </div>
                    <div className="flex-1">
                        <label className="block text-sm mb-1">Time</label>
                        <input
                            type="time"
                            value={time}
                            onChange={(e) => setTime(e.target.value)}
                            className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 text-sm"
                        />
                    </div>
                </div>

                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-800 text-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || submitting}
                        className="px-4 py-2 rounded-md bg-blue-600 text-sm disabled:opacity-50"
                    >
                        {submitting ? "Adding…" : "Add task"}
                    </button>
                </div>
            </div>
        </div>
    );
}