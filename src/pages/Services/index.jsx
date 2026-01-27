import React, { useState, useEffect } from 'react';
import { 
  Scissors, 
  X, 
  Edit, 
  Trash2, 
  Save 
} from 'lucide-react';
import api from '../../services/axios'; 
import Navbar from '../../components/Navbar';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]); 
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    value: '',
    duration: ''
  });

  const loadServices = async () => {
    try {
      const response = await api.get('/TiposServico');
      
      console.log("Dados recebidos do Backend:", response.data); 

      const formattedServices = response.data.map(item => ({
        id: item.idTipoServico, 
        name: item.nomeServico, 
        value: item.valorPadrao ?? 0, 
        duration: item.duracaoMinutos ? `${item.duracaoMinutos} min` : '',
        category: 'Geral',
        active: true
      }));

      setServices(formattedServices);
    } catch (error) {
      console.error("Erro ao carregar serviços", error);
    }
  };

  useEffect(() => {
    loadServices();
  }, []);

  const handleOpenModal = () => {
    setEditingService(null);
    setFormData({ name: '', value: '', duration: '' });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingService(null);
    setFormData({ name: '', value: '', duration: '' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

const handleSave = async () => {
   
    if (!formData.name || !formData.value) {
      alert("Nome e Valor são obrigatórios!");
      return;
    }

    try {
       
        let priceValue = 0;
        
        if (typeof formData.value === 'number') {
            priceValue = formData.value;
        } else {
            const cleanValue = formData.value.toString().replace('R$', '').replace(/\./g, '').replace(',', '.').trim();
            priceValue = parseFloat(cleanValue);
        }

        if (isNaN(priceValue)) priceValue = 0;

        const durationValue = parseInt(formData.duration.replace(/\D/g, '')) || 0;

      const payload = {
    
    Nome: formData.name,       
    valorPadrao: priceValue,   
    
    duracaoMinutos: durationValue
};

        console.log("Enviando Payload:", payload); 

        if (editingService) {
          
            const payloadComId = { ...payload, idTipoServico: editingService.id };
            
            await api.put(`/TiposServico/${editingService.id}`, payloadComId);
        } else {
          
            await api.post('/TiposServico', payload);
        }

        await loadServices();
        handleCloseModal();

    } catch (error) {
        console.error("Erro ao salvar:", error);
        
       
        if (error.response && error.response.data) {
             const mensagemErro = JSON.stringify(error.response.data);
             console.log("O servidor respondeu:", error.response.data);
             alert(`O servidor recusou: ${mensagemErro}`);
        } else {
             alert("Erro ao salvar. Verifique se o backend está rodando.");
        }
    }
  };


  const handleEdit = (service) => {
    setEditingService(service);
    
   
    const valorSeguro = (typeof service.value === 'number') ? service.value : 0;

    setFormData({
      name: service.name,
     
      value: valorSeguro.toFixed(2).replace('.', ','),
      duration: service.duration
    });
    setIsModalOpen(true);
  };


  const handleDeactivate = (serviceId) => {
    setServices(services.map(service =>
      service.id === serviceId
        ? { ...service, active: !service.active }
        : service
    ));
  };


  const handleDelete = async (serviceId) => {
    if (window.confirm('Tem certeza que deseja excluir este serviço?')) {
      try {
          await api.delete(`/TiposServico/${serviceId}`);
          setServices(services.filter(service => service.id !== serviceId));
      } catch (error) {
          alert("Erro ao excluir. Tente novamente.");
      }
    }
  };

  return (
    <div className="services-page">
      <Navbar />
      
      <main className="main-content">
        <div className="content-wrapper">
          <div className="page-header-row">
            <div className="title-area">
              <div className="title-icon-box purple">
                <Scissors size={32} color="#fff" />
              </div>
              <div>
                <h2>Tipos de Serviço</h2>
                <p>Gerencie os serviços oferecidos</p>
              </div>
            </div>
            
            <button className="new-service-btn" onClick={handleOpenModal}>
              + Novo Serviço
            </button>
          </div>

          {services.length === 0 ? (
            <div className="empty-state-card">
              <div className="empty-state-content">
                <Scissors size={64} color="#d1d5db" />
                <h3>Nenhum serviço cadastrado ainda</h3>
                <p>Clique em "Novo Serviço" para começar</p>
              </div>
            </div>
          ) : (
            <div className="services-list">
              {services.map(service => (
                <div key={service.id} className="service-card">
                  <div className="service-header">
                    <h3 className="service-name">{service.name}</h3>
                    <div className="service-tags">
                      {service.active && (
                        <span className="tag tag-active">Ativo</span>
                      )}
                      <span className="tag tag-category">{service.category}</span>
                    </div>
                  </div>
                  
                  <div className="service-info">
                    <div className="info-item">
                      <span className="info-label">Valor Padrão:</span>
                      <span className="info-value green">
                     
                        R$ {service.value !== undefined && service.value !== null 
                            ? Number(service.value).toFixed(2).replace('.', ',') 
                            : '0,00'}
                      </span>
                    </div>
                    {service.duration && (
                      <div className="info-item">
                        <span className="info-label">Duração:</span>
                        <span className="info-value">{service.duration}</span>
                      </div>
                    )}
                  </div>

                  <div className="service-actions">
                    <button 
                      className="action-btn deactivate-btn"
                      onClick={() => handleDeactivate(service.id)}
                    >
                      <X size={16} />
                      <span>Desativar</span>
                    </button>
                    <button 
                      className="action-btn edit-btn"
                      onClick={() => handleEdit(service)}
                    >
                      <Edit size={16} />
                      <span>Editar</span>
                    </button>
                    <button 
                      className="action-btn delete-btn"
                      onClick={() => handleDelete(service.id)}
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>


      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-section">
                <Scissors size={24} color="#3B82F6" />
                <h3>{editingService ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}</h3>
              </div>
              <button className="modal-close-btn" onClick={handleCloseModal}>
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="name">
                  Nome do Serviço <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  placeholder="Ex: Corte, Barba, Cabelo..."
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="value">
                  Valor Padrão (R$) <span className="required">*</span>
                </label>
                <input
                  type="text"
                  id="value"
                  name="value"
                  placeholder="0,00"
                  value={formData.value}
                  onChange={handleInputChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="duration">
                  Duração (em minutos)
                </label>
                <input
                  type="text"
                  id="duration"
                  name="duration"
                  placeholder="Ex: 30"
                  value={formData.duration}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="modal-footer">
              <button className="btn-cancel" onClick={handleCloseModal}>
                Cancelar
              </button>
              <button className="btn-save" onClick={handleSave}>
                <Save size={16} />
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;