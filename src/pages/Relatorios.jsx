import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import {
  totalMedicos, totalPacientes, totalConsultas,
  consultasPorPeriodo, especialidadesRanking,
  medicosMaisAtivos, percentualPorPerfil,
} from '../services/relatorioService';

export default function Relatorios() {
  const { user } = useAuth();
  const [totais, setTotais] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [ativos, setAtivos] = useState([]);
  const [perfis, setPerfis] = useState([]);
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });
  const [consultasPeriodo, setConsultasPeriodo] = useState(null);

  const perfil = user?.perfil;

  useEffect(() => {
    const carregar = async () => {
      try {
        const [m, p, c, r] = await Promise.all([
          totalMedicos(), totalPacientes(), totalConsultas(), especialidadesRanking(),
        ]);
        setTotais({ medicos: m.data.total, pacientes: p.data.total, consultas: c.data.total });
        setRanking(r.data);
      } catch { /* ignore */ }
    };
    carregar();
    carregarAtivos();
    if (perfil === 'admin') carregarPerfis();
  }, [perfil]);

  const carregarAtivos = async () => {
    try {
      const r = await medicosMaisAtivos();
      setAtivos(r.data);
    } catch { setAtivos([]); }
  };

  const carregarPerfis = async () => {
    try {
      const r = await percentualPorPerfil();
      setPerfis(r.data);
    } catch { setPerfis([]); }
  };

  const handleBuscarPeriodo = async () => {
    if (!periodo.inicio || !periodo.fim) return;
    try {
      const r = await consultasPorPeriodo(periodo.inicio, periodo.fim);
      setConsultasPeriodo(r.data);
    } catch {
      setConsultasPeriodo(null);
    }
  };

  const maxRanking = Math.max(...ranking.map((r) => r.total), 1);
  const maxAtivos = Math.max(...ativos.map((a) => a.total), 1);

  return (
    <Layout titulo="Relatórios">
      <div className="cards" style={{ marginBottom: 24 }}>
        <div className="card card-blue">
          <h3>Total Médicos</h3>
          <p className="card-number">{totais?.medicos ?? '...'}</p>
        </div>
        <div className="card card-green">
          <h3>Total Pacientes</h3>
          <p className="card-number">{totais?.pacientes ?? '...'}</p>
        </div>
        <div className="card card-purple">
          <h3>Total Consultas</h3>
          <p className="card-number">{totais?.consultas ?? '...'}</p>
        </div>
      </div>

      <div className="relatorios-grid">
        <div className="form-container">
          <h3 style={{ marginBottom: 16 }}>Consultas por Período</h3>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
            <input type="date" value={periodo.inicio} onChange={(e) => setPeriodo({ ...periodo, inicio: e.target.value })} />
            <input type="date" value={periodo.fim} onChange={(e) => setPeriodo({ ...periodo, fim: e.target.value })} />
            <button className="btn btn-primary" onClick={handleBuscarPeriodo}>Buscar</button>
          </div>
          {consultasPeriodo && (
            <p><strong>Total:</strong> {consultasPeriodo.total} consultas</p>
          )}
        </div>

        <div className="form-container">
          <h3 style={{ marginBottom: 16 }}>Ranking de Especialidades</h3>
          {ranking.length === 0 ? (
            <p className="empty-text">Nenhum dado disponível.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ranking.map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{item.especialidade}</span>
                    <strong>{item.total}</strong>
                  </div>
                  <div style={{ background: '#eee', borderRadius: 6, height: 20, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(item.total / maxRanking) * 100}%`,
                      background: '#1a73e8',
                      height: '100%',
                      borderRadius: 6,
                      transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="form-container">
          <h3 style={{ marginBottom: 16 }}>Médicos Mais Ativos</h3>
          {ativos.length === 0 ? (
            <p className="empty-text">Nenhum dado disponível.</p>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {ativos.map((item, i) => (
                <div key={i}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                    <span>{item.medico}</span>
                    <strong>{item.total} consultas</strong>
                  </div>
                  <div style={{ background: '#eee', borderRadius: 6, height: 20, overflow: 'hidden' }}>
                    <div style={{
                      width: `${(item.total / maxAtivos) * 100}%`,
                      background: '#28a745',
                      height: '100%',
                      borderRadius: 6,
                      transition: 'width 0.5s',
                    }} />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {perfil === 'admin' && (
          <div className="form-container">
            <h3 style={{ marginBottom: 16 }}>Usuários por Perfil</h3>
            {perfis.length === 0 ? (
              <p className="empty-text">Nenhum dado disponível.</p>
            ) : (
              <table className="table" style={{ boxShadow: 'none' }}>
                <thead>
                  <tr>
                    <th>Perfil</th>
                    <th>Total</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {perfis.map((p, i) => (
                    <tr key={i}>
                      <td style={{ textTransform: 'capitalize' }}>{p.perfil}</td>
                      <td><strong>{p.total}</strong></td>
                      <td>{p.percentual}%</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
