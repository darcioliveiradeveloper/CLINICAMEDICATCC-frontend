import { useAuth } from '../context/AuthContext';
import Sidebar from './Sidebar';

export default function Layout({ children, titulo }) {
  const { user, logout } = useAuth();

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <header className="topbar">
          <h2>{titulo || 'Dashboard'}</h2>
          <div className="topbar-right">
            <span className="user-info">
              {user?.nome} ({user?.perfil})
            </span>
            <button className="btn btn-sm btn-danger" onClick={logout}>
              Sair
            </button>
          </div>
        </header>
        <div className="content-body">{children}</div>
      </main>
    </div>
  );
}
