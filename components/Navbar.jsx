import { Link } from 'react-router-dom';
import { LayoutDashboard, FileText, User,Settings } from 'lucide-react';

const Navbar = () => {
  return (
    <nav className="space-y-2">
      {[
        { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/' },
        { name: 'Reports', icon: <FileText className="h-5 w-5" />, path: '/reports' },
        { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/profile' },
        { name: 'Settings',icon: <Settings className="h-5 w-5" />, path: '/settings' }
      ].map(({ name, icon, path }) => (
        <Link
          key={name}
          to={path}
          className="w-full flex items-center space-x-2 px-4 py-2 text-gray-700 hover:bg-blue-50 rounded-lg"
        >
          {icon}
          <span>{name}</span>
        </Link>
      ))}
    </nav>
  );
};

export default Navbar;
