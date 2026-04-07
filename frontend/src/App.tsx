import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Home } from "./pages/Home";
import { DepartmentManagement } from "./pages/DepartmentManagement";
import { EmployeeManagement } from "./pages/EmployeeManagement";
import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

function App() {
  return (
    <Router>
      <div className="flex flex-col min-h-screen bg-white dark:bg-slate-950">
        <Navbar />

        <main className="flex-1 w-full">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/departments" element={<DepartmentManagement />} />
            <Route path="/employees" element={<EmployeeManagement />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </Router>
  );
}

export default App;
