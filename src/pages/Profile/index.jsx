import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import {
  User,
  Lock,
  LogOut,
  Eye,     
  EyeOff,
  Users,
  X,
  Trash2,
} from "lucide-react";
import "./profile.css";
import api from "../../services/axios";
import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  const [isEmployeesModalOpen, setIsEmployeesModalOpen] = useState(false);
  const [funcionarios, setFuncionarios] = useState([]);
  const [loadingFuncionarios, setLoadingFuncionarios] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [deletingAccount, setDeletingAccount] = useState(false);

  
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

          const id = usuario.id || usuario.Id || usuario.idUsuario || usuario.IdUsuario;
          if (id) {
            setUserId(id);
          } else {
            console.warn('ID do usuário não encontrado no localStorage:', usuario);
          }
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

  const handleDeleteAccount = async () => {
    let currentUserId = userId;
    
    if (!currentUserId) {
      try {
        const usuarioStr = localStorage.getItem('usuario');
        if (usuarioStr) {
          const usuario = JSON.parse(usuarioStr);
          currentUserId = usuario.id || usuario.Id || usuario.idUsuario || usuario.IdUsuario;
          if (currentUserId) {
            setUserId(currentUserId);
          }
        }
      } catch (error) {
        console.error('Erro ao ler ID do usuário:', error);
      }
    }

    if (!currentUserId) {
      alert('ID do usuário não encontrado. Por favor, faça login novamente.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!')) {
      return;
    }

    if (!window.confirm('Esta é sua última chance. Deseja realmente excluir sua conta permanentemente?')) {
      return;
    }

    setDeletingAccount(true);
    try {
      await api.delete(`/Usuario/${currentUserId}`, {
        data: { id: currentUserId }
      });
      
      alert('Conta excluída com sucesso.');
      handleLogout();
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      alert(
        error.response?.data?.message || 
        error.response?.data?.erro || 
        'Erro ao excluir conta. Tente novamente.'
      );
    } finally {
      setDeletingAccount(false);
    }
  };

  const loadFuncionarios = async () => {
    setLoadingFuncionarios(true);
    try {
      const response = await api.get('/Usuario');
      const funcionariosList = response.data.filter(
        usuario => usuario.perfil === 'Funcionario' || usuario.Perfil === 'Funcionario'
      );
      setFuncionarios(funcionariosList);
    } catch (error) {
      console.error('Erro ao carregar funcionários:', error);
      setFuncionarios([]);
    } finally {
      setLoadingFuncionarios(false);
    }
  };

  const handleOpenEmployeesModal = () => {
    setIsEmployeesModalOpen(true);
    loadFuncionarios();
  };

  const handleCloseEmployeesModal = () => {
    setIsEmployeesModalOpen(false);
    setFuncionarios([]);
  };

  const handleDeleteFuncionario = async (id) => {
    if (!id) {
      alert('ID do funcionário não encontrado.');
      return;
    }

    if (!window.confirm('Tem certeza que deseja excluir este funcionário?')) {
      return;
    }

    setDeletingId(id);
    try {
      await api.delete(`/Usuario/${id}`, {
        data: { id: id }
      });
      await loadFuncionarios();
    } catch (error) {
      console.error('Erro ao deletar funcionário:', error);
      alert(
        error.response?.data?.message || 
        error.response?.data?.erro || 
        'Erro ao excluir funcionário. Tente novamente.'
      );
    } finally {
      setDeletingId(null);
    }
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
              <button 
                className="view-employees-button" 
                type="button" 
                onClick={handleOpenEmployeesModal}
              >
                <Users size={18} />
                <span>Ver Funcionários</span>
              </button>
              
              <button 
                className="delete-account-button"
                type="button" 
                onClick={handleDeleteAccount}
                disabled={deletingAccount}
              >
                {deletingAccount ? (
                  <>
                    <div style={{ width: '18px', height: '18px', border: '2px solid #ff8c42', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                    <span>Excluindo...</span>
                  </>
                ) : (
                  <>
                    <Trash2 size={18} />
                    <span>Excluir Conta</span>
                  </>
                )}
              </button>
              
              <button className="logout-button" type="button" onClick={handleLogout}>
                <LogOut size={18} />
                <span>Sair da Conta</span>
              </button>
            </section>

        </div> 
      </main>

      {/* Modal de Funcionários */}
      {isEmployeesModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseEmployeesModal}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '20px'
          }}
        >
          <div 
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white',
              width: '100%',
              maxWidth: '600px',
              borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)',
              maxHeight: '90vh',
              overflowY: 'auto',
              padding: '2rem',
              boxSizing: 'border-box'
            }}
          >
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '1.5rem'
            }}>
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '12px'
              }}>
                <div style={{
                  background: '#87ceeb',
                  padding: '12px',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users size={24} color="#FFF" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#333', fontWeight: '700' }}>
                    Lista de Funcionários
                  </h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#666' }}>
                    Gerencie os funcionários do sistema
                  </p>
                </div>
              </div>
              <button
                onClick={handleCloseEmployeesModal}
                style={{
                  background: '#f3f4f6',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#4b5563',
                  width: '36px',
                  height: '36px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = '#e5e7eb';
                  e.target.style.color = '#000';
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = '#f3f4f6';
                  e.target.style.color = '#4b5563';
                }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{
              maxHeight: '60vh',
              overflowY: 'auto'
            }}>
              {loadingFuncionarios ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Carregando funcionários...
                </div>
              ) : funcionarios.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>
                  Nenhum funcionário cadastrado
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {funcionarios.map((funcionario) => {
                    const funcionarioId = funcionario.id || funcionario.Id || funcionario.idUsuario || funcionario.IdUsuario;
                    return (
                      <div
                        key={funcionarioId}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'space-between',
                          padding: '1rem',
                          backgroundColor: '#f9fafb',
                          borderRadius: '12px',
                          border: '1px solid #e5e7eb'
                        }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', color: '#333', fontWeight: '600' }}>
                            {funcionario.usuario || funcionario.Usuario || funcionario.nome || funcionario.Nome || 'Sem nome'}
                          </h3>
                          {funcionario.email && (
                            <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#666' }}>
                              {funcionario.email || funcionario.Email}
                            </p>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteFuncionario(funcionarioId)}
                          disabled={deletingId === funcionarioId}
                        style={{
                          background: deletingId === funcionario.id ? '#ccc' : '#ef4444',
                          border: 'none',
                          cursor: deletingId === funcionario.id ? 'not-allowed' : 'pointer',
                          color: 'white',
                          width: '40px',
                          height: '40px',
                          borderRadius: '8px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          transition: 'all 0.2s',
                          marginLeft: '1rem'
                        }}
                        onMouseEnter={(e) => {
                          if (deletingId !== funcionarioId) {
                            e.target.style.backgroundColor = '#dc2626';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (deletingId !== funcionarioId) {
                            e.target.style.backgroundColor = '#ef4444';
                          }
                        }}
                      >
                        {deletingId === funcionarioId ? (
                          <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
                        ) : (
                          <Trash2 size={18} />
                        )}
                      </button>
                    </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Profile;