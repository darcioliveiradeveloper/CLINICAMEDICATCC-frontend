import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listarMedicos, deletarMedico, buscarPorNome, buscarPorEspecialidade } from '../../services/medicoService';
import Layout from '../../components/Layout';

export default function ListaMedicos() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [medicos, setMedicos] = useState([]);
  const [busca, setBusca] = useState('');
  const [tipoBusca, setTipoBusca] = useState('nome');
  const [carregando, setCarregando] = useState(true);

  const perfil = user?.perfil;
  const podeEditar = perfil === 'admin';

  const carregar = async () => {
    setCarregando(true);
    try {
      const response = await listarMedicos();
      setMedicos(response.data);
    } catch {
      setMedicos([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleBusca = async () => {
    if (!busca.trim()) {
      carregar();
      return;
    }
    setCarregando(true);
    try {
      const fn = tipoBusca === 'nome' ? buscarPorNome : buscarPorEspecialidade;
      const response = await fn(busca);
      setMedicos(response.data);
    } catch {
      setMedicos([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este médico?')) return;
    try {
      await deletarMedico(id);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir médico');
    }
  };

  return (
    <Layout titulo="Médicos">
      <div className="toolbar">
        <div className="search-group">
          <select value={tipoBusca} onChange={(e) => setTipoBusca(e.target.value)}>
            <option value="nome">Nome</option>
            <option value="especialidade">Especialidade</option>
          </select>
          <input
            type="text"
            placeholder={`Buscar por ${tipoBusca}...`}
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
          />
          <button className="btn btn-primary" onClick={handleBusca}>Buscar</button>
        </div>
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => navigate('/medicos/novo')}>
            + Novo Médico
          </button>
        )}
      </div>

      {carregando ? (
        <p className="loading-text">Carregando...</p>
      ) : medicos.length === 0 ? (
        <p className="empty-text">Nenhum médico encontrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Especialidade</th>
                <th>CRM</th>
                <th>Email</th>
                {podeEditar && <th style={{ width: 140 }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {medicos.map((m) => (
                <tr key={m._id}>
                  <td>{m.nome}</td>
                  <td>{m.especialidade}</td>
                  <td>{m.crm}</td>
                  <td>{m.email || '-'}</td>
                  {podeEditar && (
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/medicos/editar/${m._id}`)}>
                        Editar
                      </button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => handleExcluir(m._id)}>
                        Excluir
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
