import React, { useState } from 'react';
import { X, Save, Calendar } from 'lucide-react';
import './modal.css';

const NewAppointmentModal = ({ isOpen, onClose, onSave, servicesList = [], employeesList = [] }) => {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0], 
    time: '',
    client: '',
    phone: '',
    service: '',
    value: '',
    notes: '',
    responsible: ''
  });

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name === 'service') {
        const selectedService = servicesList.find(s => s.nomeServico === value);
        let price = '';
        if (selectedService) {
            price = selectedService.valorPadrao.toFixed(2).replace('.', ',');
        }
        
        setFormData(prev => ({ 
            ...prev, 
            [name]: value,
            value: `R$ ${price}` 
        }));
    } else {
        setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!formData.client || !formData.time || !formData.service) {
      alert("Por favor, preencha pelo menos Nome, Horário e Serviço.");
      return;
    }
    onSave(formData); 
    
    setFormData({ date: '', time: '', client: '', phone: '', service: '', value: '', notes: '', responsible: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="title-icon">
              <Calendar size={20} color="#000" />
            </div>
            <h2>Agendar Serviço</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label>Data</label>
              <input 
                type="date" 
                name="date"
                className="modal-input" 
                value={formData.date}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Horário</label>
              <input 
                type="time" 
                name="time"
                className="modal-input" 
                value={formData.time}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome do Cliente</label>
              <input 
                type="text" 
                name="client"
                placeholder="Digite o nome" 
                className="modal-input" 
                value={formData.client}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input 
                type="tel" 
                name="phone"
                placeholder="(00) 00000-0000" 
                className="modal-input" 
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Serviço</label>
              <select 
                className="modal-input default-select" 
                name="service"
                value={formData.service}
                onChange={handleChange}
              >
                <option value="" disabled>Selecione o serviço</option>
                {servicesList.map((item) => (
                    <option key={item.idTipoServico} value={item.nomeServico}>
                        {item.nomeServico}
                    </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label>Valor(R$)</label>
              <input 
                type="text" 
                name="value"
                placeholder="R$ 0,00" 
                className="modal-input" 
                value={formData.value}
                onChange={handleChange}
              />
            </div>
          </div>

         
          <div className="form-group full-width">
            <label>Responsável (Opcional)</label>
            <select 
                className="modal-input default-select" 
                name="responsible"
                value={formData.responsible}
                onChange={handleChange}
            >
                <option value="">-- Selecione quem vai atender --</option>
                {employeesList && employeesList.map((func) => (
                    <option 
                      key={func.idUsuario || func.id || func.IdUsuario} 
                      value={func.nome || func.Nome}
                    >
                        {func.nome || func.Nome}
                    </option>
                ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Observações (Opcional)</label>
            <textarea 
              name="notes"
              className="modal-textarea"
              value={formData.notes}
              onChange={handleChange}
            ></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save">
              <Save size={18} />
              Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;