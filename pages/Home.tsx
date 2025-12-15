import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Languages, Calculator, PenTool } from 'lucide-react';

const SubjectCard: React.FC<{
  to: string;
  title: string;
  icon: React.ReactNode;
  color: string;
  desc: string;
}> = ({ to, title, icon, color, desc }) => (
  <Link
    to={to}
    className={`${color} rounded-3xl p-6 shadow-xl hover:shadow-2xl transform hover:scale-105 transition-all duration-300 flex flex-col items-center text-center justify-center min-h-[200px] border-b-8 border-black/10`}
  >
    <div className="bg-white/20 p-4 rounded-full mb-4 text-white backdrop-blur-sm">
      {icon}
    </div>
    <h2 className="text-3xl font-bold text-white mb-2 drop-shadow-md">{title}</h2>
    <p className="text-white/90 font-medium text-lg">{desc}</p>
  </Link>
);

const Home: React.FC = () => {
  return (
    <div className="min-h-screen pb-24 px-4 pt-10 max-w-4xl mx-auto">
      <header className="mb-10 text-center">
        <h1 className="text-5xl font-extrabold text-brand-purple mb-2 tracking-tight">
          Hello, Explorer! 🚀
        </h1>
        <p className="text-xl text-gray-600">What do you want to learn today?</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <SubjectCard
          to="/chinese"
          title="Chinese"
          desc="Learn Han Yu"
          color="bg-brand-red"
          icon={<BookOpen size={48} />}
        />
        <SubjectCard
          to="/english"
          title="English"
          desc="Learn ABCs"
          color="bg-brand-blue"
          icon={<Languages size={48} />}
        />
        <SubjectCard
          to="/math"
          title="Math"
          desc="Fun Numbers"
          color="bg-brand-green"
          icon={<Calculator size={48} />}
        />
        <SubjectCard
          to="/drawing"
          title="Drawing"
          desc="Be Creative"
          color="bg-brand-purple"
          icon={<PenTool size={48} />}
        />
      </div>
    </div>
  );
};

export default Home;
