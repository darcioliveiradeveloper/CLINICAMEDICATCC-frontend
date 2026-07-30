import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';

const meses = ['Jan','Fev','Mar','Abr','Mai','Jun','Jul','Ago','Set','Out','Nov','Dez'];

export default function Dashboard() {
  const [dados, setDados] = useState(null);
  const [ativos, setAtivos] = useState([]);
  const [consultasMes, setConsultasMes] = useState([]);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [medicos, pacientes, consultas, ativosRes] = await Promise.all([
          api.get('/relatorios/medicos/total'),
          api.get('/relatorios/pacientes/total'),
          api.get('/relatorios/consultas/total'),
          api.get('/relatorios/medicos/mais-ativos'),
        ]);
        setDados({
          totalMedicos: medicos.data.total,
          totalPacientes: pacientes.data.total,
          totalConsultas: consultas.data.total,
        });
        setAtivos(ativosRes.data);

        const hoje = new Date();
        const inicioAno = new Date(hoje.getFullYear(), 0, 1);
        const hojeStr = hoje.toISOString().slice(0, 10);
        const inicioAnoStr = inicioAno.toISOString().slice(0, 10);
        const r = await api.get(`/relatorios/consultas/periodo?dataInicio=${inicioAnoStr}&dataFim=${hojeStr}`);
        if (r.data.consultas) {
          const contagem = Array(12).fill(0);
          r.data.consultas.forEach((c) => {
            const mes = new Date(c.data).getMonth();
            contagem[mes]++;
          });
          setConsultasMes(contagem);
        }
      } catch {
        setDados({ totalMedicos: 0, totalPacientes: 0, totalConsultas: 0 });
      }
    };
    carregar();
  }, []);

  const maxAtivos = Math.max(...ativos.map((a) => a.total), 1);
  const maxMes = Math.max(...consultasMes, 1);

  return (
    <Layout titulo="Dashboard">
      <div className="cards" style={{ marginBottom: 24 }}>
        <div className="card card-blue">
          <h3>Médicos</h3>
          <p className="card-number">{dados?.totalMedicos ?? '...'}</p>
        </div>
        <div className="card card-green">
          <h3>Pacientes</h3>
          <p className="card-number">{dados?.totalPacientes ?? '...'}</p>
        </div>
        <div className="card card-purple">
          <h3>Consultas</h3>
          <p className="card-number">{dados?.totalConsultas ?? '...'}</p>
        </div>
      </div>

      <div className="relatorios-grid">
        <div className="form-container">
          <h3 style={{ marginBottom: 16 }}>Consultas por Mês (ano atual)</h3>
          {consultasMes.length === 0 ? (
            <p className="empty-text">Nenhum dado disponível.</p>
          ) : (
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 160, paddingTop: 20 }}>
              {consultasMes.map((total, i) => (
                <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 600, marginBottom: 4 }}>{total}</span>
                  <div style={{
                    width: '100%',
                    height: `${(total / maxMes) * 120}px`,
                    background: '#1a73e8',
                    borderRadius: '6px 6px 0 0',
                    minHeight: total > 0 ? 4 : 0,
                    transition: 'height 0.5s',
                  }} />
                  <span style={{ fontSize: '0.7rem', marginTop: 4, color: '#666' }}>{meses[i]}</span>
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
      </div>
    </Layout>
  );
}
