import { useState } from "react";
import {
  LayoutDashboard,
  Calendar,
  BookOpen,
  FileText,
  Menu,
  X,
} from "lucide-react";

type ActiveTab = "dashboard" | "calendar" | "subjects" | "notes";

interface SidebarProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
}

const NAV_ITEMS: {
  id: ActiveTab;
  label: string;
  icon: typeof LayoutDashboard;
}[] = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "calendar", label: "Calendar", icon: Calendar },
  { id: "subjects", label: "Subjects", icon: BookOpen },
  { id: "notes", label: "Notes", icon: FileText },
];

export default function Sidebar({ activeTab, setActiveTab }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(true);

  return (
    <div
      className={`flex flex-col h-screen bg-gray-900 text-white p-3 transition-all duration-300 ${
        isOpen ? "w-56" : "w-16"
      }`}
    >
      <div className="flex items-center justify-between mb-6">
        {isOpen && <span className="font-semibold text-lg">Holocron</span>}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded hover:bg-gray-800"
        >
          {isOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`flex items-center gap-3 p-2 rounded text-sm transition-colors ${
              activeTab === id ? "bg-blue-600" : "hover:bg-gray-800"
            }`}
          >
            <Icon size={20} />
            {isOpen && <span>{label}</span>}
          </button>
        ))}
      </nav>
    </div>
  );
}
