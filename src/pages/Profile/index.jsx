import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  User,
  Lock,
  LogOut,
  Eye,     
  EyeOff,  
} from "lucide-react";
import "./profile.css";

import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);

  
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    const getUsuarioPerfil = () => {
      try {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          const perfil = usuario.perfil;
          setIsAdmin(perfil === 'Admin');
        }
      } catch (error) {
        console.error('Erro ao ler perfil do usuário:', error);
        setIsAdmin(false);
      }
    };

    getUsuarioPerfil();
    
    const handleLogin = () => {
      getUsuarioPerfil();
    };
    
    window.addEventListener('userLogin', handleLogin);
    
    return () => {
      window.removeEventListener('userLogin', handleLogin);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');

    navigate('/');
  };

  return (
    <div className="profile-page">
      <Navbar />

      <main className="profile-main">
        <div className="content-wrapper">

            <div className="profile-header">
              <div className="profile-header-row">
                <div className="profile-title-section">
                  <div className="profile-title-icon">
                    <User size={32} />
                  </div>
                  <div>
                    <h2>Perfil</h2>
                    <p className="profile-subtitle">Suas informações pessoais</p>
                  </div>
                </div>
            
                {isAdmin && (
                  <a href="/perfil-funcionario" className="add-employee-button">
                    + Adicionar Funcionário
                  </a>
                )}
              </div>
            </div>

            <section className="profile-section-card">
              <h3 className="section-title">Informações pessoais</h3>
              <div className="form-group">
                <label htmlFor="fullName">Nome Completo</label>
                <input
                  id="fullName"
                  type="text"
                  placeholder="Digite seu nome completo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input id="email" type="email" placeholder="Digite seu e-mail" />
              </div>
              <button className="primary-button" type="button">
                <User size={18} />
                <span>Salvar Alterações</span>
              </button>
            </section>

            <section className="profile-section-card">
              <h3 className="section-title">
                <Lock size={18} /> Alterar Senha
              </h3>

         
              <div className="form-group">
                <label htmlFor="currentPassword">Senha Atual</label>
                <div className="password-input-wrapper">
                    <input
                      id="currentPassword"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual"
                    />
                    <button 
                      type="button" 
                      className="eye-button"
                      onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                    >
                      {showCurrentPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
              </div>

          
              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <div className="password-input-wrapper">
                    <input
                      id="newPassword"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite a nova senha"
                    />
                    <button 
                      type="button" 
                      className="eye-button"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                    >
                      {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
              </div>

         
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirme Nova Senha</label>
                <div className="password-input-wrapper">
                    <input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita a nova senha"
                    />
                    <button 
                      type="button" 
                      className="eye-button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                    </button>
                </div>
              </div>

              <button className="secondary-button" type="button">
                <Lock size={18} />
                <span>Alterar Senha</span>
              </button>
            </section>

            <section className="logout-section">
              <button className="logout-button" type="button" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sair da Conta</span>
              </button>
            </section>

        </div> 
      </main>
    </div>
  );
}

export default Profile;