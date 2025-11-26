import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CalendarManagment from "./pages/Calendar/calendarManagment";
import Dashboard from "./pages/Dashboard";
import Costs from "./pages/Costs";
import Profits from "./pages/Profits";
import Profile from "./pages/Profile";
import EmployeeProfile from "./pages/Profile/EmployeeProfile";
import Login from "./pages/Login";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/agenda" element={<CalendarManagment />} />
        <Route path="/custos" element={<Costs />} />
        <Route path="/lucro" element={<Profits />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/perfil-funcionario" element={<EmployeeProfile />} />
        <Route path="/login" element={<Login />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
