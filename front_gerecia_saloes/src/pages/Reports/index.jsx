import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import Navbar from "../../components/Navbar";
import api from "../../services/axios";
import "./reports.css"; 

function Reports() {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const processData = (data) => {
    return data.map(service => {
        const obs = service.observacoes || service.Observacoes || "";
        const clienteNome = service.clienteNome || service.ClienteNome || "";
        const isEncaixe = obs.includes("Encaixe") || clienteNome.includes("Encaixe") || clienteNome === "Cliente Avulso";

        // Pega o horário (HH:mm)
        const horarioRaw = service.horario || service.Horario || "00:00:00";
        let timeStr = horarioRaw.includes('T') ? horarioRaw.substring(11, 16) : horarioRaw.substring(0, 5);

        // Pega a data original (YYYY-MM-DD)
        const dataRaw = service.dataServico || service.DataServico || "";
        let dateObj = new Date(dataRaw);
        
        if (isEncaixe && timeStr < "04:00") {
            dateObj.setDate(dateObj.getDate() - 1);
        }

     
        const year = dateObj.getFullYear();
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const day = String(dateObj.getDate()).padStart(2, '0');
        const dataCorrigida = `${year}-${month}-${day}`;

        return {
            ...service,
            dataCorrigida: dataCorrigida, 
            horarioCorrigido: timeStr
        };
    });
  };

  const loadData = async () => {
    try {
      const response = await api.get('/Servicos/anual');
      const dadosTratados = processData(response.data);
      
      setServices(dadosTratados);
      setFilteredServices(dadosTratados); 
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
      const serviceDate = service.dataCorrigida;
      const start = startDate || "0000-01-01";
      const end = endDate || "9999-12-31";

      return serviceDate >= start && serviceDate <= end;
    });

    setFilteredServices(filtered);
  };


  const totalPeriodo = filteredServices.reduce((acc, curr) => {
    const status = curr.statusServico || curr.StatusServico || "";
    const statusLower = status.toLowerCase();
    
 
    if (statusLower === "concluido" || statusLower === "concluído") {
        return acc + (curr.valorCobrado || curr.ValorCobrado || 0);
    }
    
    return acc;
  }, 0);

  return (
    <div className="reports-page">
      <Navbar />
      
      <main className="reports-main">
        <div className="reports-header">
          <h2>Relatório de Serviços</h2>
          <p>Histórico completo de agendamentos e encaixes</p>
        </div>

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
            <span>Total Realizado (Caixa):</span>
            <strong>{totalPeriodo.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
          </div>
        </div>

        <div className="table-container">
          <table className="reports-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Cliente / Serviço</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Responsável</th>
              </tr>
            </thead>
            <tbody>
              {filteredServices.length > 0 ? (
                filteredServices.map((service) => {
               
                  const [ano, mes, dia] = service.dataCorrigida.split('-');
                  const dataFormatada = `${dia}/${mes}/${ano}`;

                  const obs = service.observacoes || service.Observacoes || "-";
                  const resp = service.responsavel || service.Responsavel || "-";
                  const cliente = service.clienteNome || service.ClienteNome;
                  const isEncaixe = cliente.includes("Cliente Avulso");

                  return (
                    <tr key={service.idServico || service.id}>
                      <td>{dataFormatada}</td>
                      <td>
                        <div style={{fontWeight: 'bold'}}>{cliente}</div>
                        <div style={{fontSize: '0.8rem', color: '#666'}}>{obs}</div>
                      </td>
                      <td>
                        <span className={`badge-type ${isEncaixe ? "encaixe" : "normal"}`}>
                          {isEncaixe ? "Encaixe" : "Agendado"}
                        </span>
                      </td>
                      <td>R$ {(service.valorCobrado || service.ValorCobrado || 0).toFixed(2)}</td>
                      <td>{service.statusServico || service.StatusServico}</td>
                      <td>{resp}</td>
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