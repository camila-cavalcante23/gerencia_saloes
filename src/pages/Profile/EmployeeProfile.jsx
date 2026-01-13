import {
  User,
  Lock,
} from "lucide-react";
import "./profile.css";


import Navbar from "../../components/Navbar";

function EmployeeProfile() {
  return (
    <div className="profile-page">
      
     
      <Navbar />

      <main className="profile-main">
        
       
        <div className="content-wrapper">

            <div className="profile-header">
              <div className="profile-title-section">
                <div className="profile-title-icon">
                  <User size={32} />
                </div>
                <div>
                  <h2>Perfil do Funcionário</h2>
                  <p className="profile-subtitle">
                    Criação de usuário para colaboradores
                  </p>
                </div>
              </div>
            </div>

            <section className="profile-section-card">
              <h3 className="section-title">
                <Lock size={18} /> Dados do funcionário
              </h3>
              <div className="form-group">
                <label htmlFor="employeeFullName">Nome Completo</label>
                <input
                  id="employeeFullName"
                  type="text"
                  placeholder="Digite o nome completo"
                />
              </div>
              <div className="form-group">
                <label htmlFor="employeeEmail">E-mail</label>
                <input
                  id="employeeEmail"
                  type="email"
                  placeholder="Digite o e-mail"
                />
              </div>
              <div className="form-group">
                <label htmlFor="employeePassword">Senha</label>
                <input
                  id="employeePassword"
                  type="password"
                  placeholder="Digite a senha"
                />
              </div>
              <div className="form-group">
                <label htmlFor="employeeConfirmPassword">Confirme a senha</label>
                <input
                  id="employeeConfirmPassword"
                  type="password"
                  placeholder="Repita a senha"
                />
              </div>
              <button className="primary-button" type="button">
                <User size={18} />
                <span>Salvar Alterações</span>
              </button>
            </section>

        </div> 
      </main>
    </div>
  );
}

export default EmployeeProfile;