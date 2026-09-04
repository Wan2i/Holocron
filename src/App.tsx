import { useState } from "react";
import Sidebar from "./components/Sidebar";
type ActiveTab = "dashboard" | "calendar" | "subjects" | "notes";
import Dashboard from "./pages/dashboard";
import "./App.css";

function App() {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  function renderPage() {
    switch (activeTab) {
      case "dashboard":
        return <Dashboard/>;
      case "calendar":
        return <p className="p-8">Calendar — coming soon</p>;
      case "subjects":
        return <p className="p-8">Subjects — coming soon</p>;
      case "notes":
        return <p className="p-8">Notes — coming soon</p>;
    }
  }

  return (
    <main className="flex h-screen">
      <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
      <div className="flex-1 overflow-y-auto bg-gray-950 text-white">
        {renderPage()}
      </div>
    </main>
  );
}

export default App;