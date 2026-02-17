import React, { useState, useEffect, useRef } from 'react';
import { X, Save, Zap, Lightbulb } from 'lucide-react';
import './modal.css';

const QuickFitInModal = ({ isOpen, onClose, onSave, servicesList = [], employeesList = [] }) => {
  const initialFormState = {
    service: '',
    quantity: '1', 
    value: '',
    professional: '',
    observation: '' 
  };

  const [formData, setFormData] = useState(initialFormState);
  

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

  useEffect(() => {
     if(formData.service) {
         const selected = servicesList.find(s => s.nomeServico === formData.service);
         if(selected) {
             const unitPrice = selected.valorPadrao || 0;
             const qty = parseInt(formData.quantity) || 1; 
             const total = unitPrice * qty;
             
             setFormData(prev => ({
                 ...prev,
                 value: `R$ ${total.toFixed(2).replace('.', ',')}`
             }));
         }
     }
  }, [formData.service, formData.quantity, servicesList]);

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();

  const handleSelectService = (service) => {
    setFormData(prev => ({ ...prev, service: service.nomeServico }));
    setSearchTerm(service.nomeServico);
    setShowDropdown(false);
  };

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
    setSearchTerm('');
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
          
          
          <div className="form-group full-width" ref={dropdownRef} style={{ position: 'relative' }}>
            <label>Serviço realizado *</label>
            <input 
              type="text" 
              className="modal-input" 
              placeholder="Digite para buscar (ex: cort, unh)" 
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

          <div className="form-group full-width">
            <label>Quantidade *</label>
            <input 
              type="number"
              min="1"
              className="modal-input"
              name="quantity"
              value={formData.quantity}
              onChange={handleChange}
              placeholder="Ex: 1"
            />
            <span className="helper-text">Quantos serviços deste tipo foram realizados?</span>
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
            <select className="modal-input default-select" name="professional" value={formData.professional} onChange={handleChange}>
              <option value="">-- Selecione quem atendeu --</option>
              {employeesList && employeesList.map((func) => (
                  <option key={func.idUsuario || func.id} value={func.nome || func.Nome}>{func.nome || func.Nome}</option>
              ))}
            </select>
          </div>

          <div className="form-group full-width">
            <label>Observações (Opcional)</label>
            <textarea name="observation" className="modal-textarea" placeholder="Detalhes sobre o atendimento..." value={formData.observation} onChange={handleChange} rows="2"></textarea>
          </div>

          <div className="tip-box">
            <div style={{ flexShrink: 0, marginTop: 2 }}>
                <Lightbulb size={20} className="tip-icon" />
            </div>
            <p><strong>Dica:</strong> O encaixe será registrado como "Concluído" automaticamente.</p>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancelar</button>
            <button type="submit" className="btn-save green">
              <Save size={18} /> Registrar Encaixe
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default QuickFitInModal;