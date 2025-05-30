
import { LayoutDashboard, FileText, User, Settings } from 'lucide-react';
import Link from 'next/link'

const navItems = [
  { name: 'Dashboard', icon: <LayoutDashboard className="h-5 w-5" />, path: '/patient/home' },
  { name: 'Reports', icon: <FileText className="h-5 w-5" />, path: '/patient/report' },
  { name: 'Profile', icon: <User className="h-5 w-5" />, path: '/patient/profile' },
  { name: 'Settings', icon: <Settings className="h-5 w-5" />, path: '/patient/settings' }
]

export default function Navbar() {
  return (
    <nav className="space-y-2">
      {navItems.map((items) => (
        <Link key = {items.name} href = {items.path} className='flex items-center space-x-3 p-3 rounded-lg text-gray-700 hover:bg-blue-700 hover:text-blue-700'>
          
          {items.icon}
          <span>{items.name}</span>
          
        </Link>
      ))}
    </nav>
  );
};
