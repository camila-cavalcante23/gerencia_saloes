import React, { useState, useEffect } from 'react';
import { 
  Scissors, X, Edit, Trash2, Save, Lock, CheckCircle, Ban 
} from 'lucide-react';
import api from '../../services/axios'; 
import Navbar from '../../components/Navbar';
import './Services.css';

function Services() {
  const [services, setServices] = useState([]); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [formData, setFormData] = useState({ name: '', value: '', duration: '' });
  const [isAdmin, setIsAdmin] = useState(false);


  useEffect(() => {
      const checkUserRole = () => {
          const storedUsuario = localStorage.getItem('usuario');
          const storedUser = localStorage.getItem('user');
          const storedPerfil = localStorage.getItem('perfil');
          let adminCheck = false;

          if (storedUsuario) {
              try {
                  const u = JSON.parse(storedUsuario);
                  if (u.perfil === 'Admin' || u.Perfil === 'Admin') adminCheck = true;
              } catch(e) {}
          }
          if (!adminCheck && storedUser) {
              try {
                  const u = JSON.parse(storedUser);
                  if (u.perfil === 'Admin' || u.role === 'Admin') adminCheck = true;
              } catch(e) {}
          }
          if (!adminCheck && storedPerfil === 'Admin') adminCheck = true;
          setIsAdmin(adminCheck);
      };
      checkUserRole();
      window.addEventListener('storage', checkUserRole);
      return () => window.removeEventListener('storage', checkUserRole);
  }, []);


  const loadServices = async () => {
    try {
      const response = await api.get('/TiposServico');
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenServices') || '[]');

      const formattedServices = response.data.map(item => ({
        id: item.idTipoServico, 
        name: item.nomeServico, 
        value: item.valorPadrao ?? 0, 
        duration: item.duracaoMinutos ? `${item.duracaoMinutos} min` : '',
        category: 'Geral',
      
        active: !hiddenIds.includes(item.idTipoServico) 
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
  const handleCloseModal = () => setIsModalOpen(false);
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  
  const handleSave = async () => {
    if (!isAdmin) return;
    if (!formData.name || !formData.value) { alert("Nome e Valor são obrigatórios!"); return; }
    
    try {
        let priceValue = typeof formData.value === 'number' ? formData.value : parseFloat(formData.value.toString().replace('R$', '').replace(/\./g, '').replace(',', '.').trim());
        if (isNaN(priceValue)) priceValue = 0;
        const durationValue = parseInt(formData.duration.replace(/\D/g, '')) || 0;
        
        const payload = { Nome: formData.name, valorPadrao: priceValue, duracaoMinutos: durationValue };

        if (editingService) {
            await api.put(`/TiposServico/${editingService.id}`, { ...payload, idTipoServico: editingService.id });
        } else {
            await api.post('/TiposServico', payload);
        }
        await loadServices();
        handleCloseModal();
    } catch (error) { alert("Erro ao salvar."); }
  };
  
  const handleEdit = (service) => {
    setEditingService(service);
    const val = typeof service.value === 'number' ? service.value : 0;
    setFormData({ name: service.name, value: val.toFixed(2).replace('.', ','), duration: service.duration });
    setIsModalOpen(true);
  };

  const handleToggleStatus = (serviceId) => {
      const hiddenIds = JSON.parse(localStorage.getItem('hiddenServices') || '[]');
      let newHiddenIds;
      if (hiddenIds.includes(serviceId)) {
          newHiddenIds = hiddenIds.filter(id => id !== serviceId);
      } else {
          newHiddenIds = [...hiddenIds, serviceId];
      }
      localStorage.setItem('hiddenServices', JSON.stringify(newHiddenIds));
      setServices(prev => prev.map(s => s.id === serviceId ? { ...s, active: !s.active } : s));
  };

  const handleDelete = async (serviceId) => {
    if (window.confirm('Excluir permanentemente?')) {
      try {
          await api.delete(`/TiposServico/${serviceId}`);
          setServices(prev => prev.filter(s => s.id !== serviceId));
      } catch (error) { alert("Erro ao excluir."); }
    }
  };

  return (
    <div className="services-page">
      <Navbar />
      <main className="main-content">
        <div className="content-wrapper">
          <div className="page-header-row">
            <div className="title-area">
              <div className="title-icon-box purple"><Scissors size={32} color="#fff" /></div>
              <div><h2>Tipos de Serviço</h2><p>{isAdmin ? "Gerencie os serviços" : "Tabela de preços"}</p></div>
            </div>
            {isAdmin && <button className="new-service-btn" onClick={handleOpenModal}>+ Novo Serviço</button>}
          </div>

          {services.length === 0 ? (
            <div className="empty-state-card"><h3>Nenhum serviço</h3></div>
          ) : (
            <div className="services-list">
              {services.map(service => (
                <div key={service.id} className={`service-card ${!service.active ? 'inactive-card' : ''}`}>
                  <div className="service-header">
                    <h3 className="service-name">{service.name}</h3>
                    <div className="service-tags">
                        
                
                        <span className={`tag ${service.active ? 'tag-active' : 'tag-inactive'}`}>
                             {service.active ? 'Ativo' : 'Inativo'}
                        </span>

               
                        {!isAdmin && (
                            <div title="Modo Leitura" style={{display:'flex', alignItems:'center', marginLeft:'4px'}}>
                                <Lock size={14} color="#999" />
                            </div>
                        )}
                        
                        <span className="tag tag-category">{service.category}</span>
                    </div>
                  </div>
                  <div className="service-info">
                    <div className="info-item"><span className="info-label">Valor:</span><span className="info-value green">R$ {Number(service.value).toFixed(2).replace('.', ',')}</span></div>
                    {service.duration && <div className="info-item"><span className="info-label">Duração:</span><span className="info-value">{service.duration}</span></div>}
                  </div>
                  {isAdmin && (
                      <div className="service-actions">
                        <button className={`action-btn ${service.active ? 'deactivate-btn' : 'activate-btn'}`} onClick={() => handleToggleStatus(service.id)}>
                           {service.active ? <Ban size={16} /> : <CheckCircle size={16} />} 
                           <span>{service.active ? 'Desativar' : 'Ativar'}</span>
                        </button>
                        <button className="action-btn edit-btn" onClick={() => handleEdit(service)}><Edit size={16} /> <span>Editar</span></button>
                        <button className="action-btn delete-btn" onClick={() => handleDelete(service.id)}><Trash2 size={16} /></button>
                      </div>
                  )}
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
                    <div style={{background: '#EFF6FF', padding: '8px', borderRadius: '8px', marginRight: '10px', display: 'flex'}}>
                        <Scissors size={20} color="#3B82F6" />
                    </div>
                    <h3>{editingService ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}</h3>
                 </div>
                 <button className="modal-close-btn" onClick={handleCloseModal}><X size={20} /></button>
             </div>
             <div className="modal-body">
                <div className="form-group">
                    <label>Nome do Serviço *</label>
                    <input name="name" placeholder="Ex: Corte feminino" value={formData.name} onChange={handleInputChange} />
                </div>
                <div style={{display: 'flex', gap: '15px'}}>
                    <div className="form-group" style={{flex: 1}}>
                        <label>Valor Padrão (R$) *</label>
                        <input name="value" placeholder="R$ 0,00" value={formData.value} onChange={handleInputChange} />
                    </div>
                    <div className="form-group" style={{flex: 1}}>
                        <label>Duração (opcional)</label>
                        <input name="duration" placeholder="Ex: 30 minutos" value={formData.duration} onChange={handleInputChange} />
                    </div>
                </div>
             </div>
             <div className="modal-footer" style={{ justifyContent: 'space-between', gap: '10px' }}>
                <button className="btn-cancel" onClick={handleCloseModal} style={{ flex: 1, backgroundColor: '#EF4444', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Cancelar</button>
                <button className="btn-save" onClick={handleSave} style={{ flex: 1, backgroundColor: '#3B82F6', color: 'white', border: 'none', padding: '10px', borderRadius: '8px', fontWeight: 'bold', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', cursor: 'pointer' }}><Save size={18} /> Salvar</button>
             </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Services;