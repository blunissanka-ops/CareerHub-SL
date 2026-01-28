
import React, { useState } from 'react';
import { User, ApplicationStatus } from '../types';

interface AuthModalProps {
  onClose: () => void;
  onLogin: (user: User) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onLogin }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleAuth = (e: React.FormEvent) => {
    e.preventDefault();
    const mockUser: User = {
      id: 'u1',
      name: name || 'Ayesha Perera',
      email: email || 'ayesha.p@university.lk',
      university: 'University of Moratuwa',
      bio: 'Final year undergraduate passionate about sustainable engineering and management. Highly motivated to bridge the gap between technical design and business strategy.',
      skills: ['Project Management', 'Data Analysis', 'AutoCAD', 'Leadership', 'React', 'TypeScript'],
      avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${email || 'ayesha'}`,
      role: 'student',
      languages: ['Sinhala (Native)', 'English (Professional)', 'Tamil (Basic)'],
      experience: [
        {
          id: 'exp1',
          role: 'Summer Engineering Intern',
          company: 'Access Engineering PLC',
          duration: 'June 2023 - Sept 2023',
          description: 'Assisted in site management for a major bridge project. Developed progress reports and coordinated with multiple sub-contractors.'
        }
      ],
      education: [
        {
          id: 'edu1',
          degree: 'B.Sc. (Hons) in Civil Engineering',
          institution: 'University of Moratuwa',
          year: '2020 - 2024 (Expected)',
          gpa: '3.82'
        }
      ],
      projects: [
        {
          id: 'proj1',
          title: 'Smart City Traffic Management System',
          description: 'A data-driven approach to reducing congestion in Colombo 07 using real-time sensor integration.'
        }
      ],
      applications: [
        {
          id: 'app1',
          jobId: '1',
          jobTitle: 'Management Trainee - Banking',
          companyName: 'Commercial Bank',
          companyLogo: 'https://picsum.photos/seed/combank/100/100',
          status: ApplicationStatus.INTERVIEWING,
          appliedAt: '2024-05-15'
        }
      ]
    };
    onLogin(mockUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="bg-white w-full max-w-md rounded-[2.5rem] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300">
        <div className="p-8">
          <div className="flex justify-between items-center mb-8">
            <div className="w-12 h-12 bg-blue-600 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-200">CH</div>
            <button onClick={onClose} className="p-2 bg-slate-50 rounded-full hover:bg-slate-100 transition-colors">
              <svg className="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">{isLogin ? 'Welcome Back' : 'Get Started'}</h2>
          <form onSubmit={handleAuth} className="space-y-4">
            {!isLogin && (
              <input type="text" placeholder="Full Name" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={name} onChange={e => setName(e.target.value)} />
            )}
            <input type="email" placeholder="Email Address" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={email} onChange={e => setEmail(e.target.value)} />
            <input type="password" placeholder="Password" required className="w-full bg-slate-50 border border-slate-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all" value={password} onChange={e => setPassword(e.target.value)} />
            <button type="submit" className="w-full bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-xl shadow-blue-100 hover:bg-blue-700 active:scale-[0.98] transition-all mt-4">{isLogin ? 'Sign In' : 'Create Account'}</button>
          </form>
          <p className="mt-8 text-center text-sm text-slate-500 font-medium">
            {isLogin ? "Don't have an account? " : "Already have an account? "}
            <button onClick={() => setIsLogin(!isLogin)} className="text-blue-600 font-bold hover:underline">{isLogin ? 'Sign Up' : 'Log In'}</button>
          </p>
        </div>
      </div>
    </div>
  );
};
