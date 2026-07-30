import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listarPacientes, deletarPaciente, buscarPorNome } from '../../services/pacienteService';
import Layout from '../../components/Layout';

export default function ListaPacientes() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [busca, setBusca] = useState('');
  const [carregando, setCarregando] = useState(true);

  const perfil = user?.perfil;
  const podeEditar = perfil === 'admin' || perfil === 'funcionario';

  const carregar = async () => {
    setCarregando(true);
    try {
      const response = await listarPacientes();
      setPacientes(response.data);
    } catch {
      setPacientes([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleBusca = async () => {
    if (!busca.trim()) { carregar(); return; }
    setCarregando(true);
    try {
      const response = await buscarPorNome(busca);
      setPacientes(response.data);
    } catch {
      setPacientes([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este paciente?')) return;
    try {
      await deletarPaciente(id);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir paciente');
    }
  };

  return (
    <Layout titulo="Pacientes">
      <div className="toolbar">
        <div className="search-group">
          <input
            type="text"
            placeholder="Buscar por nome..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleBusca()}
          />
          <button className="btn btn-primary" onClick={handleBusca}>Buscar</button>
        </div>
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => navigate('/pacientes/novo')}>
            + Novo Paciente
          </button>
        )}
      </div>

      {carregando ? (
        <p className="loading-text">Carregando...</p>
      ) : pacientes.length === 0 ? (
        <p className="empty-text">Nenhum paciente encontrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Data Nasc.</th>
                <th>Email</th>
                {podeEditar && <th style={{ width: 140 }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {pacientes.map((p) => (
                <tr key={p._id}>
                  <td>{p.nome}</td>
                  <td>{p.cpf}</td>
                  <td>{new Date(p.dataNascimento).toLocaleDateString('pt-BR')}</td>
                  <td>{p.email || '-'}</td>
                  {podeEditar && (
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/pacientes/editar/${p._id}`)}>
                        Editar
                      </button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => handleExcluir(p._id)}>
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
