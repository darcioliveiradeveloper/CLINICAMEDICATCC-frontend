import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { criarPaciente, atualizarPaciente, buscarPaciente } from '../../services/pacienteService';
import Layout from '../../components/Layout';

export default function FormPaciente() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState({ nome: '', cpf: '', dataNascimento: '', email: '', telefone: '' });
  const [erro, setErro] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    if (editando) {
      buscarPaciente(id).then((r) => {
        const p = r.data;
        setForm({
          nome: p.nome,
          cpf: p.cpf,
          dataNascimento: p.dataNascimento ? p.dataNascimento.slice(0, 10) : '',
          email: p.email || '',
          telefone: p.telefone || '',
        });
      }).catch(() => navigate('/pacientes'));
    }
  }, [id, editando, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');

    if (!form.nome || !form.cpf || !form.dataNascimento) {
      setErro('Nome, CPF e data de nascimento são obrigatórios');
      return;
    }

    setCarregando(true);
    try {
      if (editando) {
        await atualizarPaciente(id, form);
      } else {
        await criarPaciente(form);
      }
      navigate('/pacientes');
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar paciente');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Layout titulo={editando ? 'Editar Paciente' : 'Novo Paciente'}>
      <div className="form-container">
        {erro && <div className="alert alert-error">{erro}</div>}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" autoFocus />
          </div>
          <div className="form-group">
            <label>CPF</label>
            <input name="cpf" value={form.cpf} onChange={handleChange} placeholder="Apenas números" maxLength={11} />
          </div>
          <div className="form-group">
            <label>Data de Nascimento</label>
            <input name="dataNascimento" type="date" value={form.dataNascimento} onChange={handleChange} />
          </div>
          <div className="form-group">
            <label>Email (opcional)</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="paciente@email.com" />
          </div>
          <div className="form-group">
            <label>Telefone (opcional)</label>
            <input name="telefone" value={form.telefone} onChange={handleChange} placeholder="(11) 99999-9999" />
          </div>
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/pacientes')}>Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
