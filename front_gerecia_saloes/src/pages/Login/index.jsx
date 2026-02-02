
import React, { useState } from 'react';
import { Mail, Lock, Scissors, Eye, EyeOff } from 'lucide-react'; 
import { Link, useNavigate } from 'react-router-dom'; 
import api from '../../services/axios';
import './Login.css';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await api.post('/Usuario/login', {
        email,
        senha: password
      });
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
      }
      if (response.data) {
        const { token, ...usuarioData } = response.data;
        localStorage.setItem('usuario', JSON.stringify(usuarioData));
        window.dispatchEvent(new Event('userLogin'));
      }
      navigate('/dashboard');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.erro || 
        'Erro ao fazer login. Verifique suas credenciais.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '50%' }}>
                <Scissors size={32} color="#4f46e5" />
            </div>
          </div>
          <h2>Bem-vindo</h2>
          <p>Faça login para gerenciar seu salão</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                id="email"
                placeholder="exemplo@salao.com" 
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
      
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="********" 
                className="login-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <button 
                type="button" 
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

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
        
          <Link to="/forgot-password" className="forgot-password">
            Esqueceu a senha?
          </Link>

          <button 
            type="submit" 
            className="login-button"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar no Sistema'}
          </button>

          
          <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
            <span style={{ color: '#666', fontSize: '0.9rem' }}>Não tem uma conta? </span>
            <Link to="/register" style={{ color: '#4f46e5', fontWeight: 'bold', textDecoration: 'none' }}>
              Cadastre-se
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
};

export default Login;