import { Department, Category, Priority } from '../types';

export function getDepartmentBadgeColor(dept: Department): string {
  switch (dept) {
    case 'Engineering':
      return 'bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/50 dark:text-blue-300 dark:border-blue-800';
    case 'HR & Culture':
      return 'bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950/50 dark:text-rose-300 dark:border-rose-800';
    case 'IT & Security':
      return 'bg-amber-50 text-amber-800 border-amber-200 dark:bg-amber-950/50 dark:text-amber-300 dark:border-amber-800';
    case 'Marketing':
      return 'bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800';
    case 'Operations':
      return 'bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/50 dark:text-emerald-300 dark:border-emerald-800';
    case 'Finance':
      return 'bg-teal-50 text-teal-700 border-teal-200 dark:bg-teal-950/50 dark:text-teal-300 dark:border-teal-800';
    case 'Executive Leadership':
      return 'bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/50 dark:text-indigo-300 dark:border-indigo-800';
    default:
      return 'bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-700';
  }
}

export function getCategoryIconName(cat: Category): string {
  switch (cat) {
    case 'Urgent Alert':
      return 'AlertTriangle';
    case 'News':
      return 'Newspaper';
    case 'Policy Update':
      return 'FileText';
    case 'Event':
      return 'Calendar';
    case 'System Maintenance':
      return 'Wrench';
    case 'Milestone & Achievement':
      return 'Trophy';
    default:
      return 'Bell';
  }
}

export function getPriorityBadge(priority: Priority): { label: string; className: string } {
  switch (priority) {
    case 'urgent':
      return {
        label: 'Urgent',
        className: 'bg-red-600 text-white font-semibold animate-pulse',
      };
    case 'high':
      return {
        label: 'High Priority',
        className: 'bg-amber-500 text-white font-medium',
      };
    default:
      return {
        label: 'Standard',
        className: 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300',
      };
  }
}

export function formatRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return 'Just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800) return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function getThemeAccentClass(theme: string): { primary: string; hover: string; border: string; text: string; lightBg: string } {
  switch (theme) {
    case 'teal':
      return {
        primary: 'bg-teal-600 text-white',
        hover: 'hover:bg-teal-700',
        border: 'border-teal-500',
        text: 'text-teal-600 dark:text-teal-400',
        lightBg: 'bg-teal-50 dark:bg-teal-950/40',
      };
    case 'indigo':
      return {
        primary: 'bg-indigo-600 text-white',
        hover: 'hover:bg-indigo-700',
        border: 'border-indigo-500',
        text: 'text-indigo-600 dark:text-indigo-400',
        lightBg: 'bg-indigo-50 dark:bg-indigo-950/40',
      };
    case 'amber':
      return {
        primary: 'bg-amber-600 text-white',
        hover: 'hover:bg-amber-700',
        border: 'border-amber-500',
        text: 'text-amber-600 dark:text-amber-400',
        lightBg: 'bg-amber-50 dark:bg-amber-950/40',
      };
    case 'slate':
      return {
        primary: 'bg-slate-800 text-white dark:bg-slate-200 dark:text-slate-900',
        hover: 'hover:bg-slate-900 dark:hover:bg-slate-100',
        border: 'border-slate-500',
        text: 'text-slate-800 dark:text-slate-200',
        lightBg: 'bg-slate-100 dark:bg-slate-800/60',
      };
    case 'sharepoint-blue':
    default:
      return {
        primary: 'bg-[#0078d4] text-white', // Official Microsoft 365 / SharePoint Blue
        hover: 'hover:bg-[#106ebe]',
        border: 'border-[#0078d4]',
        text: 'text-[#0078d4]',
        lightBg: 'bg-[#f3f9fd] dark:bg-[#002d4d]/40',
      };
  }
}
