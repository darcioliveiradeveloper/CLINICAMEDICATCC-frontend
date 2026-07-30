import api from '../api/axiosConfig';

export const cadastrarUsuario = (dados) => api.post('/auth/cadastro', dados);
