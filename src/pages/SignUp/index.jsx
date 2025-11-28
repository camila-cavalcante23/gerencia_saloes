
import React, { useState } from 'react';
import { Mail, Lock, UserPlus, ArrowLeft, Eye, EyeOff, Scissors } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom'; 
import '../Login/Login.css'; 

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    

    if (password !== confirmPassword) {
      alert("As senhas não coincidem!");
      return;
    }

    console.log("Cadastrando:", email, password);
    

    alert("Cadastro realizado com sucesso!");
    navigate('/'); 
  };

  return (
    <div className="login-container">
      <div className="login-card">
        
    
        <div className="login-header">
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '10px' }}>
            <div style={{ background: '#e0e7ff', padding: '12px', borderRadius: '50%' }}>
                <UserPlus size={32} color="#4f46e5" />
            </div>
          </div>
          <h2>Crie sua conta</h2>
          <p>Comece a gerenciar seu salão hoje</p>
        </div>

        <form onSubmit={handleSubmit}>
          
          {/* E-mail */}
          <div className="input-group">
            <label htmlFor="email">E-mail</label>
            <div className="input-wrapper">
              <Mail className="input-icon" size={20} />
              <input 
                type="email" 
                id="email"
                placeholder="seu@email.com" 
                className="login-input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Senha */}
          <div className="input-group">
            <label htmlFor="password">Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="password"
                placeholder="Crie uma senha" 
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

          {/* Confirmar Senha */}
          <div className="input-group">
            <label htmlFor="confirmPassword">Confirmar Senha</label>
            <div className="input-wrapper">
              <Lock className="input-icon" size={20} />
              <input 
                type={showPassword ? "text" : "password"} 
                id="confirmPassword"
                placeholder="Repita a senha" 
                className="login-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
            </div>
          </div>

          <button type="submit" className="login-button">
            Cadastrar
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center' }}>
          <Link to="/" style={{ color: '#666', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '5px' }}>
            <ArrowLeft size={16} /> Voltar para Login
          </Link>
        </div>

      </div>
    </div>
  );
};

export default SignUp;