import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarMedico, atualizarMedico, buscarMedico } from '../../services/medicoService';
import Layout from '../../components/Layout';

export default function FormMedico() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState({ nome: '', especialidade: '', crm: '', email: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (editando) {
      buscarMedico(id).then((r) => {
        const m = r.data;
        setForm({ nome: m.nome, especialidade: m.especialidade, crm: m.crm, email: m.email || '', telefone: m.telefone || '' });
      }).catch(() => navigate('/medicos'));
    }
  }, [id, editando, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.nome || !form.especialidade || !form.crm || !form.telefone) {
      setErro('Nome, especialidade, CRM e telefone são obrigatórios');
      return;
    }

    setCarregando(true);
    try {
      if (editando) {
        await atualizarMedico(id, form);
      } else {
        await criarMedico(form);
      }
      navigate('/medicos');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar médico');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Layout titulo={editando ? 'Editar Médico' : 'Novo Médico'}>
      <div className="form-container">
        {erro && <div className="alert alert-error">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" autoFocus />
          </div>
          <div className="form-group">
            <label>Especialidade</label>
            <input name="especialidade" value={form.especialidade} onChange={handleChange} placeholder="Ex: Cardiologia" />
          </div>
          <div className="form-group">
            <label>CRM</label>
            <input name="crm" value={form.crm} onChange={handleChange} placeholder="Ex: 12345-SP" />
          </div>
          <div className="form-group">
            <label>Telefone</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" />
          </div>
          <div className="form-group">
            <label>Email (opcional)</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="medico@email.com" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/medicos')}>Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
