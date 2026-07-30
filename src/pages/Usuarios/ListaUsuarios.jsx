import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { listarUsuarios, deletarUsuario } from '../../services/usuarioService';
import Layout from '../../components/Layout';

export default function ListaUsuarios() {
  const navigate = useNavigate();
  const location = useLocation();
  const [usuarios, setUsuarios] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [sucesso, setSucesso] = useState('');

  useEffect(() => {
    if (location.state?.atualizado) {
      setSucesso('Usuário atualizado com sucesso!');
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const carregar = async () => {
    setCarregando(true);
    try {
      const r = await listarUsuarios();
      setUsuarios(r.data);
    } catch {
      setUsuarios([]);
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => { carregar(); }, []);

  const handleExcluir = async (id) => {
    if (!window.confirm('Tem certeza que deseja excluir este usuário?')) return;
    try {
      await deletarUsuario(id);
      setSucesso('Usuário excluído com sucesso!');
      carregar();
    } catch (err) {
      alert(err.response?.data?.erro || 'Erro ao excluir usuário');
    }
  };

  return (
    <Layout titulo="Usuários">
      <div className="toolbar">
        <div />
        <button className="btn btn-primary" onClick={() => navigate('/usuarios/novo')}>
          + Novo Usuário
        </button>
      </div>

      {sucesso && (
        <div style={{
          background: '#d4edda', color: '#155724', border: '1px solid #c3e6cb',
          padding: '10px 14px', borderRadius: 8, marginBottom: 16, fontSize: '0.9rem',
        }}>
          {sucesso}
        </div>
      )}

      {carregando ? (
        <p className="loading-text">Carregando...</p>
      ) : usuarios.length === 0 ? (
        <p className="empty-text">Nenhum usuário encontrado.</p>
      ) : (
        <div className="table-responsive">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Email</th>
                <th>Perfil</th>
                <th>Médico Vinculado</th>
                <th style={{ width: 140 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((u) => (
                <tr key={u._id}>
                  <td>{u.nome}</td>
                  <td>{u.email}</td>
                  <td>{u.perfil}</td>
                  <td>{u.medicoId?.nome || '-'}</td>
                  <td>
                    <button className="btn btn-sm btn-primary" onClick={() => navigate(`/usuarios/editar/${u._id}`)}>
                      Editar
                    </button>{' '}
                    <button className="btn btn-sm btn-danger" onClick={() => handleExcluir(u._id)}>
                      Excluir
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
}
