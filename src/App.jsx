import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./App.css";
import CalendarManagment from "./pages/Calendar/calendarManagment";
import Dashboard from "./pages/Dashboard";
import Costs from "./pages/Costs";
import Profits from "./pages/Profits";
import Profile from "./pages/Profile";
import EmployeeProfile from "./pages/Profile/EmployeeProfile";
import Login from "./pages/Login";
import SignUp from "./pages/SignUp"; 
import ForgotPassword from "./pages/ForgotPassword"; 
import ChangePassword from "./pages/ChangePassword"; 
import Services from "./pages/Services";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/change-password" element={<ChangePassword />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/agenda" element={<CalendarManagment />} />
        <Route path="/custos" element={<Costs />} />
        <Route path="/lucro" element={<Profits />} />
        <Route path="/perfil" element={<Profile />} />
        <Route path="/servicos" element={<Services />} />
        <Route path="/perfil-funcionario" element={<EmployeeProfile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;