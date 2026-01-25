import { Home, Heart, BookOpen, Wrench, User } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { path: '/', icon: Home, label: 'Home' },
  { path: '/help-now', icon: Heart, label: 'Help Now' },
  { path: '/courses', icon: BookOpen, label: 'Courses' },
  { path: '/tools', icon: Wrench, label: 'Tools' },
  { path: '/profile', icon: User, label: 'Profile' },
];

export default function BottomNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="bottom-nav" data-testid="bottom-nav">
      {navItems.map(({ path, icon: Icon, label }) => (
        <button
          key={path}
          onClick={() => navigate(path)}
          className={`nav-item ${isActive(path) ? 'active' : ''}`}
          data-testid={`nav-${label.toLowerCase().replace(' ', '-')}`}
        >
          <Icon strokeWidth={2} />
          <span>{label}</span>
        </button>
      ))}
    </nav>
  );
}
