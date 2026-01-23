import React from 'react';
import { NavLink, Link } from 'react-router-dom';
import { 
  Calendar, 
  Home, 
  Briefcase, 
  DollarSign, 
  TrendingUp, 
  User 
} from 'lucide-react';
import './navbar.css'; 

const Navbar = () => {
  return (
    <header className="header-nav">
    
      <Link to="/" className="logo-section">
        <div className="logo-icon">
          <Calendar size={24} color="#fff" />
        </div>
        <div className="logo-text">
          <h1>Meu Salão</h1>
          <p>Gestão Simples</p>
        </div>
      </Link>

      <nav className="main-nav">
        
        
        
        <NavLink to="/dashboard" className="nav-item">
          <Home size={20} />
          <span>Hoje</span>
        </NavLink>

        <NavLink to="/agenda" className="nav-item">
          <Calendar size={20} />
          <span>Agenda</span>
        </NavLink>

        <NavLink to="/servicos" className="nav-item">
          <Briefcase size={20} />
          <span>Serviços</span>
        </NavLink>

        <NavLink to="/custos" className="nav-item">
          <DollarSign size={20} />
          <span>Custos</span>
        </NavLink>

        <NavLink to="/lucro" className="nav-item">
          <TrendingUp size={20} />
          <span>Lucro</span>
        </NavLink>

        <NavLink to="/perfil" className="nav-item">
          <User size={20} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;