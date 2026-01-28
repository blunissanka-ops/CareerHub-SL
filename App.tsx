
import React, { useState, useEffect, useMemo } from 'react';
import { Job, JobCategory, User } from './types';
import { INITIAL_JOBS } from './constants';
import { JobCard } from './components/JobCard';
import { AICoach } from './components/AICoach';
import { PostJobForm } from './components/PostJobForm';
import { AuthModal } from './components/AuthModal';
import { ProfileView } from './components/ProfileView';

const App: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>(INITIAL_JOBS);
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [locationQuery, setLocationQuery] = useState('');
  const [selectedJobType, setSelectedJobType] = useState<string>('All');
  
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [activeTab, setActiveTab] = useState<'home' | 'post-job' | 'profile'>('home');
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showSuccessToast, setShowSuccessToast] = useState<{show: boolean, msg: string}>({show: false, msg: ''});
  
  // Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  // Splash screen removal logic
  useEffect(() => {
    const removeSplashScreen = () => {
      const splash = document.getElementById('splash-screen');
      if (splash) {
        splash.classList.add('fade-out');
        setTimeout(() => {
          splash.style.display = 'none';
        }, 600);
      }
    };

    // Simulate a brief check for data/assets readiness
    const timer = setTimeout(removeSplashScreen, 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
    });
  }, []);

  const filteredJobs = useMemo(() => {
    return jobs.filter(job => {
      const matchesCategory = selectedCategory === 'All' || job.category === selectedCategory;
      const matchesSearch = job.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           job.company.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesLocation = job.location.toLowerCase().includes(locationQuery.toLowerCase());
      const matchesType = selectedJobType === 'All' || job.type === selectedJobType;
      
      return matchesCategory && matchesSearch && matchesLocation && matchesType;
    });
  }, [jobs, selectedCategory, searchQuery, locationQuery, selectedJobType]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    console.log(`User response to the install prompt: ${outcome}`);
    setDeferredPrompt(null);
  };

  const triggerToast = (msg: string) => {
    setShowSuccessToast({show: true, msg});
    setTimeout(() => setShowSuccessToast({show: false, msg: ''}), 3000);
  };

  const handlePostSuccess = (newJob: Job) => {
    setJobs(prev => [newJob, ...prev]);
    setActiveTab('home');
    triggerToast('Job posted successfully! 🎉');
  };

  const handleUpdateProfile = (updatedUser: User) => {
    setCurrentUser(updatedUser);
    triggerToast('Profile updated! ✨');
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setActiveTab('profile');
    } else {
      setIsAuthModalOpen(true);
    }
  };

  return (
    <div className="min-h-screen pb-24 sm:pb-8 bg-slate-50">
      {/* Auth Modal */}
      {isAuthModalOpen && (
        <AuthModal 
          onClose={() => setIsAuthModalOpen(false)} 
          onLogin={(user) => {
            setCurrentUser(user);
            setActiveTab('profile');
          }} 
        />
      )}

      {/* Success Toast */}
      {showSuccessToast.show && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-3 text-sm">
          <div className="bg-emerald-500 p-1 rounded-full shrink-0">
            <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          {showSuccessToast.msg}
        </div>
      )}

      {/* Header */}
      <header className="glass-morphism sticky top-0 z-40 px-6 py-4 flex justify-between items-center shadow-sm">
        <div 
          className="flex items-center gap-2 cursor-pointer group"
          onClick={() => {
            setActiveTab('home');
            setSearchQuery('');
            setLocationQuery('');
            setSelectedCategory('All');
            setSelectedJobType('All');
          }}
        >
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl group-hover:scale-105 transition-transform">CH</div>
          <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            CareerHub SL
          </h1>
        </div>
        <div className="flex gap-4 items-center">
          {deferredPrompt && (
            <button 
              onClick={handleInstallClick}
              className="hidden sm:flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-full text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-100 active:scale-95"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
              </svg>
              Install App
            </button>
          )}
          <button 
            onClick={handleProfileClick}
            className={`flex items-center gap-2 p-1 pr-3 rounded-full transition-all border ${
              activeTab === 'profile' 
                ? 'bg-blue-50 border-blue-200 text-blue-600' 
                : 'bg-white border-slate-100 hover:bg-slate-50 text-slate-600'
            }`}
          >
            {currentUser ? (
              <>
                <img src={currentUser.avatar} className="w-8 h-8 rounded-full border border-white" alt="Profile" />
                <span className="hidden sm:inline font-bold text-sm">Hi, {currentUser.name.split(' ')[0]}</span>
              </>
            ) : (
              <div className="p-2 flex items-center gap-2">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <span className="hidden sm:inline font-bold text-sm text-slate-700">Sign In</span>
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 mt-8">
        {activeTab === 'home' && (
          <>
            {/* Hero & Multi-Filter Search Section */}
            <section className="relative mb-12 py-12 rounded-[3.5rem] bg-gradient-to-br from-slate-900 to-indigo-950 text-white overflow-hidden shadow-2xl shadow-blue-100">
              <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-80 h-80 bg-indigo-600/20 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 px-8 sm:px-16 text-center max-w-4xl mx-auto">
                <h2 className="text-4xl sm:text-6xl font-black mb-6 leading-[1.1] tracking-tight">
                  Your Future Career <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-cyan-300">Awaits in Sri Lanka</span>
                </h2>
                <p className="text-slate-300 mb-12 text-lg font-medium max-w-2xl mx-auto leading-relaxed">
                  Join the premier platform connecting students with internships and entry-level roles in every sector across the island.
                </p>

                {/* Integrated Search Bar */}
                <div className="bg-white p-2.5 rounded-[2.5rem] shadow-2xl flex flex-col lg:flex-row items-stretch lg:items-center gap-1.5 text-slate-800">
                  {/* Keyword Input */}
                  <div className="flex-1 flex items-center gap-3 px-5 py-3.5">
                    <svg className="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Job title or company" 
                      className="w-full bg-transparent focus:outline-none font-semibold placeholder-slate-400 text-slate-700"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  
                  <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

                  {/* Category Dropdown */}
                  <div className="flex-1 flex items-center gap-3 px-5 py-3.5">
                    <svg className="w-5 h-5 text-indigo-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <select 
                      className="w-full bg-transparent focus:outline-none font-semibold text-slate-700 cursor-pointer appearance-none"
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                    >
                      <option value="All">All Industries</option>
                      {Object.values(JobCategory).map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="hidden lg:block w-px h-10 bg-slate-100"></div>

                  {/* Location Input */}
                  <div className="flex-1 flex items-center gap-3 px-5 py-3.5">
                    <svg className="w-5 h-5 text-emerald-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Location" 
                      className="w-full bg-transparent focus:outline-none font-semibold placeholder-slate-400 text-slate-700"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                    />
                  </div>

                  <button className="lg:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-12 py-4 rounded-[2rem] transition-all active:scale-95 shadow-xl shadow-blue-200 lg:ml-2">
                    Search
                  </button>
                </div>
              </div>
            </section>

            <div className="grid grid-cols-1 lg:grid-cols-4 gap-10">
              {/* Sidebar Filters */}
              <aside className="lg:col-span-1 space-y-8">
                <div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-[0.2em] mb-4">Job Types</h3>
                  <div className="space-y-2">
                    {['All', 'Internship', 'Full-time', 'Contract', 'Remote'].map(type => (
                      <button
                        key={type}
                        onClick={() => setSelectedJobType(type)}
                        className={`w-full text-left px-5 py-3 rounded-2xl font-bold transition-all border ${
                          selectedJobType === type 
                            ? 'bg-blue-50 border-blue-200 text-blue-600 shadow-sm' 
                            : 'bg-white border-transparent text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-6 bg-gradient-to-br from-indigo-600 to-blue-700 rounded-[2.5rem] text-white shadow-xl shadow-blue-100">
                  <h4 className="font-black text-xl mb-3">Post a Job</h4>
                  <p className="text-indigo-100 text-sm mb-6 leading-relaxed">Looking for talent? Reach thousands of graduates and students in Sri Lanka.</p>
                  <button 
                    onClick={() => setActiveTab('post-job')}
                    className="w-full bg-white text-indigo-600 font-black py-3 rounded-2xl hover:bg-slate-50 transition-colors shadow-lg"
                  >
                    Post for Free
                  </button>
                </div>
              </aside>

              {/* Main Feed */}
              <div className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{filteredJobs.length} Positions Available</h3>
                    <p className="text-slate-500 font-medium">Verified opportunities in Sri Lanka</p>
                  </div>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setLocationQuery('');
                      setSelectedCategory('All');
                      setSelectedJobType('All');
                    }}
                    className="text-sm font-bold text-blue-600 hover:underline"
                  >
                    Reset all filters
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  {filteredJobs.length > 0 ? (
                    filteredJobs.map(job => (
                      <JobCard 
                        key={job.id} 
                        job={job} 
                        onClick={setSelectedJob} 
                      />
                    ))
                  ) : (
                    <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-200">
                      <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                        <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                      <p className="text-slate-900 font-black text-2xl">No positions found</p>
                      <p className="text-slate-400 mt-2 font-medium">Try broadening your search or choosing a different industry.</p>
                      <button 
                        onClick={() => setSelectedCategory('All')}
                        className="mt-8 px-10 py-3.5 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                      >
                        Browse All Industries
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </>
        )}

        {activeTab === 'post-job' && (
          <PostJobForm 
            onSuccess={handlePostSuccess}
            onCancel={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && currentUser && (
          <ProfileView 
            user={currentUser} 
            onLogout={() => {
              setCurrentUser(null);
              setActiveTab('home');
            }} 
            onUpdate={handleUpdateProfile}
          />
        )}
      </main>

      {/* Footer Nav for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-slate-100 sm:hidden flex justify-around p-3 pb-8 z-40">
        <button 
          onClick={() => setActiveTab('home')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'home' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'home' ? 'bg-blue-50' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider">Home</span>
        </button>
        <button 
          onClick={() => setActiveTab('post-job')}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'post-job' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'post-job' ? 'bg-blue-50' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider">Post</span>
        </button>
        <button 
          onClick={handleProfileClick}
          className={`flex flex-col items-center gap-1.5 transition-all ${activeTab === 'profile' ? 'text-blue-600' : 'text-slate-400'}`}
        >
          <div className={`p-1.5 rounded-xl transition-all ${activeTab === 'profile' ? 'bg-blue-50' : ''}`}>
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
          </div>
          <span className="text-[10px] font-black uppercase tracking-wider">Profile</span>
        </button>
      </nav>

      {/* Job Details Modal */}
      {selectedJob && (
        <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
          <div 
            className="bg-white w-full max-w-xl rounded-t-[3rem] sm:rounded-[3.5rem] h-[92vh] sm:h-auto overflow-y-auto animate-in slide-in-from-bottom-32 duration-500 shadow-2xl relative"
          >
            <div className="sticky top-0 right-0 p-6 flex justify-end z-10">
               <button onClick={() => setSelectedJob(null)} className="bg-white/80 backdrop-blur-md p-3.5 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-10 pb-12 -mt-12">
              <div className="mb-8 flex flex-col items-center sm:items-start">
                <div className="relative">
                  <img src={selectedJob.logo} alt={selectedJob.company} className="w-28 h-28 rounded-[2rem] shadow-2xl border-4 border-white mb-8 bg-white object-cover" />
                  <div className="absolute -bottom-2 -right-2 bg-emerald-500 w-8 h-8 rounded-full border-4 border-white flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                </div>
                <h2 className="text-4xl font-black text-slate-900 leading-tight text-center sm:text-left">{selectedJob.title}</h2>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 mt-4">
                  <p className="text-blue-600 font-black text-2xl">{selectedJob.company}</p>
                  <span className="bg-slate-100 text-slate-500 px-4 py-1.5 rounded-xl font-bold text-sm">{selectedJob.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-5 mt-10">
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Pay Range</p>
                  <p className="text-lg font-bold text-slate-700">{selectedJob.salary || 'Competitive'}</p>
                </div>
                <div className="bg-slate-50 p-6 rounded-[2rem] border border-slate-100">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest mb-1">Employment</p>
                  <p className="text-lg font-bold text-slate-700">{selectedJob.type}</p>
                </div>
              </div>

              <div className="mt-12">
                <h3 className="font-black text-slate-900 mb-4 text-xl flex items-center gap-2">
                  <div className="w-2 h-8 bg-blue-600 rounded-full"></div>
                  About the Role
                </h3>
                <div className="text-slate-600 leading-relaxed text-lg bg-slate-50/50 p-8 rounded-[2.5rem] border border-slate-50">
                  {selectedJob.description.split('\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="mt-12 flex flex-col sm:flex-row gap-5">
                <button className="flex-[2] bg-blue-600 text-white font-black py-5 rounded-[2rem] shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-xl">
                  Quick Apply
                </button>
                <button className="flex-1 bg-slate-100 text-slate-700 font-black py-5 rounded-[2rem] hover:bg-slate-200 transition-all flex items-center justify-center gap-3">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Coach Floating Widget */}
      <AICoach jobs={jobs} />
    </div>
  );
};

export default App;
