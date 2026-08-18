import React, { useState } from 'react';
import {
  Grid,
  Bell,
  Settings,
  ShieldCheck,
  Code2,
  Search,
  Share2,
  ExternalLink,
  ChevronDown,
  Globe,
  Sparkles,
  BookOpen,
} from 'lucide-react';

interface SPFxHeaderProps {
  currentPage: 'dashboard' | 'admin';
  onNavigate: (page: 'dashboard' | 'admin') => void;
  isPropertyPaneOpen: boolean;
  onTogglePropertyPane: () => void;
  onOpenExportModal: () => void;
  unreadAlertsCount: number;
}

export const SPFxHeader: React.FC<SPFxHeaderProps> = ({
  currentPage,
  onNavigate,
  isPropertyPaneOpen,
  onTogglePropertyPane,
  onOpenExportModal,
  unreadAlertsCount,
}) => {
  const [showWaffleMenu, setShowWaffleMenu] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  const m365Apps = [
    { name: 'SharePoint', icon: '🌐', color: 'bg-teal-600' },
    { name: 'Teams', icon: '💬', color: 'bg-indigo-600' },
    { name: 'Outlook', icon: '✉️', color: 'bg-blue-600' },
    { name: 'OneDrive', icon: '☁️', color: 'bg-sky-600' },
    { name: 'Word', icon: '📄', color: 'bg-[#185abd]' },
    { name: 'Excel', icon: '📊', color: 'bg-[#107c41]' },
    { name: 'PowerPoint', icon: '📈', color: 'bg-[#c43e1c]' },
    { name: 'Viva Engage', icon: '📣', color: 'bg-purple-600' },
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0078d4] text-white shadow-md border-b border-[#005a9e]">
      {/* Top Suite Navigation Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 h-12 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: App Launcher & Site Title */}
        <div className="flex items-center gap-3">
          {/* M365 Waffle Button */}
          <div className="relative">
            <button
              id="m365-waffle-btn"
              onClick={() => setShowWaffleMenu(!showWaffleMenu)}
              className="p-1.5 rounded hover:bg-white/10 transition-colors flex items-center justify-center text-white focus:outline-none"
              title="Microsoft 365 App Launcher"
            >
              <Grid className="w-5 h-5" />
            </button>

            {/* M365 App Launcher Dropdown */}
            {showWaffleMenu && (
              <div className="absolute left-0 mt-2 w-72 bg-white text-slate-800 rounded-lg shadow-2xl border border-slate-200 z-50 p-4 animate-in fade-in slide-in-from-top-2 duration-150">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <span className="font-semibold text-sm text-slate-900 flex items-center gap-2">
                    <Globe className="w-4 h-4 text-[#0078d4]" />
                    Microsoft 365
                  </span>
                  <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded font-mono">
                    Tenant Apps
                  </span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  {m365Apps.map((app) => (
                    <button
                      key={app.name}
                      onClick={() => setShowWaffleMenu(false)}
                      className="flex flex-col items-center justify-center p-2 rounded-lg hover:bg-slate-50 transition-colors text-center group"
                    >
                      <span className="text-2xl mb-1 group-hover:scale-110 transition-transform">
                        {app.icon}
                      </span>
                      <span className="text-xs text-slate-700 font-medium group-hover:text-[#0078d4]">
                        {app.name}
                      </span>
                    </button>
                  ))}
                </div>
                <div className="mt-3 pt-2 border-t border-slate-100 flex items-center justify-between text-xs text-[#0078d4] font-medium">
                  <span className="hover:underline cursor-pointer">Explore all apps</span>
                  <ExternalLink className="w-3 h-3" />
                </div>
              </div>
            )}
          </div>

          {/* Pumex Branding */}
          <div className="flex items-center gap-2 border-l border-white/20 pl-3">
            <div className="w-7 h-7 rounded bg-white text-[#0078d4] font-black flex items-center justify-center text-sm shadow-sm font-sans tracking-tight">
              P
            </div>
            <div className="hidden sm:block">
              <h1 className="text-sm font-bold tracking-tight text-white leading-none">
                Pumex Employee Hub
              </h1>
              <p className="text-[10px] text-sky-100 leading-tight">
                M365 Directory & Intranet Updates
              </p>
            </div>
          </div>
        </div>

        {/* Middle: Universal Search Bar */}
        <div className="flex-1 max-w-md hidden md:block">
          <div className="relative">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Search SharePoint, department news & announcements..."
              className="w-full pl-9 pr-4 py-1.5 bg-white/10 hover:bg-white/20 focus:bg-white focus:text-slate-900 text-white placeholder-white/70 focus:placeholder-slate-400 text-xs rounded border border-white/20 focus:outline-none transition-all shadow-inner"
            />
          </div>
        </div>

        {/* Right: Actions, Admin Panel Toggle, Property Pane & User */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {/* SPFx Generator Code Export Button */}
          <button
            id="spfx-export-code-btn"
            onClick={onOpenExportModal}
            className="flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium bg-white/15 hover:bg-white/25 rounded text-white border border-white/20 transition-all"
            title="View SPFx Yeoman Code & Manifest"
          >
            <Code2 className="w-3.5 h-3.5 text-sky-200" />
            <span className="hidden lg:inline">SPFx Code & Yeoman</span>
          </button>

          {/* Admin Publishing Panel Navigation Button */}
          <button
            id="spfx-admin-panel-btn"
            onClick={() => onNavigate(currentPage === 'admin' ? 'dashboard' : 'admin')}
            className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded transition-all shadow-sm ${
              currentPage === 'admin'
                ? 'bg-[#fff4ce] text-[#797673] border border-[#ffe79a]'
                : 'bg-white text-[#0078d4] hover:bg-[#f3f2f1]'
            }`}
          >
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>{currentPage === 'admin' ? '← Back to Dashboard' : 'Admin Studio Page'}</span>
          </button>

          {/* Web Part Property Pane Gear Button */}
          <button
            id="spfx-property-pane-btn"
            onClick={onTogglePropertyPane}
            className={`p-1.5 rounded transition-all flex items-center justify-center ${
              isPropertyPaneOpen
                ? 'bg-white text-[#0078d4] ring-2 ring-white/50'
                : 'hover:bg-white/10 text-white'
            }`}
            title="Configure Web Part Properties"
          >
            <Settings className="w-4 h-4" />
          </button>

          {/* User Persona Profile */}
          <div className="relative border-l border-white/20 pl-2 ml-1">
            <button
              id="spfx-user-profile-btn"
              onClick={() => setShowProfileMenu(!showProfileMenu)}
              className="flex items-center gap-2 focus:outline-none"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                alt="Sandeep Kumar"
                className="w-7 h-7 rounded-full border-2 border-white/50 object-cover"
              />
              <span className="hidden xl:inline text-xs font-medium text-white">
                Sandeep Kumar
              </span>
            </button>

            {/* Profile Dropdown */}
            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white text-slate-800 rounded-lg shadow-xl border border-slate-200 z-50 p-3 text-xs">
                <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
                  <img
                    src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80"
                    alt="Sandeep Kumar"
                    className="w-10 h-10 rounded-full object-cover"
                  />
                  <div>
                    <h4 className="font-semibold text-slate-900">Sandeep Kumar</h4>
                    <p className="text-slate-500">M365 SharePoint Admin</p>
                    <p className="text-[10px] text-[#0078d4]">sandeep.k@contoso.com</p>
                  </div>
                </div>
                <div className="pt-2 space-y-1">
                  <div className="px-2 py-1 text-slate-600 rounded hover:bg-slate-50 cursor-pointer flex items-center justify-between">
                    <span>Role Permissions</span>
                    <span className="text-[10px] bg-emerald-100 text-emerald-800 font-semibold px-1.5 py-0.5 rounded">
                      Tenant Owner
                    </span>
                  </div>
                  <div className="px-2 py-1 text-slate-600 rounded hover:bg-slate-50 cursor-pointer">
                    SharePoint Online Site Settings
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
