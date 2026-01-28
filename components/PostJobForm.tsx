
import React, { useState } from 'react';
import { JobCategory, Job } from '../types';

interface PostJobFormProps {
  onSuccess: (job: Job) => void;
  onCancel: () => void;
}

export const PostJobForm: React.FC<PostJobFormProps> = ({ onSuccess, onCancel }) => {
  // Initialize today's date in YYYY-MM-DD format for the date input
  const today = new Date().toISOString().split('T')[0];

  const [formData, setFormData] = useState({
    title: '',
    company: '',
    location: '',
    type: 'Full-time' as Job['type'],
    salary: '',
    description: '',
    category: JobCategory.SOFTWARE,
    postedAt: today,
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newJob: Job = {
      ...formData,
      id: Math.random().toString(36).substr(2, 9),
      logo: `https://picsum.photos/seed/${formData.company}/100/100`,
    };

    onSuccess(newJob);
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all";
  const labelClass = "block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5 ml-1";

  return (
    <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-black text-slate-900">Post a Job</h2>
          <p className="text-slate-500 text-sm">Fill in the details to reach top Sri Lankan talent.</p>
        </div>
        <button 
          onClick={onCancel}
          className="p-2 bg-slate-100 rounded-full hover:bg-slate-200 text-slate-500 transition-colors"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Job Title</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Software Engineer"
              className={inputClass}
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
            />
          </div>
          <div>
            <label className={labelClass}>Company Name</label>
            <input 
              required
              type="text" 
              placeholder="e.g. WSO2"
              className={inputClass}
              value={formData.company}
              onChange={e => setFormData({...formData, company: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Location</label>
            <input 
              required
              type="text" 
              placeholder="e.g. Colombo / Remote"
              className={inputClass}
              value={formData.location}
              onChange={e => setFormData({...formData, location: e.target.value})}
            />
          </div>
          <div>
            <label className={labelClass}>Salary (Optional)</label>
            <input 
              type="text" 
              placeholder="e.g. Rs. 100,000 - 150,000"
              className={inputClass}
              value={formData.salary}
              onChange={e => setFormData({...formData, salary: e.target.value})}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Job Type</label>
            <select 
              className={inputClass}
              value={formData.type}
              onChange={e => setFormData({...formData, type: e.target.value as Job['type']})}
            >
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>
          <div>
            <label className={labelClass}>Category</label>
            <select 
              className={inputClass}
              value={formData.category}
              onChange={e => setFormData({...formData, category: e.target.value as JobCategory})}
            >
              {Object.values(JobCategory).map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div>
            <label className={labelClass}>Posted Date</label>
            <input 
              required
              type="date"
              className={inputClass}
              value={formData.postedAt}
              onChange={e => setFormData({...formData, postedAt: e.target.value})}
            />
          </div>
        </div>

        <div>
          <label className={labelClass}>Job Description</label>
          <textarea 
            required
            rows={5}
            placeholder="Describe the role, requirements, and benefits..."
            className={`${inputClass} resize-none`}
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <button 
            type="submit"
            className="flex-1 bg-blue-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-blue-200 hover:bg-blue-700 active:scale-[0.98] transition-all"
          >
            Post Job Listing
          </button>
          <button 
            type="button"
            onClick={onCancel}
            className="px-8 py-4 bg-slate-100 text-slate-600 font-bold rounded-2xl hover:bg-slate-200 transition-all"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};
