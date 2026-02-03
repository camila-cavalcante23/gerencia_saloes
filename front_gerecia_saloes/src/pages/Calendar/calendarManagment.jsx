import { useState, useEffect } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./calendarManagment.css";
import api from "../../services/axios";
import Navbar from "../../components/Navbar";

function CalendarManagment() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState("month");
  const [servicos, setServicos] = useState([]);
  
  const months = [
    "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro",
  ];

  const daysOfWeek = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

  const getDaysInMonth = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }

    return days;
  };

  const navigateMonth = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const navigateYear = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setFullYear(newDate.getFullYear() - 1);
      } else {
        newDate.setFullYear(newDate.getFullYear() + 1);
      }
      return newDate;
    });
  };

  const navigateDay = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 1);
      } else {
        newDate.setDate(newDate.getDate() + 1);
      }
      return newDate;
    });
  };

  const navigateWeek = (direction) => {
    setCurrentDate((prevDate) => {
      const newDate = new Date(prevDate);
      if (direction === "prev") {
        newDate.setDate(newDate.getDate() - 7);
      } else {
        newDate.setDate(newDate.getDate() + 7);
      }
      return newDate;
    });
  };

  const getWeekDays = (date) => {
    const dateCopy = new Date(date);
    const day = dateCopy.getDay();
    const diff = dateCopy.getDate() - day;
    const weekStart = new Date(dateCopy);
    weekStart.setDate(diff);
    const weekDays = [];

    for (let i = 0; i < 7; i++) {
      const weekDay = new Date(weekStart);
      weekDay.setDate(weekStart.getDate() + i);
      weekDays.push(weekDay);
    }

    return weekDays;
  };

  const getDaysInMonthForYear = (year, month) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days = [];
    for (let i = 0; i < startingDayOfWeek; i++) {
      days.push(null);
    }
    for (let day = 1; day <= daysInMonth; day++) {
      days.push(day);
    }
    return days;
  };

  const formatDateToString = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };


  const loadServicos = async () => {
    try {
      let endpoint = '/Servicos/anual';
      let params = {};
      
      if (viewMode === 'mes') {
        endpoint = '/Servicos/mes';
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        params = { ano: year, mes: month };
      } else if (viewMode === 'semana') {
        endpoint = '/Servicos/semana';
        const weekStart = getWeekDays(new Date(currentDate))[0];
        const weekEnd = getWeekDays(new Date(currentDate))[6];
        params = { 
          dataInicio: formatDateToString(weekStart),
          dataFim: formatDateToString(weekEnd)
        };
      } else if (viewMode === 'dia') {
        endpoint = '/Servicos/dia';
        params = { data: formatDateToString(currentDate) };
      }

      const response = await api.get(endpoint, { params });

      const servicosNormalizados = response.data.map(servico => {
        const dataRaw = servico.dataServico || servico.DataServico || servico.data || "";
        const horarioRaw = servico.horario || servico.Horario || "00:00";
        const observacoes = servico.observacoes || servico.Observacoes || "";
        
        
        let timeStr = horarioRaw.includes('T') ? horarioRaw.substring(11, 16) : horarioRaw.substring(0, 5);
    
        let dateStr = dataRaw.length >= 10 ? dataRaw.substring(0, 10) : "";

        
        const isEncaixe = observacoes.includes("Encaixe") || (servico.clienteNome || "").includes("Encaixe");
        
        if (isEncaixe && timeStr < "04:00") {
    
            const dateObj = new Date(dateStr);
            dateObj.setDate(dateObj.getDate() + 1); 
          
            
           
            const d = new Date(dataRaw); 
            d.setHours(d.getHours() - 3); 
            
          
            const year = d.getFullYear();
            const month = String(d.getMonth() + 1).padStart(2, '0');
            const day = String(d.getDate()).padStart(2, '0');
            dateStr = `${year}-${month}-${day}`;

         
            const h = String(d.getHours()).padStart(2, '0');
            const m = String(d.getMinutes()).padStart(2, '0');
            timeStr = `${h}:${m}`;
        }
       

        return {
          id: servico.idServico || servico.IdServico,
          data: dateStr,
          cliente: servico.clienteNome || servico.ClienteNome,
          horario: timeStr,
          status: servico.statusServico || servico.StatusServico
        };
      });

      setServicos(servicosNormalizados);
    } catch (error) {
      console.error('Erro ao carregar serviços:', error);
      setServicos([]);
    }
  };

  const getServicosCountByDate = (date) => {
    const dateStr = formatDateToString(date);
    return servicos.filter(servico => servico.data === dateStr).length;
  };

  const getServicosByDateAndHour = (date, hour) => {
    const dateStr = formatDateToString(date);
    return servicos.filter(servico => {
      if (servico.data !== dateStr) return false;
      if (servico.horario) {
        const [h] = servico.horario.split(':');
        return parseInt(h) === hour;
      }
      return false;
    });
  };

  useEffect(() => {
    loadServicos();
  }, [viewMode, currentDate]);

  const currentMonth = months[currentDate.getMonth()];
  const currentYear = currentDate.getFullYear();
  const currentDay = currentDate.getDate();
  const days = getDaysInMonth(currentDate);

  return (
    <div className="calendar-page">
      
      <Navbar />

      <main className="main-content">
        
        <div className="content-wrapper">

            <div className="page-title-section">
              <div className="title-text">
                <h2>Agenda Completa</h2>
                <p>Planejamento e visualização</p>
              </div>
            </div>

            <div className="view-selector">
              <button
                className={`view-btn ${viewMode === "month" ? "active" : ""}`}
                onClick={() => setViewMode("month")}
              >
                <Calendar size={18} />
                <span>Mês</span>
              </button>
              <button
                className={`view-btn ${viewMode === "week" ? "active" : ""}`}
                onClick={() => setViewMode("week")}
              >
                <Calendar size={18} />
                <span>Semana</span>
              </button>
              <button
                className={`view-btn ${viewMode === "day" ? "active" : ""}`}
                onClick={() => setViewMode("day")}
              >
                <Calendar size={18} />
                <span>Dia</span>
              </button>
              <button
                className={`view-btn ${viewMode === "year" ? "active" : ""}`}
                onClick={() => setViewMode("year")}
              >
                <Calendar size={18} />
                <span>Ano</span>
              </button>
            </div>

            {viewMode === "week" && (
              <div className="calendar-container">
                <div className="calendar-header">
                  <button
                    className="nav-arrow"
                    onClick={() => navigateWeek("prev")}
                    aria-label="Semana anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="calendar-month-year">
                    {getWeekDays(new Date(currentDate))[0].getDate()} -{" "}
                    {getWeekDays(new Date(currentDate))[6].getDate()} de{" "}
                    {months[getWeekDays(new Date(currentDate))[0].getMonth()]}{" "}
                    {getWeekDays(new Date(currentDate))[0].getFullYear()}
                  </h3>
                  <button
                    className="nav-arrow"
                    onClick={() => navigateWeek("next")}
                    aria-label="Próxima semana"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="week-view-content">
                  <div className="week-time-header">
                    <div className="week-time-label"></div>
                    {getWeekDays(new Date(currentDate)).map((day, index) => (
                      <div key={index} className="week-day-header">
                        <div className="week-day-name">
                          {daysOfWeek[day.getDay()]}
                        </div>
                        <div className="week-day-number">
                          {day.getDate()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="week-time-slots">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="week-time-row">
                        <div className="week-time-label">
                          {String(hour).padStart(2, "0")}:00
                        </div>
                        {getWeekDays(new Date(currentDate)).map((day, dayIndex) => {
                          const servicosNoHorario = getServicosByDateAndHour(day, hour);
                          
                          return (
                            <div
                              key={dayIndex}
                              className="week-time-cell"
                              onClick={() => {
                                setCurrentDate(day);
                                setViewMode("day");
                              }}
                            >
                              {servicosNoHorario.length > 0 && (
                                <div className="servicos-indicators">
                                  {Array.from({ length: Math.min(servicosNoHorario.length, 3) }, (_, i) => (
                                    <span key={i} className="servico-dot"></span>
                                  ))}
                                  {servicosNoHorario.length > 3 && (
                                    <span className="servico-count">+{servicosNoHorario.length - 3}</span>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {viewMode === "month" && (
              <div className="calendar-container">
                <div className="calendar-header">
                  <button
                    className="nav-arrow"
                    onClick={() => navigateMonth("prev")}
                    aria-label="Mês anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="calendar-month-year">
                    {currentMonth} de {currentYear}
                  </h3>
                  <button
                    className="nav-arrow"
                    onClick={() => navigateMonth("next")}
                    aria-label="Próximo mês"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="calendar-grid">
                  {daysOfWeek.map((day) => (
                    <div key={day} className="day-header">
                      {day}
                    </div>
                  ))}

                  {days.map((day, index) => {
                    if (!day) {
                      return (
                        <button
                          key={index}
                          className="calendar-day empty"
                          disabled
                        />
                      );
                    }
                    
                    const dayDate = new Date(currentYear, currentDate.getMonth(), day);
                    const servicosCount = getServicosCountByDate(dayDate);
                    
                    return (
                      <button
                        key={index}
                        className={`calendar-day ${day === currentDate.getDate() && 
                          currentDate.getMonth() === new Date().getMonth() && 
                          currentYear === new Date().getFullYear() ? "today" : ""}`}
                      >
                        <span className="day-number">{day}</span>
                        {servicosCount > 0 && (
                          <div className="servicos-indicators">
                            {Array.from({ length: Math.min(servicosCount, 3) }, (_, i) => (
                              <span key={i} className="servico-dot"></span>
                            ))}
                            {servicosCount > 3 && (
                              <span className="servico-count">+{servicosCount - 3}</span>
                            )}
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "year" && (
              <div className="calendar-container">
                <div className="calendar-header">
                  <button
                    className="nav-arrow"
                    onClick={() => navigateYear("prev")}
                    aria-label="Ano anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="calendar-month-year">{currentYear}</h3>
                  <button
                    className="nav-arrow"
                    onClick={() => navigateYear("next")}
                    aria-label="Próximo ano"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="year-grid">
                  {months.map((month, monthIndex) => {
                    const monthDays = getDaysInMonthForYear(
                      currentYear,
                      monthIndex
                    );
                    return (
                      <div key={monthIndex} className="year-month-card">
                        <h4 className="year-month-title">{month}</h4>
                        <div className="year-month-grid">
                          {daysOfWeek.map((day) => (
                            <div key={day} className="year-day-header">
                              {day}
                            </div>
                          ))}
                          {monthDays.map((day, dayIndex) => {
                            if (!day) {
                              return (
                                <button
                                  key={dayIndex}
                                  className="year-calendar-day empty"
                                  disabled
                                />
                              );
                            }
                            
                            const dayDate = new Date(currentYear, monthIndex, day);
                            const servicosCount = getServicosCountByDate(dayDate);
                            
                            return (
                              <button
                                key={dayIndex}
                                className={`year-calendar-day ${
                                  day &&
                                  monthIndex === currentDate.getMonth() &&
                                  day === currentDate.getDate()
                                    ? "today"
                                    : ""
                                }`}
                                onClick={() => {
                                  setCurrentDate(dayDate);
                                  setViewMode("day");
                                }}
                              >
                                <span className="day-number">{day}</span>
                                {servicosCount > 0 && (
                                  <div className="servicos-indicators">
                                    {Array.from({ length: Math.min(servicosCount, 3) }, (_, i) => (
                                      <span key={i} className="servico-dot"></span>
                                    ))}
                                    {servicosCount > 3 && (
                                      <span className="servico-count">+{servicosCount - 3}</span>
                                    )}
                                  </div>
                                )}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {viewMode === "day" && (
              <div className="calendar-container">
                <div className="calendar-header">
                  <button
                    className="nav-arrow"
                    onClick={() => navigateDay("prev")}
                    aria-label="Dia anterior"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <h3 className="calendar-month-year">
                    {currentDay} de {currentMonth} de {currentYear}
                  </h3>
                  <button
                    className="nav-arrow"
                    onClick={() => navigateDay("next")}
                    aria-label="Próximo dia"
                  >
                    <ChevronRight size={20} />
                  </button>
                </div>

                <div className="day-view-content">
                  <div className="day-time-slots">
                    {Array.from({ length: 24 }, (_, hour) => {
                      const servicosNoHorario = getServicosByDateAndHour(currentDate, hour);
                      
                      return (
                        <div key={hour} className="time-slot">
                          <div className="time-label">
                            {String(hour).padStart(2, "0")}:00
                          </div>
                          <div className="time-content">
                            {servicosNoHorario.length > 0 && (
                              <div className="servicos-indicators">
                                {Array.from({ length: Math.min(servicosNoHorario.length, 3) }, (_, i) => (
                                  <span key={i} className="servico-dot"></span>
                                ))}
                                {servicosNoHorario.length > 3 && (
                                  <span className="servico-count">+{servicosNoHorario.length - 3}</span>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
        </div>
      </main>
    </div>
  );
}

export default CalendarManagment;