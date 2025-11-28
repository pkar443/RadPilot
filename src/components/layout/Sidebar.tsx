import { cn } from '@/lib/utils';
import { Home, FileText, Users, Settings } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface NavItem {
  icon: React.ElementType;
  label: string;
  path: string;
}

const navItems: NavItem[] = [
  { icon: Home, label: 'Dashboard', path: '/' },
  { icon: FileText, label: 'Studies', path: '/studies' },
  { icon: Users, label: 'Patients', path: '/patients' },
  { icon: Settings, label: 'Settings', path: '/settings' }
];

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <aside className="w-64 bg-gray-50 border-r fixed left-0 top-16 bottom-0 z-30">
      <nav className="p-4 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = location.pathname === item.path;
          
          return (
            <button
              key={item.path}
              onClick={() => navigate(item.path)}
              className={cn(
                'w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="h-5 w-5" />
              {item.label}
            </button>
          );
        })}
      </nav>

      <div className="absolute bottom-0 left-0 right-0 p-4 border-t bg-white">
        <div className="text-xs font-semibold text-gray-500 mb-3">APPLICATIONS</div>
        <div className="space-y-2">
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="h-2 w-2 rounded-full bg-blue-600"></div>
            <span className="text-sm font-medium text-blue-900">RadPilot</span>
          </div>
          <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 rounded-lg opacity-60">
            <div className="h-2 w-2 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-500">Multimodal Precision Health</span>
            <span className="ml-auto text-xs text-gray-400">Soon</span>
          </div>
        </div>
      </div>
    </aside>
  );
}
