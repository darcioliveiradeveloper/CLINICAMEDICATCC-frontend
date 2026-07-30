import api from '../api/axiosConfig';

export const listarPacientes = () => api.get('/pacientes');
export const buscarPaciente = (id) => api.get(`/pacientes/${id}`);
export const criarPaciente = (dados) => api.post('/pacientes', dados);
export const atualizarPaciente = (id, dados) => api.put(`/pacientes/${id}`, dados);
export const deletarPaciente = (id) => api.delete(`/pacientes/${id}`);
export const buscarPorNome = (nome) => api.get(`/pacientes/busca/nome?nome=${nome}`);
