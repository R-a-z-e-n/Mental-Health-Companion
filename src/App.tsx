import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";
import { Home, MessageCircle, BarChart2, BookOpen, Settings, Menu, X, CheckSquare } from "lucide-react";
import { useState } from "react";

// Pages
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MoodTracker from "./pages/MoodTracker";
import ResourcesPage from "./pages/ResourcesPage";
import TasksPage from "./pages/TasksPage";

function Navigation() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { path: "/", label: "Home", icon: Home },
    { path: "/chat", label: "Chat", icon: MessageCircle },
    { path: "/mood", label: "Mood Tracker", icon: BarChart2 },
    { path: "/tasks", label: "Tasks", icon: CheckSquare },
    { path: "/resources", label: "Resources", icon: BookOpen },
    { path: "/settings", label: "Settings", icon: Settings },
  ];

  if (location.pathname === "/") return null;

  return (
    <nav className="fixed bottom-0 left-0 right-0 md:top-0 md:bottom-auto bg-white/80 backdrop-blur-lg border-t md:border-t-0 md:border-b border-slate-200 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-xl font-bold text-brand-600 flex items-center gap-2">
              <div className="w-8 h-8 bg-brand-500 rounded-lg flex items-center justify-center text-white">
                <Home size={18} />
              </div>
              Companion
            </Link>
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                  location.pathname === item.path
                    ? "bg-brand-100 text-brand-600 font-medium"
                    : "text-slate-600 hover:bg-slate-50"
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>

          {/* Mobile Nav */}
          <div className="flex md:hidden w-full justify-around items-center">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex flex-col items-center gap-1 p-2 transition-colors ${
                  location.pathname === item.path ? "text-brand-600" : "text-slate-400"
                }`}
              >
                <item.icon size={20} />
                <span className="text-[10px] font-medium">{item.label}</span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default function App() {
  return (
    <Router>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow">
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/chat" element={<Dashboard />} />
              <Route path="/mood" element={<MoodTracker />} />
              <Route path="/tasks" element={<TasksPage />} />
              <Route path="/resources" element={<ResourcesPage />} />
              <Route path="/settings" element={<div className="p-8 text-center">Settings coming soon...</div>} />
            </Routes>
          </AnimatePresence>
        </main>
      </div>
    </Router>
  );
}
