import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import Layout from '../components/Layout';
import {
  totalMedicos, totalPacientes, totalConsultas,
  consultasPorPeriodo, especialidadesRanking,
} from '../services/relatorioService';

export default function Relatorios() {
  const { user } = useAuth();
  const [totais, setTotais] = useState(null);
  const [ranking, setRanking] = useState([]);
  const [periodo, setPeriodo] = useState({ inicio: '', fim: '' });
  const [consultasPeriodo, setConsultasPeriodo] = useState(null);

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
  }, []);

  const handleBuscarPeriodo = async () => {
    if (!periodo.inicio || !periodo.fim) return;
    try {
      const r = await consultasPorPeriodo(periodo.inicio, periodo.fim);
      setConsultasPeriodo(r.data);
    } catch {
      setConsultasPeriodo(null);
    }
  };

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
            <table className="table" style={{ boxShadow: 'none' }}>
              <thead>
                <tr>
                  <th>Especialidade</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {ranking.map((item, i) => (
                  <tr key={i}>
                    <td>{item.especialidade}</td>
                    <td><strong>{item.total}</strong></td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
}
