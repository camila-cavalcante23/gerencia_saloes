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

import Navbar from '../../components/Navbar';

const Profits = () => {
  const [timeFilter, setTimeFilter] = useState('month'); 

  //  DADOS SIMULADOS ( viriam do banco de dados) 
  // Simulando alguns serviços para ter dados nos filtros
  const servicesData = [
    { id: 1, value: 70.00, date: new Date(), status: 'Concluído' }, 
    { id: 2, value: 35.00, date: new Date(), status: 'Concluído' }, 
    { id: 3, value: 120.00, date: new Date(new Date().setDate(new Date().getDate() - 5)), status: 'Concluído' }, 
    { id: 4, value: 50.00, date: new Date(new Date().setMonth(new Date().getMonth() - 2)), status: 'Concluído' }, 
  ];

 
  const expensesData = [
    { id: 1, value: 150.00, date: new Date(), description: 'Produtos' }, 
    { id: 2, value: 300.00, date: new Date(new Date().setDate(new Date().getDate() - 10)), description: 'Luz' },
  ];

  
  const monthlySalariesTotal = 1200.00; 

  
  const [revenue, setRevenue] = useState(0);
  const [expenses, setExpenses] = useState(0);
  const [salaries, setSalaries] = useState(0);
  const [countServices, setCountServices] = useState(0);


  useEffect(() => {
    const now = new Date();
    const currentDay = now.getDate();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();


    const filteredServices = servicesData.filter(service => {
        const sDate = service.date;
        if (timeFilter === 'today') return sDate.getDate() === currentDay && sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
        if (timeFilter === 'month') return sDate.getMonth() === currentMonth && sDate.getFullYear() === currentYear;
        if (timeFilter === 'year') return sDate.getFullYear() === currentYear;
        return true;
    });

    const totalRevenue = filteredServices.reduce((acc, curr) => acc + curr.value, 0);
    
   
    const filteredExpenses = expensesData.filter(expense => {
        const eDate = expense.date;
        if (timeFilter === 'today') return eDate.getDate() === currentDay && eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
        if (timeFilter === 'month') return eDate.getMonth() === currentMonth && eDate.getFullYear() === currentYear;
        if (timeFilter === 'year') return eDate.getFullYear() === currentYear;
        return true;
    });

    const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.value, 0);


    let totalSalaries = 0;
    if (timeFilter === 'today') totalSalaries = 0;
    if (timeFilter === 'month') totalSalaries = monthlySalariesTotal;
    if (timeFilter === 'year') totalSalaries = monthlySalariesTotal * 12;

 
    setRevenue(totalRevenue);
    setExpenses(totalExpenses);
    setSalaries(totalSalaries);
    setCountServices(filteredServices.length);

  }, [timeFilter]); 

 
  const totalCosts = expenses + salaries;
  const netProfit = revenue - totalCosts;
  const isProfitPositive = netProfit >= 0;

  const formatCurrency = (val) => val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
//simulação até aqui vitória, depois a gente vÊ
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
                  <p>Acompanhe seus resultados</p>
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
                <p className="card-subtext">{countServices} serviços concluídos</p>
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
                  <p>Despesas: {formatCurrency(expenses)}</p>
                  <p>Salários: {formatCurrency(salaries)}</p>
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
              <h3>Fórmula do Cálculo</h3>
              
              <div className="calculation-box">
              
                <div className="calc-row">
                  <span className="calc-label">Faturamento (serviços Concluídos)</span>
                  <span className="calc-value bold green-text">+ {formatCurrency(revenue)}</span>
                </div>

                <div className="divider-line"></div>

                <div className="calc-row">
                  <span className="calc-label">Despesas Gerais</span>
                  <span className="calc-value red-text">-{formatCurrency(expenses)}</span>
                </div>
                <div className="calc-row">
                  <span className="calc-label">Salários dos funcionários</span>
                  <span className="calc-value red-text">-{formatCurrency(salaries)}</span>
                </div>

                <div className="divider-line"></div>

                <div className="result-row">
                  <span className="result-label">Resultado Final (Lucro)</span>
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