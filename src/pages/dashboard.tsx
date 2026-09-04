import { useEffect, useState } from "react";
import { getTask, updateTask, deleteTask } from "../services/task";
import { getSubjects } from "../services/subject";
import { getCategory } from "../services/category";
import type { Task } from "../types/task";
import type { Subject } from "../types/subject";
import type { Category } from "../types/category";
import { Plus, Circle, CheckCircle2, Trash  } from "lucide-react";
import AddTaskModal from "../components/AddTaskModal";

const CATEGORY_COLORS: Record<string, { bg: string; text: string }> = {
    ASSIGNMENT: { bg: "bg-blue-500/15", text: "text-blue-300" },
    PROJECT: { bg: "bg-purple-500/15", text: "text-purple-300" },
    TEST: { bg: "bg-red-500/15", text: "text-red-300" },
    QUIZ: { bg: "bg-amber-500/15", text: "text-amber-300" },
    PRESENTATION: { bg: "bg-pink-500/15", text: "text-pink-300" },
};
const DEFAULT_CATEGORY_COLOR = { bg: "bg-gray-500/15", text: "text-gray-300" };

function formatDateHeader(dueDate: string): string {
    const date = new Date(dueDate);
    return date.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short" });
}

function formatTime(dueDate: string): string {
    const date = new Date(dueDate);
    return date.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", hour12: false });
}

function groupByDate(tasks: Task[]): Map<string, Task[]> {
    const groups = new Map<string, Task[]>();
    for (const task of tasks) {
        const key = new Date(task.due_date).toDateString();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(task);
    }
    return groups;
}

export default function Dashboard() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const [showAddModal, setShowAddModal] = useState(false)

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const [taskData, subjectData, categoryData] = await Promise.all([
                    getTask(),
                    getSubjects(),
                    getCategory(),
                ]);
                setTasks(taskData);
                setSubjects(subjectData);
                setCategories(categoryData);
            } catch (err) {
                setError(String(err));
            } finally {
                setLoading(false);
            }
        }
        loadData();
    }, []);

    async function toggleComplete(task: Task) {
        try {
            const updated = await updateTask(
                task.t_id,
                task.title,
                task.due_date,
                task.completed === 1 ? 0 : 1,
                task.s_id,
                task.c_id
            );
            setTasks((prev) => prev.map((t) => (t.t_id === updated.t_id ? updated : t)));
        } catch (err) {
            setError(String(err));
        }
    }

    async function handleDeleteTask(task: Task) {
        try {
            await deleteTask(task.t_id);
            setTasks((prev) => prev.filter((t) => t.t_id !== task.t_id));
        } catch (err) {
            setError(String(err));
        }
    }

    if (loading) return <p className="p-8 text-sm text-gray-400">Loading…</p>;
    if (error) return <p className="p-8 text-sm text-red-400">Couldn't load dashboard: {error}</p>;

    const subjectById = new Map(subjects.map((s) => [s.s_id, s]));
    const categoryById = new Map(categories.map((c) => [c.c_id, c]));

    const upcoming = tasks
        .filter((t) => t.completed === 0)
        .sort((a, b) => a.due_date.localeCompare(b.due_date));

    const completed = tasks.filter((t) => t.completed === 1);
    const groupedUpcoming = groupByDate(upcoming);

    function renderTaskRow(task: Task, dimmed: boolean) {
        const subject = subjectById.get(task.s_id);
        const category = categoryById.get(task.c_id);
        const colors = category ? (CATEGORY_COLORS[category.category] ?? DEFAULT_CATEGORY_COLOR) : DEFAULT_CATEGORY_COLOR;

        return (
            <div
                key={task.t_id}
                className={`flex items-center gap-3 rounded-lg bg-gray-900 border border-gray-800 p-3 ${dimmed ? "opacity-50" : ""}`}
            >
                <button onClick={() => toggleComplete(task)} className="shrink-0">
                    {task.completed === 1 ? (
                        <CheckCircle2 className="w-5 h-5 text-blue-400" />
                    ) : (
                        <Circle className="w-5 h-5 text-gray-500" />
                    )}
                </button>

                <div className="flex-1 flex flex-col gap-1">
                    <p className={`text-sm font-medium ${dimmed ? "line-through" : ""}`}>{task.title}</p>
                    <div className="flex items-center gap-2">
                        <div className="h-2 w-2 rounded-full" style={{ backgroundColor: subject?.color ?? "#555" }} />
                        <p className="text-xs text-gray-400">{subject?.code ?? "Unknown subject"}</p>
                        {category && (
                            <span className={`text-xs px-2 py-0.5 rounded-full ${colors.bg} ${colors.text}`}>
                                {category.category}
                            </span>
                        )}
                    </div>
                </div>

                <div className="text-right text-xs text-gray-400">
                    <p>{formatDateHeader(task.due_date)}</p>
                    <p>{formatTime(task.due_date)}</p>
                </div>
                <button onClick={() => handleDeleteTask(task)} className="text-transparent hover:text-red-400">
                    <Trash className="w-4 h-4" />
                </button>
            </div>
        );
    }

    return (
        <main className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Dashboard</h1>
                    <p className="text-sm text-gray-400 mb-6">{upcoming.length} upcoming tasks</p>
                </div>
                <button className="addButton" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Task
                </button>
            </div>

            <section className="mb-8">
                {upcoming.length === 0 && (
                    <p className="text-sm text-gray-500">Nothing due — you're clear.</p>
                )}
                {Array.from(groupedUpcoming).map(([dateKey, dayTasks]) => (
                    <div key={dateKey} className="mb-4">
                        <p className="text-xs text-gray-500 uppercase tracking-wide mb-2">
                            {formatDateHeader(dayTasks[0].due_date)}
                        </p>
                        <div className="flex flex-col gap-2">
                            {dayTasks.map((task) => renderTaskRow(task, false))}
                        </div>
                    </div>
                ))}
            </section>

            {completed.length > 0 && (
                <section>
                    <p className="text-xs text-gray-500 mb-2">Completed ({completed.length})</p>
                    <div className="flex flex-col gap-2">
                        {completed.map((task) => renderTaskRow(task, true))}
                    </div>
                </section>
            )}

            {showAddModal && <AddTaskModal subjects={subjects} categories={categories} onClose={() => setShowAddModal(false)} onCreated={() => setShowAddModal(false)} />}

        </main>
    );
}