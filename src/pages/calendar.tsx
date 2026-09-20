import { useEffect, useState } from "react";
import { getTask } from "../services/task";
import { getSubjects } from "../services/subject";
import { getCategory } from "../services/category";
import type { Task } from "../types/task";
import type { Subject } from "../types/subject";
import { ChevronLeft, ChevronRight, Plus } from "lucide-react";
import { getMonthGrid, groupByDate, formatMonthYear, formatSelectedDate } from "../utils/date";
import AddTaskModal from "../components/AddTaskModal";
import { Category } from "../types/category";

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function Calendar() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [subjects, setSubjects] = useState<Subject[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const today = new Date();
    const [currentMonth, setCurrentMonth] = useState(today.getMonth());
    const [currentYear, setCurrentYear] = useState(today.getFullYear());
    const [selectedDate, setSelectedDate] = useState<Date>(today);
    const [showAddModal, setShowAddModal] = useState(false)
    const [categories, setCategories] = useState<Category[]>([]);

    useEffect(() => {
        async function loadData() {
            try {
                setLoading(true);
                setError(null);
                const [taskData, subjectData, categoryData] = await Promise.all([getTask(), getSubjects(), getCategory()]);
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

    if (loading) return <p className="p-8 text-sm text-gray-400">Loading…</p>;
    if (error) return <p className="p-8 text-sm text-red-400">Couldn't load calendar: {error}</p>;

    const subjectById = new Map(subjects.map((s) => [s.s_id, s]));
    const tasksByDate = groupByDate(tasks);
    const grid = getMonthGrid(currentYear, currentMonth);

    function goToPrevMonth() {
        if (currentMonth === 0) {
            setCurrentMonth(11);
            setCurrentYear((y) => y - 1);
        } else {
            setCurrentMonth((m) => m - 1);
        }
    }

    function goToNextMonth() {
        if (currentMonth === 11) {
            setCurrentMonth(0);
            setCurrentYear((y) => y + 1);
        } else {
            setCurrentMonth((m) => m + 1);
        }
    }

    function goToToday() {
        setCurrentMonth(today.getMonth());
        setCurrentYear(today.getFullYear());
        setSelectedDate(today);
    }

    const selectedTasks = tasksByDate.get(selectedDate.toDateString()) ?? [];

    return (
        <main className="p-8 text-white">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-semibold mb-1">Calendar</h1>
                    <p className="text-sm text-gray-400">Tap a day to see its tasks</p>
                </div>
                <button className="addButton" onClick={() => setShowAddModal(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add task
                </button>
            </div>

            <div className="flex gap-6">
                <div className="flex-1 bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <div className="flex items-center justify-between mb-4">
                        <p className="font-medium">{formatMonthYear(currentYear, currentMonth)}</p>
                        <div className="flex items-center gap-2">
                            <button onClick={goToPrevMonth} className="p-1 rounded hover:bg-gray-800">
                                <ChevronLeft className="w-4 h-4" />
                            </button>
                            <button onClick={goToToday} className="text-xs px-3 py-1 rounded-md bg-gray-800 hover:bg-gray-700">
                                Today
                            </button>
                            <button onClick={goToNextMonth} className="p-1 rounded hover:bg-gray-800">
                                <ChevronRight className="w-4 h-4" />
                            </button>
                        </div>
                    </div>

                    <div className="grid grid-cols-7 text-xs text-gray-500 mb-2">
                        {WEEKDAY_LABELS.map((label) => (
                            <div key={label} className="text-center py-1">{label}</div>
                        ))}
                    </div>

                    <div className="grid grid-cols-7 gap-1">
                        {grid.map((date, i) => {
                            if (!date) return <div key={i} />;
                            const isSelected = date.toDateString() === selectedDate.toDateString();
                            const isToday = date.toDateString() === today.toDateString();
                            const dayTasks = tasksByDate.get(date.toDateString()) ?? [];

                            return (
                                <button
                                    key={i}
                                    onClick={() => setSelectedDate(date)}
                                    className={`aspect-square rounded-lg flex flex-col items-center justify-center text-sm ${isSelected ? "bg-blue-600" : isToday ? "bg-gray-800" : "hover:bg-gray-800"
                                        }`}
                                >
                                    <span>{date.getDate()}</span>
                                    {dayTasks.length > 0 && (
                                        <div className="flex gap-0.5 mt-1">
                                            {dayTasks.slice(0, 3).map((t) => (
                                                <div
                                                    key={t.t_id}
                                                    className="w-1.5 h-1.5 rounded-full"
                                                    style={{ backgroundColor: subjectById.get(t.s_id)?.color ?? "#555" }}
                                                />
                                            ))}
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                </div>

                <div className="w-72 bg-gray-900 border border-gray-800 rounded-xl p-4">
                    <p className="font-medium mb-3">{formatSelectedDate(selectedDate)}</p>
                    {selectedTasks.length === 0 ? (
                        <p className="text-sm text-gray-500">No tasks scheduled.</p>
                    ) : (
                        <div className="flex flex-col gap-2">
                            {selectedTasks.map((task) => {
                                const subject = subjectById.get(task.s_id);
                                return (
                                    <div
                                        key={task.t_id}
                                        className="bg-gray-900 border border-gray-700 rounded-xl p-4 hover:border-gray-600 transition-colors"
                                    >
                                        <div className="flex items-center justify-between">
                                            <div>
                                                <p className="text-sm font-medium text-gray-100">
                                                    {task.title}
                                                </p>

                                                <p className="text-xs text-gray-400 mt-1">
                                                    {subject?.code ?? "Unknown subject"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </div>

            {showAddModal && <AddTaskModal subjects={subjects} categories={categories} onClose={() => setShowAddModal(false)} onCreated={(created) => {
                setTasks((prev) => [...prev, created]);
                setShowAddModal(false);
            }} />}
        </main>
    );
}