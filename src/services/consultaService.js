import api from '../api/axiosConfig';

export const listarConsultas = () => api.get('/consultas');
export const buscarConsulta = (id) => api.get(`/consultas/${id}`);
export const criarConsulta = (dados) => api.post('/consultas', dados);
export const atualizarConsulta = (id, dados) => api.put(`/consultas/${id}`, dados);
export const deletarConsulta = (id) => api.delete(`/consultas/${id}`);

export const buscarPorMedico = (id) => api.get(`/consultas/busca/medico/${id}`);
export const buscarPorPaciente = (id) => api.get(`/consultas/busca/paciente/${id}`);
export const buscarPorPeriodo = (inicio, fim) =>
  api.get(`/consultas/busca/periodo?dataInicio=${inicio}&dataFim=${fim}`);
export const buscarPorEspecialidade = (especialidade) =>
  api.get(`/consultas/busca/especialidade?especialidade=${especialidade}`);
export const buscarAvancado = (params) => api.get('/consultas/busca/avancada', { params });
