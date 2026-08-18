import React, { useState } from 'react';
import {
  X,
  Code2,
  Copy,
  Check,
  FileCode,
  Terminal,
  Layers,
  Settings,
  Package,
  Wrench,
  Globe,
  Sliders,
} from 'lucide-react';

interface SPFxGeneratorExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SPFxGeneratorExportModal: React.FC<SPFxGeneratorExportModalProps> = ({
  isOpen,
  onClose,
}) => {
  const [activeTab, setActiveTab] = useState<
    | 'manifest'
    | 'package-solution'
    | 'config-json'
    | 'serve-json'
    | 'gulpfile'
    | 'heft'
    | 'webpart-ts'
    | 'powershell'
  >('package-solution');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const codeSnippets: Record<string, string> = {
    'package-solution': `{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/package-solution.schema.json",
  "solution": {
    "name": "pumex-employee-hub-client-side-solution",
    "id": "d9e034a1-87b2-4f11-91a3-a712130e9d22",
    "version": "1.0.0.0",
    "includeClientSideAssets": true,
    "skipFeatureDeployment": true,
    "isDomainIsolated": false,
    "developer": {
      "name": "Pumex Infotech",
      "websiteUrl": "https://www.pumexinfotech.com",
      "privacyUrl": "",
      "termsOfUseUrl": "",
      "mpnId": "Undefined"
    },
    "metadata": {
      "shortDescription": {
        "default": "Pumex Employee Hub M365 Intranet Web Part Solution"
      },
      "longDescription": {
        "default": "Complete Microsoft 365 Employee Directory with Teams Presence, contact tools, and real-time Department Intranet Announcements."
      },
      "categories": ["Communication", "People"],
      "tags": ["Employee Directory", "Intranet", "SPFx", "Microsoft 365"]
    },
    "features": [
      {
        "title": "pumex-employee-hub Feature",
        "description": "Installs the Pumex Employee Hub web part to SharePoint site collections",
        "id": "e2c34a1-87b2-4f11-91a3-a712130e9d22",
        "version": "1.0.0.0"
      }
    ]
  },
  "paths": {
    "zippedPackage": "sharepoint/solution/pumex-employee-hub.sppkg"
  }
}`,
    'config-json': `{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/config.2.0.schema.json",
  "version": "2.0",
  "bundles": {
    "pumex-employee-hub-web-part": {
      "components": [
        {
          "entrypoint": "./lib/webparts/pumexEmployeeHub/PumexEmployeeHubWebPart.js",
          "manifest": "./src/webparts/pumexEmployeeHub/PumexEmployeeHubWebPart.manifest.json"
        }
      ]
    }
  },
  "localizedResources": {
    "PumexEmployeeHubWebPartStrings": "lib/webparts/pumexEmployeeHub/loc/{locale}.js"
  }
}`,
    'serve-json': `{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx-build/spfx-serve.schema.json",
  "port": 4321,
  "https": true,
  "initialPage": "https://pumex.sharepoint.com/sites/intranet/_layouts/15/workbench.aspx",
  "api": {
    "port": 5432,
    "entryPath": "node_modules/@microsoft/sp-webpart-workbench/lib/api/"
  }
}`,
    gulpfile: `'use strict';

const build = require('@microsoft/sp-build-web');

build.addSuppression(\`Warning - [sass] The local CSS class 'ms-Grid' is not camelCase and will not be type-safe.\`);

var getTasks = build.rig.getTasks;
build.rig.getTasks = function () {
  var result = getTasks.call(build.rig);
  result.set('serve', result.get('serve-deprecated'));
  return result;
};

build.initialize(require('gulp'));`,
    heft: `# heft.json (SPFx Modern Rig Configuration)
{
  "$schema": "https://developer.microsoft.com/json-schemas/heft/v0/heft.schema.json",
  "eventActions": [],
  "heftPlugins": [
    {
      "plugin": "@microsoft/heft-web-ext-plugin"
    }
  ]
}

# .yo-rc.json (Yeoman SPFx Generator State)
{
  "@microsoft/generator-sharepoint": {
    "promptValues": {
      "packageManager": "npm"
    },
    "solutionName": "pumex-employee-hub",
    "solutionShortDescription": "Pumex Employee Hub M365 Intranet & Directory",
    "skipFeatureDeployment": true,
    "isDomainIsolated": false,
    "componentType": "webpart",
    "buildTarget": "latest",
    "isCreatingSolution": true,
    "environment": "spo",
    "version": "1.18.2",
    "libraryName": "pumex-employee-hub",
    "libraryId": "d9e034a1-87b2-4f11-91a3-a712130e9d22"
  }
}`,
    manifest: `{
  "$schema": "https://developer.microsoft.com/json-schemas/spfx/1.18.0/manifest-schema.json",
  "id": "d9e034a1-87b2-4f11-91a3-a712130e9d22",
  "alias": "PumexEmployeeHubWebPart",
  "componentType": "WebPart",
  "version": "1.0.0",
  "manifestVersion": 2,
  "requiresCustomScript": false,
  "supportedHosts": ["SharePointWebPart", "TeamsPersonalApp", "TeamsTab", "SharePointFullPage"],
  "preconfiguredEntries": [
    {
      "groupId": "5c454e16-a3e0-476b-967f-23fe0b27b233",
      "group": { "default": "People & News" },
      "title": { "default": "Pumex Employee Hub" },
      "description": { "default": "M365 Employee Directory with Teams Presence, contact tools, and Department Announcements." },
      "officeFabricIconFontName": "People",
      "properties": {
        "title": "Pumex Employee Hub",
        "selectedDepartment": "All",
        "displayMode": "split",
        "itemsPerPage": 6,
        "showSearch": true,
        "showReactions": true
      }
    }
  ]
}`,
    'webpart-ts': `import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';
import { PropertyPaneTextField, PropertyPaneDropdown } from '@microsoft/sp-property-pane';

import { PumexEmployeeHub, IPumexEmployeeHubProps } from './components/PumexEmployeeHub';

export interface IPumexEmployeeHubWebPartProps {
  title: string;
  selectedDepartment: string;
  displayMode: string;
}

export default class PumexEmployeeHubWebPart extends BaseClientSideWebPart<IPumexEmployeeHubWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IPumexEmployeeHubProps> = React.createElement(
      PumexEmployeeHub,
      {
        title: this.properties.title,
        selectedDepartment: this.properties.selectedDepartment,
        displayMode: this.properties.displayMode,
        context: this.context
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration() {
    return {
      pages: [
        {
          header: { description: "Configure Pumex Employee Hub Web Part" },
          groups: [
            {
              groupName: "Hub Settings",
              groupFields: [
                PropertyPaneTextField('title', { label: 'Web Part Header Title' }),
                PropertyPaneDropdown('selectedDepartment', {
                  label: 'Default Filtered Department',
                  options: [
                    { key: 'All', text: 'All Departments' },
                    { key: 'Engineering', text: 'Engineering' },
                    { key: 'HR & Culture', text: 'HR & Culture' },
                    { key: 'IT & Security', text: 'IT & Security' }
                  ]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}`,
    powershell: `# 1. Build SPFx Bundle and Package
# Run in terminal:
# gulp clean
# gulp bundle --ship
# gulp package-solution --ship

# 2. Connect to SharePoint Online Tenant Admin
Connect-PnPOnline -Url "https://pumex-admin.sharepoint.com" -Interactive

# 3. Deploy .sppkg to Tenant App Catalog
Add-PnPSiteCollectionAppCatalog -Site "https://pumex.sharepoint.com/sites/appcatalog"
Add-PnPApp -Path "./sharepoint/solution/pumex-employee-hub.sppkg" -Publish -Overwrite

# 4. Deploy Web Part to all site collections
Publish-PnPApp -Identity "pumex-employee-hub" -Scope Tenant`,
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(codeSnippets[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-5xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 bg-[#0078d4] text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Code2 className="w-5 h-5 text-sky-200" />
            <div>
              <h3 className="font-semibold text-base">
                SharePoint Framework (SPFx v1.18) Solution & Build Toolchain Generator
              </h3>
              <p className="text-xs text-sky-100">
                Gulp tasks, Heft config, SPFx config/ folder, Manifests & PowerShell deployment
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-full hover:bg-white/20 transition-colors text-white"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Subheader info */}
        <div className="bg-slate-100 dark:bg-slate-800 px-4 py-2.5 border-b border-slate-200 dark:border-slate-700 flex flex-wrap items-center justify-between gap-2 text-xs shrink-0">
          <div className="flex items-center gap-2 text-slate-700 dark:text-slate-300">
            <span className="font-semibold bg-sky-100 dark:bg-sky-900/60 text-[#0078d4] dark:text-sky-300 px-2 py-0.5 rounded font-mono">
              Gulp + Heft Toolchain
            </span>
            <span>•</span>
            <span className="font-semibold bg-emerald-100 dark:bg-emerald-900/60 text-emerald-800 dark:text-emerald-300 px-2 py-0.5 rounded font-mono">
              SPFx v1.18.2
            </span>
            <span>•</span>
            <span className="font-mono text-slate-500">config/package-solution.json</span>
          </div>
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3 py-1 bg-[#0078d4] hover:bg-[#106ebe] text-white rounded font-medium transition-colors"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
            <span>{copied ? 'Copied Code!' : 'Copy Active Code'}</span>
          </button>
        </div>

        {/* Code Tabs Bar */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs overflow-x-auto shrink-0">
          {[
            { id: 'package-solution', label: 'config/package-solution.json', icon: Package },
            { id: 'config-json', label: 'config/config.json', icon: Settings },
            { id: 'serve-json', label: 'config/serve.json', icon: Globe },
            { id: 'gulpfile', label: 'gulpfile.js (Gulp)', icon: Wrench },
            { id: 'heft', label: 'heft.json / .yo-rc.json', icon: Sliders },
            { id: 'manifest', label: 'WebPart.manifest.json', icon: FileCode },
            { id: 'webpart-ts', label: 'PumexEmployeeHubWebPart.ts', icon: Layers },
            { id: 'powershell', label: 'DeployAppCatalog.ps1', icon: Terminal },
          ].map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as typeof activeTab)}
                className={`py-2.5 px-3.5 font-mono font-medium flex items-center gap-1.5 border-b-2 transition-all whitespace-nowrap ${
                  isSelected
                    ? 'border-[#0078d4] text-[#0078d4] dark:text-sky-400 bg-white dark:bg-slate-900 font-semibold'
                    : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* Code Display Area */}
        <div className="flex-1 bg-slate-950 text-slate-100 p-4 font-mono text-xs overflow-y-auto leading-relaxed">
          <pre className="text-sky-300 whitespace-pre-wrap">{codeSnippets[activeTab]}</pre>
        </div>

        {/* Modal Footer */}
        <div className="p-3 bg-slate-100 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs text-slate-600 dark:text-slate-400 shrink-0">
          <span>SPFx Solution Ready for `gulp bundle --ship` & `gulp package-solution --ship`</span>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 dark:bg-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-300 rounded font-medium transition-colors"
          >
            Close Window
          </button>
        </div>
      </div>
    </div>
  );
};
