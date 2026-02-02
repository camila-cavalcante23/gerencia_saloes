import React, { useState } from 'react';
import { X, Save, Receipt } from 'lucide-react';
import './modal.css';

const NewExpenseModal = ({ isOpen, onClose, onSave }) => {

  const [formData, setFormData] = useState({
    description: '',
    value: '',
    date: ''
  });

  if (!isOpen) return null;

  const handleModalClick = (e) => e.stopPropagation();

  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    
    if (!formData.description || !formData.value || !formData.date) {
      alert("Por favor, preencha todos os campos.");
      return;
    }

    
    onSave(formData);
    
   
    setFormData({ description: '', value: '', date: '' });
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={handleModalClick}>
        
        <div className="modal-header">
          <div className="modal-title-group">
            <div className="title-icon orange-expense">
              <Receipt size={24} color="#FFF" />
            </div>
            <h2>Adicionar Despesa</h2>
          </div>
          <button className="close-btn" onClick={onClose}>
            <X size={24} />
          </button>
        </div>

        <form className="modal-form" onSubmit={handleSubmit}>
          
          <div className="form-group full-width">
            <label>Descrição*</label>
            <input 
              type="text" 
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="modal-input" 
              placeholder="Ex: conta de Luz, produtos" 
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label>Valor(R$)</label>
              <input 
                type="text" 
                name="value"
                value={formData.value}
                onChange={handleChange}
                className="modal-input" 
                placeholder="R$ 0,00" 
              />
            </div>
            <div className="form-group">
              <label>Data*</label>
              <input 
                type="date" 
                name="date"
                value={formData.date}
                onChange={handleChange}
                className="modal-input" 
              />
            </div>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-cancel" onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className="btn-save green">
              <Save size={18} />
              Salvar Despesa
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewExpenseModal;