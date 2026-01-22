import React, { useState } from 'react';
import { X, Save, Zap, Lightbulb } from 'lucide-react';
import './modal.css';


const QuickFitInModal = ({ isOpen, onClose, onSave }) => {
 
  const initialFormState = {
    service: '',
    quantity: '1',
    value: '',
    professional: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

 
  const handleSubmit = (e) => {
    e.preventDefault();

    
    if (!formData.service || !formData.value) {
      alert("Preencha o Serviço e o Valor.");
      return;
    }

    onSave(formData); 
    
    setFormData(initialFormState); 
    onClose(); 
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="title-icon orange">
              <Zap size={24} color="#FFF" />
            </div>
            <div>
              <h2>Adicionar Encaixe Rápido</h2>
              <p className="subtitle">Para registrar atendimentos feitos agora, sem hora marcada</p>
            </div>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group full-width">
            <label>Serviço realizado *</label>
            <select 
              className="modal-input default-select"
              name="service"
              value={formData.service}
              onChange={handleChange}
            >
              <option value="" disabled>Selecione o tipo de Serviço</option>
              <option value="Corte">Corte</option>
              <option value="Barba">Barba</option>
              <option value="Sobrancelha">Sobrancelha</option>
              <option value="Corte + Barba">Corte + Barba</option>
            </select>
          </div>

          <div className="form-group full-width">
            <label>Quantidade *</label>
            <select 
              className="modal-input default-select"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
            >
              <option value="1">1</option>
              <option value="2">2</option>
              <option value="3">3</option>
              <option value="4">4</option>
            </select>
            <span className="helper-text">quantos serviços deste tipo foram realizados?</span>
          </div>

          <div className="form-group full-width">
            <label>Valor Total (R$)</label>
            <input 
              type="text" 
              name="value"
              placeholder="R$ 0,00" 
              className="modal-input"
              value={formData.value}
              onChange={handleChange}
            />
          </div>

          <div className="form-group full-width">
            <label>Quem fez (Opcional)</label>
            <input 
              type="text" 
              name="professional"
              className="modal-input" 
              placeholder="Nome do profissional"
              value={formData.professional}
              onChange={handleChange}
            />
          </div>

          <div className="tip-box">
            <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Lightbulb size={20} className="tip-icon" />
            </div>
            <p><strong>Dica:</strong> O encaixe será registrado como "Concluído" automaticamente e já contará no faturamento do dia.</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save green">
              <Save size={18} />
              Registrar Encaixe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickFitInModal;