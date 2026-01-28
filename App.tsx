
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
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] bg-slate-900 text-white px-8 py-4 rounded-3xl shadow-2xl font-bold animate-in fade-in slide-in-from-top-4 flex items-center gap-3">
          <div className="bg-emerald-500 p-1 rounded-full">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
                <span className="hidden sm:inline font-bold text-sm">Sign In</span>
              </div>
            )}
          </button>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 mt-8">
        {activeTab === 'home' && (
          <>
            {/* Hero & Search Section */}
            <section className="relative mb-12 py-10 rounded-[3rem] bg-gradient-to-br from-slate-900 to-blue-900 text-white overflow-hidden shadow-2xl shadow-blue-200/50">
              <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
              <div className="absolute bottom-0 left-0 w-64 h-64 bg-indigo-500/20 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2"></div>
              
              <div className="relative z-10 px-8 sm:px-12 text-center max-w-3xl mx-auto">
                <h2 className="text-4xl sm:text-5xl font-black mb-4 leading-tight tracking-tight">
                  Your Tech Career in <br/><span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-cyan-200">Sri Lanka Starts Here</span>
                </h2>
                <p className="text-blue-100/80 mb-10 text-lg font-medium">
                  The most curated internship & associate job board for the next generation of SL tech talent.
                </p>

                {/* Search Bar Container */}
                <div className="bg-white p-3 rounded-[2rem] shadow-2xl flex flex-col md:flex-row items-center gap-2 text-slate-800">
                  <div className="flex-1 flex items-center gap-3 px-4 w-full">
                    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="Job title, company, or keyword" 
                      className="w-full py-3 bg-transparent focus:outline-none font-medium placeholder-slate-400"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  <div className="hidden md:block w-px h-8 bg-slate-100"></div>
                  <div className="flex-1 flex items-center gap-3 px-4 w-full">
                    <svg className="w-5 h-5 text-slate-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <input 
                      type="text" 
                      placeholder="City or 'Remote'" 
                      className="w-full py-3 bg-transparent focus:outline-none font-medium placeholder-slate-400"
                      value={locationQuery}
                      onChange={(e) => setLocationQuery(e.target.value)}
                    />
                  </div>
                  <button className="w-full md:w-auto bg-blue-600 hover:bg-blue-700 text-white font-black px-10 py-4 rounded-[1.5rem] transition-all active:scale-95 shadow-lg shadow-blue-200">
                    Find Jobs
                  </button>
                </div>
              </div>
            </section>

            {/* Filters Row */}
            <div className="mb-10 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black text-slate-900 tracking-tight">Explore Categories</h3>
                <button 
                   onClick={() => {
                     setSearchQuery('');
                     setLocationQuery('');
                     setSelectedCategory('All');
                     setSelectedJobType('All');
                   }}
                   className="text-sm font-bold text-blue-600 hover:underline"
                >
                  Clear all filters
                </button>
              </div>
              
              <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
                {['All', ...Object.values(JobCategory)].map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`whitespace-nowrap px-6 py-3 rounded-2xl text-sm font-bold transition-all border ${
                      selectedCategory === cat 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-xl shadow-blue-100' 
                        : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap items-center gap-4 pt-2">
                <span className="text-xs font-black text-slate-400 uppercase tracking-widest">Quick Filters:</span>
                {['Internship', 'Full-time', 'Remote'].map(type => (
                   <button
                    key={type}
                    onClick={() => setSelectedJobType(selectedJobType === type ? 'All' : type)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold transition-all border ${
                      selectedJobType === type 
                        ? 'bg-blue-50 text-blue-600 border-blue-200' 
                        : 'bg-white text-slate-500 border-slate-200 hover:bg-slate-50'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>

            {/* Job List Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                <h3 className="text-2xl font-black text-slate-900">{filteredJobs.length} Results Found</h3>
                <p className="text-slate-500 font-medium text-sm">Sorted by newest listings</p>
              </div>
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-xl px-4 py-2">
                <span className="text-xs font-bold text-slate-400">Sort:</span>
                <select className="text-sm font-bold bg-transparent focus:outline-none text-slate-700">
                  <option>Recent</option>
                  <option>Oldest</option>
                </select>
              </div>
            </div>

            {/* Job Feed Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filteredJobs.length > 0 ? (
                filteredJobs.map(job => (
                  <JobCard 
                    key={job.id} 
                    job={job} 
                    onClick={setSelectedJob} 
                  />
                ))
              ) : (
                <div className="col-span-full text-center py-32 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
                  <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <svg className="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <p className="text-slate-900 font-black text-2xl">No jobs match your search</p>
                  <p className="text-slate-400 mt-2 font-medium">Try broadening your search terms or changing categories.</p>
                  <button 
                    onClick={() => {
                      setSearchQuery('');
                      setLocationQuery('');
                      setSelectedCategory('All');
                    }}
                    className="mt-8 px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100"
                  >
                    Clear Search
                  </button>
                </div>
              )}
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

      {/* Footer Nav for Mobile (PWA feel) */}
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
          <span className="text-[10px] font-black uppercase tracking-wider">Jobs</span>
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
            className="bg-white w-full max-w-lg rounded-t-[3rem] sm:rounded-[3rem] h-[90vh] sm:h-auto overflow-y-auto animate-in slide-in-from-bottom-32 duration-500 shadow-2xl relative"
          >
            <div className="sticky top-0 right-0 p-4 flex justify-end z-10">
               <button onClick={() => setSelectedJob(null)} className="bg-white/80 backdrop-blur-md p-3 rounded-2xl shadow-sm border border-slate-100 hover:bg-slate-50 transition-colors">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="px-8 pb-10 -mt-10">
              <div className="mb-6 flex flex-col items-center sm:items-start">
                <img src={selectedJob.logo} alt={selectedJob.company} className="w-24 h-24 rounded-3xl shadow-xl border-4 border-white mb-6 bg-white" />
                <h2 className="text-3xl font-black text-slate-900 leading-tight text-center sm:text-left">{selectedJob.title}</h2>
                <div className="flex items-center gap-2 mt-2">
                  <p className="text-blue-600 font-black text-xl">{selectedJob.company}</p>
                  <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                  <span className="text-slate-400 font-bold">{selectedJob.location}</span>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mt-8">
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Pay Grade</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{selectedJob.salary || 'Negotiable'}</p>
                </div>
                <div className="bg-slate-50 p-5 rounded-3xl border border-slate-100">
                  <p className="text-xs text-slate-400 font-black uppercase tracking-widest">Commitment</p>
                  <p className="text-base font-bold text-slate-700 mt-1">{selectedJob.type}</p>
                </div>
              </div>

              <div className="mt-10">
                <h3 className="font-black text-slate-900 mb-3 text-lg">Position Overview</h3>
                <div className="text-slate-600 leading-relaxed text-lg bg-slate-50/50 p-6 rounded-3xl border border-slate-50">
                  {selectedJob.description.split('\n').map((para, i) => (
                    <p key={i} className={i > 0 ? 'mt-4' : ''}>{para}</p>
                  ))}
                </div>
              </div>

              <div className="mt-10 flex gap-4">
                <button className="flex-1 bg-blue-600 text-white font-black py-5 rounded-3xl shadow-2xl shadow-blue-200 hover:bg-blue-700 active:scale-95 transition-all text-lg">
                  Submit Application
                </button>
                <button className="w-16 h-16 bg-slate-100 flex items-center justify-center rounded-3xl hover:bg-slate-200 transition-colors">
                  <svg className="w-7 h-7 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                  </svg>
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
