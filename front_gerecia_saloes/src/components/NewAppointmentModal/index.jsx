import React, { useState, useEffect, useRef } from 'react';
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

  const [searchTerm, setSearchTerm] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef(null); 


  const filteredServices = servicesList.filter(item =>
    item.nomeServico.toLowerCase().includes(searchTerm.toLowerCase())
  );


  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();

  const handleSelectService = (service) => {
    const price = service.valorPadrao.toFixed(2).replace('.', ',');
    setFormData(prev => ({ 
        ...prev, 
        service: service.nomeServico,
        value: `R$ ${price}` 
    }));
    setSearchTerm(service.nomeServico);
    setShowDropdown(false); 
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault(); 
    if (!formData.client || !formData.time || !formData.service) {
      alert("Por favor, preencha pelo menos Nome, Horário e Serviço.");
      return;
    }
    onSave(formData); 
    setFormData({ date: new Date().toISOString().split('T')[0], time: '', client: '', phone: '', service: '', value: '', notes: '', responsible: '' });
    setSearchTerm('');
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
              <input type="date" name="date" className="modal-input" value={formData.date} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Horário</label>
              <input type="time" name="time" className="modal-input" value={formData.time} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Nome do Cliente</label>
              <input type="text" name="client" placeholder="Digite o nome" className="modal-input" value={formData.client} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input type="tel" name="phone" placeholder="(00) 00000-0000" className="modal-input" value={formData.phone} onChange={handleChange} />
            </div>
          </div>

          <div className="form-row">
     
            <div className="form-group" ref={dropdownRef} style={{ position: 'relative' }}>
              <label>Serviço</label>
              <input 
                type="text" 
                className="modal-input" 
                placeholder="Busque o serviço..." 
                value={searchTerm}
                autoComplete="off"
                onFocus={() => setShowDropdown(true)}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setShowDropdown(true);
                }}
              />
              
              {showDropdown && (
                <ul className="dropdown-search">
                  {filteredServices.map((item) => (
                    <li key={item.idTipoServico} onClick={() => handleSelectService(item)}>
                      {item.nomeServico}
                    </li>
                  ))}
                  {filteredServices.length === 0 && (
                    <li className="no-results">Nenhum serviço encontrado</li>
                  )}
                </ul>
              )}
            </div>

            <div className="form-group">
              <label>Valor(R$)</label>
              <input type="text" name="value" placeholder="R$ 0,00" className="modal-input" value={formData.value} onChange={handleChange} />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Responsável (Opcional)</label>
            <select className="modal-input default-select" name="responsible" value={formData.responsible} onChange={handleChange}>
                <option value="">-- Selecione quem vai atender --</option>
                {employeesList.map((func) => (
                    <option key={func.idUsuario || func.id} value={func.nome || func.Nome}>
                      {func.nome || func.Nome}
                    </option>
                ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Observações (Opcional)</label>
            <textarea name="notes" className="modal-textarea" value={formData.notes} onChange={handleChange}></textarea>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save">
              <Save size={18} /> Salvar Agendamento
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewAppointmentModal;