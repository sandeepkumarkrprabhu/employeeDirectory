import React, { useState, useEffect } from 'react';
import {
  SPFxHeader,
  PumexEmployeeHub,
  SPFxWebPartView,
  EmployeeDirectory,
  SPFxPropertyPane,
  AdminPanel,
  AnnouncementDetailModal,
  SPFxGeneratorExportModal,
} from './components';
import { Announcement, Employee, Department, SPFxWebPartConfig } from './types';
import { INITIAL_ANNOUNCEMENTS } from './data/seedData';
import { INITIAL_EMPLOYEES } from './data/employeeData';
import {
  Globe,
  Bell,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  Layers,
  Code2,
  CheckCircle2,
  ExternalLink,
  Users,
} from 'lucide-react';

export default function App() {
  const [announcements, setAnnouncements] = useState<Announcement[]>(INITIAL_ANNOUNCEMENTS);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [pageView, setPageView] = useState<'dashboard' | 'admin'>('dashboard');
  const [dashboardLayout, setDashboardLayout] = useState<'split' | 'directory' | 'announcements'>('split');
  const [selectedDeptFilter, setSelectedDeptFilter] = useState<Department>('All');
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);

  // UI Panels Toggle State
  const [isPropertyPaneOpen, setIsPropertyPaneOpen] = useState(false);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);

  // SPFx Web Part Configuration Properties
  const [webPartConfig, setWebPartConfig] = useState<SPFxWebPartConfig>({
    title: 'Department Updates & Real-Time Announcements',
    description: 'Real-time company news, policy updates, and department advisories on Microsoft 365.',
    displayMode: 'cards',
    selectedDepartment: 'All',
    itemsPerPage: 6,
    showSearch: true,
    showReactions: true,
    showComments: true,
    themeColor: 'sharepoint-blue',
    enableUrgentBanner: true,
    compactHeader: false,
    allowUserFiltering: true,
  });

  // Fetch initial announcements from server REST API
  useEffect(() => {
    fetch('/api/announcements')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline, using seed data');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setAnnouncements(data);
        }
      })
      .catch((err) => {
        console.warn('Using local seed data:', err.message);
      });

    // Fetch employee directory
    fetch('/api/employees')
      .then((res) => {
        if (res.ok) return res.json();
        throw new Error('API offline');
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setEmployees(data);
        }
      })
      .catch(() => {});
  }, []);

  const handleAddEmployee = async (newEmp: Partial<Employee>) => {
    try {
      const res = await fetch('/api/employees', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newEmp),
      });

      if (res.ok) {
        const created: Employee = await res.json();
        setEmployees((prev) => [created, ...prev]);
      } else {
        const localCreated: Employee = {
          id: `emp-${Date.now()}`,
          name: newEmp.name || 'New Colleague',
          title: newEmp.title || 'Team Member',
          department: newEmp.department || 'Engineering',
          email: newEmp.email || 'user@contoso.com',
          phone: newEmp.phone || '+1 (555) 019-0000',
          officeLocation: newEmp.officeLocation || 'Redmond HQ',
          avatar:
            newEmp.avatar ||
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
          skills: newEmp.skills || [],
          availability: 'Available',
          bio: newEmp.bio,
        };
        setEmployees((prev) => [localCreated, ...prev]);
      }
    } catch (err) {
      console.error(err);
    }
  };


  // Handlers
  const handleAddAnnouncement = async (postData: Partial<Announcement>) => {
    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(postData),
      });

      if (res.ok) {
        const created: Announcement = await res.json();
        setAnnouncements((prev) => [created, ...prev]);
      } else {
        // Fallback local addition
        const localCreated: Announcement = {
          id: `ann-${Date.now()}`,
          createdAt: new Date().toISOString(),
          viewsCount: 0,
          reactions: { like: 0, celebrate: 0, important: 0 },
          comments: [],
          title: postData.title || 'Untitled Update',
          summary: postData.summary || '',
          content: postData.content || '',
          department: postData.department || 'Engineering',
          category: postData.category || 'News',
          priority: postData.priority || 'normal',
          author: postData.author!,
          pinned: postData.pinned || false,
          targetAudience: ['All Employees'],
          tags: postData.tags || [],
          bannerImageUrl: postData.bannerImageUrl,
        };
        setAnnouncements((prev) => [localCreated, ...prev]);
      }
    } catch (err) {
      console.error('Failed to save announcement:', err);
    }
  };

  const handleUpdateAnnouncement = async (id: string, updatedData: Partial<Announcement>) => {
    try {
      const res = await fetch(`/api/announcements/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        const updatedItem = await res.json();
        setAnnouncements((prev) => prev.map((a) => (a.id === id ? updatedItem : a)));
      } else {
        setAnnouncements((prev) =>
          prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
        );
      }
    } catch (err) {
      setAnnouncements((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updatedData } : a))
      );
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    try {
      await fetch(`/api/announcements/${id}`, { method: 'DELETE' });
    } catch (err) {
      console.error(err);
    }
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
  };

  const handleAddReaction = async (id: string, type: 'like' | 'celebrate' | 'important') => {
    // Optimistic UI update
    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            reactions: {
              ...item.reactions,
              [type]: (item.reactions[type] || 0) + 1,
            },
          };
        }
        return item;
      })
    );

    // Update modal if currently opened
    if (selectedAnnouncement && selectedAnnouncement.id === id) {
      setSelectedAnnouncement((prev) =>
        prev
          ? {
              ...prev,
              reactions: {
                ...prev.reactions,
                [type]: (prev.reactions[type] || 0) + 1,
              },
            }
          : null
      );
    }

    try {
      await fetch(`/api/announcements/${id}/reaction`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleAddComment = async (id: string, text: string) => {
    const newComment = {
      id: `c-${Date.now()}`,
      authorName: 'Sandeep Kumar',
      authorAvatar:
        'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
      text,
      createdAt: new Date().toISOString(),
    };

    setAnnouncements((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return {
            ...item,
            comments: [...item.comments, newComment],
          };
        }
        return item;
      })
    );

    if (selectedAnnouncement && selectedAnnouncement.id === id) {
      setSelectedAnnouncement((prev) =>
        prev
          ? {
              ...prev,
              comments: [...prev.comments, newComment],
            }
          : null
      );
    }

    try {
      await fetch(`/api/announcements/${id}/comment`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          authorName: 'Sandeep Kumar',
          authorAvatar:
            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80',
          text,
        }),
      });
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAnnouncement = (item: Announcement) => {
    setSelectedAnnouncement(item);
    // Increment view counter
    fetch(`/api/announcements/${item.id}/view`, { method: 'POST' }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-[#f3f2f1] font-sans text-[#323130] flex flex-col antialiased">
      {/* 1. M365 Top Suite Header */}
      <SPFxHeader
        currentPage={pageView}
        onNavigate={(page) => setPageView(page)}
        isPropertyPaneOpen={isPropertyPaneOpen}
        onTogglePropertyPane={() => setIsPropertyPaneOpen(!isPropertyPaneOpen)}
        onOpenExportModal={() => setIsExportModalOpen(true)}
        unreadAlertsCount={announcements.filter((a) => a.priority === 'urgent').length}
      />

      {/* 2. Intranet Site Header / Breadcrumb Hero */}
      <div className="bg-white border-b border-[#edebe9] py-3.5 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3 text-xs">
          {/* Breadcrumb Path */}
          <div className="flex items-center gap-2 text-[#605e5c]">
            <span
              onClick={() => setPageView('dashboard')}
              className="text-[#0078d4] font-semibold hover:underline cursor-pointer"
            >
              Pumex Employee Hub
            </span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span
              onClick={() => setPageView('dashboard')}
              className={`font-medium hover:underline cursor-pointer ${
                pageView === 'dashboard' ? 'text-[#201f1e] font-semibold' : 'text-[#0078d4]'
              }`}
            >
              Company Dashboard
            </span>
            {pageView === 'admin' && (
              <>
                <ChevronRight className="w-3.5 h-3.5" />
                <span className="font-semibold text-[#201f1e]">
                  Admin Publishing Studio
                </span>
              </>
            )}
          </div>

          {/* Page Action Controls & View Mode Selector */}
          <div className="flex flex-wrap items-center gap-2">
            {pageView === 'dashboard' && (
              <div className="flex items-center bg-[#f3f2f1] p-0.5 rounded-md border border-[#edebe9] text-xs font-semibold">
                <button
                  onClick={() => setDashboardLayout('split')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    dashboardLayout === 'split'
                      ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                      : 'text-[#605e5c] hover:text-[#201f1e]'
                  }`}
                >
                  Split View
                </button>
                <button
                  onClick={() => setDashboardLayout('directory')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    dashboardLayout === 'directory'
                      ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                      : 'text-[#605e5c] hover:text-[#201f1e]'
                  }`}
                >
                  Employee Directory
                </button>
                <button
                  onClick={() => setDashboardLayout('announcements')}
                  className={`px-2.5 py-1 rounded transition-all ${
                    dashboardLayout === 'announcements'
                      ? 'bg-white text-[#0078d4] shadow-sm font-bold'
                      : 'text-[#605e5c] hover:text-[#201f1e]'
                  }`}
                >
                  Department Updates
                </button>
              </div>
            )}

            <button
              onClick={() => setPageView(pageView === 'admin' ? 'dashboard' : 'admin')}
              className="bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors flex items-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#0078d4]" />
              <span>{pageView === 'admin' ? 'View Dashboard' : 'Open Admin Page'}</span>
            </button>
            <button
              onClick={() => setIsPropertyPaneOpen(true)}
              className="bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors"
            >
              ⚙️ Web Part Config
            </button>
          </div>
        </div>
      </div>

      {/* 3. Main Page Body Canvas */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 space-y-6">
        {pageView === 'admin' ? (
          /* SEPARATE PAGE: ADMIN PUBLISHING STUDIO */
          <AdminPanel
            announcements={announcements}
            onAddAnnouncement={handleAddAnnouncement}
            onUpdateAnnouncement={handleUpdateAnnouncement}
            onDeleteAnnouncement={handleDeleteAnnouncement}
            onClose={() => setPageView('dashboard')}
          />
        ) : (
          /* DASHBOARD VIEW: Pumex Employee Hub Master Component */
          <PumexEmployeeHub
            employees={employees}
            announcements={announcements}
            config={webPartConfig}
            selectedDeptFilter={selectedDeptFilter}
            onSelectDeptFilter={(dept) => setSelectedDeptFilter(dept)}
            onSelectAnnouncement={handleSelectAnnouncement}
            onAddReaction={handleAddReaction}
            onAddEmployee={handleAddEmployee}
            onManageAnnouncements={() => setPageView('admin')}
            dashboardLayout={dashboardLayout}
            onLayoutChange={(layout) => setDashboardLayout(layout)}
          />
        )}
      </main>

      {/* 4. SPFx Property Pane Drawer */}
      <SPFxPropertyPane
        isOpen={isPropertyPaneOpen}
        onClose={() => setIsPropertyPaneOpen(false)}
        config={webPartConfig}
        onUpdateConfig={(newConfig) => setWebPartConfig(newConfig)}
      />

      {/* 5. Announcement Detail View Modal */}
      <AnnouncementDetailModal
        announcement={selectedAnnouncement}
        onClose={() => setSelectedAnnouncement(null)}
        onAddReaction={handleAddReaction}
        onAddComment={handleAddComment}
      />

      {/* 6. Yeoman SPFx Generator Code Export Modal */}
      <SPFxGeneratorExportModal
        isOpen={isExportModalOpen}
        onClose={() => setIsExportModalOpen(false)}
      />

      {/* 7. Footer Bar */}
      <footer className="bg-white border-t border-[#edebe9] py-4 px-4 sm:px-6 text-xs text-[#605e5c]">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-sm bg-[#0078d4] text-white flex items-center justify-center font-black text-[10px]">
              P
            </div>
            <span className="font-semibold text-[#323130]">
              Pumex Employee Hub • SharePoint Framework (SPFx) Multi-WebPart Solution
            </span>
          </div>

          <div className="flex items-center gap-4 text-[#605e5c]">
            <span>Microsoft 365 Tenant Integration</span>
            <span>•</span>
            <span>Yeoman Generator Compatible</span>
            <span>•</span>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="text-[#0078d4] hover:underline font-semibold"
            >
              Export SPFx Code
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}
