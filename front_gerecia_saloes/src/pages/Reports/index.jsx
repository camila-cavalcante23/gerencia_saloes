import { useState, useEffect } from "react";
import { Search, Filter, Download } from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../services/axios";
import "./reports.css"; 

function Reports() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadData = async () => {
    try {
      const response = await api.get('/Servicos/anual');
      setServices(response.data);
      setFilteredServices(response.data); 
    } catch (error) {
      console.error("Erro ao carregar relatórios", error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);


  const handleFilter = () => {
    if (!startDate && !endDate) {
      setFilteredServices(services);
      return;
    }

    const filtered = services.filter(service => {
     
      const dataRaw = service.dataServico || service.DataServico || "";
      const serviceDate = dataRaw.split("T")[0];

      const start = startDate || "0000-01-01";
      const end = endDate || "9999-12-31";

      return serviceDate >= start && serviceDate <= end;
    });

    setFilteredServices(filtered);
  };


  const totalPeriodo = filteredServices.reduce((acc, curr) => {
    return acc + (curr.valorCobrado || curr.ValorCobrado || 0);
  }, 0);

  return (
    <div className="reports-page">
      <Navbar />
      
      <main className="reports-main">
        <div className="reports-header">
          <h2>Relatório de Serviços</h2>
          <p>Histórico completo de agendamentos e encaixes</p>
        </div>

        {/* ÁREA DE FILTROS */}
        <div className="filters-container">
          <div className="date-inputs">
            <div className="input-group">
              <label>De:</label>
              <input 
                type="date" 
                value={startDate} 
                onChange={(e) => setStartDate(e.target.value)} 
              />
            </div>
            <div className="input-group">
              <label>Até:</label>
              <input 
                type="date" 
                value={endDate} 
                onChange={(e) => setEndDate(e.target.value)} 
              />
            </div>
           <button className="reports-filter-btn" onClick={handleFilter}>
              <Search size={18} /> Filtrar
            </button>
          </div>
          
          <div className="total-badge">
            <span>Total no Período:</span>
            <strong>{totalPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </div>
        </div>

        {/* TABELA DE DADOS */}
        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente</th>
                <th>Serviço/Obs</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
                  const dataRaw = service.dataServico || service.DataServico;
                  const dataFormatada = dataRaw ? new Date(dataRaw).toLocaleDateString('pt-BR') : "-";
                  const obs = service.observacoes || service.Observacoes || "-";
                  const isEncaixe = obs.includes("Encaixe");

                  return (
                    <tr key={service.idServico || service.id}>
                      <td>{dataFormatada}</td>
                      <td>{service.clienteNome || service.ClienteNome}</td>
                      <td>{obs}</td>
                      <td>
                        <span className={`badge-type ${isEncaixe ? "encaixe" : "normal"}`}>
                          {isEncaixe ? "Encaixe" : "Agendado"}
                        </span>
                      </td>
                      <td>R$ {(service.valorCobrado || 0).toFixed(2)}</td>
                      <td>{service.statusServico || service.StatusServico}</td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="6" style={{textAlign: "center", padding: "20px"}}>
                    Nenhum registro encontrado neste período.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default Reports;