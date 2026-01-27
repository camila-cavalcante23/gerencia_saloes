import React, { useState, useEffect } from 'react';
import { 
  DollarSign, 
  Plus, 
  Receipt, 
  Users,
  X,
  Save,
  Trash2,
  Calendar
} from 'lucide-react';
import './Costs.css';
import api from '../../services/axios'; 
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
  const [employees, setEmployees] = useState([]); 

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

  const loadData = async () => {
    try {
      const despesasResponse = await api.get('/Despesa'); 
      setExpenses(despesasResponse.data);

      const funcionariosResponse = await api.get('/Funcionario'); 
      setEmployees(funcionariosResponse.data);
    } catch (error) {
      console.error("Erro ao buscar dados", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []); 

  const currencyToNumber = (valueStr) => {
    if (!valueStr) return 0;
    if (typeof valueStr === 'number') return valueStr;
    const cleanStr = valueStr.replace(/\D/g, ''); 
    return parseFloat(cleanStr) / 100;
  };

  const handleOpenModal = (type) => {
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    if (modalType === 'expense') {
      setFormData({ description: '', value: '', date: getTodayDate() });
    } else {
      setEmployeeFormData({ name: '', salary: '', phone: '', admissionDate: getTodayDate() });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEmployeeInputChange = (e) => {
    const { name, value } = e.target;
    setEmployeeFormData(prev => ({ ...prev, [name]: value }));
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
    if (dateString.startsWith('0001')) return 'Data Pendente';
    const datePart = dateString.toString().split('T')[0]; 
    const [year, month, day] = datePart.split('-');
    return `${day}/${month}/${year}`;
  };

  // --- FUNÇÕES DE SALVAR ---
  const handleSaveExpense = async () => {
    if (formData.description && formData.value) {
      try {
        const payload = {
          descricao: formData.description, 
          valor: currencyToNumber(formData.value), 
          dataDespesa: formData.date,
          categoria: "Geral" 
        };
        await api.post('/Despesa', payload);
        await loadData(); 
        handleCloseModal();
        alert("Despesa salva com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao salvar despesa");
      }
    }
  };
  
  const handleSaveEmployee = async () => {
    if (employeeFormData.name && employeeFormData.salary) {
      try {
        const payload = {
          nome: employeeFormData.name,
          salario: currencyToNumber(employeeFormData.salary), 
          telefone: employeeFormData.phone,
          dataAdmissao: employeeFormData.admissionDate
        };
        await api.post('/Funcionario', payload);
        await loadData(); 
        handleCloseModal();
        alert("Funcionário salvo com sucesso!");
      } catch (error) {
        console.error(error);
        alert("Erro ao salvar funcionário");
      }
    }
  };


  const getExpenseId = (exp) => exp.id || exp.idDespesa || exp.IdDespesa || exp.Id;
  const getEmployeeId = (emp) => emp.id || emp.idFuncionario || emp.IdFuncionario || emp.Id;

  const handleDeleteExpense = async (id) => {
    if(window.confirm("Excluir despesa?")) {
      try {
        await api.delete(`/Despesa/${id}`);
        setExpenses(prev => prev.filter(e => getExpenseId(e) !== id));
      } catch (error) {
        alert("Erro ao excluir. Verifique a conexão.");
      }
    }
  };

 const handleDeleteEmployee = async (id) => {

    const employeeToDelete = employees.find(e => getEmployeeId(e) === id);
    const empName = employeeToDelete ? (employeeToDelete.nome || employeeToDelete.Nome) : "o funcionário";

    if(window.confirm(`ATENÇÃO: Excluir ${empName} irá apagar também todo o histórico de salários lançados nas despesas.\n\nDeseja continuar?`)) {
      try {
        

        const despesasVinculadas = expenses.filter(exp => 
            exp.idFuncionario === id || exp.IdFuncionario === id
        );

      
        if (despesasVinculadas.length > 0) {
         
            await Promise.all(despesasVinculadas.map(exp => 
                api.delete(`/Despesa/${getExpenseId(exp)}`)
            ));
            
          
            const idsDespesasApagadas = despesasVinculadas.map(e => getExpenseId(e));
            setExpenses(prev => prev.filter(e => !idsDespesasApagadas.includes(getExpenseId(e))));
        }

 
        await api.delete(`/Funcionario/${id}`);
        
 
        setEmployees(prev => prev.filter(e => getEmployeeId(e) !== id));
        
        alert("Funcionário e históricos excluídos com sucesso!");

      } catch (error) {
        console.error("Erro na exclusão inteligente:", error);
        

        if (error.response && error.response.status === 500) {
             alert(`Erro ao excluir.\n\nO sistema tentou limpar os salários automaticamente, mas o Banco de Dados ainda encontrou registros presos (talvez em Agendamentos antigos).\n\nErro técnico: ${error.response.data}`);
        } else {
             alert("Erro ao excluir funcionário. Verifique sua conexão.");
        }
      }
    }
  };

  const formatCurrency = (value) => {
    let num = value;
    if (typeof value === 'string') num = parseFloat(value);
    if (isNaN(num)) return 'R$ 0,00';
    return `R$ ${num.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };



  const checkFilter = (dataString) => {
    if (!dataString) return true;
    if (dataString.startsWith('0001')) return true;

    const dataItem = dataString.toString().split('T')[0]; 
    const hojeObj = new Date();
    const anoAtual = hojeObj.getFullYear();
    const mesAtual = String(hojeObj.getMonth() + 1).padStart(2, '0');
    const diaAtual = String(hojeObj.getDate()).padStart(2, '0');

    const stringHoje = `${anoAtual}-${mesAtual}-${diaAtual}`;
    const stringMes = `${anoAtual}-${mesAtual}`;
    const stringAno = `${anoAtual}`;
    
    if (timeFilter === 'today') return dataItem === stringHoje;
    if (timeFilter === 'month') return dataItem.startsWith(stringMes);
    if (timeFilter === 'year') return dataItem.startsWith(stringAno);
    return true;
  };

  const filteredExpenses = expenses.filter(expense => {
      const data = expense.dataDespesa || expense.DataDespesa;
   
      const temFuncionarioVinculado = expense.idFuncionario !== null && expense.idFuncionario !== undefined || 
                                      expense.IdFuncionario !== null && expense.IdFuncionario !== undefined;


      return checkFilter(data) && !temFuncionarioVinculado;
  });


  const totalExpensesValue = filteredExpenses.reduce((acc, expense) => {
    const val = typeof expense.valor === 'number' ? expense.valor : parseFloat(expense.value || 0);
    return acc + val;
  }, 0);


  const totalMonthlySalaries = employees.reduce((acc, emp) => {
    const val = typeof emp.salario === 'number' ? emp.salario : parseFloat(emp.salary || 0);
    return acc + val;
  }, 0);


  let totalSalariesValue = 0;
  if (timeFilter === 'month') {
    totalSalariesValue = totalMonthlySalaries; 
  } else if (timeFilter === 'year') {
    totalSalariesValue = totalMonthlySalaries * 12; 
  } else if (timeFilter === 'today') {
    totalSalariesValue = totalMonthlySalaries / 30; 
  }


  const grandTotalValue = totalExpensesValue + totalSalariesValue; 

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
                <button className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`} onClick={() => setTimeFilter('today')}>Hoje</button>
                <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>Este Mês</button>
                <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>Este Ano</button>
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
                <button className="add-expense-btn" onClick={() => handleOpenModal('expense')}>
                  <Plus size={20} /> Adicionar Despesa
                </button>

                {filteredExpenses.length > 0 ? (
                  <div className="expenses-list">
                    {filteredExpenses.map((expense, index) => (
                      <div key={getExpenseId(expense) || index} className="expense-item">
                        <div className="expense-info">
                          <h4 className="expense-name" style={{ marginBottom: '8px' }}>
                            {expense.descricao || "Sem nome"}
                          </h4>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '4px' }}>
                              <Calendar size={16} color="#4f46e5" />
                              <span style={{ fontSize: '0.9rem', color: '#666' }}>
                                Vencimento: <strong style={{color: '#333'}}>{formatDateToBR(expense.dataDespesa)}</strong>
                              </span>
                          </div>
                          <span className="expense-category" style={{ fontSize: '0.8rem', color: '#888' }}>
                              Categoria: Geral
                          </span>
                        </div>
                        <div className="expense-actions">
                          <span className="expense-value">
                              {formatCurrency(expense.valor)}
                          </span>
                          <button className="delete-expense-btn" onClick={() => handleDeleteExpense(getExpenseId(expense))}>
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="empty-state-container">
                    <div className="empty-icon-box"><DollarSign size={48} color="#999" /></div>
                    <p>Nenhuma despesa registrada neste período</p>
                  </div>
                )}
              </>
            )}

    
            {activeTab === 'employees' && (
              <>
                <button className="add-employee-btn" onClick={() => handleOpenModal('employee')}>
                  <Plus size={20} /> Adicionar Funcionário
                </button>

                {employees.length > 0 ? (
                  <div className="expenses-list">
                    {employees.map((employee, index) => {
                      const empId = getEmployeeId(employee);
                      return (
                        <div key={empId || index} className="expense-item"> 
                          <div className="expense-info">
                            <h4 className="expense-name">
                                {employee.nome || employee.Nome || "Sem Nome"}
                            </h4>
                            <div className="expense-meta">
                              <span style={{color: '#666', fontSize: '0.85rem'}}>Admissão: </span>
                              <span style={{fontWeight: 'bold', color: '#333'}}>
                                  {formatDateToBR(employee.dataAdmissao || employee.DataAdmissao || employee.admissionDate)}
                              </span>
                            </div>
                          </div>
                          <div className="expense-actions">
                            <span className="employee-salary-text">
                              {formatCurrency(employee.salario || employee.Salario)}/mês
                            </span>
                            <button className="delete-expense-btn" onClick={() => handleDeleteEmployee(empId)}>
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="empty-state-container">
                    <div className="empty-icon-box"><Users size={48} color="#999" /></div>
                    <p>Nenhum funcionário cadastrado</p>
                  </div>
                )}
              </>
            )}

        </div> 
      </main>

 
      {isModalOpen && modalType === 'expense' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon-box"><DollarSign size={24} color="#000" /></div>
                <h3>Adicionar Despesa</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Descrição<span className="required">*</span></label>
                <input type="text" name="description" placeholder="Ex: conta de Luz" value={formData.description} onChange={handleInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Valor(R$)</label>
                  <input type="text" name="value" placeholder="R$ 0,00" value={formData.value} onChange={(e) => {
                      const formatted = formatValue(e.target.value); 
                      setFormData({...formData, value: e.target.value}); 
                  }} 
                  onBlur={(e) => setFormData({...formData, value: formatValue(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Data de Vencimento<span className="required">*</span></label>
                  <input type="date" name="date" value={formData.date} onChange={handleInputChange} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-save-expense" onClick={handleSaveExpense}><Save size={16} /> Salvar Despesa</button>
            </div>
          </div>
        </div>
      )}


      {isModalOpen && modalType === 'employee' && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <div className="modal-icon-box"><Users size={24} color="#000" /></div>
                <h3>Adicionar funcionário</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label>Nome do funcionário<span className="required">*</span></label>
                <input type="text" name="name" placeholder="Digite o nome Completo" value={employeeFormData.name} onChange={handleEmployeeInputChange} />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Salário mensal (R$)<span className="required">*</span></label>
                  <input type="text" name="salary" placeholder="R$ 0,00" value={employeeFormData.salary} 
                   onChange={(e) => setEmployeeFormData({...employeeFormData, salary: e.target.value})} 
                   onBlur={(e) => setEmployeeFormData({...employeeFormData, salary: formatValue(e.target.value)})}
                  />
                </div>
                <div className="form-group">
                  <label>Telefone</label>
                  <input type="text" name="phone" placeholder="(00) 00000-0000" value={employeeFormData.phone} onChange={handleEmployeeInputChange} />
                </div>
              </div>
              <div className="form-group">
                <label>Data de admissão</label>
                <input type="date" name="admissionDate" value={employeeFormData.admissionDate} onChange={handleEmployeeInputChange} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-save-employee" onClick={handleSaveEmployee}><Save size={16} /> Salvar funcionário</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Costs;