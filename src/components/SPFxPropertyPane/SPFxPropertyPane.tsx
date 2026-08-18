import React, { useState } from 'react';
import {
  X,
  Sliders,
  Palette,
  LayoutGrid,
  Filter,
  CheckCircle2,
  Code,
  Layers,
  Copy,
  Check,
  Zap,
} from 'lucide-react';
import { SPFxWebPartConfig, Department } from '../../types';

interface SPFxPropertyPaneProps {
  isOpen: boolean;
  onClose: () => void;
  config: SPFxWebPartConfig;
  onUpdateConfig: (newConfig: SPFxWebPartConfig) => void;
}

export const SPFxPropertyPane: React.FC<SPFxPropertyPaneProps> = ({
  isOpen,
  onClose,
  config,
  onUpdateConfig,
}) => {
  const [activeTab, setActiveTab] = useState<'properties' | 'spfx-code'>('properties');
  const [copiedCode, setCopiedCode] = useState(false);

  if (!isOpen) return null;

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

  const handleCopyYeomanCode = () => {
    const code = `# 1. Ensure Node.js v18+ LTS and Yeoman are installed globally:
npm install -g yo @microsoft/generator-sharepoint

# 2. Run the SharePoint Framework (SPFx) generator:
yo @microsoft/sharepoint

# Prompts setup:
# Solution Name: pumex-employee-hub
# Target: SharePoint Online only (latest)
# Component Type: WebPart
# Web Part Name: PumexEmployeeHub
# Framework: React

# 3. Build & serve locally with SharePoint Workbench:
gulp serve`;
    navigator.clipboard.writeText(code);
    setCopiedCode(true);
    setTimeout(() => setCopiedCode(false), 2000);
  };

  return (
    <aside
      id="spfx-property-pane"
      className="fixed inset-y-0 right-0 w-80 sm:w-96 bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl z-50 flex flex-col animate-in slide-in-from-right duration-200"
    >
      {/* Property Pane Header */}
      <div className="p-4 bg-[#0078d4] text-white flex items-center justify-between border-b border-[#005a9e]">
        <div className="flex items-center gap-2">
          <Sliders className="w-5 h-5" />
          <div>
            <h3 className="text-sm font-semibold leading-tight">Web Part Properties</h3>
            <p className="text-[11px] text-sky-100">SharePoint Framework (SPFx) Panel</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          title="Close Property Pane"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 text-xs font-medium">
        <button
          onClick={() => setActiveTab('properties')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'properties'
              ? 'border-[#0078d4] text-[#0078d4] bg-white dark:bg-slate-800 font-semibold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Palette className="w-3.5 h-3.5" />
          Display Settings
        </button>
        <button
          onClick={() => setActiveTab('spfx-code')}
          className={`flex-1 py-2.5 px-3 flex items-center justify-center gap-1.5 border-b-2 transition-colors ${
            activeTab === 'spfx-code'
              ? 'border-[#0078d4] text-[#0078d4] bg-white dark:bg-slate-800 font-semibold'
              : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
          }`}
        >
          <Code className="w-3.5 h-3.5" />
          Yeoman & SPFx Code
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4 space-y-6 text-xs text-slate-700 dark:text-slate-300">
        {activeTab === 'properties' ? (
          <>
            {/* General Settings */}
            <div className="space-y-3">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-500">
                General Options
              </label>

              <div>
                <label className="block mb-1 font-medium">Web Part Title</label>
                <input
                  type="text"
                  value={config.title}
                  onChange={(e) => onUpdateConfig({ ...config, title: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                />
              </div>

              <div>
                <label className="block mb-1 font-medium">Subtitle / Description</label>
                <input
                  type="text"
                  value={config.description}
                  onChange={(e) => onUpdateConfig({ ...config, description: e.target.value })}
                  className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
                />
              </div>
            </div>

            {/* Layout Mode */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-500">
                Layout Style
              </label>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { key: 'cards', label: 'Cards Grid', icon: LayoutGrid },
                  { key: 'compact', label: 'Compact List', icon: Layers },
                  { key: 'hero', label: 'Hero Featured', icon: Zap },
                  { key: 'carousel', label: 'Carousel Slider', icon: Filter },
                ].map((mode) => {
                  const Icon = mode.icon;
                  const isSelected = config.displayMode === mode.key;
                  return (
                    <button
                      key={mode.key}
                      onClick={() =>
                        onUpdateConfig({
                          ...config,
                          displayMode: mode.key as SPFxWebPartConfig['displayMode'],
                        })
                      }
                      className={`p-2.5 rounded border text-left flex items-center gap-2 transition-all ${
                        isSelected
                          ? 'border-[#0078d4] bg-sky-50 dark:bg-sky-950/40 text-[#0078d4] font-semibold ring-1 ring-[#0078d4]'
                          : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800'
                      }`}
                    >
                      <Icon className="w-4 h-4 text-[#0078d4]" />
                      <span>{mode.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Default Department Filter */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-500">
                Default Department Filter
              </label>
              <select
                value={config.selectedDepartment}
                onChange={(e) =>
                  onUpdateConfig({ ...config, selectedDepartment: e.target.value as Department })
                }
                className="w-full px-3 py-1.5 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded text-xs focus:ring-1 focus:ring-[#0078d4]"
              >
                {departmentsList.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Color Selector */}
            <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-500">
                Theme Accent Color
              </label>
              <div className="flex items-center gap-2">
                {[
                  { name: 'sharepoint-blue', hex: '#0078d4', label: 'SharePoint' },
                  { name: 'teal', hex: '#0d9488', label: 'Teal' },
                  { name: 'indigo', hex: '#4f46e5', label: 'Indigo' },
                  { name: 'amber', hex: '#d97706', label: 'Amber' },
                  { name: 'slate', hex: '#334155', label: 'Slate' },
                ].map((c) => (
                  <button
                    key={c.name}
                    onClick={() =>
                      onUpdateConfig({
                        ...config,
                        themeColor: c.name as SPFxWebPartConfig['themeColor'],
                      })
                    }
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-transform ${
                      config.themeColor === c.name
                        ? 'ring-2 ring-offset-2 ring-[#0078d4] scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.label}
                  >
                    {config.themeColor === c.name && <CheckCircle2 className="w-4 h-4 text-white" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Interactive Features Toggles */}
            <div className="space-y-3 pt-2 border-t border-slate-200 dark:border-slate-800">
              <label className="block text-xs font-semibold text-slate-900 dark:text-slate-100 uppercase tracking-wider text-[10px] text-slate-500">
                Interactive Options
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Show Search Bar</span>
                <input
                  type="checkbox"
                  checked={config.showSearch}
                  onChange={(e) => onUpdateConfig({ ...config, showSearch: e.target.checked })}
                  className="rounded text-[#0078d4] focus:ring-[#0078d4]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Show User Reactions</span>
                <input
                  type="checkbox"
                  checked={config.showReactions}
                  onChange={(e) => onUpdateConfig({ ...config, showReactions: e.target.checked })}
                  className="rounded text-[#0078d4] focus:ring-[#0078d4]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Enable Urgent Alert Banner</span>
                <input
                  type="checkbox"
                  checked={config.enableUrgentBanner}
                  onChange={(e) => onUpdateConfig({ ...config, enableUrgentBanner: e.target.checked })}
                  className="rounded text-[#0078d4] focus:ring-[#0078d4]"
                />
              </label>

              <label className="flex items-center justify-between cursor-pointer">
                <span>Compact Header Layout</span>
                <input
                  type="checkbox"
                  checked={config.compactHeader}
                  onChange={(e) => onUpdateConfig({ ...config, compactHeader: e.target.checked })}
                  className="rounded text-[#0078d4] focus:ring-[#0078d4]"
                />
              </label>
            </div>
          </>
        ) : (
          /* SPFx Code Generator Info */
          <div className="space-y-4">
            <div className="bg-slate-900 text-slate-100 p-3 rounded-lg font-mono text-[11px] relative">
              <div className="flex items-center justify-between mb-2 pb-1 border-b border-slate-800 text-slate-400">
                <span>Yeoman SPFx Generator Command</span>
                <button
                  onClick={handleCopyYeomanCode}
                  className="hover:text-white flex items-center gap-1 text-xs"
                >
                  {copiedCode ? (
                    <Check className="w-3.5 h-3.5 text-emerald-400" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  {copiedCode ? 'Copied!' : 'Copy'}
                </button>
              </div>
              <pre className="whitespace-pre-wrap leading-relaxed text-sky-300">
                {`npm install -g yo @microsoft/generator-sharepoint
yo @microsoft/sharepoint`}
              </pre>
            </div>

            <div className="p-3 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 rounded-lg text-blue-900 dark:text-blue-300 space-y-2">
              <h4 className="font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                Ready for Microsoft 365 Tenant Catalog
              </h4>
              <p className="text-[11px]">
                This web part code matches the SPFx v1.18+ React standard architecture. Run{' '}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">gulp bundle --ship</code> and{' '}
                <code className="bg-blue-100 dark:bg-blue-900 px-1 rounded">gulp package-solution --ship</code>{' '}
                to upload the <code className="font-mono">.sppkg</code> package directly into your SharePoint App Catalog!
              </p>
            </div>
          </div>
        )}
      </div>

      {/* Property Pane Footer */}
      <div className="p-3 bg-slate-50 dark:bg-slate-800/80 border-t border-slate-200 dark:border-slate-800 flex items-center justify-between text-xs">
        <span className="text-slate-500 font-mono text-[10px]">SPFx v1.18.2 | React 19</span>
        <button
          onClick={onClose}
          className="px-4 py-1.5 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded font-medium transition-colors"
        >
          Apply Changes
        </button>
      </div>
    </aside>
  );
};
