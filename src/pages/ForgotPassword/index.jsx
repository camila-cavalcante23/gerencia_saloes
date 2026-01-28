
import React, { useState } from 'react';
import { Mail, ArrowLeft, User, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import api from '../../services/axios';
import '../Login/Login.css'; 

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const frontendUrl = window.location.origin;
      
      await api.post('/Usuario/esqueceu-senha', {
        email: email,
        urlFrontend: frontendUrl
      });

      setSuccess('Se o e-mail existir, enviaremos um link para recuperação de senha!');
      setEmail('');
    } catch (err) {
      setError(
        err.response?.data?.message || 
        err.response?.data?.erro || 
        'Erro ao enviar e-mail de recuperação. Verifique se o e-mail está correto.'
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
            <User size={40} color="#e0e7ff" strokeWidth={1.5} />
          </div>
        </div>

        <div className="login-header">
          <h2 style={{ fontSize: '1.5rem' }}>Recuperação de Senha</h2>
          <p style={{ maxWidth: '300px', margin: '0 auto', lineHeight: '1.4' }}>
            Para recuperar sua senha, informe seu endereço de e-mail que nós vamos enviaremos um link para alteração de senha.
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

          <div className="input-group">
            <label htmlFor="email" style={{fontWeight: 'bold'}}>E-mail</label>
            <div className="input-wrapper">
              <input 
                type="email" 
                id="email"
                placeholder="exemplo@email.com" 
                className="login-input"
                style={{ paddingLeft: '12px' }} 
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError('');
                  if (success) setSuccess('');
                }}
                required
                disabled={loading}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="login-button" 
            style={{ background: '#3B82F6' }}
            disabled={loading}
          >
            {loading ? 'Enviando...' : 'Enviar Link de Recuperação'}
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

export default ForgotPassword;