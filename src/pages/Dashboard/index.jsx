import { useState } from "react";
import {
  Calendar,
  Home,
  DollarSign,
  CheckCircle,
  Zap,
  Star,
  Trash2,
  Clock 
} from "lucide-react";
import "./dashboard.css";

import Navbar from "../../components/Navbar"; 
import NewAppointmentModal from "../../components/NewAppointmentModal";
import QuickFitInModal from "../../components/QuickFitInModal";
import FinishDayModal from "../../components/FinishDayModal";

function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isQuickFitModalOpen, setIsQuickFitModalOpen] = useState(false);
  const [isFinishModalOpen, setIsFinishModalOpen] = useState(false);

  const [services, setServices] = useState([
    {       
      id: 1,
      time: "10:00",
      client: "Mila",
      status: "Agendado",
      statusColor: "purple",
      totalValue: "R$ 70,00",
      completed: false,
      type: "agendado",
    },
    {
      id: 2,
      time: "10:09",
      client: "Mila",
      status: "Encaixe",
      statusColor: "yellow",
      totalValue: "R$ 70,00",
      completed: true,
      type: "encaixe",
    },
  ]);



  const handleAddService = (newServiceData) => {
    const newService = {
      id: Date.now(),
      time: newServiceData.time,
      client: newServiceData.client,
      status: "Agendado",
      statusColor: "purple",
      totalValue: newServiceData.value || "R$ 0,00",
      completed: false,
      type: "agendado",
    };
    setServices((prev) => [...prev, newService].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleAddQuickFitIn = (data) => {
    const now = new Date();
    const currentTime = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const quantity = parseInt(data.quantity) || 1;
    const newFitIns = [];
    
    for (let i = 0; i < quantity; i++) {
        newFitIns.push({
            id: Date.now() + i,
            time: currentTime,
            client: `Encaixe - ${data.service}`, 
            status: "Encaixe",
            statusColor: "yellow",
            totalValue: data.value,
            completed: true,
            type: "encaixe",
        });
    }
    setServices((prev) => [...prev, ...newFitIns].sort((a, b) => a.time.localeCompare(b.time)));
  };

  const handleDeleteService = (idToDelete) => {
    if (window.confirm("Tem certeza que deseja excluir este agendamento?")) {
      setServices((prev) => prev.filter(service => service.id !== idToDelete));
    }
  };
  
  const handleCompleteService = (idToComplete) => {
      setServices((prev) =>
        prev.map(service => 
            service.id === idToComplete 
            ? { ...service, completed: true, status: "Concluído", statusColor: "green" } 
            : service
        )
      );
  };

  const handleNoShowService = (idNoShow) => {
    if (window.confirm("Confirmar que o cliente não compareceu?")) {
      setServices((prev) =>
        prev.map(service => 
            service.id === idNoShow 
            ? { ...service, completed: true, status: "Não compareceu", statusColor: "red" } 
            : service
        )
      );
    }
  };

  
  const handleConfirmFinishDay = () => {
    
    alert(`Dia finalizado com sucesso!\nFaturamento Total: ${todayRevenue}`);
    
    setServices([]); 
    setIsFinishModalOpen(false); 
  };

  
  const scheduledCount = services.filter((s) => !s.completed && s.status !== "Não compareceu").length;
  

  const completedCount = services.filter((s) => s.completed && s.status !== "Não compareceu").length;
  

  const noShowCount = services.filter((s) => s.status === "Não compareceu").length;
  

  const todayRevenueValue = services.reduce((acc, curr) => {
      if (curr.status === "Não compareceu") return acc;
      const valueString = curr.totalValue.toString().replace("R$", "").replace(/\./g, "").replace(",", ".").trim();
      return acc + (parseFloat(valueString) || 0);
  }, 0);
  const todayRevenue = `R$ ${todayRevenueValue.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}`;


  const today = new Date();
  const daysOfWeek = ["domingo", "segunda-feira", "terça-feira", "quarta-feira", "quinta-feira", "sexta-feira", "sábado"];
  const months = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];
  const formattedDate = `${daysOfWeek[today.getDay()]}, ${today.getDate()} de ${months[today.getMonth()]}`;
  const fullDateString = today.toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

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
              <p className="summary-label">AGENDADOS</p>
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
              <p className="summary-label">FATURAMENTO HOJE</p>
              <p className="summary-value">{todayRevenue}</p>
            </div>
          </div>
        </div>

      
        <div className="action-buttons">
          <button className="action-btn primary" onClick={() => setIsModalOpen(true)}>
            <Calendar size={18} />
            <span>Agendar Serviço</span>
          </button>
          
          <button className="action-btn secondary" onClick={() => setIsQuickFitModalOpen(true)}>
            <Zap size={18} />
            <span>Adicionar Encaixe</span>
          </button>

          <button className="action-btn tertiary" onClick={() => setIsFinishModalOpen(true)}>
            <Star size={18} />
            <span>Finalizar Dia</span>
          </button>
        </div>

      
        <div className="services-section">
          <h3 className="services-title">Atendimento de Hoje</h3>
          {services.length === 0 ? (
             <p style={{ textAlign: 'center', color: '#999', marginTop: '2rem' }}>Nenhum serviço registrado hoje.</p>
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
                      {service.completed && service.status !== "Não compareceu" && <span className="service-tag green">Concluído</span>}
                    </div>
                  </div>
                  <div className="service-actions">
                    <div className="service-value">
                      <p className="value-label">Valor Total</p>
                      <p className="value-amount">{service.totalValue}</p>
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
      </main>


      
      <NewAppointmentModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        onSave={handleAddService} 
      />

      <QuickFitInModal 
        isOpen={isQuickFitModalOpen} 
        onClose={() => setIsQuickFitModalOpen(false)} 
        onSave={handleAddQuickFitIn} 
      />

      
      <FinishDayModal
        isOpen={isFinishModalOpen}
        onClose={() => setIsFinishModalOpen(false)}
        onConfirm={handleConfirmFinishDay} 
        summary={{
            date: fullDateString,
            completed: completedCount,
            noShow: noShowCount,
            pending: scheduledCount,
            revenue: todayRevenue
        }}
      />

    </div>
  );
}

export default Dashboard;