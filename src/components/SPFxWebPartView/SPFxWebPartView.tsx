import React, { useState } from 'react';
import {
  Search,
  Pin,
  Flame,
  ThumbsUp,
  PartyPopper,
  AlertCircle,
  MessageSquare,
  Eye,
  Calendar,
  Tag,
  ChevronRight,
  ChevronLeft,
  Paperclip,
  Bell,
  Sparkles,
  LayoutGrid,
  List,
  SlidersHorizontal,
  Bookmark,
  Share2,
  Check,
  Zap,
  ShieldCheck,
  Settings2,
} from 'lucide-react';
import { Announcement, Department, Category, SPFxWebPartConfig } from '../../types';
import {
  getDepartmentBadgeColor,
  getPriorityBadge,
  formatRelativeTime,
  getThemeAccentClass,
} from '../../utils/spfxHelpers';

interface SPFxWebPartViewProps {
  announcements: Announcement[];
  config: SPFxWebPartConfig;
  onSelectAnnouncement: (announcement: Announcement) => void;
  onAddReaction: (id: string, type: 'like' | 'celebrate' | 'important') => void;
  selectedDeptFilter: Department;
  onSelectDeptFilter: (dept: Department) => void;
  onManageAnnouncements?: () => void;
}

export const SPFxWebPartView: React.FC<SPFxWebPartViewProps> = ({
  announcements,
  config,
  onSelectAnnouncement,
  onAddReaction,
  selectedDeptFilter,
  onSelectDeptFilter,
  onManageAnnouncements,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [pinnedOnly, setPinnedOnly] = useState(false);
  const [carouselIndex, setCarouselIndex] = useState(0);

  const themeStyle = getThemeAccentClass(config.themeColor);

  const departmentsList: Department[] = [
    'All',
    'Engineering',
    'HR & Culture',
    'IT & Security',
    'Marketing',
    'Operations',
    'Finance',
    'Executive Leadership',
  ];

  const categoriesList = [
    'All',
    'News',
    'Urgent Alert',
    'Policy Update',
    'Event',
    'System Maintenance',
    'Milestone & Achievement',
  ];

  // Urgent Alerts Filter
  const urgentAlerts = announcements.filter((a) => a.priority === 'urgent');

  // Filter Logic
  const filteredAnnouncements = announcements.filter((a) => {
    // Dept Filter
    if (selectedDeptFilter !== 'All' && a.department !== selectedDeptFilter) {
      return false;
    }
    // Category Filter
    if (selectedCategory !== 'All' && a.category !== selectedCategory) {
      return false;
    }
    // Pinned Only Filter
    if (pinnedOnly && !a.pinned) {
      return false;
    }
    // Search Query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        a.title.toLowerCase().includes(q) ||
        a.summary.toLowerCase().includes(q) ||
        a.tags.some((t) => t.toLowerCase().includes(q)) ||
        a.author.name.toLowerCase().includes(q)
      );
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* 1. Urgent Broadcast Banner (if enabled & active alerts exist) */}
      {config.enableUrgentBanner && urgentAlerts.length > 0 && (
        <div className="bg-[#fde7e9] border border-[#f1707b] text-[#201f1e] p-4 rounded-lg shadow-sm flex flex-wrap items-center justify-between gap-3 animate-in slide-in-from-top-2">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-[#a80000] text-white rounded-md">
              <AlertCircle className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] uppercase tracking-wider font-bold text-[#a80000]">
                Critical Alert ({urgentAlerts.length})
              </span>
              <h3 className="font-semibold text-base text-[#201f1e] leading-snug mt-0.5">
                {urgentAlerts[0].title}
              </h3>
            </div>
          </div>

          <button
            onClick={() => onSelectAnnouncement(urgentAlerts[0])}
            className="px-4 py-1.5 bg-[#a80000] hover:bg-[#8a0000] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
          >
            <span>Review Advisory</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Web Part Container / Frame */}
      <div className="bg-white border border-[#edebe9] rounded-lg shadow-sm p-5 sm:p-6 space-y-5">
        {/* Web Part Title & Control Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#edebe9]">
          <div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-sm bg-[#0078d4]" />
              <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#201f1e]">
                {config.title}
              </h2>
            </div>
            {config.description && (
              <p className="text-xs text-[#605e5c] mt-0.5 pl-5">
                {config.description}
              </p>
            )}
          </div>

          {/* Quick Stats Counter & Manage Action */}
          <div className="flex items-center gap-2 text-xs text-[#605e5c]">
            <span className="bg-[#f3f2f1] text-[#605e5c] px-2.5 py-1 rounded-md font-medium">
              {filteredAnnouncements.length} Updates
            </span>
            {announcements.filter((a) => a.pinned).length > 0 && (
              <span className="bg-[#fff4ce] text-[#797673] px-2.5 py-1 rounded-md font-semibold flex items-center gap-1">
                <Pin className="w-3 h-3 text-[#797673]" />
                {announcements.filter((a) => a.pinned).length} Pinned
              </span>
            )}
            {onManageAnnouncements && (
              <button
                onClick={onManageAnnouncements}
                className="px-2.5 py-1 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded-md font-semibold text-xs flex items-center gap-1 transition-colors shadow-sm ml-1"
                title="Manage & publish announcements in Admin Studio"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manage</span>
              </button>
            )}
          </div>
        </div>

        {/* 3. Department Tabs & Filters */}
        <div className="space-y-3">
          {/* Section Heading */}
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-[#605e5c]">
              Department Filter
            </h3>
            <span className="text-xs text-[#a19f9d]">Select a department to filter updates</span>
          </div>

          {/* Department Pills Scrollable Row */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none text-xs">
            {departmentsList.map((dept) => {
              const isSelected = selectedDeptFilter === dept;
              const count =
                dept === 'All'
                  ? announcements.length
                  : announcements.filter((a) => a.department === dept).length;

              return (
                <button
                  key={dept}
                  onClick={() => onSelectDeptFilter(dept)}
                  className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-[#0078d4] text-white font-semibold shadow-sm'
                      : 'bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130]'
                  }`}
                >
                  <span>{dept}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                      isSelected
                        ? 'bg-white/20 text-white'
                        : 'bg-[#edebe9] text-[#605e5c]'
                    }`}
                  >
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Sub-Filter Row (Search, Category & Pinned Toggle) */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
            {/* Search Box */}
            {config.showSearch && (
              <div className="relative flex-1 max-w-xs">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#605e5c]" />
                <input
                  type="text"
                  placeholder="Search news & updates..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-3 py-1.5 bg-[#f3f2f1] border-none rounded-md text-xs text-[#323130] placeholder-[#605e5c] focus:ring-2 focus:ring-[#0078d4] outline-none transition-all"
                />
              </div>
            )}

            <div className="flex flex-wrap items-center gap-2">
              {/* Category Dropdown */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-3 py-1.5 bg-white border border-[#edebe9] rounded-md text-xs text-[#323130] font-medium focus:border-[#0078d4] outline-none"
              >
                {categoriesList.map((cat) => (
                  <option key={cat} value={cat}>
                    Category: {cat}
                  </option>
                ))}
              </select>

              {/* Pinned Only Toggle */}
              <button
                onClick={() => setPinnedOnly(!pinnedOnly)}
                className={`px-3 py-1.5 rounded-md border font-medium flex items-center gap-1.5 transition-colors ${
                  pinnedOnly
                    ? 'bg-[#fff4ce] border-[#ffe79a] text-[#797673] font-semibold'
                    : 'bg-white border-[#edebe9] text-[#605e5c] hover:bg-[#f3f2f1]'
                }`}
              >
                <Pin className="w-3.5 h-3.5 text-[#797673]" />
                <span>Pinned Only</span>
              </button>
            </div>
          </div>
        </div>

        {/* 4. Main Cards Render Area */}
        {filteredAnnouncements.length === 0 ? (
          <div className="text-center py-12 bg-[#f3f2f1] rounded-lg border border-dashed border-[#edebe9] p-6">
            <Bell className="w-8 h-8 text-[#a19f9d] mx-auto mb-2" />
            <h3 className="font-semibold text-sm text-[#323130]">
              No announcements match your filter
            </h3>
            <p className="text-xs text-[#605e5c] mt-1">
              Try adjusting your search query, department tabs, or category filter.
            </p>
          </div>
        ) : config.displayMode === 'compact' ? (
          /* COMPACT LIST VIEW */
          <div className="divide-y divide-[#edebe9]">
            {filteredAnnouncements.slice(0, config.itemsPerPage).map((item) => {
              const badgeStyle =
                item.priority === 'urgent'
                  ? 'bg-[#fde7e9] text-[#a80000] border border-[#f1707b]'
                  : item.category === 'Milestone & Achievement'
                  ? 'bg-[#dff6dd] text-[#107c10]'
                  : 'bg-[#f3f2f1] text-[#605e5c]';

              return (
                <div
                  key={item.id}
                  onClick={() => onSelectAnnouncement(item)}
                  className="py-3.5 px-3 hover:bg-[#f3f2f1] rounded-lg transition-colors cursor-pointer flex items-start justify-between gap-4 group"
                >
                  <div className="space-y-1 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      {item.pinned && (
                        <span className="text-[10px] bg-[#fff4ce] text-[#797673] px-2 py-0.5 rounded font-bold uppercase flex items-center gap-0.5">
                          <Pin className="w-3 h-3" />
                          Pinned
                        </span>
                      )}
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${badgeStyle}`}>
                        {item.category}
                      </span>
                      <span className="text-[10px] text-[#a19f9d] font-medium">
                        {item.department} • {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <h4 className="font-semibold text-base text-[#201f1e] group-hover:text-[#0078d4] transition-colors leading-snug">
                      {item.title}
                    </h4>

                    <p className="text-sm text-[#605e5c] line-clamp-1 leading-relaxed">
                      {item.summary}
                    </p>
                  </div>

                  <div className="flex items-center gap-3 text-[#605e5c] text-xs pt-1">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="w-3.5 h-3.5 text-[#0078d4]" />
                      {item.reactions.like + item.reactions.celebrate}
                    </span>
                    <ChevronRight className="w-4 h-4 text-[#a19f9d] group-hover:text-[#0078d4]" />
                  </div>
                </div>
              );
            })}
          </div>
        ) : config.displayMode === 'hero' ? (
          /* HERO FEATURED VIEW */
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
            {/* Left Big Hero Card */}
            {filteredAnnouncements[0] && (
              <div
                onClick={() => onSelectAnnouncement(filteredAnnouncements[0])}
                className="lg:col-span-2 bg-white rounded-lg border border-[#edebe9] shadow-sm hover:border-[#0078d4] p-6 cursor-pointer transition-all flex flex-col justify-between min-h-[280px] group"
              >
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold bg-[#dff6dd] text-[#107c10] px-2 py-0.5 rounded uppercase">
                      Featured Milestone
                    </span>
                    <span className="text-xs text-[#a19f9d]">
                      {filteredAnnouncements[0].department} • {formatRelativeTime(filteredAnnouncements[0].createdAt)}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold text-[#201f1e] group-hover:text-[#0078d4] transition-colors leading-tight">
                    {filteredAnnouncements[0].title}
                  </h3>
                  <p className="text-sm text-[#605e5c] leading-relaxed line-clamp-3">
                    {filteredAnnouncements[0].summary}
                  </p>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-[#edebe9] text-xs mt-4">
                  <div className="flex items-center gap-2">
                    <img
                      src={filteredAnnouncements[0].author.avatar}
                      alt={filteredAnnouncements[0].author.name}
                      className="w-6 h-6 rounded-full object-cover"
                    />
                    <span className="font-medium text-[#323130]">{filteredAnnouncements[0].author.name}</span>
                  </div>
                  <span className="flex items-center gap-1 text-[#0078d4] font-semibold group-hover:underline">
                    Read Full Story <ChevronRight className="w-4 h-4" />
                  </span>
                </div>
              </div>
            )}

            {/* Right List Column */}
            <div className="space-y-3">
              {filteredAnnouncements.slice(1, 4).map((item) => (
                <div
                  key={item.id}
                  onClick={() => onSelectAnnouncement(item)}
                  className="bg-white p-4 rounded-lg border border-[#edebe9] shadow-sm hover:border-[#0078d4] cursor-pointer transition-colors space-y-1.5"
                >
                  <div className="flex justify-between items-center text-[10px]">
                    <span className="bg-[#f3f2f1] text-[#605e5c] font-bold px-2 py-0.5 rounded uppercase">
                      {item.category}
                    </span>
                    <span className="text-[#a19f9d]">{formatRelativeTime(item.createdAt)}</span>
                  </div>
                  <h4 className="font-semibold text-sm text-[#201f1e] line-clamp-2">
                    {item.title}
                  </h4>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* STANDARD CARDS FEED VIEW */
          <div className="grid grid-cols-1 gap-4">
            {filteredAnnouncements.slice(0, config.itemsPerPage).map((item) => {
              const badgeClass =
                item.priority === 'urgent'
                  ? 'bg-[#fde7e9] text-[#a80000] border border-[#f1707b]'
                  : item.category === 'Milestone & Achievement'
                  ? 'bg-[#dff6dd] text-[#107c10]'
                  : item.category === 'Urgent Alert'
                  ? 'bg-[#fff4ce] text-[#797673]'
                  : 'bg-[#f3f2f1] text-[#605e5c]';

              return (
                <div
                  key={item.id}
                  className="bg-white p-5 rounded-lg border border-[#edebe9] shadow-sm hover:border-[#0078d4] transition-all flex flex-col justify-between group"
                >
                  {/* Card Content Body */}
                  <div className="space-y-3 flex-1">
                    <div className="flex justify-between items-start">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${badgeClass}`}>
                        {item.category}
                      </span>
                      <span className="text-xs text-[#a19f9d] font-normal">
                        {formatRelativeTime(item.createdAt)}
                      </span>
                    </div>

                    <h3
                      onClick={() => onSelectAnnouncement(item)}
                      className="font-semibold text-base text-[#201f1e] group-hover:text-[#0078d4] cursor-pointer transition-colors leading-snug line-clamp-2"
                    >
                      {item.title}
                    </h3>

                    <p className="text-sm text-[#605e5c] leading-relaxed line-clamp-3">
                      {item.summary}
                    </p>
                  </div>

                  {/* Card Footer */}
                  <div className="pt-4 mt-4 border-t border-[#edebe9] flex items-center justify-between text-xs text-[#605e5c]">
                    <div className="flex items-center gap-2">
                      <img
                        src={item.author.avatar}
                        alt={item.author.name}
                        className="w-5 h-5 rounded-full object-cover"
                      />
                      <span className="text-xs font-medium text-[#323130] truncate max-w-[100px]">
                        {item.author.name}
                      </span>
                    </div>

                    {/* Inline Reactions */}
                    <div className="flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          onAddReaction(item.id, 'like');
                        }}
                        className="p-1 hover:bg-[#f3f2f1] rounded transition-colors flex items-center gap-1 text-xs text-[#605e5c]"
                        title="Like"
                      >
                        <ThumbsUp className="w-3.5 h-3.5 text-[#0078d4]" />
                        <span>{item.reactions.like}</span>
                      </button>

                      <button
                        onClick={() => onSelectAnnouncement(item)}
                        className="p-1 hover:bg-[#f3f2f1] rounded transition-colors flex items-center gap-1 text-xs text-[#605e5c]"
                        title="View Comments"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-[#605e5c]" />
                        <span>{item.comments.length}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
