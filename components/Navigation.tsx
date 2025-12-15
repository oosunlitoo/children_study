import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, PenTool, Calculator, Languages, BookOpen } from 'lucide-react';

const Navigation: React.FC = () => {
  const location = useLocation();
  const path = location.pathname;

  const getLinkClass = (targetPath: string, color: string) => {
    const isActive = path === targetPath;
    const baseClass = "flex flex-col items-center justify-center w-full h-full transition-all duration-200";
    const activeClass = `scale-110 ${color} -translate-y-2 bg-white rounded-full shadow-lg p-2 border-4 border-white`;
    const inactiveClass = "text-white/80 hover:text-white hover:scale-105";

    return `${baseClass} ${isActive ? activeClass : inactiveClass}`;
  };

  return (
    <nav className="fixed bottom-4 left-4 right-4 h-20 bg-gray-900/90 backdrop-blur-md rounded-full shadow-2xl z-50 flex justify-around items-center px-2">
      <Link to="/" className={getLinkClass('/', 'text-brand-yellow')}>
        <Home size={28} fill={path === '/' ? 'currentColor' : 'none'} />
        <span className="text-[10px] font-bold mt-1">Home</span>
      </Link>
      <Link to="/chinese" className={getLinkClass('/chinese', 'text-brand-red')}>
        <BookOpen size={28} />
        <span className="text-[10px] font-bold mt-1">中文</span>
      </Link>
      <Link to="/english" className={getLinkClass('/english', 'text-brand-blue')}>
        <Languages size={28} />
        <span className="text-[10px] font-bold mt-1">ABC</span>
      </Link>
      <Link to="/math" className={getLinkClass('/math', 'text-brand-green')}>
        <Calculator size={28} />
        <span className="text-[10px] font-bold mt-1">123</span>
      </Link>
      <Link to="/drawing" className={getLinkClass('/drawing', 'text-brand-purple')}>
        <PenTool size={28} />
        <span className="text-[10px] font-bold mt-1">Art</span>
      </Link>
    </nav>
  );
};

export default Navigation;
