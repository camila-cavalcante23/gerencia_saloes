import React, { useState, useEffect } from 'react';
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
  const [isAdmin, setIsAdmin] = useState(true); 

  useEffect(() => {
    const getUsuarioPerfil = () => {
      try {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          const perfil = usuario.perfil;
          const adminStatus = perfil === 'Admin';
          setIsAdmin(adminStatus);
        } else {
          setIsAdmin(false);
        }
      } catch (error) {
        console.error('Erro ao ler perfil do usuário:', error);
        setIsAdmin(false);
      }
    };

    getUsuarioPerfil();
    const handleStorageChange = () => {
      getUsuarioPerfil();
    };
    
    const handleLogin = () => {
      getUsuarioPerfil();
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('userLogin', handleLogin);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

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

        {isAdmin && (
          <>
            <NavLink to="/custos" className="nav-item">
              <DollarSign size={20} />
              <span>Custos</span>
            </NavLink>

            <NavLink to="/lucro" className="nav-item">
              <TrendingUp size={20} />
              <span>Lucro</span>
            </NavLink>
          </>
        )}

        <NavLink to="/perfil" className="nav-item">
          <User size={20} />
          <span>Perfil</span>
        </NavLink>
      </nav>
    </header>
  );
};

export default Navbar;