import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { listarConsultas, deletarConsulta, buscarPorPeriodo, buscarPorEspecialidade } from '../../services/consultaService';
import Layout from '../../components/Layout';

export default function ListaConsultas() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [consultas, setConsultas] = useState([]);
  const [carregando, setCarregando] = useState(true);

  const [filtroTipo, setFiltroTipo] = useState('');
  const [filtroValor, setFiltroValor] = useState('');

  const perfil = user?.perfil;
  const podeEditar = perfil === 'admin' || perfil === 'funcionario';

  const carregar = async () => {
    setCarregando(true);
    try {
      const response = await listarConsultas();
      setConsultas(response.data);
    } catch {
      setConsultas([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleFiltrar = async () => {
    if (!filtroValor.trim()) { carregar(); return; }
    setCarregando(true);
    try {
      let response;
      if (filtroTipo === 'especialidade') {
        response = await buscarPorEspecialidade(filtroValor);
      } else if (filtroTipo === 'periodo') {
        const [inicio, fim] = filtroValor.split(' a ');
        response = await buscarPorPeriodo(inicio, fim);
      } else {
        response = await listarConsultas();
      }
      setConsultas(response.data);
    } catch {
      setConsultas([]);
    } finally {
      setCarregando(false);
    }
  };

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir esta consulta?')) return;
    try {
      await deletarConsulta(id);
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir consulta');
    }
  };

  return (
    <Layout titulo="Consultas">
      <div className="toolbar">
        <div className="search-group">
          <select value={filtroTipo} onChange={(e) => setFiltroTipo(e.target.value)}>
            <option value="">Todas</option>
            <option value="especialidade">Especialidade</option>
            <option value="periodo">Período (dataInicio a dataFim)</option>
          </select>
          {filtroTipo && (
            <input
              type="text"
              placeholder={filtroTipo === 'periodo' ? 'Ex: 2026-01-01 a 2026-12-31' : 'Ex: Cardiologia'}
              value={filtroValor}
              onChange={(e) => setFiltroValor(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleFiltrar()}
            />
          )}
          {filtroTipo && (
            <button className="btn btn-primary" onClick={handleFiltrar}>Filtrar</button>
          )}
        </div>
        {podeEditar && (
          <button className="btn btn-primary" onClick={() => navigate('/consultas/nova')}>
            + Nova Consulta
          </button>
        )}
      </div>

      {carregando ? (
        <p className="loading-text">Carregando...</p>
      ) : consultas.length === 0 ? (
        <p className="empty-text">Nenhuma consulta encontrada.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Médico</th>
                <th>Especialidade</th>
                <th>Paciente</th>
                <th>Descrição</th>
                {podeEditar && <th style={{ width: 140 }}>Ações</th>}
              </tr>
            </thead>
            <tbody>
              {consultas.map((c) => (
                <tr key={c._id}>
                  <td>{new Date(c.data).toLocaleDateString('pt-BR')}</td>
                  <td>{c.medico?.nome || '---'}</td>
                  <td>{c.medico?.especialidade || '---'}</td>
                  <td>{c.paciente?.nome || '---'}</td>
                  <td>{c.descricao || '-'}</td>
                  {podeEditar && (
                    <td>
                      <button className="btn btn-sm btn-primary" onClick={() => navigate(`/consultas/editar/${c._id}`)}>
                        Editar
                      </button>{' '}
                      <button className="btn btn-sm btn-danger" onClick={() => handleExcluir(c._id)}>
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
