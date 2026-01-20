import { useState } from "react";
import {
  User,
  Lock,
} from "lucide-react";
import "./profile.css";
import api from "../../services/axios";
import Navbar from "../../components/Navbar";

function EmployeeProfile() {
  const [formData, setFormData] = useState({
    nomeCompleto: '',
    email: '',
    senha: '',
    confirmarSenha: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [id]: value
    }));
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');


    if (!formData.nomeCompleto || !formData.email || !formData.senha || !formData.confirmarSenha) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (formData.senha !== formData.confirmarSenha) {
      setError('As senhas não coincidem.');
      return;
    }

    if (formData.senha.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        setError('Você precisa estar autenticado para cadastrar funcionários.');
        setLoading(false);
        return;
      }
      const cleanToken = token.trim();
      
      const response = await api.post('/Usuario/cadastro-funcionario', {
        Nome: formData.nomeCompleto,
        Email: formData.email,
        Senha: formData.senha
      }, {
        headers: {
          Authorization: `Bearer ${cleanToken}`
        }
      });

      setSuccess('Funcionário cadastrado com sucesso!');
 
      setFormData({
        nomeCompleto: '',
        email: '',
        senha: '',
        confirmarSenha: ''
      });

    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.erro || 
        'Erro ao cadastrar funcionário. Tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

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
              
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}

              {success && (
                <div className="success-message">
                  {success}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label htmlFor="nomeCompleto">Nome Completo</label>
                  <input
                    id="nomeCompleto"
                    type="text"
                    placeholder="Digite o nome completo"
                    value={formData.nomeCompleto}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="email">E-mail</label>
                  <input
                    id="email"
                    type="email"
                    placeholder="Digite o e-mail"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="senha">Senha</label>
                  <input
                    id="senha"
                    type="password"
                    placeholder="Digite a senha"
                    value={formData.senha}
                    onChange={handleInputChange}
                    required
                    minLength={6}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="confirmarSenha">Confirme a senha</label>
                  <input
                    id="confirmarSenha"
                    type="password"
                    placeholder="Repita a senha"
                    value={formData.confirmarSenha}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <button 
                  className="primary-button" 
                  type="submit"
                  disabled={loading}
                >
                  <User size={18} />
                  <span>{loading ? 'Salvando...' : 'Salvar Alterações'}</span>
                </button>
              </form>
            </section>

        </div> 
      </main>
    </div>
  );
}

export default EmployeeProfile;