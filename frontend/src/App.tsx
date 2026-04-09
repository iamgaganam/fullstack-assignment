import { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";
import { Dashboard } from "./pages/Dashboard";
import { DepartmentPage } from "./pages/DepartmentPage";
import { EmployeePage } from "./pages/EmployeePage";
import "./App.css";

function AppContent() {
  const [isDark, setIsDark] = useState(() => {
    const saved = localStorage.getItem("theme");
    if (saved) {
      return saved === "dark";
    }
    return false; // Default to light theme
  });

  useEffect(() => {
    localStorage.setItem("theme", isDark ? "dark" : "light");
    if (isDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, [isDark]);

  const toggleDarkMode = () => {
    setIsDark(!isDark);
  };

  return (
    <div
      className={`flex flex-col min-h-screen transition-colors ${
        isDark ? "bg-slate-950 text-white" : "bg-white text-slate-900"
      }`}
    >
      <Navbar isDark={isDark} onToggleDarkMode={toggleDarkMode} />

      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Dashboard isDark={isDark} />} />
          <Route
            path="/departments"
            element={<DepartmentPage isDark={isDark} />}
          />
          <Route path="/employees" element={<EmployeePage isDark={isDark} />} />
        </Routes>
      </main>

      <Footer isDark={isDark} />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
