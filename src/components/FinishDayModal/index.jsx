import React from 'react';
import { X, Star, Calendar, CheckCircle, XCircle, DollarSign } from 'lucide-react';
import './modal.css';

const FinishDayModal = ({ isOpen, onClose, summary, onConfirm }) => {
  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="title-icon orange-star">
              <Star size={24} color="#FFF" fill="#FFF" />
            </div>
            <h2>Resumo do Dia</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <div className="modal-content-scroll">
          
         
          <div className="info-card date-theme">
            <div className="card-label-row">
              <Calendar size={18} />
              <span>Data</span>
            </div>
            <p className="card-main-text capitalize">{summary?.date}</p>
          </div>

          <div className="stats-row">
            
            
            <div className="stat-card green-stat">
              <div className="stat-header">
                <CheckCircle size={16} />
                <span>Concluídos</span>
              </div>
              <p className="stat-number">{summary?.completed || 0}</p>
            </div>

           
            <div className="stat-card red-stat">
              <div className="stat-header">
                <XCircle size={16} />
                <span>Não compareceram</span>
              </div>
              <p className="stat-number">{summary?.noShow || 0}</p>
            </div>

         
            <div className="stat-card purple-stat">
              <div className="stat-header">
                <Calendar size={16} />
                <span>Pendentes</span>
              </div>
              <p className="stat-number">{summary?.pending || 0}</p>
            </div>

          </div>

         
          <div className="info-card revenue-theme">
            <div className="card-label-row">
              <div className="revenue-icon-box">
                <DollarSign size={20} color="#FFF" />
              </div>
              <span className="revenue-label">Faturamento Total</span>
            </div>
            <p className="revenue-amount">{summary?.revenue || "R$ 0,00"}</p>
          </div>

        </div>

        <div className="modal-footer">
          <button type="button" className="btn-back" onClick={onClose}>
            Voltar
          </button>
          
         
          <button type="button" className="btn-confirm" onClick={onConfirm}>
            <Star size={18} fill="#FFF" />
            Confirmar Fechamento
          </button>
        </div>

      </div>
    </div>
  );
};

export default FinishDayModal;