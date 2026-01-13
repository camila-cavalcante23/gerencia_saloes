import { useState } from "react";
import {
  Calendar,
  Home,
  DollarSign,
  TrendingUp,
  User,
  Clock,
  CheckCircle,
  Zap,
  Star,
  Trash2,
  Briefcase,
} from "lucide-react";
import "./dashboard.css";

import Navbar from "../../components/Navbar"; 

function Dashboard() {
  const [services] = useState([
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

  const scheduledCount = services.filter((s) => s.type === "agendado").length;
  const completedCount = services.filter((s) => s.completed).length;
  const todayRevenue = "R$ 70.00";

  const today = new Date();
  const daysOfWeek = [
    "domingo",
    "segunda-feira",
    "terça-feira",
    "quarta-feira",
    "quinta-feira",
    "sexta-feira",
    "sábado",
  ];
  const months = [
    "janeiro",
    "fevereiro",
    "março",
    "abril",
    "maio",
    "junho",
    "julho",
    "agosto",
    "setembro",
    "outubro",
    "novembro",
    "dezembro",
  ];

  const dayName = daysOfWeek[today.getDay()];
  const day = today.getDate();
  const month = months[today.getMonth()];
  const formattedDate = `${dayName}, ${day} de ${month}`;

  return (
    <div className="dashboard-page">
      
      <Navbar />

      <main className="dashboard-main">
        <div className="dashboard-header">
          <div className="dashboard-title-section">
            <div className="dashboard-title-icon">
              <Home size={32} />
            </div>
            <div>
              <h2>Agenda de Hoje</h2>
              <p className="dashboard-date">{formattedDate}</p>
            </div>
          </div>
        </div>

        <div className="summary-cards">
          <div className="summary-card">
            <div className="summary-icon">
              <Calendar size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">AGENDADOS</p>
              <p className="summary-value">{scheduledCount}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <CheckCircle size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">CONCLUÍDOS</p>
              <p className="summary-value">{completedCount}</p>
            </div>
          </div>

          <div className="summary-card">
            <div className="summary-icon">
              <DollarSign size={24} />
            </div>
            <div className="summary-content">
              <p className="summary-label">FATURAMENTO HOJE</p>
              <p className="summary-value">{todayRevenue}</p>
            </div>
          </div>
        </div>

        <div className="action-buttons">
          <button className="action-btn primary">
            <Calendar size={18} />
            <span>Agendar Serviço</span>
          </button>
          <button className="action-btn secondary">
            <Zap size={18} />
            <span>Adicionar Encaixe</span>
          </button>
          <button className="action-btn tertiary">
            <Star size={18} />
            <span>Finalizar Dia</span>
          </button>
        </div>

        <div className="services-section">
          <h3 className="services-title">Atendimento de Hoje</h3>
          <div className="services-list">
            {services.map((service) => (
              <div key={service.id} className="service-card">
                <div
                  className={`service-time-icon ${
                    service.type === "encaixe" ? "encaixe" : ""
                  }`}
                >
                  {service.type === "encaixe" ? (
                    <Zap size={20} />
                  ) : (
                    <Clock size={20} />
                  )}
                  <span className="service-time">{service.time}</span>
                </div>
                <div className="service-info">
                  <p className="service-client">{service.client}</p>
                  <div className="service-tags">
                    <span className={`service-tag ${service.statusColor}`}>
                      {service.status}
                    </span>
                    {service.completed && (
                      <span className="service-tag green">Concluído</span>
                    )}
                  </div>
                </div>
                <div className="service-actions">
                  <div className="service-value">
                    <p className="value-label">Valor Total</p>
                    <p className="value-amount">{service.totalValue}</p>
                  </div>
                  {!service.completed && service.type === "agendado" && (
                    <div className="service-buttons">
                      <button className="service-btn green">Concluído</button>
                      <button className="service-btn orange">
                        Não compareceu
                      </button>
                      <button className="service-btn red">
                        <Trash2 size={14} />
                        Deletar
                      </button>
                    </div>
                  )}
                  {service.completed && (
                    <div className="service-buttons">
                      <button className="service-btn red">
                        <Trash2 size={14} />
                        Deletar
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;