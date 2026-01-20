import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Receipt, 
  Users,
  X,
  Save,
  Trash2
} from 'lucide-react';
import './Costs.css';


import Navbar from '../../components/Navbar';

const Costs = () => {
  const getTodayDate = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const [timeFilter, setTimeFilter] = useState('month');
  const [activeTab, setActiveTab] = useState('expenses');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('expense');
  const [expenses, setExpenses] = useState([]);
  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: getTodayDate()
  });
  const [employeeFormData, setEmployeeFormData] = useState({
    name: '',
    salary: '',
    phone: '',
    admissionDate: getTodayDate()
  });

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalType === 'expense') {
      setFormData({ 
        description: '', 
        value: '',
        date: getTodayDate()
      });
    } else {
      setEmployeeFormData({
        name: '',
        salary: '',
        phone: '',
        admissionDate: getTodayDate()
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const formatValue = (value) => {
    const numbers = value.replace(/\D/g, '');
    const numValue = numbers ? parseFloat(numbers) / 100 : 0;
    return numValue.toLocaleString('pt-BR', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    });
  };

  const formatDateToBR = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  };

  const handleSave = () => {
    if (formData.description && formData.value) {
      const formattedValue = formatValue(formData.value);
      const formattedDate = formatDateToBR(formData.date);
      const newExpense = {
        id: Date.now(),
        name: formData.description,
        value: formattedValue,
        date: formattedDate,
        category: formData.description
      };
      setExpenses([...expenses, newExpense]);
      handleCloseModal();
    }
  };

  const handleSaveEmployee = () => {
    if (employeeFormData.name && employeeFormData.salary) {
      console.log('Salvando funcionário:', employeeFormData);
      handleCloseModal();
    }
  };

  const handleDeleteExpense = (id) => {
    setExpenses(expenses.filter(expense => expense.id !== id));
  }; 

  return (
    <div className="costs-page">
    
      <Navbar />
      
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

      
            {activeTab === 'expenses' ? (
              <>
                <button className="add-expense-btn" onClick={() => handleOpenModal('expense')}>
                  <Plus size={20} />
                  Adicionar Despesa
                </button>

                {/* Lista de Despesas */}
                {expenses.length > 0 ? (
                  <div className="expenses-list">
                    {expenses.map((expense) => (
                      <div key={expense.id} className="expense-item">
                        <div className="expense-info">
                          <h4 className="expense-name">{expense.name}</h4>
                          <div className="expense-meta">
                            <span className="expense-date">{expense.date}</span>
                            <span className="expense-category">{expense.category}</span>
                          </div>
                        </div>
                        <div className="expense-actions">
                          <span className="expense-value">R$ {expense.value}</span>
                          <button 
                            className="delete-expense-btn"
                            onClick={() => handleDeleteExpense(expense.id)}
                            aria-label="Deletar despesa"
                          >
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-container">
                    <div className="empty-icon-box">
                      <DollarSign size={48} color="#999" />
                    </div>
                    <p>Nenhuma despesa registrada neste período</p>
                  </div>
                )}
              </>
            ) : (
              <>
                <button className="add-employee-btn" onClick={() => handleOpenModal('employee')}>
                  <Plus size={20} />
                  Adicionar Funcionário
                </button>

                <div className="empty-state-container">
                  <div className="empty-icon-box">
                    <Users size={48} color="#999" />
                  </div>
                  <p>Nenhum funcionário cadastrado</p>
                </div>
              </>
            )}

        </div> 

      </main>

      {/* Modal Nova Despesa */}
      {isModalOpen && modalType === 'expense' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon-box">
                  <DollarSign size={24} color="#000" />
                </div>
                <h3>Adicionar Despesa</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="description">
                  Descrição<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  placeholder="Ex: conta de Luz, produtos"
                  value={formData.description}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="value">
                    Valor(R$)
                  </label>
                  <input
                    type="text"
                    id="value"
                    name="value"
                    placeholder="R$ 0,00"
                    value={formData.value}
                    onChange={handleInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="date">
                    Data<span className="required">*</span>
                  </label>
                  <input
                    type="date"
                    id="date"
                    name="date"
                    value={formData.date}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-save-expense" onClick={handleSave}>
                <Save size={16} />
                Salvar Despesa
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Adicionar Funcionário */}
      {isModalOpen && modalType === 'employee' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon-box">
                  <Users size={24} color="#000" />
                </div>
                <h3>Adicionar funcionário</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="employee-name">
                  Nome do funcionário<span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="employee-name"
                  name="name"
                  placeholder="Digite o nome Completo"
                  value={employeeFormData.name}
                  onChange={handleEmployeeInputChange}
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="employee-salary">
                    Salário mensal (R$)<span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    id="employee-salary"
                    name="salary"
                    placeholder="R$ 0,00"
                    value={employeeFormData.salary}
                    onChange={handleEmployeeInputChange}
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="employee-phone">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="employee-phone"
                    name="phone"
                    placeholder="(00) 00000-0000"
                    value={employeeFormData.phone}
                    onChange={handleEmployeeInputChange}
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="employee-admission">
                  Data de admissão
                </label>
                <input
                  type="date"
                  id="employee-admission"
                  name="admissionDate"
                  value={employeeFormData.admissionDate}
                  onChange={handleEmployeeInputChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-save-employee" onClick={handleSaveEmployee}>
                <Save size={16} />
                Salvar funcionário
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Costs;