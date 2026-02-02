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
  Save 
} from "lucide-react";
import "./profile.css";
import api from "../../services/axios";
import Navbar from "../../components/Navbar";

function Profile() {
  const navigate = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const [userId, setUserId] = useState(null);
  

  const [profileData, setProfileData] = useState({
    nome: '',
    emailAnterior: '',
    emailNovo: ''
  });

  const [passwordData, setPasswordData] = useState({
    senhaAtual: '',
    novaSenha: '',
    confirmarSenha: ''
  });

  const [loadingProfile, setLoadingProfile] = useState(false);
  const [loadingPassword, setLoadingPassword] = useState(false);
  
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
            
            setProfileData(prev => ({
                ...prev,
                nome: usuario.nome || usuario.Nome || '',
                emailNovo: usuario.email || usuario.Email || ''
            }));
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


  const handleProfileChange = (e) => {
      const { id, value } = e.target;
      setProfileData(prev => ({ ...prev, [id]: value }));
  };

  const handlePasswordChange = (e) => {
      const { id, value } = e.target;
      setPasswordData(prev => ({ ...prev, [id]: value }));
  };
const handleSaveProfile = async () => {
      if (!userId) return alert("Erro: Usuário não identificado.");
      if (!profileData.nome || !profileData.emailNovo) return alert("Nome e Email são obrigatórios.");

      setLoadingProfile(true);

      try {
         
          const usuarioStr = localStorage.getItem('usuario');
          const usuarioAtual = JSON.parse(usuarioStr || '{}');

        
          const emailOriginal = usuarioAtual.email || usuarioAtual.Email;
          if (profileData.emailNovo !== emailOriginal) {
              if (profileData.emailAnterior !== emailOriginal) {
                  setLoadingProfile(false);
                  return alert("Para alterar o e-mail, confirme o e-mail atual corretamente.");
              }
          }

         
          const payload = {
              id: userId,
              nome: profileData.nome,
              email: profileData.emailNovo,
              perfil: usuarioAtual.perfil || usuarioAtual.Perfil,
              telefone: usuarioAtual.telefone || usuarioAtual.Telefone,
              dataAdmissao: usuarioAtual.dataAdmissao || usuarioAtual.DataAdmissao
             
          };

          await api.put(`/Usuario/${userId}`, payload);

        
          const novoUsuario = { ...usuarioAtual, ...payload };
          localStorage.setItem('usuario', JSON.stringify(novoUsuario));

          alert("Perfil atualizado com sucesso!");
          setProfileData(prev => ({ ...prev, emailAnterior: '' })); 

      } catch (error) {
          console.error("Erro ao atualizar perfil:", error);
          alert("Erro ao salvar. Verifique os dados.");
      } finally {
          setLoadingProfile(false);
      }
  };


  const handleSavePassword = async () => {
      if (!userId) return;
      
      if (!passwordData.senhaAtual || !passwordData.novaSenha || !passwordData.confirmarSenha) {
          return alert("Preencha todos os campos de senha.");
      }

      if (passwordData.novaSenha !== passwordData.confirmarSenha) {
          return alert("A nova senha e a confirmação não conferem.");
      }

      setLoadingPassword(true);

      try {
         
          const payload = {
              id: userId, 
              senhaAtual: passwordData.senhaAtual,
              novaSenha: passwordData.novaSenha,
              confirmarNovaSenha: passwordData.confirmarSenha 
          };

          await api.put(`/Usuario/${userId}/alterar-senha`, payload);

          alert("SUCESSO! Senha alterada com sucesso!.\n\nFaça login novamente.");
          handleLogout();

      } catch (error) {
          console.error("Erro detalhado:", error);
          let mensagemErro = "Erro ao alterar senha.";
          
          if (error.response && error.response.data) {
             
              if (typeof error.response.data === 'string') {
                  mensagemErro = error.response.data;
              } 
              
              else if (error.response.data.errors) {
                  mensagemErro = JSON.stringify(error.response.data.errors);
              }
             
              else if (error.response.data.message) {
                  mensagemErro = error.response.data.message;
              }
          }

          if (error.response?.status === 400) {
              alert(`O sistema recusou os dados:\n\n${mensagemErro}\n\nDica: Se a mensagem for 'Senha atual incorreta', é porque a senha no banco foi alterada manualmente e não está criptografada.`);
          } else {
              alert(`Erro técnico (${error.response?.status}): ${mensagemErro}`);
          }
      } finally {
          setLoadingPassword(false);
      }
  };

  const handleDeleteAccount = async () => {
   
    if (!window.confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita!')) {
      return;
    }

    if (!window.confirm('Esta é sua última chance. Deseja realmente excluir sua conta permanentemente?')) {
      return;
    }

    setDeletingAccount(true);
    
    try {
      
      await api.delete('/Usuario/excluir-conta');
      
      alert('Sua conta foi excluída com sucesso. Sentiremos sua falta!');
      handleLogout(); 
      
    } catch (error) {
      console.error('Erro ao excluir conta:', error);
      
      let msg = 'Erro ao excluir conta.';
      
      if (error.response?.data) {
          
           msg = error.response.data.message || error.response.data || msg;
      }

      alert(msg);
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
                <label htmlFor="nome">Nome Completo</label>
                <input
                  id="nome"
                  type="text"
                  placeholder="Digite seu nome completo"
                  value={profileData.nome}
                  onChange={handleProfileChange}
                />
              </div>

            
              <div className="form-group">
                <label htmlFor="emailAnterior" style={{color: '#666', fontSize: '0.9rem'}}>
                    Email Atual / Anterior <span style={{color: 'red'}}>*</span>
                    <br/><small>(Obrigatório para mudar o e-mail)</small>
                </label>
                <input 
                    id="emailAnterior" 
                    type="email" 
                    placeholder="Confirme seu email atual para alterar"
                    value={profileData.emailAnterior}
                    onChange={handleProfileChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="emailNovo">Novo E-mail</label>
                <input 
                    id="emailNovo" 
                    type="email" 
                    placeholder="Digite seu novo e-mail" 
                    value={profileData.emailNovo}
                    onChange={handleProfileChange}
                />
              </div>

              <button 
                className="primary-button" 
                type="button" 
                onClick={handleSaveProfile}
                disabled={loadingProfile}
              >
                <Save size={18} />
                <span>{loadingProfile ? "Salvando..." : "Salvar Alterações"}</span>
              </button>
            </section>

          
            <section className="profile-section-card">
              <h3 className="section-title">
                <Lock size={18} /> Alterar Senha
              </h3>

              <div className="form-group">
                <label htmlFor="senhaAtual">Senha Atual</label>
                <div className="password-input-wrapper">
                    <input
                      id="senhaAtual"
                      type={showCurrentPassword ? "text" : "password"}
                      placeholder="Digite sua senha atual"
                      value={passwordData.senhaAtual}
                      onChange={handlePasswordChange}
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
                <label htmlFor="novaSenha">Nova Senha</label>
                <div className="password-input-wrapper">
                    <input
                      id="novaSenha"
                      type={showNewPassword ? "text" : "password"}
                      placeholder="Digite a nova senha"
                      value={passwordData.novaSenha}
                      onChange={handlePasswordChange}
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
                <label htmlFor="confirmarSenha">Confirme Nova Senha</label>
                <div className="password-input-wrapper">
                    <input
                      id="confirmarSenha"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Repita a nova senha"
                      value={passwordData.confirmarSenha}
                      onChange={handlePasswordChange}
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

              <button 
                className="secondary-button" 
                type="button"
                onClick={handleSavePassword}
                disabled={loadingPassword}
              >
                <Lock size={18} />
                <span>{loadingPassword ? "Alterando..." : "Alterar Senha"}</span>
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

      
      {isEmployeesModalOpen && (
        <div 
          className="modal-overlay" 
          onClick={handleCloseEmployeesModal}
          style={{
            position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px'
          }}
        >
          <div 
            className="modal-container"
            onClick={(e) => e.stopPropagation()}
            style={{
              backgroundColor: 'white', width: '100%', maxWidth: '600px', borderRadius: '24px',
              boxShadow: '0 10px 40px rgba(0, 0, 0, 0.2)', maxHeight: '90vh', overflowY: 'auto', padding: '2rem', boxSizing: 'border-box'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ background: '#87ceeb', padding: '12px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Users size={24} color="#FFF" />
                </div>
                <div>
                  <h2 style={{ margin: 0, fontSize: '1.25rem', color: '#333', fontWeight: '700' }}>Lista de Funcionários</h2>
                  <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#666' }}>Gerencie os funcionários do sistema</p>
                </div>
              </div>
              <button
                onClick={handleCloseEmployeesModal}
                style={{ background: '#f3f4f6', border: 'none', cursor: 'pointer', color: '#4b5563', width: '36px', height: '36px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ maxHeight: '60vh', overflowY: 'auto' }}>
              {loadingFuncionarios ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Carregando funcionários...</div>
              ) : funcionarios.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '2rem', color: '#666' }}>Nenhum funcionário cadastrado</div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {funcionarios.map((funcionario) => {
                    const funcionarioId = funcionario.id || funcionario.Id || funcionario.idUsuario || funcionario.IdUsuario;
                    return (
                      <div
                        key={funcionarioId}
                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem', backgroundColor: '#f9fafb', borderRadius: '12px', border: '1px solid #e5e7eb' }}
                      >
                        <div style={{ flex: 1 }}>
                          <h3 style={{ margin: 0, fontSize: '1rem', color: '#333', fontWeight: '600' }}>
                            {funcionario.usuario || funcionario.Usuario || funcionario.nome || funcionario.Nome || 'Sem nome'}
                          </h3>
                          {funcionario.email && <p style={{ margin: '4px 0 0 0', fontSize: '0.875rem', color: '#666' }}>{funcionario.email || funcionario.Email}</p>}
                        </div>
                        <button
                          onClick={() => handleDeleteFuncionario(funcionarioId)}
                          disabled={deletingId === funcionarioId}
                          style={{ background: deletingId === funcionarioId ? '#ccc' : '#ef4444', border: 'none', cursor: deletingId === funcionarioId ? 'not-allowed' : 'pointer', color: 'white', width: '40px', height: '40px', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.2s', marginLeft: '1rem' }}
                        >
                          {deletingId === funcionarioId ? <div style={{ width: '20px', height: '20px', border: '2px solid white', borderTop: '2px solid transparent', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} /> : <Trash2 size={18} />}
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