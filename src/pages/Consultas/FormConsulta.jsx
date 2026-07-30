import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarConsulta, atualizarConsulta, buscarConsulta } from '../../services/consultaService';
import { listarMedicos } from '../../services/medicoService';
import { listarPacientes } from '../../services/pacienteService';
import Layout from '../../components/Layout';

export default function FormConsulta() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState({ medico: '', paciente: '', data: '', descricao: '' });
  const [medicos, setMedicos] = useState([]);
  const [pacientes, setPacientes] = useState([]);
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [medicosRes, pacientesRes] = await Promise.all([listarMedicos(), listarPacientes()]);
        setMedicos(medicosRes.data);
        setPacientes(pacientesRes.data);

        if (editando) {
          const consultaRes = await buscarConsulta(id);
          const c = consultaRes.data;
          setForm({
            medico: c.medico?._id || '',
            paciente: c.paciente?._id || '',
            data: c.data ? c.data.slice(0, 10) : '',
            descricao: c.descricao || '',
          });
        }
      } catch {
        navigate('/consultas');
      }
    };
    carregarDados();
  }, [id, editando, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.medico || !form.paciente || !form.data) {
      setErro('Médico, paciente e data são obrigatórios');
      return;
    }

    setCarregando(true);
    try {
      if (editando) {
        await atualizarConsulta(id, form);
      } else {
        await criarConsulta(form);
      }
      navigate('/consultas');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar consulta');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Layout titulo={editando ? 'Editar Consulta' : 'Nova Consulta'}>
      <div className="form-container">
        {erro && <div className="alert alert-error">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Médico</label>
            <select name="medico" value={form.medico} onChange={handleChange}>
              <option value="">Selecione um médico</option>
              {medicos.map((m) => (
                <option key={m._id} value={m._id}>{m.nome} - {m.especialidade}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Paciente</label>
            <select name="paciente" value={form.paciente} onChange={handleChange}>
              <option value="">Selecione um paciente</option>
              {pacientes.map((p) => (
                <option key={p._id} value={p._id}>{p.nome} - {p.cpf}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Data</label>
            <input name="data" type="date" value={form.data} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Descrição (opcional)</label>
            <textarea
              name="descricao"
              value={form.descricao}
              onChange={handleChange}
              placeholder="Motivo da consulta"
              rows={3}
            />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/consultas')}>Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
