import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  User, 
  TrendingDown, 
  Calculator,
  CheckCircle,
  BarChart3,
  Briefcase 
} from 'lucide-react';
import './Profits.css';

const Profits = () => {
  const [timeFilter, setTimeFilter] = useState('month'); 

  return (
    <div className="profits-page">
  
      <header className="header-nav">
        <div className="logo-section">
          <div className="logo-icon">
            <Calendar size={24} color="#fff" />
          </div>
          <div className="logo-text">
            <h1>Meu Salão</h1>
            <p>Gestão Simples</p>
          </div>
        </div>
        <nav className="main-nav">
          <a href="/" className="nav-item">
            <Home size={20} />
            <span>Hoje</span>
          </a>
          <a href="/agenda" className="nav-item">
            <Calendar size={20} />
            <span>Agenda</span>
          </a>
          
      
          <a href="/servicos" className="nav-item">
            <Briefcase size={20} />
            <span>Serviços</span>
          </a>

          <a href="/custos" className="nav-item">
            <DollarSign size={20} />
            <span>Custos</span>
          </a>
          
          <a href="/lucro" className="nav-item active">
            <TrendingUp size={20} />
            <span>Lucro</span>
          </a>
          <a href="/perfil" className="nav-item">
            <User size={20} />
            <span>Perfil</span>
          </a>
        </nav>
      </header>

  
      <main className="main-content">
        
       
        <div className="content-wrapper">

          
            <div className="page-header-row">
              <div className="title-area">
                <div className="title-icon-box purple">
                  <TrendingUp size={32} color="#fff" />
                </div>
                <div>
                  <h2>Lucro</h2>
                  <p>Acompanhe seus resultados</p>
                </div>
              </div>

              <div className="filter-group">
                <button 
                  className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('today')}
                >
                  Hoje
                </button>
                <button 
                  className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('month')}
                >
                  Este Mês
                </button>
                <button 
                  className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`}
                  onClick={() => setTimeFilter('year')}
                >
                  Este Ano
                </button>
              </div>
            </div>

          
            <div className="profit-cards-grid">
              
             
              <div className="profit-card green-theme">
                <div className="card-header">
                  <div className="card-icon-box">
                    <BarChart3 size={20} />
                  </div>
                  <span>Faturamento Total</span>
                </div>
                <h3 className="card-value">R$ 0.00</h3>
                <p className="card-subtext">0 serviços concluídos</p>
              </div>

             
              <div className="profit-card red-theme">
                <div className="card-header">
                  <div className="card-icon-box">
                    <TrendingDown size={20} />
                  </div>
                  <span>Custos Totais</span>
                </div>
                <h3 className="card-value">R$ 0.00</h3>
                <div className="card-details">
                  <p>Despesas: R$ 0.00</p>
                  <p>Salários: R$ 0.00</p>
                </div>
              </div>

             
              <div className="profit-card purple-theme">
                <div className="card-header">
                  <div className="card-icon-box">
                    <Calculator size={20} />
                  </div>
                  <span>Lucro Líquido</span>
                </div>
                <h3 className="card-value">R$ 0.00</h3>
                <p className="card-subtext check">
                  <CheckCircle size={14} style={{marginRight: 4}}/> 
                  Positivo
                </p>
              </div>
            </div>

          
            <div className="formula-section">
              <h3>Fórmula do Cálculo</h3>
              
              <div className="calculation-box">
               
                <div className="calc-row">
                  <span className="calc-label">Faturamento (serviços Concluídos)</span>
                  <span className="calc-value bold">+ R$ 0.00</span>
                </div>

                <div className="divider-line"></div>

                
                <div className="calc-row">
                  <span className="calc-label">Despesas Gerais</span>
                  <span className="calc-value">-R$ 0.00</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">Salários dos funcionários</span>
                  <span className="calc-value">-R$ 0.00</span>
                </div>

                <div className="divider-line"></div>

               
                <div className="result-row">
                  <span className="result-label">Resultado Final (Lucro)</span>
                  <span className="result-value">= R$ 0.00</span>
                </div>
              </div>
            </div>

        </div> 
      </main>
    </div>
  );
}

export default Profits;