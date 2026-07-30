import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { cadastrarUsuario } from '../../services/authService';
import { buscarUsuario, atualizarUsuario } from '../../services/usuarioService';
import { listarMedicos } from '../../services/medicoService';
import Layout from '../../components/Layout';

export default function FormUsuario() {
  const { id } = useParams();
  const navigate = useNavigate();
  const editando = Boolean(id);

  const [form, setForm] = useState({ nome: '', email: '', senha: '', perfil: 'funcionario', medicoId: '' });
  const [medicos, setMedicos] = useState([]);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');
  const [carregando, setCarregando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const r = await listarMedicos();
        setMedicos(r.data);
      } catch { /* ignore */ }

      if (editando) {
        try {
          const r = await buscarUsuario(id);
          const u = r.data;
          setForm({
            nome: u.nome,
            email: u.email,
            senha: '',
            perfil: u.perfil,
            medicoId: u.medicoId?._id || '',
          });
        } catch {
          navigate('/usuarios');
        }
      }
    };
    carregarDados();
  }, [id, editando, navigate]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErro('');
    setSucesso('');

    if (!form.nome || !form.email) {
      setErro('Nome e email são obrigatórios');
      return;
    }

    if (!editando && !form.senha) {
      setErro('Senha é obrigatória no cadastro');
      return;
    }

    const dados = { ...form };
    if (!dados.senha) delete dados.senha;
    if (dados.perfil !== 'medico') dados.medicoId = undefined;

    setCarregando(true);
    try {
      if (editando) {
        await atualizarUsuario(id, dados);
        setSucesso('Usuário atualizado com sucesso!');
      } else {
        await cadastrarUsuario(dados);
        setSucesso('Usuário cadastrado com sucesso!');
        setForm({ nome: '', email: '', senha: '', perfil: 'funcionario', medicoId: '' });
      }
    } catch (err) {
      setErro(err.response?.data?.erro || 'Erro ao salvar usuário');
    } finally {
      setCarregando(false);
    }
  };

  return (
    <Layout titulo={editando ? 'Editar Usuário' : 'Cadastrar Usuário'}>
      <div className="form-container">
        {erro && <div className="alert alert-error">{erro}</div>}
        {sucesso && <div className="alert" style={{ background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb' }}>{sucesso}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Nome</label>
            <input name="nome" value={form.nome} onChange={handleChange} placeholder="Nome completo" autoFocus />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input name="email" type="email" value={form.email} onChange={handleChange} placeholder="usuario@email.com" />
          </div>
          <div className="form-group">
            <label>{editando ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}</label>
            <input name="senha" type="password" value={form.senha} onChange={handleChange} placeholder={editando ? 'Deixe em branco para manter' : 'Mínimo 6 caracteres'} />
          </div>
          <div className="form-group">
            <label>Perfil</label>
            <select name="perfil" value={form.perfil} onChange={handleChange}>
              <option value="funcionario">Funcionário</option>
              <option value="medico">Médico</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          {form.perfil === 'medico' && (
            <div className="form-group">
              <label>Vincular ao Médico</label>
              <select name="medicoId" value={form.medicoId} onChange={handleChange}>
                <option value="">Selecione um médico</option>
                {medicos.map((m) => (
                  <option key={m._id} value={m._id}>{m.nome} - {m.especialidade}</option>
                ))}
              </select>
            </div>
          )}
          <div className="form-actions">
            <button type="submit" className="btn btn-primary" disabled={carregando}>
              {carregando ? 'Salvando...' : editando ? 'Atualizar' : 'Cadastrar'}
            </button>
            <button type="button" className="btn" onClick={() => navigate('/usuarios')}>Cancelar</button>
          </div>
        </form>
      </div>
    </Layout>
  );
}
