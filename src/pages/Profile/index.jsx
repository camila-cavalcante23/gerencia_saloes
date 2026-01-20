import { useNavigate } from "react-router-dom";
import {
  User,
  Lock,
  LogOut,
} from "lucide-react";
import "./profile.css";

import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();

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
            
                <a href="/perfil-funcionario" className="add-employee-button">
                  + Adicionar
                </a>
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
                <input
                  id="currentPassword"
                  type="password"
                  placeholder="Digite sua senha atual"
                />
              </div>
              <div className="form-group">
                <label htmlFor="newPassword">Nova Senha</label>
                <input
                  id="newPassword"
                  type="password"
                  placeholder="Digite a nova senha"
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirme Nova Senha</label>
                <input
                  id="confirmPassword"
                  type="password"
                  placeholder="Repita a nova senha"
                />
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