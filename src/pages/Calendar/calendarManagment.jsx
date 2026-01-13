import { useState } from "react";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import "./calendarManagment.css";


import Navbar from "../../components/Navbar";

function CalendarManagment() {
  const [currentDate, setCurrentDate] = useState(new Date(2025, 9, 1));
  const [viewMode, setViewMode] = useState("month");
  
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
                        <div className="week-day-number">{day.getDate()}</div>
                      </div>
                    ))}
                  </div>
                  <div className="week-time-slots">
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="week-time-row">
                        <div className="week-time-label">
                          {String(hour).padStart(2, "0")}:00
                        </div>
                        {getWeekDays(new Date(currentDate)).map((day, dayIndex) => (
                          <div
                            key={dayIndex}
                            className="week-time-cell"
                            onClick={() => {
                              setCurrentDate(day);
                              setViewMode("day");
                            }}
                          >
                          </div>
                        ))}
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

                  {days.map((day, index) => (
                    <button
                      key={index}
                      className={`calendar-day ${day ? "" : "empty"}`}
                      disabled={!day}
                    >
                      {day}
                    </button>
                  ))}
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
                          {monthDays.map((day, dayIndex) => (
                            <button
                              key={dayIndex}
                              className={`year-calendar-day ${day ? "" : "empty"} ${
                                day &&
                                monthIndex === currentDate.getMonth() &&
                                day === currentDate.getDate()
                                  ? "today"
                                  : ""
                              }`}
                              disabled={!day}
                              onClick={() => {
                                if (day) {
                                  setCurrentDate(
                                    new Date(currentYear, monthIndex, day)
                                  );
                                  setViewMode("day");
                                }
                              }}
                            >
                              {day}
                            </button>
                          ))}
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
                    {Array.from({ length: 24 }, (_, hour) => (
                      <div key={hour} className="time-slot">
                        <div className="time-label">
                          {String(hour).padStart(2, "0")}:00
                        </div>
                        <div className="time-content">
                        </div>
                      </div>
                    ))}
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