
import React, { useState } from 'react';
import { User } from '../types';

interface ProfileViewProps {
  user: User;
  onLogout: () => void;
  onUpdate: (updatedUser: User) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ user, onLogout, onUpdate }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [newSkill, setNewSkill] = useState('');

  const handleSave = () => {
    onUpdate(editedUser);
    setIsEditing(false);
  };

  const handleAddSkill = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSkill.trim() && !editedUser.skills.includes(newSkill.trim())) {
      setEditedUser({
        ...editedUser,
        skills: [...editedUser.skills, newSkill.trim()]
      });
      setNewSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setEditedUser({
      ...editedUser,
      skills: editedUser.skills.filter(s => s !== skillToRemove)
    });
  };

  const inputClass = "w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all";
  const labelClass = "block text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 ml-1";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-6 duration-500 max-w-4xl mx-auto">
      {/* Header Profile Card */}
      <div className="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden mb-8">
        <div className="h-40 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 relative">
           <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>
        </div>
        <div className="px-8 pb-8 -mt-16 relative z-10">
          <div className="flex flex-col sm:flex-row justify-between items-end gap-6">
            <div className="relative group">
              <img 
                src={user.avatar} 
                alt={user.name} 
                className="w-36 h-36 rounded-[2.5rem] border-[6px] border-white shadow-2xl bg-white object-cover"
              />
              {isEditing && (
                <div className="absolute inset-0 bg-black/40 rounded-[2.5rem] border-[6px] border-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              {isEditing ? (
                <>
                  <button 
                    onClick={handleSave}
                    className="px-8 py-3 bg-blue-600 text-white font-black rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                  >
                    Save Changes
                  </button>
                  <button 
                    onClick={() => {
                      setEditedUser({...user});
                      setIsEditing(false);
                    }}
                    className="px-8 py-3 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
                  >
                    Cancel
                  </button>
                </>
              ) : (
                <>
                  <button 
                    onClick={() => setIsEditing(true)}
                    className="px-8 py-3 bg-white border border-slate-200 text-slate-700 font-black rounded-2xl hover:bg-slate-50 transition-all shadow-sm active:scale-95 flex items-center gap-2"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                    Edit Profile
                  </button>
                  <button 
                    onClick={onLogout}
                    className="p-3 bg-rose-50 text-rose-600 rounded-2xl hover:bg-rose-100 transition-all group"
                    title="Logout"
                  >
                    <svg className="w-6 h-6 group-hover:translate-x-0.5 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                    </svg>
                  </button>
                </>
              )}
            </div>
          </div>

          <div className="mt-8">
            {isEditing ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in slide-in-from-top-2">
                <div>
                  <label className={labelClass}>Full Name</label>
                  <input 
                    className={inputClass}
                    value={editedUser.name}
                    onChange={e => setEditedUser({...editedUser, name: e.target.value})}
                  />
                </div>
                <div>
                  <label className={labelClass}>University</label>
                  <input 
                    className={inputClass}
                    value={editedUser.university}
                    onChange={e => setEditedUser({...editedUser, university: e.target.value})}
                  />
                </div>
              </div>
            ) : (
              <>
                <h2 className="text-4xl font-black text-slate-900 tracking-tight">{user.name}</h2>
                <div className="flex flex-wrap items-center gap-4 mt-3 text-slate-500 font-semibold">
                  <span className="flex items-center gap-2 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-100">
                    <svg className="w-5 h-5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                    {user.university}
                  </span>
                  <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black px-3 py-1.5 rounded-xl uppercase tracking-widest border border-emerald-100">
                    Verified Student
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
          {/* Bio Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-4">Professional Bio</h3>
            {isEditing ? (
              <textarea 
                className={`${inputClass} min-h-[150px] resize-none leading-relaxed text-slate-600`}
                value={editedUser.bio}
                onChange={e => setEditedUser({...editedUser, bio: e.target.value})}
                placeholder="Write something about yourself..."
              />
            ) : (
              <p className="text-slate-600 leading-relaxed text-lg font-medium">
                {user.bio || "No bio added yet."}
              </p>
            )}
          </div>

          {/* Skills Section */}
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6 flex items-center justify-between">
              Skills & Expertise
              <span className="bg-blue-50 text-blue-600 text-xs px-3 py-1 rounded-full font-bold">
                {isEditing ? editedUser.skills.length : user.skills.length} Total
              </span>
            </h3>
            
            <div className="flex flex-wrap gap-3 mb-6">
              {(isEditing ? editedUser.skills : user.skills).map((skill, i) => (
                <div key={i} className="flex items-center gap-2 px-5 py-3 bg-slate-50 border border-slate-100 text-slate-700 font-bold rounded-2xl hover:border-blue-200 hover:text-blue-600 transition-all group">
                  {skill}
                  {isEditing && (
                    <button 
                      onClick={() => removeSkill(skill)}
                      className="text-slate-300 hover:text-rose-500 transition-colors"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  )}
                </div>
              ))}
            </div>

            {isEditing && (
              <form onSubmit={handleAddSkill} className="flex gap-2">
                <input 
                  type="text"
                  placeholder="e.g. Figma, Go, React"
                  className={inputClass}
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                />
                <button 
                  type="submit"
                  className="px-6 bg-blue-50 text-blue-600 font-bold rounded-xl hover:bg-blue-100 transition-colors"
                >
                  Add
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <div className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100">
            <h3 className="text-xl font-black text-slate-900 mb-6">Account Details</h3>
            <div className="space-y-5">
              <div>
                <label className={labelClass}>Primary Email</label>
                {isEditing ? (
                  <input 
                    type="email"
                    className={inputClass}
                    value={editedUser.email}
                    onChange={e => setEditedUser({...editedUser, email: e.target.value})}
                  />
                ) : (
                  <div className="flex items-center gap-3 text-slate-600 bg-slate-50 p-3 rounded-2xl border border-slate-50">
                    <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    <span className="text-sm font-bold">{user.email}</span>
                  </div>
                )}
              </div>
              
              <div className="pt-4 border-t border-slate-50">
                <p className="text-xs text-slate-400 font-bold uppercase mb-3">Profile Statistics</p>
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-xl font-black text-blue-600">12</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Applications</p>
                  </div>
                  <div className="bg-slate-50 p-3 rounded-2xl text-center">
                    <p className="text-xl font-black text-indigo-600">4</p>
                    <p className="text-[10px] font-bold text-slate-500 uppercase">Saved Jobs</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-8 rounded-[2.5rem] shadow-xl shadow-blue-100 text-white">
            <h4 className="font-black text-lg mb-2">Build your CV</h4>
            <p className="text-blue-100 text-sm mb-6 leading-relaxed">
              Export your CareerHub profile as a professional PDF resume with one click.
            </p>
            <button className="w-full bg-white text-blue-600 font-black py-3 rounded-2xl hover:bg-blue-50 transition-colors shadow-lg">
              Generate CV
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
