import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  TrendingDown, 
  Calculator,
  CheckCircle,
  BarChart3,
  XCircle
} from 'lucide-react';
import './Profits.css';
import api from '../../services/axios'; 
import Navbar from '../../components/Navbar';

const Profits = () => {
  const [timeFilter, setTimeFilter] = useState('month'); 

  const [expensesList, setExpensesList] = useState([]);
  const [employeesList, setEmployeesList] = useState([]);
  const [appointmentsList, setAppointmentsList] = useState([]);

  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [salaries, setSalaries] = useState(0);
  const [countServices, setCountServices] = useState(0);

  const loadData = async () => {
    try {
      const despesasResponse = await api.get('/Despesa');
      setExpensesList(despesasResponse.data);
  
      const funcionariosResponse = await api.get('/Funcionario');
      setEmployeesList(funcionariosResponse.data);
      
      try {
        const agendamentosResponse = await api.get('/Servicos/anual'); 
        setAppointmentsList(agendamentosResponse.data);
      } catch (error) {
        console.warn("Erro ao buscar agendamentos:", error);
        setAppointmentsList([]); 
      }

    } catch (error) {
      console.error("Erro ao carregar dados financeiros:", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const checkFilter = (dataString) => {
    if (!dataString) return false;
    
    let dataItem = dataString.toString();
    if (dataItem.includes('T')) {
        dataItem = dataItem.split('T')[0];
    } else if (dataItem.includes(' ')) {
        dataItem = dataItem.split(' ')[0];
    }
    
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

  useEffect(() => {
    

    const filteredAppointments = appointmentsList.filter(app => {
      const data = app.dataServico || app.DataServico || app.data || app.date; 
      const status = app.statusServico || app.StatusServico || "";
      const isValidStatus = status === "Concluido" || status === "Concluído" || status === "Encaixe" || status === "Encaixe Rápido";
      return checkFilter(data) && isValidStatus; 
    });

    const totalRevenue = filteredAppointments.reduce((acc, curr) => {
        const val = curr.valorCobrado || curr.ValorCobrado || curr.valor || 0;
        return acc + (typeof val === 'number' ? val : parseFloat(val));
    }, 0);



    const filteredExpenses = expensesList.filter(exp => {
      const data = exp.dataDespesa || exp.DataDespesa || exp.data;
      
    
      const temFuncionarioVinculado = exp.idFuncionario !== null && exp.idFuncionario !== undefined || 
                                      exp.IdFuncionario !== null && exp.IdFuncionario !== undefined;


      return checkFilter(data) && !temFuncionarioVinculado;
    });

    const totalExpenses = filteredExpenses.reduce((acc, curr) => {
       const val = typeof curr.valor === 'number' ? curr.valor : parseFloat(curr.value || 0);
       return acc + val;
    }, 0);


 
    const totalMonthlySalaries = employeesList.reduce((acc, emp) => {
        const val = typeof emp.salario === 'number' ? emp.salario : parseFloat(emp.salary || 0);
        return acc + val;
    }, 0);

    let calculatedSalaries = 0;
    if (timeFilter === 'today') {
   
        calculatedSalaries = totalMonthlySalaries / 30; 
    } else if (timeFilter === 'month') {
        calculatedSalaries = totalMonthlySalaries;
    } else if (timeFilter === 'year') {
        calculatedSalaries = totalMonthlySalaries * 12; 
    }

    setRevenue(totalRevenue);
    setExpenses(totalExpenses);
    setSalaries(calculatedSalaries);
    setCountServices(filteredAppointments.length);

  }, [timeFilter, expensesList, employeesList, appointmentsList]);


  const totalCosts = expenses + salaries;
  const netProfit = revenue - totalCosts;
  const isProfitPositive = netProfit >= 0;

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  return (
    <div className="profits-page">
      <Navbar />

      <main className="main-content">
        <div className="content-wrapper">

            <div className="page-header-row">
              <div className="title-area">
                <div className="title-icon-box purple">
                  <TrendingUp size={32} color="#fff" />
                </div>
                <div>
                  <h2>Lucro</h2>
                  <p>Acompanhe seus resultados reais</p>
                </div>
              </div>

              <div className="filter-group">
                <button className={`filter-btn ${timeFilter === 'today' ? 'active' : ''}`} onClick={() => setTimeFilter('today')}>Hoje</button>
                <button className={`filter-btn ${timeFilter === 'month' ? 'active' : ''}`} onClick={() => setTimeFilter('month')}>Este Mês</button>
                <button className={`filter-btn ${timeFilter === 'year' ? 'active' : ''}`} onClick={() => setTimeFilter('year')}>Este Ano</button>
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
                <h3 className="card-value">{formatCurrency(revenue)}</h3>
                <p className="card-subtext">{countServices} serviços realizados</p>
              </div>

       
              <div className="profit-card red-theme">
                <div className="card-header">
                  <div className="card-icon-box">
                    <TrendingDown size={20} />
                  </div>
                  <span>Custos Totais</span>
                </div>
                <h3 className="card-value">{formatCurrency(totalCosts)}</h3>
                <div className="card-details">
                  <p>Despesas Gerais: {formatCurrency(expenses)}</p>
                  <p>Folha Salarial: {formatCurrency(salaries)}</p>
                </div>
              </div>

          
              <div className="profit-card purple-theme">
                <div className="card-header">
                  <div className="card-icon-box">
                    <Calculator size={20} />
                  </div>
                  <span>Lucro Líquido</span>
                </div>
                
                <h3 className={`card-value ${!isProfitPositive ? 'negative-text' : ''}`}>
                    {formatCurrency(netProfit)}
                </h3>
                
                <p className={`card-subtext ${isProfitPositive ? 'check' : 'warning'}`}>
                  {isProfitPositive ? (
                      <>
                        <CheckCircle size={14} style={{marginRight: 4}}/> 
                        Positivo
                      </>
                  ) : (
                      <>
                        <XCircle size={14} style={{marginRight: 4}}/> 
                        Prejuízo
                      </>
                  )}
                </p>
              </div>
            </div>

         
            <div className="formula-section">
              <h3>Detalhamento do Cálculo</h3>
              
              <div className="calculation-box">
              
                <div className="calc-row">
                  <span className="calc-label">Faturamento (Agendamentos Concluídos)</span>
                  <span className="calc-value bold green-text">+ {formatCurrency(revenue)}</span>
                </div>

                <div className="divider-line"></div>

                <div className="calc-row">
                  <span className="calc-label">Despesas Gerais (Contas)</span>
                  <span className="calc-value red-text">-{formatCurrency(expenses)}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">Folha Salarial ({timeFilter === 'year' ? 'Anual' : (timeFilter === 'today' ? 'Diária' : 'Mensal')})</span>
                  <span className="calc-value red-text">-{formatCurrency(salaries)}</span>
                </div>

                <div className="divider-line"></div>

                <div className="result-row">
                  <span className="result-label">Resultado Final</span>
                  <span className={`result-value ${isProfitPositive ? 'green-text' : 'red-text'}`}>
                    = {formatCurrency(netProfit)}
                  </span>
                </div>
              </div>
            </div>

        </div> 
      </main>
    </div>
  );
}

export default Profits;