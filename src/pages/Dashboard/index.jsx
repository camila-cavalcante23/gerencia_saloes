import { useState, useEffect } from "react";
import {
  Calendar,
  Home,
  DollarSign,
  CheckCircle,
  Zap,
  Star,
  Trash2,
  Clock,
  CalendarDays
} from "lucide-react";
import { useNavigate } from 'react-router-dom';
import "./dashboard.css";

import api from "../../services/axios"; 
import Navbar from "../../components/Navbar"; 
import NewAppointmentModal from "../../components/NewAppointmentModal";
import QuickFitInModal from "../../components/QuickFitInModal";
import FinishDayModal from "../../components/FinishDayModal";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickFitModalOpen, setIsQuickFitModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [services, setServices] = useState([]); 
  const [availableServices, setAvailableServices] = useState([]); 
  

  const [nextAppointments, setNextAppointments] = useState([]);

  const navigate = useNavigate();

  const getLocalDate = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`; 
  };

  const loadDashboardData = async () => {
    try {
      
      const responseTipos = await api.get('/TiposServico');
      const tiposDisponiveis = responseTipos.data;
      setAvailableServices(tiposDisponiveis);

    
      const responseApp = await api.get('/Servicos/hoje');
      const hojeStr = getLocalDate();

     
      const formattedAppointments = responseApp.data.map(app => {
        const idSeguro = app.idServico || app.IdServico || app.id;
        const clienteSeguro = app.clienteNome || app.ClienteNome || "Cliente";
        const dataRaw = app.dataServico || app.DataServico || app.data;
        const dataItemStr = dataRaw ? dataRaw.split('T')[0] : ""; 

        let idTipoServicoSeguro = app.idTipoServico || app.IdTipoServico || 0;
        if (idTipoServicoSeguro === 0 && tiposDisponiveis.length > 0) {
             const servicoEncontrado = tiposDisponiveis.find(tipo => 
                 clienteSeguro.toLowerCase().includes(tipo.nomeServico.toLowerCase())
             );
             if (servicoEncontrado) idTipoServicoSeguro = servicoEncontrado.idTipoServico;
        }

        const horarioRaw = app.horario || app.Horario;
        const timeSeguro = horarioRaw 
            ? (horarioRaw.includes('T') ? horarioRaw.substring(11, 16) : horarioRaw.substring(0, 5)) 
            : "00:00";

        const valorSeguro = app.valorCobrado || app.ValorCobrado || app.valor || 0;
        const statusSeguro = app.statusServico || app.StatusServico || app.status || "Agendado";
        const tipoSeguro = app.observacoes === "Encaixe Rápido" ? "encaixe" : "agendado";
        const isCompleted = statusSeguro === "Concluído" || statusSeguro === "Concluido" || statusSeguro === "Encaixe";

        return {
            id: idSeguro, 
            time: timeSeguro,
            date: dataItemStr,
            client: clienteSeguro,
            status: statusSeguro,
            statusColor: getStatusColor(statusSeguro),
            totalValue: valorSeguro,
            completed: isCompleted,
            type: tipoSeguro,
            serviceTypeId: idTipoServicoSeguro
        };
      })
      .filter(item => item.id !== undefined && item.id !== null)
      .filter(item => item.date === hojeStr) 
      .sort((a, b) => {
          if (a.completed === b.completed) return a.time.localeCompare(b.time);
          return a.completed ? 1 : -1; 
      });

      setServices(formattedAppointments);

      
      try {
          const responseAnual = await api.get('/Servicos/anual'); 
          
          const futuros = responseAnual.data
            .map(app => {
                const dataRaw = app.dataServico || app.DataServico || app.data;
                const dataItemStr = dataRaw ? dataRaw.split('T')[0] : "";
                
                return {
                    id: app.idServico || app.IdServico,
                    client: app.clienteNome || app.ClienteNome,
                    date: dataItemStr,
                    time: app.horario || app.Horario,
                    status: app.statusServico || app.StatusServico
                };
            })
            .filter(item => item.date > hojeStr) 
            .filter(item => item.status !== "Cancelado" && item.status !== "Deletado") 
            .sort((a, b) => a.date.localeCompare(b.date)); 

   
          setNextAppointments(futuros.slice(0, 5)); 

      } catch (err) {
          console.warn("Não foi possível carregar futuros", err);
      }

    } catch (error) {
      console.error("Erro dashboard:", error);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const getStatusColor = (status) => {
      if (status === "Concluído" || status === "Concluido") return "green";
      if (status === "Não compareceu") return "red";
      if (status === "Encaixe") return "yellow";
      return "purple";
  };


  const handleAddService = async (newServiceData) => {
    try {
        const timeStr = newServiceData.time; 
        const dateToSave = newServiceData.date || getLocalDate(); 

        const serviceObj = availableServices.find(s => s.nomeServico === newServiceData.service);
        const serviceId = serviceObj ? serviceObj.idTipoServico : 0;
        const val = typeof newServiceData.value === 'string' 
            ? parseFloat(newServiceData.value.replace("R$", "").replace(/\./g, "").replace(",", ".")) 
            : newServiceData.value;

        const payload = {
            Horario: timeStr,      
            DataServico: dateToSave,
            ClienteNome: `${newServiceData.client} - ${newServiceData.service}`,
            ValorCobrado: val || 0, 
            StatusServico: "Agendado",
            IdTipoServico: serviceId 
        };
        
        await api.post('/Servicos/agendar', payload);
        await loadDashboardData();
        setIsModalOpen(false);
    } catch (error) {
        if (error.response?.data) alert(`Erro: ${JSON.stringify(error.response.data)}`);
    }
  };

  const handleAddQuickFitIn = async (data) => {
    try {
        const now = new Date();
        const horas = now.getHours().toString().padStart(2, '0');
        const minutos = now.getMinutes().toString().padStart(2, '0');
        const timeStr = `${horas}:${minutos}`; 
        const dateStr = getLocalDate();

        const serviceObj = availableServices.find(s => s.nomeServico === data.service);
        const serviceId = serviceObj ? serviceObj.idTipoServico : 0;

        const quantity = parseInt(data.quantity) || 1;
        const valTotal = typeof data.value === 'string' 
            ? parseFloat(data.value.replace("R$", "").replace(/\./g, "").replace(",", ".")) 
            : data.value;
        const valUnitario = valTotal / quantity;

        for (let i = 0; i < quantity; i++) {
            const payload = {
                Horario: timeStr, 
                DataServico: dateStr, 
                ClienteNome: `Encaixe - ${data.service}`,
                ValorCobrado: valUnitario, 
                StatusServico: "Concluido", 
                Observacoes: "Encaixe Rápido", 
                IdTipoServico: serviceId
            };
            await api.post('/Servicos/encaixe', payload);
        }
        
        await loadDashboardData();
        setIsQuickFitModalOpen(false);
    } catch (error) {
        if (error.response?.data) alert(`Erro: ${JSON.stringify(error.response.data)}`);
    }
  };

  const handleDeleteService = async (idToDelete) => {
    if (window.confirm("Tem certeza que deseja excluir?")) {
        try {
            await api.delete(`/Servicos/${idToDelete}`);
            setServices((prev) => prev.filter(service => service.id !== idToDelete));
        } catch (error) {
            alert("Erro ao excluir");
        }
    }
  };
  
  const updateStatus = async (id, newStatus) => {
      const payload = { id: id, status: newStatus };
      try {
          await api.put(`/Servicos/${id}`, payload);
          await loadDashboardData();
      } catch (error) {
          console.error(error);
             alert("Erro ao atualizar status.");
      }
  }

  const handleCompleteService = (id) => updateStatus(id, "Concluido"); 
  const handleNoShowService = (id) => {
      if(window.confirm("Confirmar falta?")) updateStatus(id, "Não compareceu");
  };

  const handleConfirmFinishDay = async () => {
    const pendingServices = services.filter(s => s.status === "Agendado");
    try {
        if (pendingServices.length > 0) {
            await Promise.all(pendingServices.map(service => 
                api.put(`/Servicos/${service.id}`, { id: service.id, status: "Concluido" })
            ));
        }

        const pendingValue = pendingServices.reduce((acc, curr) => {
             const val = typeof curr.totalValue === 'number' ? curr.totalValue : parseFloat(curr.totalValue) || 0;
             return acc + val;
        }, 0);
        
        const currentRevenueNum = parseFloat(todayRevenue.replace("R$", "").replace(/\./g, "").replace(",", ".")) || 0;
        const totalFinal = currentRevenueNum + pendingValue;
        const totalFinalString = totalFinal.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

        alert(`Dia finalizado!\nFaturamento Final: ${totalFinalString}`);
        
        setServices([]); 
        setIsFinishModalOpen(false);
        navigate('/lucro'); 
        
    } catch (error) {
        alert("Erro ao finalizar.");
    }
  };

  const scheduledCount = services.filter((s) => !s.completed && s.status !== "Não compareceu").length;
  const completedCount = services.filter((s) => s.completed).length;
  const noShowCount = services.filter((s) => s.status === "Não compareceu").length;
  
  const todayRevenueValue = services.reduce((acc, curr) => {
      if (!curr.completed) return acc; 
      const val = typeof curr.totalValue === 'number' ? curr.totalValue : parseFloat(curr.totalValue) || 0;
      return acc + val;
  }, 0);
  
  const todayRevenue = `R$ ${todayRevenueValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;

  const today = new Date();
  const formattedDate = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });
  const fullDateString = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });


  const formatDateShort = (dateStr) => {
      if(!dateStr) return "";
      const parts = dateStr.split('-');
      return `${parts[2]}/${parts[1]}`;
  }
  

  const formatTimeShort = (timeStr) => {
      if(!timeStr) return "";
      if(timeStr.includes('T')) return timeStr.substring(11, 16);
      return timeStr.substring(0, 5);
  }

  return (
    <div className="dashboard-page">
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <div className="dashboard-title-icon"><Home size={32} /></div>
            <div>
              <h2>Agenda de Hoje</h2>
              <p className="dashboard-date">{formattedDate}</p>
            </div>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon"><Calendar size={24} /></div>
            <div className="summary-content">
              <p className="summary-label">PENDENTES</p>
              <p className="summary-value">{scheduledCount}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon"><CheckCircle size={24} /></div>
            <div className="summary-content">
              <p className="summary-label">CONCLUÍDOS</p>
              <p className="summary-value">{completedCount}</p>
            </div>
          </div>
          <div className="summary-card">
            <div className="summary-icon"><DollarSign size={24} /></div>
            <div className="summary-content">
              <p className="summary-label">FATURAMENTO</p>
              <p className="summary-value">{todayRevenue}</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => setIsModalOpen(true)}>
            <Calendar size={18} /> <span>Agendar Serviço</span>
          </button>
          <button className="action-btn secondary" onClick={() => setIsQuickFitModalOpen(true)}>
            <Zap size={18} /> <span>Adicionar Encaixe</span>
          </button>
          <button className="action-btn tertiary" onClick={() => setIsFinishModalOpen(true)}>
            <Star size={18} /> <span>Finalizar Dia</span>
          </button>
        </div>

        <div className="services-section">
          <h3 className="services-title">Atendimento de Hoje</h3>
       {services.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-state-icon-wrapper"><Calendar size={32} color="#4a9eff" /></div>
              <h3 className="empty-state-title">Tudo limpo por hoje</h3>
              <p className="empty-state-subtitle">Nenhum atendimento agendado para hoje</p>
            </div>
          ) : (
            <div className="services-list">
              {services.map((service) => (
                <div key={service.id} className="service-card">
                  <div className={`service-time-icon ${service.type === "encaixe" ? "encaixe" : ""}`}>
                    {service.type === "encaixe" ? <Zap size={20} /> : <Clock size={20} />}
                    <span className="service-time">{service.time}</span>
                  </div>
                  <div className="service-info">
                    <p className="service-client">{service.client}</p>
                    <div className="service-tags">
                      <span className={`service-tag ${service.statusColor}`}>{service.status}</span>
                      {service.completed && service.status !== "Não compareceu" && service.status !== "Concluído" && service.status !== "Concluido" && (
                        <span className="service-tag green">Concluído</span>
                      )}
                    </div>
                  </div>
                  <div className="service-actions">
                    <div className="service-value">
                      <p className="value-label">Valor Total</p>
                      <p className="value-amount">R$ {typeof service.totalValue === 'number' ? service.totalValue.toFixed(2).replace('.', ',') : service.totalValue}</p>
                    </div>
                    <div className="service-buttons">
                      {!service.completed && (
                          <>
                              <button className="service-btn green" onClick={() => handleCompleteService(service.id)}>Concluído</button>
                              {service.type === "agendado" && (
                                  <button className="service-btn orange" onClick={() => handleNoShowService(service.id)}>Não compareceu</button>
                              )}
                          </>
                      )}
                      <button className="service-btn red" onClick={() => handleDeleteService(service.id)}><Trash2 size={14} /> Deletar</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

    
        {nextAppointments.length > 0 && (
            <div className="future-section">
                <div className="future-header">
                    <CalendarDays size={20} color="#666" />
                    <h3>Próximos Agendamentos</h3>
                </div>
                <div className="future-grid">
                    {nextAppointments.map(app => (
                        <div key={app.id} className="future-card">
                            <div className="future-date-badge">
                                {formatDateShort(app.date)}
                            </div>
                            <div className="future-info">
                                <p className="future-client">{app.client}</p>
                                <p className="future-time">{formatTimeShort(app.time)}h</p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        )}

      </main>

      <NewAppointmentModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} onSave={handleAddService} servicesList={availableServices} />
      <QuickFitInModal isOpen={isQuickFitModalOpen} onClose={() => setIsQuickFitModalOpen(false)} onSave={handleAddQuickFitIn} servicesList={availableServices} />
      <FinishDayModal isOpen={isFinishModalOpen} onClose={() => setIsFinishModalOpen(false)} onConfirm={handleConfirmFinishDay} summary={{ date: fullDateString, completed: completedCount, noShow: noShowCount, pending: scheduledCount, revenue: todayRevenue }} />
    </div>
  );
}

export default Dashboard;