import React, { useState } from 'react';
import { EmployeeDirectory } from '../EmployeeDirectory';
import { SPFxWebPartView } from '../SPFxWebPartView';
import { Announcement, Employee, Department, SPFxWebPartConfig } from '../../types';
import { ShieldCheck, Users, Megaphone, LayoutGrid } from 'lucide-react';

export interface PumexEmployeeHubProps {
  employees: Employee[];
  announcements: Announcement[];
  config: SPFxWebPartConfig;
  selectedDeptFilter: Department;
  onSelectDeptFilter: (dept: Department) => void;
  onSelectAnnouncement: (announcement: Announcement) => void;
  onAddReaction: (id: string, type: 'like' | 'celebrate' | 'important') => void;
  onAddEmployee: (newEmp: Partial<Employee>) => void;
  onManageAnnouncements: () => void;
  dashboardLayout?: 'split' | 'directory' | 'announcements';
  onLayoutChange?: (layout: 'split' | 'directory' | 'announcements') => void;
}

export const PumexEmployeeHub: React.FC<PumexEmployeeHubProps> = ({
  employees,
  announcements,
  config,
  selectedDeptFilter,
  onSelectDeptFilter,
  onSelectAnnouncement,
  onAddReaction,
  onAddEmployee,
  onManageAnnouncements,
  dashboardLayout = 'split',
  onLayoutChange,
}) => {
  const [internalLayout, setInternalLayout] = useState<'split' | 'directory' | 'announcements'>(dashboardLayout);

  const activeLayout = onLayoutChange ? dashboardLayout : internalLayout;
  const handleLayoutToggle = (layout: 'split' | 'directory' | 'announcements') => {
    setInternalLayout(layout);
    if (onLayoutChange) {
      onLayoutChange(layout);
    }
  };

  const departments: Department[] = [
    'All',
    'Engineering',
    'HR & Culture',
    'IT & Security',
    'Marketing',
    'Operations',
    'Finance',
    'Executive Leadership',
  ];

  return (
    <div className="space-y-6">
      {/* Pumex Employee Hub Header Banner */}
      <div className="bg-gradient-to-r from-[#0078d4] via-[#106ebe] to-[#005a9e] rounded-xl p-5 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="bg-white/20 backdrop-blur-sm text-white px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider">
                Pumex Employee Hub
              </span>
              <span className="bg-emerald-400/30 text-emerald-100 px-2 py-0.5 rounded text-[11px] font-medium">
                M365 Active
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              Pumex Employee Directory & Department Intranet
            </h1>
            <p className="text-xs sm:text-sm text-sky-100 max-w-2xl">
              Find colleagues, check real-time Teams status, email team members, and stay up to date with departmental news.
            </p>
          </div>

          {/* Quick Layout Mode Buttons */}
          <div className="bg-black/20 backdrop-blur-md p-1 rounded-lg flex items-center gap-1 border border-white/10 shrink-0">
            <button
              onClick={() => handleLayoutToggle('split')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeLayout === 'split'
                  ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                  : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              <LayoutGrid className="w-3.5 h-3.5" />
              <span>Split Hub</span>
            </button>
            <button
              onClick={() => handleLayoutToggle('directory')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeLayout === 'directory'
                  ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                  : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Directory ({employees.length})</span>
            </button>
            <button
              onClick={() => handleLayoutToggle('announcements')}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold flex items-center gap-1.5 transition-all ${
                activeLayout === 'announcements'
                  ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                  : 'text-sky-100 hover:bg-white/10'
              }`}
            >
              <Megaphone className="w-3.5 h-3.5" />
              <span>Updates ({announcements.length})</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: Employee Directory Component */}
        {(activeLayout === 'split' || activeLayout === 'directory') && (
          <div
            className={`${
              activeLayout === 'directory' ? 'col-span-12' : 'md:col-span-7 xl:col-span-7'
            } space-y-4`}
          >
            <div className="bg-white p-3 px-4 rounded-lg border border-[#edebe9] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#0078d4]" />
                <h2 className="text-sm font-bold text-[#201f1e] uppercase tracking-wider">
                  Microsoft 365 Employee Directory
                </h2>
              </div>
              <span className="text-xs font-semibold bg-[#f3f2f1] text-[#605e5c] px-2.5 py-0.5 rounded-full">
                {employees.length} Colleagues Listed
              </span>
            </div>

            <EmployeeDirectory
              employees={employees}
              departments={departments}
              onAddEmployee={onAddEmployee}
            />
          </div>
        )}

        {/* RIGHT COLUMN: Department Announcements Component */}
        {(activeLayout === 'split' || activeLayout === 'announcements') && (
          <div
            className={`${
              activeLayout === 'announcements' ? 'col-span-12' : 'md:col-span-5 xl:col-span-5'
            } space-y-4`}
          >
            <div className="bg-white p-3 px-4 rounded-lg border border-[#edebe9] flex items-center justify-between shadow-xs">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-[#107c10]" />
                <h2 className="text-sm font-bold text-[#201f1e] uppercase tracking-wider">
                  Department Updates
                </h2>
              </div>
              <button
                onClick={onManageAnnouncements}
                className="text-xs font-semibold text-[#0078d4] hover:text-[#106ebe] hover:underline flex items-center gap-1 transition-colors"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Manage Studio →</span>
              </button>
            </div>

            <SPFxWebPartView
              announcements={announcements}
              config={config}
              onSelectAnnouncement={onSelectAnnouncement}
              onAddReaction={onAddReaction}
              selectedDeptFilter={selectedDeptFilter}
              onSelectDeptFilter={onSelectDeptFilter}
              onManageAnnouncements={onManageAnnouncements}
            />
          </div>
        )}
      </div>
    </div>
  );
};
