import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  DollarSign, 
  TrendingUp, 
  User, 
  Plus, 
  Receipt, 
  Users,
  Briefcase 
} from 'lucide-react';
import './Costs.css';

const Costs = () => {
  const [timeFilter, setTimeFilter] = useState('month');
  const [activeTab, setActiveTab] = useState('expenses'); 

  return (
    <div className="costs-page">
    
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

          {/* Item Ativo */}
          <a href="/custos" className="nav-item active">
            <DollarSign size={20} />
            <span>Custos</span>
          </a>
          <a href="/lucro" className="nav-item">
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
                <div className="title-icon-box">
                  <DollarSign size={32} color="#000" />
                </div>
                <div>
                  <h2>Custos</h2>
                  <p>Controle suas despesas</p>
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

       
            <div className="summary-cards-grid">
              <div className="cost-card">
                <p className="card-label">Despesas Gerais</p>
                <h3 className="card-value red">R$ 0.00</h3>
              </div>
              <div className="cost-card">
                <p className="card-label">Salários</p>
                <h3 className="card-value red">R$ 0.00</h3>
              </div>
              <div className="cost-card">
                <p className="card-label">Total Geral</p>
                <h3 className="card-value black">R$ 0.00</h3>
              </div>
            </div>

         
            <div className="tabs-container">
              <button 
                className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`}
                onClick={() => setActiveTab('expenses')}
              >
                <Receipt size={18} />
                Despesas Gerais
              </button>
              <button 
                className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`}
                onClick={() => setActiveTab('employees')}
              >
                <Users size={18} />
                Funcionários
              </button>
            </div>

      
            <button className="add-expense-btn">
              <Plus size={20} />
              Adicionar Despesa
            </button>

         
            <div className="empty-state-container">
              <div className="empty-icon-box">
                <DollarSign size={48} color="#999" />
              </div>
              <p>Nenhuma despesa registrada neste período</p>
            </div>

        </div> 

      </main>
    </div>
  );
}

export default Costs;