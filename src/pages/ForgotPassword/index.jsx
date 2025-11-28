
import React, { useState } from 'react';
import { Mail, ArrowLeft, User, Scissors } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Login/Login.css'; 
const ForgotPassword = () => {
  const [email, setEmail] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Enviando email de recuperação para:", email);
    alert("Se o e-mail existir, enviaremos um link!");
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
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button" style={{ background: '#3B82F6' }}>
            Entrar
          
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