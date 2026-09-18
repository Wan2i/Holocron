// src/utils/date.ts
import type { Task } from "../types/task";

export function getMonthGrid(year: number, month: number): (Date | null)[] {
    const firstDay = new Date(year, month, 1);
    const startWeekday = firstDay.getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const grid: (Date | null)[] = [];
    for (let i = 0; i < startWeekday; i++) grid.push(null);
    for (let day = 1; day <= daysInMonth; day++) grid.push(new Date(year, month, day));
    return grid;
}

export function groupByDate(tasks: Task[]): Map<string, Task[]> {
    const groups = new Map<string, Task[]>();
    for (const task of tasks) {
        const key = new Date(task.due_date).toDateString();
        if (!groups.has(key)) groups.set(key, []);
        groups.get(key)!.push(task);
    }
    return groups;
}

export function formatMonthYear(year: number, month: number): string {
    return new Date(year, month, 1).toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatSelectedDate(date: Date): string {
    return date.toLocaleDateString("en-US", { weekday: "long", day: "numeric", month: "long" });
}