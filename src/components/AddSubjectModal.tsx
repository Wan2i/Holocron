import { useState } from "react";
import { Subject } from "../types/subject";
import { createSubject } from "../services/subject";

interface AddSubjectModalProps {
    onClose: () => void;
    onCreated: (subject: Subject) => void;
}

export default function AddSubjectModal({ onClose, onCreated }: AddSubjectModalProps) {
    const [code, setCode] = useState("");
    const [name, setName] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const canSubmit = code.trim() !== "" && name.trim() !== "";

    async function handleSubmit() {
        if (!canSubmit) return;
        try {
            setSubmitting(true);
            setError(null);
            const created = await createSubject(code.trim(), name.trim(), color);
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
                    <h2 className="text-lg font-semibold">Add subject</h2>
                    <button onClick={onClose} className="text-gray-400 hover:text-white">✕</button>
                </div>

                <label className="block text-sm mb-1">Subject code</label>
                <input
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    placeholder="e.g. MATH101"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                />

                <label className="block text-sm mb-1">Subject name</label>
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g. Calculus I"
                    className="w-full bg-gray-800 border border-gray-700 rounded-md p-2 mb-4 text-sm"
                />

                <label className="block text-sm mb-1">Color</label>
                <div className="flex items-center gap-2 mb-4">
                    <button
                        onClick={() => setColor("#EE4444")}
                        className={`h-6 w-6 bg-red-500 border rounded-full transition-all ${color === "#EE4444" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#F97216")}
                        className={`h-6 w-6 bg-orange-500 border rounded-full transition-all ${color === "#F97216" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#E9B308")}
                        className={`h-6 w-6 bg-yellow-500 border rounded-full transition-all ${color === "#E9B308" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#10B981")}
                        className={`h-6 w-6 bg-green-500 border rounded-full transition-all ${color === "#10B981" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#06B6D4")}
                        className={`h-6 w-6 bg-cyan-500 border rounded-full transition-all ${color === "#06B6D4" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#3B82F6")}
                        className={`h-6 w-6 bg-blue-500 border rounded-full transition-all ${color === "#3B82F6" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#6366F1")}
                        className={`h-6 w-6 bg-indigo-500 border rounded-full transition-all ${color === "#6366F1" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                    <button
                        onClick={() => setColor("#EC4899")}
                        className={`h-6 w-6 bg-pink-500 border rounded-full transition-all ${color === "#EC4899" ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900" : "border-gray-700"
                            }`}
                    />
                </div>


                {error && <p className="text-xs text-red-400 mb-3">{error}</p>}

                <div className="flex justify-end gap-2">
                    <button onClick={onClose} className="px-4 py-2 rounded-md bg-gray-800 text-sm">Cancel</button>
                    <button
                        onClick={handleSubmit}
                        disabled={!canSubmit || submitting}
                        className="px-4 py-2 rounded-md bg-blue-600 text-sm disabled:opacity-50"
                    >
                        {submitting ? "Adding…" : "Add subject"}
                    </button>
                </div>
            </div>
        </div>
    );
}