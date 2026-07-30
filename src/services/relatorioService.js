import api from '../api/axiosConfig';

export const totalMedicos = () => api.get('/relatorios/medicos/total');
export const totalPacientes = () => api.get('/relatorios/pacientes/total');
export const totalConsultas = () => api.get('/relatorios/consultas/total');
export const consultasPorMedico = (id) => api.get(`/relatorios/consultas/medico/${id}`);
export const consultasPorPaciente = (id) => api.get(`/relatorios/consultas/paciente/${id}`);
export const consultasPorPeriodo = (inicio, fim) =>
  api.get(`/relatorios/consultas/periodo?dataInicio=${inicio}&dataFim=${fim}`);
export const especialidadesRanking = () => api.get('/relatorios/especialidades');
