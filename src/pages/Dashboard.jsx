import { useState, useEffect } from 'react';
import api from '../api/axiosConfig';
import Layout from '../components/Layout';

export default function Dashboard() {
  const [dados, setDados] = useState(null);

  useEffect(() => {
    const carregar = async () => {
      try {
        const [medicos, pacientes, consultas] = await Promise.all([
          api.get('/relatorios/medicos/total'),
          api.get('/relatorios/pacientes/total'),
          api.get('/relatorios/consultas/total'),
        ]);
        setDados({
          totalMedicos: medicos.data.total,
          totalPacientes: pacientes.data.total,
          totalConsultas: consultas.data.total,
        });
      } catch {
        setDados({ totalMedicos: 0, totalPacientes: 0, totalConsultas: 0 });
      }
    };
    carregar();
  }, []);

  return (
    <Layout titulo="Dashboard">
      <div className="cards">
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
    </Layout>
  );
}
