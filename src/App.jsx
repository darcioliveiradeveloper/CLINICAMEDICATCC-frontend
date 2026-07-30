import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import ListaMedicos from './pages/Medicos/ListaMedicos';
import FormMedico from './pages/Medicos/FormMedico';
import ListaPacientes from './pages/Pacientes/ListaPacientes';
import FormPaciente from './pages/Pacientes/FormPaciente';
import ListaConsultas from './pages/Consultas/ListaConsultas';
import FormConsulta from './pages/Consultas/FormConsulta';
import Relatorios from './pages/Relatorios';
import ListaUsuarios from './pages/Usuarios/ListaUsuarios';
import FormUsuario from './pages/Usuarios/FormUsuario';

export default function App() {
  const { token } = useAuth();

  return (
    <Routes>
      <Route path="/login" element={token ? <Navigate to="/" replace /> : <Login />} />
      <Route path="/" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
      <Route path="/medicos" element={<PrivateRoute><ListaMedicos /></PrivateRoute>} />
      <Route path="/medicos/novo" element={<PrivateRoute><FormMedico /></PrivateRoute>} />
      <Route path="/medicos/editar/:id" element={<PrivateRoute><FormMedico /></PrivateRoute>} />
      <Route path="/pacientes" element={<PrivateRoute><ListaPacientes /></PrivateRoute>} />
      <Route path="/pacientes/novo" element={<PrivateRoute><FormPaciente /></PrivateRoute>} />
      <Route path="/pacientes/editar/:id" element={<PrivateRoute><FormPaciente /></PrivateRoute>} />
      <Route path="/consultas" element={<PrivateRoute><ListaConsultas /></PrivateRoute>} />
      <Route path="/consultas/nova" element={<PrivateRoute><FormConsulta /></PrivateRoute>} />
      <Route path="/consultas/editar/:id" element={<PrivateRoute><FormConsulta /></PrivateRoute>} />
      <Route path="/relatorios" element={<PrivateRoute><Relatorios /></PrivateRoute>} />
      <Route path="/usuarios" element={<PrivateRoute><ListaUsuarios /></PrivateRoute>} />
      <Route path="/usuarios/novo" element={<PrivateRoute><FormUsuario /></PrivateRoute>} />
      <Route path="/usuarios/editar/:id" element={<PrivateRoute><FormUsuario /></PrivateRoute>} />
    </Routes>
  );
}
