
import React, { useState } from 'react';
import { User, JobApplication, ApplicationStatus, WorkExperience, Education, Project } from '../types';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState('');
  const [activeProfileTab, setActiveProfileTab] = useState<'info' | 'portfolio' | 'applications'>('info');

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleExportCV = () => {
    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    const cvHtml = `
      <html>
        <head>
          <title>CV - ${user.name}</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <style>
            @media print { .no-print { display: none; } body { padding: 0; margin: 0; } }
            body { font-family: 'Inter', sans-serif; background: #fff; color: #1e293b; }
          </style>
        </head>
        <body class="p-10">
          <div class="max-w-4xl mx-auto border border-slate-200 p-12 shadow-sm bg-white">
            <header class="flex justify-between items-start border-b-4 border-blue-600 pb-8 mb-10">
              <div>
                <h1 class="text-5xl font-black text-slate-900 mb-2 uppercase tracking-tighter">${user.name}</h1>
                <p class="text-xl font-bold text-blue-600">${user.university}</p>
              </div>
              <div class="text-right text-sm text-slate-500 font-medium">
                <p>${user.email}</p>
                <p>Sri Lanka</p>
              </div>
            </header>

            <div class="grid grid-cols-3 gap-12">
              <aside class="col-span-1 space-y-10">
                <div>
                  <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Skills</h3>
                  <div class="flex flex-wrap gap-2">
                    ${user.skills.map(s => `<span class="text-xs font-bold bg-slate-50 px-3 py-1 rounded-md border border-slate-100">${s}</span>`).join('')}
                  </div>
                </div>
                <div>
                  <h3 class="text-sm font-black text-slate-900 uppercase tracking-widest border-b border-slate-100 pb-2 mb-4">Languages</h3>
                  <ul class="text-sm space-y-1 font-medium">
                    ${user.languages.map(l => `<li>• ${l}</li>`).join('')}
                  </ul>
                </div>
              </aside>

              <main class="col-span-2 space-y-12">
                <section>
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span class="w-8 h-1 bg-blue-600 rounded-full"></span> Professional Profile
                  </h3>
                  <p class="text-slate-600 leading-relaxed font-medium">${user.bio}</p>
                </section>

                <section>
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span class="w-8 h-1 bg-blue-600 rounded-full"></span> Work Experience
                  </h3>
                  <div class="space-y-8">
                    ${user.experience.map(exp => `
                      <div>
                        <div class="flex justify-between items-baseline mb-1">
                          <h4 class="font-bold text-slate-900">${exp.role}</h4>
                          <span class="text-xs font-black text-slate-400 uppercase">${exp.duration}</span>
                        </div>
                        <p class="text-blue-600 text-sm font-black mb-2">${exp.company}</p>
                        <p class="text-sm text-slate-600 leading-relaxed">${exp.description}</p>
                      </div>
                    `).join('')}
                  </div>
                </section>

                <section>
                  <h3 class="text-lg font-black text-slate-900 uppercase tracking-widest mb-6 flex items-center gap-3">
                    <span class="w-8 h-1 bg-blue-600 rounded-full"></span> Education
                  </h3>
                  <div class="space-y-6">
                    ${user.education.map(edu => `
                      <div class="flex justify-between items-start">
                        <div>
                          <h4 class="font-bold text-slate-900">${edu.degree}</h4>
                          <p class="text-sm text-slate-600">${edu.institution}</p>
                        </div>
                        <div class="text-right">
                          <p class="text-xs font-black text-slate-400">${edu.year}</p>
                          ${edu.gpa ? `<p class="text-xs font-bold text-blue-600">GPA: ${edu.gpa}</p>` : ''}
                        </div>
                      </div>
                    `).join('')}
                  </div>
                </section>
              </main>
            </div>

            <footer class="mt-20 pt-8 border-t border-slate-100 text-center text-[10px] text-slate-400 uppercase font-black tracking-[0.3em]">
              Generated by CareerHub SL • verified student portfolio
            </footer>
          </div>
          <div class="fixed bottom-8 right-8 no-print">
            <button onclick="window.print()" class="bg-blue-600 text-white font-black px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-all">Print / Save as PDF</button>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(cvHtml);
    printWindow.document.close();
  };

  const updateList = <T extends { id: string }>(
    listName: 'experience' | 'education' | 'projects',
    action: 'add' | 'remove' | 'update',
    item?: T
  ) => {
    let newList = [...editedUser[listName]] as any[];
    if (action === 'add' && item) newList.push(item);
    if (action === 'remove' && item) newList = newList.filter(i => i.id !== item.id);
    if (action === 'update' && item) newList = newList.map(i => i.id === item.id ? item : i);
    
    setEditedUser({ ...editedUser, [listName]: newList });
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-2 ml-1";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-5xl mx-auto pb-12">
      {/* Header Profile Card */}
      <div className="bg-white rounded-[3rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="h-48 bg-gradient-to-r from-blue-700 via-indigo-600 to-blue-800 relative">
          <div className="absolute inset-0 opacity-15 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:24px_24px]"></div>
          <div className="absolute bottom-4 right-8 flex gap-4 no-print">
             <button 
              onClick={handleExportCV}
              className="px-6 py-2.5 bg-white/20 backdrop-blur-md text-white font-black rounded-xl border border-white/20 hover:bg-white/30 transition-all flex items-center gap-2 text-sm"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
              Generate Smart CV
            </button>
          </div>
        </div>
        <div className="px-10 pb-10 -mt-20 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
            <img 
              src={user.avatar} 
              className="w-44 h-44 rounded-[3rem] border-[8px] border-white shadow-2xl bg-white object-cover"
              alt={user.name}
            />
            <div className="flex gap-3 mb-2">
              {isEditing ? (
                <>
                  <button onClick={handleSave} className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95">Save Changes</button>
                  <button onClick={() => { setEditedUser({...user}); setIsEditing(false); }} className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl">Cancel</button>
                </>
              ) : (
                <button onClick={() => setIsEditing(true)} className="px-10 py-3.5 bg-white border border-slate-200 text-slate-800 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"/></svg>
                  Edit Portfolio
                </button>
              )}
            </div>
          </div>
          <div className="mt-8">
            <h2 className="text-5xl font-black text-slate-900 tracking-tighter">{user.name}</h2>
            <p className="text-xl font-bold text-blue-600 mt-2">{user.university}</p>
          </div>
        </div>
      </div>

      {/* Profile Tabs */}
      <div className="flex gap-4 mb-8">
        {[
          { id: 'info', label: 'Overview', icon: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z' },
          { id: 'portfolio', label: 'Portfolio', icon: 'M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10' },
          { id: 'applications', label: 'Applications', icon: 'M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveProfileTab(tab.id as any)}
            className={`flex items-center gap-3 px-8 py-4 rounded-3xl font-black transition-all ${
              activeProfileTab === tab.id 
              ? 'bg-blue-600 text-white shadow-xl shadow-blue-100' 
              : 'bg-white text-slate-400 hover:bg-slate-50 border border-slate-100'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d={tab.icon}/></svg>
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {activeProfileTab === 'info' && (
            <>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <h3 className="text-2xl font-black text-slate-900 mb-6">About Me</h3>
                {isEditing ? (
                  <textarea 
                    className={`${inputClass} min-h-[150px] leading-relaxed`}
                    value={editedUser.bio}
                    onChange={e => setEditedUser({...editedUser, bio: e.target.value})}
                  />
                ) : (
                  <p className="text-slate-600 leading-relaxed text-lg font-medium">{user.bio}</p>
                )}
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Education</h3>
                  {isEditing && (
                    <button 
                      onClick={() => updateList('education', 'add', { id: Date.now().toString(), degree: '', institution: '', year: '', gpa: '' })}
                      className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100"
                    >
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </button>
                  )}
                </div>
                <div className="space-y-6">
                  {(isEditing ? editedUser.education : user.education).map((edu, idx) => (
                    <div key={edu.id} className="relative group p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                      {isEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                          <input className={inputClass} placeholder="Degree" value={edu.degree} onChange={e => updateList('education', 'update', {...edu, degree: e.target.value})} />
                          <input className={inputClass} placeholder="Institution" value={edu.institution} onChange={e => updateList('education', 'update', {...edu, institution: e.target.value})} />
                          <input className={inputClass} placeholder="Years" value={edu.year} onChange={e => updateList('education', 'update', {...edu, year: e.target.value})} />
                          <input className={inputClass} placeholder="GPA (Optional)" value={edu.gpa} onChange={e => updateList('education', 'update', {...edu, gpa: e.target.value})} />
                        </div>
                      ) : (
                        <div className="flex justify-between">
                          <div>
                            <h4 className="font-black text-slate-900 text-lg">{edu.degree}</h4>
                            <p className="text-blue-600 font-bold">{edu.institution}</p>
                            <p className="text-slate-400 text-sm mt-1">{edu.year}</p>
                          </div>
                          {edu.gpa && <div className="bg-emerald-50 text-emerald-600 px-4 py-1.5 rounded-xl text-sm font-black border border-emerald-100 self-start">GPA: {edu.gpa}</div>}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeProfileTab === 'portfolio' && (
            <>
              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Work Experience</h3>
                  {isEditing && (
                    <button onClick={() => updateList('experience', 'add', { id: Date.now().toString(), role: '', company: '', duration: '', description: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </button>
                  )}
                </div>
                <div className="space-y-8">
                  {(isEditing ? editedUser.experience : user.experience).map(exp => (
                    <div key={exp.id} className="p-6 bg-slate-50/50 rounded-3xl border border-slate-100">
                      {isEditing ? (
                        <div className="space-y-4">
                          <input className={inputClass} placeholder="Role" value={exp.role} onChange={e => updateList('experience', 'update', {...exp, role: e.target.value})} />
                          <div className="grid grid-cols-2 gap-4">
                            <input className={inputClass} placeholder="Company" value={exp.company} onChange={e => updateList('experience', 'update', {...exp, company: e.target.value})} />
                            <input className={inputClass} placeholder="Duration" value={exp.duration} onChange={e => updateList('experience', 'update', {...exp, duration: e.target.value})} />
                          </div>
                          <textarea className={inputClass} placeholder="Responsibilities" value={exp.description} onChange={e => updateList('experience', 'update', {...exp, description: e.target.value})} />
                        </div>
                      ) : (
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="text-xl font-black text-slate-900">{exp.role}</h4>
                            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-lg text-xs font-black uppercase tracking-wider">{exp.duration}</span>
                          </div>
                          <p className="text-blue-600 font-bold mb-4">{exp.company}</p>
                          <p className="text-slate-500 leading-relaxed font-medium">{exp.description}</p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
                 <div className="flex justify-between items-center mb-8">
                  <h3 className="text-2xl font-black text-slate-900">Key Projects</h3>
                  {isEditing && (
                    <button onClick={() => updateList('projects', 'add', { id: Date.now().toString(), title: '', description: '' })} className="p-2 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6v6m0 0v6m0-6h6m-6 0H6"/></svg>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-6">
                  {(isEditing ? editedUser.projects : user.projects).map(proj => (
                    <div key={proj.id} className="p-8 bg-gradient-to-br from-white to-slate-50 border border-slate-100 rounded-[2.5rem] shadow-sm">
                      {isEditing ? (
                        <div className="space-y-4">
                          <input className={inputClass} placeholder="Project Title" value={proj.title} onChange={e => updateList('projects', 'update', {...proj, title: e.target.value})} />
                          <textarea className={inputClass} placeholder="Project Brief" value={proj.description} onChange={e => updateList('projects', 'update', {...proj, description: e.target.value})} />
                        </div>
                      ) : (
                        <>
                          <h4 className="text-2xl font-black text-slate-900 mb-2">{proj.title}</h4>
                          <p className="text-slate-600 font-medium leading-relaxed">{proj.description}</p>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}

          {activeProfileTab === 'applications' && (
            <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-8">Application Tracker</h3>
              <div className="space-y-4">
                {user.applications.map(app => (
                  <div key={app.id} className="p-6 bg-slate-50 rounded-3xl border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <img src={app.companyLogo} className="w-16 h-16 rounded-2xl bg-white p-2 border border-slate-100" />
                      <div>
                        <h4 className="font-black text-slate-900 text-lg">{app.jobTitle}</h4>
                        <p className="text-blue-600 font-bold">{app.companyName}</p>
                      </div>
                    </div>
                    <div className={`px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider border ${
                      app.status === ApplicationStatus.OFFERED ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>
                      {app.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar Info */}
        <div className="space-y-8">
          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest text-sm">Skills Set</h3>
            <div className="flex flex-wrap gap-2">
              {(isEditing ? editedUser.skills : user.skills).map((skill, i) => (
                <div key={i} className="px-4 py-2 bg-slate-50 border border-slate-100 text-slate-800 font-black text-xs rounded-xl uppercase tracking-tighter">
                  {skill}
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white p-10 rounded-[3rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 uppercase tracking-widest text-sm">Languages</h3>
            <div className="space-y-4">
              {user.languages.map((lang, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-2 h-2 rounded-full bg-blue-600"></div>
                  <span className="font-bold text-slate-700">{lang}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-indigo-900 to-blue-900 p-10 rounded-[3rem] text-white shadow-2xl shadow-blue-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700"></div>
            <h4 className="text-2xl font-black mb-4 leading-tight">Professional CV Ready</h4>
            <p className="text-indigo-200 text-sm mb-8 leading-relaxed font-medium">Your profile is updated with all professional details. Export a recruiter-ready CV in seconds.</p>
            <button 
              onClick={handleExportCV}
              className="w-full bg-white text-indigo-900 font-black py-4 rounded-[1.5rem] hover:bg-indigo-50 transition-all shadow-lg active:scale-95"
            >
              Export Smart CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
