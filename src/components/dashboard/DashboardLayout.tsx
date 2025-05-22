
import { useNavigate } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import Logo from '@/components/Logo';

interface DashboardLayoutProps {
  onLogout: () => void;
  children: React.ReactNode;
}

const DashboardLayout = ({ onLogout, children }: DashboardLayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white shadow-sm py-4">
        <div className="container-custom flex justify-between items-center">
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo />
          </div>
          <button 
            onClick={onLogout} 
            className="flex items-center text-trioguard-dark hover:text-trioguard transition-colors"
          >
            <LogOut size={20} className="mr-2" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      <main className="flex-grow bg-trioguard-bg">
        <div className="container-custom py-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
