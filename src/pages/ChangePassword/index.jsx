
import React, { useState } from 'react';
import { Lock, Scissors, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';
import '../Login/Login.css';

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if(newPassword !== confirmPassword) {
      alert("As novas senhas não coincidem!");
      return;
    }
    console.log("Alterando senha...");
  };

  return (
    <div className="login-container">
      <div className="login-card" style={{ maxWidth: '450px' }}> 
        
  
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '2rem' }}>
            <div style={{ background: '#e0e7ff', padding: '6px', borderRadius: '8px' }}>
                <Scissors size={20} color="#4f46e5" />
            </div>
            <span style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>Meu Salão</span>
        </div>

        <div style={{ textAlign: 'left', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '10px' }}>
           <Lock size={20} />
           <h3 style={{ margin: 0 }}>Alterar Senha</h3>
        </div>

        <form onSubmit={handleSubmit}>
          
       
          <div className="input-group">
            <label htmlFor="current" style={{fontWeight: 'bold'}}>Senha Atual</label>
            <input 
              type="password" 
              id="current"
              className="login-input"
              style={{ paddingLeft: '12px' }}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
            />
          </div>

    
          <div className="input-group">
            <label htmlFor="new" style={{fontWeight: 'bold'}}>Nova Senha</label>
            <input 
              type="password" 
              id="new"
              className="login-input"
              style={{ paddingLeft: '12px' }}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>

      
          <div className="input-group">
            <label htmlFor="confirm" style={{fontWeight: 'bold'}}>Confirme Nova Senha</label>
            <input 
              type="password" 
              id="confirm"
              className="login-input"
              style={{ paddingLeft: '12px' }}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

     
          <button 
            type="submit" 
            className="login-button" 
            style={{ 
                background: '#F3F4F6', 
                color: '#1F2937', 
                border: '1px solid #E5E7EB',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                marginTop: '10px'
            }}
          >
            <Lock size={16} />
            Alterar Senha
          </button>

        </form>

  
        <div style={{ marginTop: '3rem' }}>
            <Link to="/" style={{ textDecoration: 'none' }}>
                <button 
                    type="button"
                    className="login-button"
                    style={{ 
                        background: '#EEF2FF', 
                        color: '#1F2937', 
                        border: '1px solid #C7D2FE',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '8px'
                    }}
                >
                    <LogOut size={16} style={{ transform: 'rotate(180deg)' }} /> 
                    Entrar na conta
                </button>
            </Link>
        </div>

      </div>
    </div>
  );
};

export default ChangePassword;