import api from '../api/axiosConfig';

export const listarMedicos = () => api.get('/medicos');
export const buscarMedico = (id) => api.get(`/medicos/${id}`);
export const criarMedico = (dados) => api.post('/medicos', dados);
export const atualizarMedico = (id, dados) => api.put(`/medicos/${id}`, dados);
export const deletarMedico = (id) => api.delete(`/medicos/${id}`);
export const buscarPorNome = (nome) => api.get(`/medicos/busca/nome?nome=${nome}`);
export const buscarPorEspecialidade = (especialidade) =>
  api.get(`/medicos/busca/especialidade?especialidade=${especialidade}`);
