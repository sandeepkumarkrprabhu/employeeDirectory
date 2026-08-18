import React, { useState } from 'react';
import {
  ShieldCheck,
  PlusCircle,
  List,
  Sparkles,
  AlertTriangle,
  Pin,
  Trash2,
  Edit,
  Save,
  Send,
  Loader2,
  FileText,
  CheckCircle,
  Megaphone,
  Paperclip,
  Tag,
  Building,
} from 'lucide-react';
import { Announcement, Department, Category, Priority, AIDraftRequest } from '../../types';

interface AdminPanelProps {
  announcements: Announcement[];
  onAddAnnouncement: (announcement: Partial<Announcement>) => void;
  onUpdateAnnouncement: (id: string, updated: Partial<Announcement>) => void;
  onDeleteAnnouncement: (id: string) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  announcements,
  onAddAnnouncement,
  onUpdateAnnouncement,
  onDeleteAnnouncement,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<'create' | 'manage' | 'ai-assistant'>('create');

  // Form State
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState<Department>('Engineering');
  const [category, setCategory] = useState<Category>('News');
  const [priority, setPriority] = useState<Priority>('normal');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [pinned, setPinned] = useState(false);
  const [tagsInput, setTagsInput] = useState('M365, DepartmentUpdate');
  const [bannerImageUrl, setBannerImageUrl] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  // AI Assistant State
  const [aiTopic, setAiTopic] = useState('');
  const [aiTone, setAiTone] = useState<'professional' | 'urgent' | 'celebratory' | 'concise' | 'policy'>('professional');
  const [aiKeyPoints, setAiKeyPoints] = useState('');
  const [isAiGenerating, setIsAiGenerating] = useState(false);

  // Editing state
  const [editingId, setEditingId] = useState<string | null>(null);

  const departmentsList: Department[] = [
    'Engineering',
    'HR & Culture',
    'IT & Security',
    'Marketing',
    'Operations',
    'Finance',
    'Executive Leadership',
  ];

  const categoriesList: Category[] = [
    'News',
    'Urgent Alert',
    'Policy Update',
    'Event',
    'System Maintenance',
    'Milestone & Achievement',
  ];

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const tagsArr = tagsInput
      .split(',')
      .map((t) => t.trim())
      .filter((t) => t.length > 0);

    const postData: Partial<Announcement> = {
      title: title.trim(),
      department,
      category,
      priority,
      summary: summary.trim() || title.trim(),
      content: content.trim(),
      pinned,
      tags: tagsArr.length > 0 ? tagsArr : [department],
      bannerImageUrl: bannerImageUrl.trim() || undefined,
      author: {
        name: 'Sandeep Kumar',
        title: 'SharePoint Admin',
        avatar:
          'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
        email: 'sandeep.k@contoso.com',
        department,
      },
      targetAudience: ['All Employees'],
    };

    if (editingId) {
      onUpdateAnnouncement(editingId, postData);
      setEditingId(null);
    } else {
      onAddAnnouncement(postData);
    }

    // Reset Form
    setTitle('');
    setSummary('');
    setContent('');
    setBannerImageUrl('');
    setPinned(false);
    setIsSuccess(true);
    setTimeout(() => setIsSuccess(false), 3000);
  };

  const handleGenerateAIDraft = async () => {
    if (!aiTopic.trim()) return;
    setIsAiGenerating(true);

    try {
      const payload: AIDraftRequest = {
        topic: aiTopic,
        department,
        category,
        tone: aiTone,
        keyPoints: aiKeyPoints ? aiKeyPoints.split('\n').filter((k) => k.trim()) : [],
      };

      const res = await fetch('/api/ai/draft', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error('AI Generation failed');

      const data = await res.json();
      setTitle(data.title || '');
      setSummary(data.summary || '');
      setContent(data.content || '');
      if (data.tags) setTagsInput(data.tags.join(', '));
      if (data.suggestedPriority) setPriority(data.suggestedPriority);

      setActiveTab('create');
    } catch (err) {
      console.error(err);
    } finally {
      setIsAiGenerating(false);
    }
  };

  const handleEditClick = (item: Announcement) => {
    setEditingId(item.id);
    setTitle(item.title);
    setDepartment(item.department);
    setCategory(item.category);
    setPriority(item.priority);
    setSummary(item.summary);
    setContent(item.content);
    setPinned(item.pinned);
    setTagsInput(item.tags.join(', '));
    setBannerImageUrl(item.bannerImageUrl || '');
    setActiveTab('create');
  };

  return (
    <div className="bg-white border border-[#edebe9] rounded-lg shadow-sm">
      <div className="max-w-7xl mx-auto p-5 sm:p-6 space-y-6">
        {/* Admin Header Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#edebe9]">
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-3 py-1.5 bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5"
            >
              ← Back to Dashboard
            </button>
            <div>
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#201f1e] flex items-center gap-2">
                SharePoint Admin Publishing Studio
                <span className="text-[10px] uppercase font-bold bg-[#fff4ce] text-[#797673] px-2 py-0.5 rounded">
                  Admin Studio
                </span>
              </h2>
              <p className="text-xs text-[#605e5c] mt-0.5">
                Publish company updates, generate AI drafts, and broadcast advisories across the M365 tenant.
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs">
            <button
              onClick={() => setActiveTab('create')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'create'
                  ? 'bg-[#0078d4] text-white shadow-sm'
                  : 'bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130]'
              }`}
            >
              <PlusCircle className="w-3.5 h-3.5" />
              {editingId ? 'Editing Post' : 'New Announcement'}
            </button>

            <button
              onClick={() => setActiveTab('ai-assistant')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'ai-assistant'
                  ? 'bg-purple-700 text-white shadow-sm'
                  : 'bg-purple-50 text-purple-800 border border-purple-200'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-purple-600" />
              Smart Draft Generator
            </button>

            <button
              onClick={() => setActiveTab('manage')}
              className={`px-3 py-1.5 rounded-md font-semibold transition-colors flex items-center gap-1.5 ${
                activeTab === 'manage'
                  ? 'bg-[#0078d4] text-white shadow-sm'
                  : 'bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130]'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              Manage All Posts ({announcements.length})
            </button>
          </div>
        </div>

        {/* Tab 1: Create / Edit Form */}
        {activeTab === 'create' && (
          <form onSubmit={handleCreatePost} className="space-y-4 text-xs">
            {isSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-lg flex items-center gap-2 animate-in fade-in">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                <span>Announcement successfully published to the company dashboard!</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Department */}
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Target Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              {/* Category */}
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Category
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as Category)}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
                >
                  {categoriesList.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>

              {/* Priority */}
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Priority Level
                </label>
                <div className="flex gap-2">
                  {[
                    { key: 'normal', label: 'Standard' },
                    { key: 'high', label: 'High' },
                    { key: 'urgent', label: '🚨 Urgent Alert' },
                  ].map((p) => (
                    <button
                      key={p.key}
                      type="button"
                      onClick={() => setPriority(p.key as Priority)}
                      className={`flex-1 py-2 px-2 rounded-lg border font-medium transition-all text-center ${
                        priority === p.key
                          ? p.key === 'urgent'
                            ? 'bg-red-600 text-white border-red-700 font-bold'
                            : 'bg-[#0078d4] text-white border-[#005a9e]'
                          : 'bg-slate-50 dark:bg-slate-800 border-slate-300 dark:border-slate-700'
                      }`}
                    >
                      {p.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Title */}
            <div>
              <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Announcement Headline
              </label>
              <input
                type="text"
                placeholder="e.g. Q3 Engineering Architecture Migration & Security Advisory..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
              />
            </div>

            {/* Executive Summary */}
            <div>
              <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Executive Summary (1-2 Sentences preview)
              </label>
              <input
                type="text"
                placeholder="Brief summary displayed on dashboard web part cards..."
                value={summary}
                onChange={(e) => setSummary(e.target.value)}
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
              />
            </div>

            {/* Body Content */}
            <div>
              <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Full Details (Supports Markdown & Lists)
              </label>
              <textarea
                rows={5}
                placeholder="Write update details, timeline, action steps for team members..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                className="w-full px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4] font-mono"
              />
            </div>

            {/* Meta: Image URL, Tags, Pin Toggle */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Banner Image URL (Optional)
                </label>
                <input
                  type="url"
                  placeholder="https://images.unsplash.com/..."
                  value={bannerImageUrl}
                  onChange={(e) => setBannerImageUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Tags (Comma Separated)
                </label>
                <input
                  type="text"
                  placeholder="M365, Roadmap, Policy"
                  value={tagsInput}
                  onChange={(e) => setTagsInput(e.target.value)}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg focus:ring-1 focus:ring-[#0078d4]"
                />
              </div>

              <div className="flex items-center gap-3 pt-4">
                <label className="flex items-center gap-2 cursor-pointer font-medium text-slate-700 dark:text-slate-300">
                  <input
                    type="checkbox"
                    checked={pinned}
                    onChange={(e) => setPinned(e.target.checked)}
                    className="rounded text-[#0078d4] focus:ring-[#0078d4]"
                  />
                  <Pin className="w-4 h-4 text-amber-500" />
                  <span>Pin to Top of Dashboard</span>
                </label>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-2">
              {editingId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setTitle('');
                    setContent('');
                  }}
                  className="px-4 py-2 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 rounded-lg font-medium"
                >
                  Cancel Edit
                </button>
              )}
              <button
                type="submit"
                className="px-6 py-2.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-lg font-semibold flex items-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-4 h-4" />
                <span>{editingId ? 'Update Announcement' : 'Publish to Dashboard'}</span>
              </button>
            </div>
          </form>
        )}

        {/* Tab 2: AI Assistant */}
        {activeTab === 'ai-assistant' && (
          <div className="p-4 bg-purple-50/50 dark:bg-purple-950/20 border border-purple-200 dark:border-purple-900 rounded-xl space-y-4 text-xs">
            <div className="flex items-center gap-2 text-purple-900 dark:text-purple-300">
              <Sparkles className="w-5 h-5 text-purple-600" />
              <div>
                <h3 className="font-bold text-sm">Smart Announcement Draft Generator</h3>
                <p className="text-slate-600 dark:text-slate-400">
                  Provide a brief topic to draft a professional, formatted SharePoint announcement.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Topic / Event Title
                </label>
                <input
                  type="text"
                  placeholder="e.g. Migration to Microsoft Teams Phone System"
                  value={aiTopic}
                  onChange={(e) => setAiTopic(e.target.value)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg"
                />
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Target Department
                </label>
                <select
                  value={department}
                  onChange={(e) => setDepartment(e.target.value as Department)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg"
                >
                  {departmentsList.map((d) => (
                    <option key={d} value={d}>
                      {d}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                  Tone Style
                </label>
                <select
                  value={aiTone}
                  onChange={(e) => setAiTone(e.target.value as any)}
                  className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg"
                >
                  <option value="professional">Professional & Corporate</option>
                  <option value="urgent">Urgent Alert / Action Required</option>
                  <option value="celebratory">Celebratory & Milestone</option>
                  <option value="concise">Concise Memo</option>
                  <option value="policy">HR Policy Official</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block mb-1 font-semibold text-slate-700 dark:text-slate-300">
                Key Bullet Points (1 per line)
              </label>
              <textarea
                rows={3}
                placeholder="Cutover date Friday 5 PM&#10;No downtime for mobile apps&#10;Contact helpdesk extension 400"
                value={aiKeyPoints}
                onChange={(e) => setAiKeyPoints(e.target.value)}
                className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-purple-200 dark:border-slate-700 rounded-lg font-mono text-xs"
              />
            </div>

            <button
              onClick={handleGenerateAIDraft}
              disabled={isAiGenerating || !aiTopic.trim()}
              className="px-6 py-2.5 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white rounded-lg font-semibold flex items-center gap-2 shadow transition-all"
            >
              {isAiGenerating ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Generating AI Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Announcement & Populate Form</span>
                </>
              )}
            </button>
          </div>
        )}

        {/* Tab 3: Manage Existing Announcements */}
        {activeTab === 'manage' && (
          <div className="overflow-x-auto border border-slate-200 dark:border-slate-800 rounded-xl">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-semibold border-b border-slate-200 dark:border-slate-700">
                  <th className="p-3">Title & Dept</th>
                  <th className="p-3">Category</th>
                  <th className="p-3">Priority</th>
                  <th className="p-3">Views</th>
                  <th className="p-3">Pinned</th>
                  <th className="p-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
                {announcements.map((item) => (
                  <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/50">
                    <td className="p-3">
                      <div className="font-semibold text-slate-900 dark:text-slate-100 line-clamp-1">
                        {item.title}
                      </div>
                      <div className="text-[10px] text-slate-500">{item.department}</div>
                    </td>
                    <td className="p-3 text-slate-600 dark:text-slate-400">{item.category}</td>
                    <td className="p-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          item.priority === 'urgent'
                            ? 'bg-red-100 text-red-800'
                            : item.priority === 'high'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {item.priority.toUpperCase()}
                      </span>
                    </td>
                    <td className="p-3 font-mono text-slate-600 dark:text-slate-400">
                      {item.viewsCount}
                    </td>
                    <td className="p-3">
                      <button
                        onClick={() =>
                          onUpdateAnnouncement(item.id, { pinned: !item.pinned })
                        }
                        className={`p-1 rounded ${
                          item.pinned ? 'text-amber-500 bg-amber-50' : 'text-slate-400'
                        }`}
                        title="Toggle Pin"
                      >
                        <Pin className="w-4 h-4" />
                      </button>
                    </td>
                    <td className="p-3 text-right space-x-2">
                      <button
                        onClick={() => handleEditClick(item)}
                        className="p-1 text-[#0078d4] hover:bg-sky-50 rounded"
                        title="Edit Post"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteAnnouncement(item.id)}
                        className="p-1 text-red-600 hover:bg-red-50 rounded"
                        title="Delete Post"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
