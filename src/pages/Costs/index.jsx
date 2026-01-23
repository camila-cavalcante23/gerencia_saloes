import React, { useState } from 'react';
import { 
  DollarSign, 
  Plus, 
  Receipt, 
  Users,
  Trash2,
  User 
} from 'lucide-react';
import './Costs.css';

import Navbar from '../../components/Navbar';
import NewExpenseModal from '../../components/NewExpenseModal';
import NewEmployeeModal from '../../components/NewEmployeeModal';

const Costs = () => {
 
  const [timeFilter, setTimeFilter] = useState('month');
  
  const [activeTab, setActiveTab] = useState('expenses'); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEmployeeModalOpen, setIsEmployeeModalOpen] = useState(false);

  const [expenses, setExpenses] = useState([]);
  const [employees, setEmployees] = useState([]);


  const parseValue = (val) => {
    if (!val) return 0;
    const cleanVal = val.toString().replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
    return parseFloat(cleanVal) || 0;
  };

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  
  const getFilteredExpenses = () => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    return expenses.filter((expense) => {
      
      const expenseDate = new Date(expense.rawDate + 'T12:00:00'); 
      
      const expDay = expenseDate.getDate();
      const expMonth = expenseDate.getMonth();
      const expYear = expenseDate.getFullYear();

      if (timeFilter === 'today') {
        return expDay === currentDay && expMonth === currentMonth && expYear === currentYear;
      } else if (timeFilter === 'month') {
        return expMonth === currentMonth && expYear === currentYear;
      } else if (timeFilter === 'year') {
        return expYear === currentYear;
      }
      return true;
    });
  };

 
  const filteredExpenses = getFilteredExpenses();
  const totalExpensesValue = filteredExpenses.reduce((acc, curr) => acc + parseValue(curr.value), 0);

  
  const baseMonthlySalary = employees.reduce((acc, curr) => acc + parseValue(curr.salary), 0);
  
  let totalSalariesValue = 0;
  if (timeFilter === 'today') {
    totalSalariesValue = 0; 
  } else if (timeFilter === 'month') {
    totalSalariesValue = baseMonthlySalary; 
  } else if (timeFilter === 'year') {
    totalSalariesValue = baseMonthlySalary * 12;
  }

  const grandTotalValue = totalExpensesValue + totalSalariesValue;


 
  const handleAddExpense = (data) => {
    const newExpense = {
      id: Date.now(),
      description: data.description,
      dateDisplay: new Date(data.date + 'T12:00:00').toLocaleDateString('pt-BR'), 
      rawDate: data.date, 
      value: data.value, 
      tag: data.description 
    };
    setExpenses(prev => [newExpense, ...prev]);
  };

  const handleDeleteExpense = (id) => {
    if(window.confirm("Deseja excluir esta despesa?")) {
      setExpenses(prev => prev.filter(item => item.id !== id));
    }
  };

  const handleAddEmployee = (data) => {
    const newEmployee = {
      id: Date.now(),
      name: data.name,
      salary: data.salary,
      phone: data.phone,
      admissionDate: new Date(data.admissionDate + 'T12:00:00').toLocaleDateString('pt-BR')
    };
    setEmployees(prev => [newEmployee, ...prev]);
  };

  const handleDeleteEmployee = (id) => {
    if(window.confirm("Deseja remover este funcionário?")) {
      setEmployees(prev => prev.filter(item => item.id !== id));
    }
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
                <h3 className="card-value red">{formatCurrency(totalExpensesValue)}</h3>
              </div>
              <div className="cost-card">
                <p className="card-label">Salários {timeFilter === 'year' ? '(Anual)' : ''}</p>
                <h3 className="card-value red">{formatCurrency(totalSalariesValue)}</h3>
              </div>
              <div className="cost-card">
                <p className="card-label">Total Geral</p>
                <h3 className="card-value black">{formatCurrency(grandTotalValue)}</h3>
              </div>
            </div>

        
            <div className="tabs-container">
              <button className={`tab-btn ${activeTab === 'expenses' ? 'active' : ''}`} onClick={() => setActiveTab('expenses')}>
                <Receipt size={18} /> Despesas Gerais
              </button>
              <button className={`tab-btn ${activeTab === 'employees' ? 'active' : ''}`} onClick={() => setActiveTab('employees')}>
                <Users size={18} /> Funcionários
              </button>
            </div>

            {activeTab === 'expenses' && (
              <>
                <button className="add-expense-btn" onClick={() => setIsModalOpen(true)}>
                  <Plus size={20} /> Adicionar Despesa
                </button>

               
                {filteredExpenses.length === 0 ? (
                  <div className="empty-state-container">
                    <div className="empty-icon-box"><DollarSign size={48} color="#999" /></div>
                    <p>Nenhuma despesa encontrada para este período</p>
                  </div>
                ) : (
                  <div className="expenses-list">
                    
                    {filteredExpenses.map((expense) => (
                      <div key={expense.id} className="expense-card-item">
                        <div className="expense-info">
                          <h4 className="expense-title">{expense.description}</h4>
                          <div className="expense-details">
                            <span>{expense.dateDisplay}</span>
                            <span className="expense-tag">{expense.tag}</span>
                          </div>
                        </div>
                        <div className="expense-actions">
                          <span className="expense-value">
                            {expense.value.includes('R$') ? expense.value : `R$ ${expense.value}`}
                          </span>
                          <button className="delete-btn" onClick={() => handleDeleteExpense(expense.id)}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

           
            {activeTab === 'employees' && (
              <>
                <button className="add-employee-wide-btn" onClick={() => setIsEmployeeModalOpen(true)}>
                  <Plus size={18} />
                  Adicionar Funcionário
                </button>

                {employees.length === 0 ? (
                  <div className="employees-empty-state">
                    <User size={48} className="employees-empty-icon" strokeWidth={1.5} />
                    <p className="employees-empty-text">Nenhum funcionário cadastrado</p>
                  </div>
                ) : (
                  <div className="expenses-list">
                    {employees.map((employee) => (
                      <div key={employee.id} className="expense-card-item">
                        <div className="expense-info">
                          <h4 className="expense-title">{employee.name}</h4>
                          <div className="expense-details">
                            <span style={{ color: '#888', fontSize: '0.8rem' }}>Admissão:</span>
                            <span style={{ fontWeight: 'bold', color: '#333' }}>{employee.admissionDate}</span>
                          </div>
                        </div>
                        <div className="expense-actions">
                          <span className="employee-salary-value">
                             {employee.salary.includes('R$') ? employee.salary : `R$ ${employee.salary}`}/mês
                          </span>
                          <button className="delete-btn" onClick={() => handleDeleteEmployee(employee.id)}>
                            <Trash2 size={20} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

        </div> 
      </main>

      {/* Modais */}
      <NewExpenseModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        onSave={handleAddExpense} 
      />

      <NewEmployeeModal 
        isOpen={isEmployeeModalOpen} 
        onClose={() => setIsEmployeeModalOpen(false)}
        onSave={handleAddEmployee}
      />
      
    </div>
  );
}

export default Costs;