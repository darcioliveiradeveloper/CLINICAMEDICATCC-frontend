import api from '../api/axiosConfig';

export const listarUsuarios = () => api.get('/usuarios');
export const buscarUsuario = (id) => api.get(`/usuarios/${id}`);
export const atualizarUsuario = (id, dados) => api.put(`/usuarios/${id}`, dados);
export const deletarUsuario = (id) => api.delete(`/usuarios/${id}`);
