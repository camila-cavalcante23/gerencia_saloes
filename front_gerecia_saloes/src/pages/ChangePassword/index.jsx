
import React, { useState, useEffect } from 'react';
import { Lock, ArrowLeft, User, Eye, EyeOff } from 'lucide-react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../services/axios';
import '../Login/Login.css';

const ChangePassword = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [token, setToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const tokenFromUrl = searchParams.get('token');
    if (tokenFromUrl) {
      setToken(tokenFromUrl);
    } else {
      setError('Token de redefinição não encontrado. Por favor, use o link enviado por e-mail.');
    }
  }, [searchParams]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!newPassword || !confirmPassword) {
      setError('Por favor, preencha todos os campos.');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('As senhas não coincidem!');
      return;
    }

    if (newPassword.length < 6) {
      setError('A senha deve ter no mínimo 6 caracteres.');
      return;
    }

    if (!token) {
      setError('Token de redefinição não encontrado. Por favor, use o link enviado por e-mail.');
      return;
    }

    setLoading(true);

    try {
      await api.post('/Usuario/redefinir-senha', {
        token: token,
        novaSenha: newPassword,
        confirmarNovaSenha: confirmPassword
      });

      setSuccess('Senha redefinida com sucesso! Redirecionando para o login...');
      setNewPassword('');
      setConfirmPassword('');
      setTimeout(() => {
        navigate('/');
      }, 2000);
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.erro || 
        'Erro ao redefinir senha. Verifique se o token é válido e tente novamente.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
       
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: '#4f46e5', padding: '20px', borderRadius: '50px', width: '80px', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Lock size={40} color="#e0e7ff" strokeWidth={1.5} />
          </div>
        </div>

        <div className="login-header">
          <h2 style={{ fontSize: '1.5rem' }}>Redefinição de senha</h2>
          <p style={{ maxWidth: '300px', margin: '0 auto', lineHeight: '1.4', marginBottom: '2rem' }}>
            Digite sua nova senha nos campos abaixo
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {error && (
            <div style={{ 
              color: '#ef4444', 
              fontSize: '0.875rem', 
              marginBottom: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: '#fee2e2',
              borderRadius: '4px'
            }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ 
              color: '#10b981', 
              fontSize: '0.875rem', 
              marginBottom: '1rem',
              textAlign: 'center',
              padding: '0.5rem',
              backgroundColor: '#d1fae5',
              borderRadius: '4px'
            }}>
              {success}
            </div>
          )}

          <div className="input-group" style={{ marginTop: '1rem' }}>
            <label htmlFor="newPassword" style={{fontWeight: 'bold'}}>Nova Senha</label>
            <div className="input-wrapper">
              <input 
                type={showNewPassword ? "text" : "password"}
                id="newPassword"
                placeholder="Digite sua nova senha" 
                className="login-input"
                style={{ paddingLeft: '12px' }} 
                value={newPassword}
                onChange={(e) => {
                  setNewPassword(e.target.value);
                  if (error) setError('');
                  if (success) setSuccess('');
                }}
                required
                disabled={loading}
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowNewPassword(!showNewPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="confirmPassword" style={{fontWeight: 'bold'}}>Confirmação de Senha</label>
            <div className="input-wrapper">
              <input 
                type={showConfirmPassword ? "text" : "password"}
                id="confirmPassword"
                placeholder="Confirme sua nova senha" 
                className="login-input"
                style={{ paddingLeft: '12px' }} 
                value={confirmPassword}
                onChange={(e) => {
                  setConfirmPassword(e.target.value);
                  if (error) setError('');
                  if (success) setSuccess('');
                }}
                required
                disabled={loading}
                minLength={6}
              />
              <button 
                type="button" 
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: '#6b7280',
                  display: 'flex',
                  alignItems: 'center'
                }}
              >
                {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button" 
            style={{ background: '#3B82F6' }}
            disabled={loading}
          >
            {loading ? 'Redefinindo...' : 'Redefinir Senha'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <ArrowLeft size={16} /> Voltar para Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;