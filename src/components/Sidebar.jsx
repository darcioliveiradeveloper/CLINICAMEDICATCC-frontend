import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Sidebar() {
  const { user } = useAuth();
  const perfil = user?.perfil;

  const links = [
    { to: '/', label: 'Dashboard', icon: '📊', perfis: ['admin', 'funcionario', 'medico'] },
    { to: '/medicos', label: 'Médicos', icon: '👨‍⚕️', perfis: ['admin', 'funcionario', 'medico'] },
    { to: '/pacientes', label: 'Pacientes', icon: '👤', perfis: ['admin', 'funcionario', 'medico'] },
    { to: '/consultas', label: 'Consultas', icon: '📅', perfis: ['admin', 'funcionario', 'medico'] },
    { to: '/relatorios', label: 'Relatórios', icon: '📈', perfis: ['admin', 'funcionario'] },
    { to: '/usuarios', label: 'Usuários', icon: '🔐', perfis: ['admin'] },
  ];

  const linksPermitidos = links.filter((l) => l.perfis.includes(perfil));

  return (
    <aside className="sidebar">
      <div className="sidebar-header">
        <h2>Clínica Médica</h2>
      </div>
      <nav className="sidebar-nav">
        {linksPermitidos.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === '/'}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon">{link.icon}</span>
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
