
import React, { useState } from 'react';
import { X, Save, Users } from 'lucide-react'; 
import './modal.css';

const NewEmployeeModal = ({ isOpen, onClose, onSave }) => {

  const [formData, setFormData] = useState({
    name: '',
    salary: '',
    phone: '',
    admissionDate: ''
  });

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
 
    if (!formData.name || !formData.salary || !formData.admissionDate) {
      alert("Por favor, preencha os campos obrigatórios.");
      return;
    }

 
    onSave(formData);
    
  
    setFormData({ name: '', salary: '', phone: '', admissionDate: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        
  
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="title-icon orange-users">
              <Users size={24} color="#FFF" />
            </div>
            <h2>Adicionar funcionário</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

     
        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group full-width">
            <label>Nome do funcionário*</label>
            <input 
              type="text" 
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="modal-input" 
              placeholder="Digite o nome Completo" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Salário mensal (R$)*</label>
              <input 
                type="text" 
                name="salary"
                value={formData.salary}
                onChange={handleChange}
                className="modal-input" 
                placeholder="R$ 0,00" 
              />
            </div>
            <div className="form-group">
              <label>Telefone</label>
              <input 
                type="tel" 
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="modal-input" 
                placeholder="(00) 00000-0000" 
              />
            </div>
          </div>

          <div className="form-group full-width">
            <label>Data de admissão</label>
            <input 
              type="date" 
              name="admissionDate"
              value={formData.admissionDate}
              onChange={handleChange}
              className="modal-input" 
            />
          </div>

        
          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save blue"> 
              <Save size={18} />
              Salvar funcionário
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewEmployeeModal;