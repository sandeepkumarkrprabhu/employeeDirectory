import React, { useState, useMemo } from 'react';
import {
  Search,
  Mail,
  Phone,
  MapPin,
  User,
  MessageSquare,
  Grid,
  List,
  Filter,
  X,
  ChevronRight,
  Sparkles,
  Building2,
  Calendar,
  Check,
  ExternalLink
} from 'lucide-react';
import { Employee, Department, AvailabilityStatus } from '../../types';

interface EmployeeDirectoryProps {
  employees: Employee[];
  departments: Department[];
  onAddEmployee?: (employee: Partial<Employee>) => void;
}

export const EmployeeDirectory: React.FC<EmployeeDirectoryProps> = ({
  employees,
  departments,
  onAddEmployee,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDept, setSelectedDept] = useState<Department>('All');
  const [selectedAvailability, setSelectedAvailability] = useState<string>('All');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [teamsChatStatus, setTeamsChatStatus] = useState<string | null>(null);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  const handleCopyEmail = (email: string, e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(email);
    setCopiedEmail(email);
    setTimeout(() => setCopiedEmail(null), 2000);
  };

  // New employee form state
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpTitle, setNewEmpTitle] = useState('');
  const [newEmpDept, setNewEmpDept] = useState<Department>('Engineering');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpPhone, setNewEmpPhone] = useState('+1 (555) 019-1234');
  const [newEmpLocation, setNewEmpLocation] = useState('Redmond HQ - Building 2');
  const [newEmpSkills, setNewEmpSkills] = useState('TypeScript, React, SPFx');
  const [newEmpBio, setNewEmpBio] = useState('');

  // Filtered employees
  const filteredEmployees = useMemo(() => {
    return employees.filter((emp) => {
      const matchesDept = selectedDept === 'All' || emp.department === selectedDept;
      const matchesAvailability =
        selectedAvailability === 'All' || emp.availability === selectedAvailability;

      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        emp.name.toLowerCase().includes(q) ||
        emp.title.toLowerCase().includes(q) ||
        emp.email.toLowerCase().includes(q) ||
        emp.officeLocation.toLowerCase().includes(q) ||
        emp.skills.some((s) => s.toLowerCase().includes(q));

      return matchesDept && matchesAvailability && matchesSearch;
    });
  }, [employees, selectedDept, selectedAvailability, searchQuery]);

  // Helper for availability presence badge
  const getAvailabilityBadge = (status: AvailabilityStatus) => {
    switch (status) {
      case 'Available':
        return { color: 'bg-emerald-500', text: 'Available', badgeStyle: 'bg-[#dff6dd] text-[#107c10]' };
      case 'In a meeting':
      case 'Busy':
        return { color: 'bg-rose-500', text: status, badgeStyle: 'bg-[#fde7e9] text-[#a80000]' };
      case 'Away':
        return { color: 'bg-amber-500', text: 'Away', badgeStyle: 'bg-[#fff4ce] text-[#797673]' };
      case 'Out of office':
        return { color: 'bg-slate-400', text: 'Out of Office', badgeStyle: 'bg-[#f3f2f1] text-[#605e5c]' };
      default:
        return { color: 'bg-slate-400', text: status, badgeStyle: 'bg-[#f3f2f1] text-[#605e5c]' };
    }
  };

  const handleStartTeamsChat = (emp: Employee) => {
    setTeamsChatStatus(`Initiating Teams chat window with ${emp.name}...`);
    setTimeout(() => {
      setTeamsChatStatus(null);
    }, 3000);
  };

  const handleCreateEmployeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;

    if (onAddEmployee) {
      onAddEmployee({
        name: newEmpName,
        title: newEmpTitle || 'Team Member',
        department: newEmpDept,
        email: newEmpEmail,
        phone: newEmpPhone,
        officeLocation: newEmpLocation,
        skills: newEmpSkills.split(',').map((s) => s.trim()).filter(Boolean),
        bio: newEmpBio || 'Contoso team professional.',
        avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80`,
        availability: 'Available',
      });
    }

    // Reset & close
    setNewEmpName('');
    setNewEmpTitle('');
    setNewEmpEmail('');
    setNewEmpBio('');
    setIsAddModalOpen(false);
  };

  return (
    <div className="bg-white border border-[#edebe9] rounded-lg shadow-sm p-5 sm:p-6 space-y-6">
      {/* 1. Header Title & Stats Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 border-b border-[#edebe9]">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-sm bg-[#0078d4]" />
            <h2 className="text-base sm:text-lg font-semibold tracking-tight text-[#201f1e]">
              Microsoft 365 Employee Directory
            </h2>
          </div>
          <p className="text-xs text-[#605e5c] mt-0.5 pl-5">
            Connect with colleagues, view Microsoft Teams presence, and explore departmental organization.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <span className="bg-[#f3f2f1] text-[#605e5c] px-3 py-1 rounded-md text-xs font-semibold">
            {filteredEmployees.length} Colleagues Listed
          </span>
          {onAddEmployee && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-3 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 shadow-sm"
            >
              <User className="w-3.5 h-3.5" />
              <span>Add Member</span>
            </button>
          )}
        </div>
      </div>

      {/* Teams Chat Toast Notification */}
      {teamsChatStatus && (
        <div className="bg-[#dff6dd] border border-[#107c10] text-[#107c10] px-4 py-2.5 rounded-md text-xs font-medium flex items-center justify-between animate-in fade-in">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-[#107c10]" />
            <span>{teamsChatStatus}</span>
          </div>
          <button onClick={() => setTeamsChatStatus(null)} className="text-[#107c10] hover:opacity-75">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Controls & Search Row */}
      <div className="space-y-4">
        {/* Department Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs">
          {departments.map((dept) => {
            const isSelected = selectedDept === dept;
            const count =
              dept === 'All'
                ? employees.length
                : employees.filter((e) => e.department === dept).length;

            return (
              <button
                key={dept}
                onClick={() => setSelectedDept(dept)}
                className={`px-3 py-1.5 rounded-md font-medium transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#0078d4] text-white font-semibold shadow-sm'
                    : 'bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130]'
                }`}
              >
                <span>{dept}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded font-bold ${
                    isSelected ? 'bg-white/20 text-white' : 'bg-[#edebe9] text-[#605e5c]'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Teams Status Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-xs border-t border-b border-[#edebe9] py-2">
          <span className="text-[11px] font-bold text-[#605e5c] uppercase shrink-0 mr-1 flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5 text-[#0078d4]" />
            Teams Status:
          </span>
          {[
            { id: 'All', label: 'All Statuses', dot: 'bg-slate-400' },
            { id: 'Available', label: 'Available', dot: 'bg-emerald-500' },
            { id: 'In a meeting', label: 'In a meeting', dot: 'bg-rose-500' },
            { id: 'Busy', label: 'Busy', dot: 'bg-rose-500' },
            { id: 'Away', label: 'Away', dot: 'bg-amber-500' },
            { id: 'Out of office', label: 'Out of office', dot: 'bg-slate-400' },
          ].map((statusItem) => {
            const isSelected = selectedAvailability === statusItem.id;
            const count =
              statusItem.id === 'All'
                ? employees.length
                : employees.filter((e) => e.availability === statusItem.id).length;

            return (
              <button
                key={statusItem.id}
                onClick={() => setSelectedAvailability(statusItem.id)}
                className={`px-2.5 py-1 rounded-full text-xs font-semibold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                  isSelected
                    ? 'bg-[#201f1e] text-white shadow-sm ring-1 ring-[#201f1e]'
                    : 'bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130]'
                }`}
              >
                <span className={`w-2 h-2 rounded-full ${statusItem.dot}`} />
                <span>{statusItem.label}</span>
                <span className="text-[10px] bg-black/10 px-1.5 py-0.2 rounded font-bold">
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Sub-Filter Controls */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          {/* Search Box */}
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-[#605e5c]" />
            <input
              type="text"
              placeholder="Search by name, email, title, or skill..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 bg-[#f3f2f1] border-none rounded-md text-xs text-[#323130] placeholder-[#605e5c] focus:ring-2 focus:ring-[#0078d4] outline-none transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-[#605e5c] hover:text-[#201f1e]"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2">
            {/* View Mode Toggle */}
            <div className="flex items-center border border-[#edebe9] rounded-md overflow-hidden bg-white p-0.5">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-[#f3f2f1] text-[#0078d4] font-semibold'
                    : 'text-[#605e5c] hover:bg-[#f3f2f1]'
                }`}
                title="Card Grid View"
              >
                <Grid className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded transition-colors ${
                  viewMode === 'table'
                    ? 'bg-[#f3f2f1] text-[#0078d4] font-semibold'
                    : 'text-[#605e5c] hover:bg-[#f3f2f1]'
                }`}
                title="List Table View"
              >
                <List className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Directory Content Display */}
      {filteredEmployees.length === 0 ? (
        <div className="text-center py-12 bg-[#f3f2f1] rounded-lg border border-dashed border-[#edebe9] p-6 space-y-2">
          <User className="w-8 h-8 text-[#a19f9d] mx-auto" />
          <h3 className="font-semibold text-sm text-[#323130]">No employee profiles found</h3>
          <p className="text-xs text-[#605e5c]">
            Try clearing your search query or choosing a different department.
          </p>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredEmployees.map((emp) => {
            const presence = getAvailabilityBadge(emp.availability);

            return (
              <div
                key={emp.id}
                className="bg-white rounded-lg border border-[#edebe9] p-5 shadow-sm hover:border-[#0078d4] transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  {/* Top Avatar & Presence Info */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="relative">
                      <img
                        src={emp.avatar}
                        alt={emp.name}
                        className="w-14 h-14 rounded-full object-cover border border-[#edebe9]"
                      />
                      <span
                        className={`absolute bottom-0 right-0 w-3.5 h-3.5 rounded-full border-2 border-white ${presence.color}`}
                        title={emp.availability}
                      />
                    </div>

                    <span
                      className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${presence.badgeStyle}`}
                    >
                      {presence.text}
                    </span>
                  </div>

                  {/* Name & Job Title */}
                  <div>
                    <h3
                      onClick={() => setSelectedEmployee(emp)}
                      className="font-semibold text-base text-[#201f1e] hover:text-[#0078d4] cursor-pointer transition-colors leading-snug"
                    >
                      {emp.name}
                    </h3>
                    <p className="text-xs font-medium text-[#605e5c] mt-0.5 line-clamp-1">
                      {emp.title}
                    </p>
                    <span className="inline-block text-[10px] bg-[#f3f2f1] text-[#605e5c] font-semibold px-2 py-0.5 rounded mt-1.5 uppercase">
                      {emp.department}
                    </span>
                  </div>

                  {/* Details List */}
                  <div className="space-y-2 text-xs text-[#605e5c] pt-1">
                    {/* Work Email Row */}
                    <div className="bg-[#f3f2f1] p-2 rounded-md flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2 min-w-0">
                        <Mail className="w-3.5 h-3.5 text-[#0078d4] shrink-0" />
                        <a
                          href={`mailto:${emp.email}`}
                          className="hover:underline hover:text-[#0078d4] font-medium text-[#201f1e] truncate text-[11px]"
                          title={`Send email to ${emp.email}`}
                        >
                          {emp.email}
                        </a>
                      </div>
                      <button
                        onClick={(e) => handleCopyEmail(emp.email, e)}
                        className="text-[10px] bg-white hover:bg-[#edebe9] text-[#323130] font-semibold px-2 py-0.5 rounded border border-[#edebe9] shrink-0 transition-colors flex items-center gap-1"
                        title="Copy email address"
                      >
                        {copiedEmail === emp.email ? (
                          <>
                            <Check className="w-3 h-3 text-[#107c10]" />
                            <span className="text-[#107c10]">Copied</span>
                          </>
                        ) : (
                          <span>Copy</span>
                        )}
                      </button>
                    </div>

                    <div className="flex items-center gap-2 truncate px-1">
                      <Phone className="w-3.5 h-3.5 text-[#a19f9d] shrink-0" />
                      <span>{emp.phone}</span>
                    </div>
                    <div className="flex items-center gap-2 truncate px-1">
                      <MapPin className="w-3.5 h-3.5 text-[#a19f9d] shrink-0" />
                      <span className="truncate">{emp.officeLocation}</span>
                    </div>
                  </div>

                  {/* Skills Tags */}
                  {emp.skills && emp.skills.length > 0 && (
                    <div className="flex flex-wrap gap-1 pt-1">
                      {emp.skills.slice(0, 3).map((skill) => (
                        <span
                          key={skill}
                          className="text-[10px] bg-[#f3f2f1] text-[#323130] px-2 py-0.5 rounded font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {emp.skills.length > 3 && (
                        <span className="text-[10px] text-[#a19f9d] font-medium self-center">
                          +{emp.skills.length - 3} more
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {/* Card Actions Footer */}
                <div className="pt-4 mt-4 border-t border-[#edebe9] flex items-center justify-between gap-2">
                  <button
                    onClick={() => handleStartTeamsChat(emp)}
                    className="flex-1 py-1.5 px-2 bg-[#0078d4] hover:bg-[#106ebe] text-white text-xs font-semibold rounded transition-colors flex items-center justify-center gap-1.5 shadow-sm"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Teams Chat</span>
                  </button>

                  <button
                    onClick={() => setSelectedEmployee(emp)}
                    className="py-1.5 px-3 bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] text-xs font-semibold rounded transition-colors"
                    title="View M365 Persona Card"
                  >
                    Persona
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE LIST VIEW */
        <div className="overflow-x-auto border border-[#edebe9] rounded-lg">
          <table className="w-full text-left text-xs text-[#323130]">
            <thead className="bg-[#f3f2f1] border-b border-[#edebe9] text-[#605e5c] font-semibold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="p-3">Employee</th>
                <th className="p-3">Department</th>
                <th className="p-3">Status</th>
                <th className="p-3">Location</th>
                <th className="p-3">Contact</th>
                <th className="p-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#edebe9]">
              {filteredEmployees.map((emp) => {
                const presence = getAvailabilityBadge(emp.availability);

                return (
                  <tr key={emp.id} className="hover:bg-[#f3f2f1] transition-colors">
                    <td className="p-3">
                      <div className="flex items-center gap-3">
                        <div className="relative">
                          <img
                            src={emp.avatar}
                            alt={emp.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                          <span
                            className={`absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full border border-white ${presence.color}`}
                          />
                        </div>
                        <div>
                          <div
                            onClick={() => setSelectedEmployee(emp)}
                            className="font-semibold text-[#201f1e] hover:text-[#0078d4] cursor-pointer"
                          >
                            {emp.name}
                          </div>
                          <div className="text-[#605e5c] text-[11px]">{emp.title}</div>
                        </div>
                      </div>
                    </td>
                    <td className="p-3">
                      <span className="bg-[#f3f2f1] text-[#605e5c] px-2 py-0.5 rounded font-semibold text-[10px]">
                        {emp.department}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${presence.badgeStyle}`}>
                        {presence.text}
                      </span>
                    </td>
                    <td className="p-3 text-[#605e5c]">{emp.officeLocation}</td>
                    <td className="p-3 text-[#605e5c]">
                      <div className="flex items-center gap-1.5 font-medium text-[#201f1e]">
                        <Mail className="w-3 h-3 text-[#0078d4] shrink-0" />
                        <a href={`mailto:${emp.email}`} className="hover:underline hover:text-[#0078d4]">
                          {emp.email}
                        </a>
                        <button
                          onClick={(e) => handleCopyEmail(emp.email, e)}
                          className="text-[9px] bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] font-semibold px-1.5 py-0.2 rounded border border-[#edebe9] ml-1 shrink-0"
                          title="Copy email address"
                        >
                          {copiedEmail === emp.email ? 'Copied ✓' : 'Copy'}
                        </button>
                      </div>
                      <div className="text-[11px] text-[#605e5c] mt-0.5">{emp.phone}</div>
                    </td>
                    <td className="p-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => handleStartTeamsChat(emp)}
                          className="p-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded transition-colors"
                          title="Start Teams Chat"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => setSelectedEmployee(emp)}
                          className="p-1.5 bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] rounded transition-colors"
                          title="View Persona Card"
                        >
                          <ChevronRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. M365 Persona Details Modal */}
      {selectedEmployee && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#edebe9] rounded-lg shadow-xl w-full max-w-lg overflow-hidden animate-in zoom-in-95">
            {/* Header Banner */}
            <div className="bg-[#0078d4] text-white p-6 relative">
              <button
                onClick={() => setSelectedEmployee(null)}
                className="absolute top-4 right-4 text-white/80 hover:text-white p-1 rounded-full hover:bg-white/10"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-4">
                <div className="relative">
                  <img
                    src={selectedEmployee.avatar}
                    alt={selectedEmployee.name}
                    className="w-16 h-16 rounded-full object-cover border-2 border-white shadow-md"
                  />
                  <span
                    className={`absolute bottom-0 right-0 w-4 h-4 rounded-full border-2 border-white ${
                      getAvailabilityBadge(selectedEmployee.availability).color
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold text-lg leading-snug">{selectedEmployee.name}</h3>
                  <p className="text-xs text-white/90">{selectedEmployee.title}</p>
                  <span className="inline-block text-[10px] bg-white/20 px-2 py-0.5 rounded font-medium mt-1 uppercase">
                    {selectedEmployee.department}
                  </span>
                </div>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-5 text-xs text-[#323130]">
              {/* Presence & Bio */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-[#605e5c]">
                    Microsoft 365 Presence
                  </span>
                  <span
                    className={`font-bold px-2.5 py-0.5 rounded text-[10px] uppercase ${
                      getAvailabilityBadge(selectedEmployee.availability).badgeStyle
                    }`}
                  >
                    {selectedEmployee.availability}
                  </span>
                </div>
                {selectedEmployee.bio && (
                  <p className="text-xs text-[#605e5c] leading-relaxed bg-[#f3f2f1] p-3 rounded-md">
                    {selectedEmployee.bio}
                  </p>
                )}
              </div>

              {/* Direct Info Fields */}
              <div className="grid grid-cols-2 gap-4 bg-[#f3f2f1] p-3.5 rounded-md">
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#605e5c] uppercase font-semibold block">Work Email</span>
                  <div className="flex items-center gap-1.5 min-w-0">
                    <a
                      href={`mailto:${selectedEmployee.email}`}
                      className="font-semibold text-[#0078d4] hover:underline truncate"
                    >
                      {selectedEmployee.email}
                    </a>
                    <button
                      onClick={(e) => handleCopyEmail(selectedEmployee.email, e)}
                      className="text-[10px] bg-white hover:bg-[#edebe9] text-[#323130] font-semibold px-2 py-0.5 rounded border border-[#edebe9] shrink-0"
                    >
                      {copiedEmail === selectedEmployee.email ? 'Copied ✓' : 'Copy'}
                    </button>
                  </div>
                </div>
                <div className="space-y-1 col-span-2 sm:col-span-1">
                  <span className="text-[10px] text-[#605e5c] uppercase font-semibold block">Teams Status</span>
                  <div className="flex items-center gap-1.5 font-semibold text-[#201f1e]">
                    <span
                      className={`w-2.5 h-2.5 rounded-full ${
                        getAvailabilityBadge(selectedEmployee.availability).color
                      }`}
                    />
                    <span>{selectedEmployee.availability}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#605e5c] uppercase font-semibold block">Phone</span>
                  <div className="font-medium text-[#201f1e]">{selectedEmployee.phone}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] text-[#605e5c] uppercase font-semibold block">Office Location</span>
                  <div className="font-medium text-[#201f1e]">{selectedEmployee.officeLocation}</div>
                </div>
                {selectedEmployee.manager && (
                  <div className="space-y-1 col-span-2">
                    <span className="text-[10px] text-[#605e5c] uppercase font-semibold block">Manager</span>
                    <div className="font-medium text-[#201f1e]">{selectedEmployee.manager}</div>
                  </div>
                )}
              </div>

              {/* Skills Matrix */}
              {selectedEmployee.skills && selectedEmployee.skills.length > 0 && (
                <div className="space-y-1.5">
                  <span className="font-semibold uppercase tracking-wider text-[10px] text-[#605e5c]">
                    Skills & Expertise
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedEmployee.skills.map((skill) => (
                      <span
                        key={skill}
                        className="bg-[#f3f2f1] text-[#323130] px-2.5 py-1 rounded text-xs font-medium"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick Actions Footer */}
              <div className="pt-3 border-t border-[#edebe9] flex items-center justify-end gap-2">
                <a
                  href={`mailto:${selectedEmployee.email}`}
                  className="px-3 py-2 bg-[#f3f2f1] hover:bg-[#edebe9] text-[#323130] font-semibold rounded flex items-center gap-1.5"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>Send Email</span>
                </a>
                <button
                  onClick={() => {
                    handleStartTeamsChat(selectedEmployee);
                    setSelectedEmployee(null);
                  }}
                  className="px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] text-white font-semibold rounded flex items-center gap-1.5"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Start Teams Chat</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. Add Employee Profile Modal (Admin / HR) */}
      {isAddModalOpen && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-[#edebe9] rounded-lg shadow-xl w-full max-w-md overflow-hidden animate-in zoom-in-95">
            <div className="bg-[#0078d4] text-white p-4 flex items-center justify-between">
              <h3 className="font-semibold text-sm">Add New Employee Profile</h3>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-white/80 hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCreateEmployeeSubmit} className="p-5 space-y-4 text-xs">
              <div>
                <label className="block text-[#605e5c] font-semibold mb-1">Full Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Jordan Smith"
                  value={newEmpName}
                  onChange={(e) => setNewEmpName(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#605e5c] font-semibold mb-1">Job Title</label>
                  <input
                    type="text"
                    placeholder="e.g. UX Architect"
                    value={newEmpTitle}
                    onChange={(e) => setNewEmpTitle(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#605e5c] font-semibold mb-1">Department</label>
                  <select
                    value={newEmpDept}
                    onChange={(e) => setNewEmpDept(e.target.value as Department)}
                    className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                  >
                    {departments
                      .filter((d) => d !== 'All')
                      .map((dept) => (
                        <option key={dept} value={dept}>
                          {dept}
                        </option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[#605e5c] font-semibold mb-1">Work Email *</label>
                <input
                  type="email"
                  required
                  placeholder="jordan.smith@contoso.com"
                  value={newEmpEmail}
                  onChange={(e) => setNewEmpEmail(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-[#605e5c] font-semibold mb-1">Phone</label>
                  <input
                    type="text"
                    value={newEmpPhone}
                    onChange={(e) => setNewEmpPhone(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[#605e5c] font-semibold mb-1">Office Location</label>
                  <input
                    type="text"
                    value={newEmpLocation}
                    onChange={(e) => setNewEmpLocation(e.target.value)}
                    className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[#605e5c] font-semibold mb-1">Skills (Comma separated)</label>
                <input
                  type="text"
                  value={newEmpSkills}
                  onChange={(e) => setNewEmpSkills(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                />
              </div>

              <div>
                <label className="block text-[#605e5c] font-semibold mb-1">Short Bio</label>
                <textarea
                  rows={2}
                  placeholder="Brief summary of background or role..."
                  value={newEmpBio}
                  onChange={(e) => setNewEmpBio(e.target.value)}
                  className="w-full px-3 py-1.5 border border-[#edebe9] rounded text-xs focus:border-[#0078d4] outline-none"
                />
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-3 py-1.5 bg-[#f3f2f1] text-[#323130] font-semibold rounded hover:bg-[#edebe9]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white font-semibold rounded shadow-sm"
                >
                  Save Profile
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
