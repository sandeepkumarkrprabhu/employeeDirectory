import { Announcement } from '../types';

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Critical IT Security Update: Mandatory Password Reset & 2FA Verification',
    summary: 'All employees must perform a password update and re-authenticate their Microsoft 365 Authenticator app prior to Friday 5 PM EST.',
    content: `### Security Advisory

As part of our quarterly IT Security hardening protocols, the **IT & Security team** is executing a mandatory credential refresh across all Microsoft 365 tenant accounts.

#### Action Required:
1. Open your **Microsoft Authenticator** app on your registered mobile device.
2. Navigate to the [M365 Account Security Portal](https://myaccount.microsoft.com).
3. Update your password following our updated 16-character complex password guideline.
4. Verify your backup SMS/FIDO2 security key settings.

> **Note:** Access to SharePoint Online, Microsoft Teams, and Outlook Web will be restricted after **Friday at 5:00 PM EST** for unverified accounts.

If you encounter any issues during authorization, contact the IT Service Desk via Teams (#it-helpdesk) or extension 4400.`,
    department: 'IT & Security',
    category: 'Urgent Alert',
    priority: 'urgent',
    author: {
      name: 'Alex Rivera',
      title: 'Chief Information Security Officer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
      email: 'alex.rivera@contoso.com',
      department: 'IT & Security',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 45).toISOString(), // 45 mins ago
    pinned: true,
    targetAudience: ['All Employees'],
    tags: ['M365', 'Security', 'Action Required', 'Helpdesk'],
    bannerImageUrl: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      {
        id: 'att-1',
        name: 'M365_Security_Guide_2026.pdf',
        size: '1.4 MB',
        type: 'pdf',
        url: '#',
      },
    ],
    reactions: { like: 42, celebrate: 3, important: 88 },
    viewsCount: 342,
    comments: [
      {
        id: 'c-1',
        authorName: 'Sarah Jenkins',
        authorAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80',
        text: 'Does this apply to contractor tenant accounts as well?',
        createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
      },
      {
        id: 'c-2',
        authorName: 'Alex Rivera',
        authorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80',
        text: 'Yes Sarah, contractor accounts must complete authentication by Thursday evening.',
        createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
      },
    ],
  },
  {
    id: 'ann-2',
    title: 'Q3 Product Engineering Roadmap Reveal & Cloud Architecture Migration',
    summary: 'Engineering announces our transition to hybrid cloud microservices and new AI Studio integration modules starting next month.',
    content: `We are thrilled to share the key milestones for our **Q3 Product & Engineering Roadmap**.

### Highlights:
* **Cloud Run & Serverless Scaling:** 40% improvement in API response latencies for global team hubs.
* **SPFx Integration Suite:** Native SharePoint framework web parts with live WebSockets support for real-time collaboration.
* **Intelligent Assistance:** Embedded automated tools to assist teams with summary generation and document tagging inside SharePoint Libraries.

#### Town Hall Presentation:
Join us this **Thursday at 10:00 AM EST** for a live engineering demo and Q&A session.

[Join Microsoft Teams Meeting](#)`,
    department: 'Engineering',
    category: 'News',
    priority: 'high',
    author: {
      name: 'David Chen',
      title: 'VP of Engineering',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=250&q=80',
      email: 'david.chen@contoso.com',
      department: 'Engineering',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(), // 3 hours ago
    pinned: true,
    targetAudience: ['Engineering', 'Product', 'Operations'],
    tags: ['Roadmap', 'SPFx', 'AI Studio', 'Cloud Architecture'],
    bannerImageUrl: 'https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1200&q=80',
    reactions: { like: 67, celebrate: 45, important: 12 },
    viewsCount: 520,
    comments: [],
  },
  {
    id: 'ann-3',
    title: 'Annual Open Enrollment for Employee Health Benefits & Wellness Stipend',
    summary: 'HR & Culture is opening the 2026 Benefit Enrollment window. Explore new dental coverage, wellness stipends, and flexible hybrid perks.',
    content: `### Welcome to Open Enrollment 2026

The HR & Culture team invites all full-time team members to review and customize their healthcare, retirement, and wellness benefits packages.

#### Key Updates for 2026:
- **Expanded Wellness Stipend:** Increased to $150/month for fitness, ergonomics, or mental health apps.
- **Enhanced Vision & Dental Plans:** Tier 1 preventative care now 100% covered.
- **Flexible HSA Match:** Contoso will match up to $750 in HSA contributions.

Please review your options in the **Workday HR Portal** before the cutoff deadline on **October 15th**.`,
    department: 'HR & Culture',
    category: 'Policy Update',
    priority: 'normal',
    author: {
      name: 'Elena Rostova',
      title: 'Head of People & Culture',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=250&q=80',
      email: 'elena.rostova@contoso.com',
      department: 'HR & Culture',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 12).toISOString(), // 12 hours ago
    pinned: false,
    targetAudience: ['All Employees'],
    tags: ['HR', 'Benefits', 'Open Enrollment', 'Wellness'],
    bannerImageUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',
    attachments: [
      {
        id: 'att-2',
        name: '2026_Benefits_Guide_Summary.pdf',
        size: '2.8 MB',
        type: 'pdf',
        url: '#',
      },
    ],
    reactions: { like: 89, celebrate: 34, important: 19 },
    viewsCount: 890,
    comments: [],
  },
  {
    id: 'ann-4',
    title: 'Contoso Brand Guidelines 2026 Refresh & SharePoint Design Assets',
    summary: 'Marketing has released new official presentation templates, vector logos, and color palettes for all internal and client-facing materials.',
    content: `The Marketing team has published the brand refresh kit! 

All PowerPoint decks, SharePoint site headers, document templates, and email signatures have been updated in the **Central Asset Library**.

#### What\'s New:
- Updated accessible color contrast palettes for high readability.
- New icon library compatible with Microsoft Fluent UI and Lucide icons.
- Official SPFx theme token variables for custom SharePoint web parts.`,
    department: 'Marketing',
    category: 'News',
    priority: 'normal',
    author: {
      name: 'Marcus Vance',
      title: 'Creative Director',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=250&q=80',
      email: 'marcus.vance@contoso.com',
      department: 'Marketing',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 28).toISOString(),
    pinned: false,
    targetAudience: ['All Employees'],
    tags: ['Marketing', 'Brand', 'Templates', 'Design'],
    reactions: { like: 52, celebrate: 21, important: 5 },
    viewsCount: 410,
    comments: [],
  },
  {
    id: 'ann-5',
    title: 'Scheduled Maintenance: Regional Server Rack Upgrade in East Hub',
    summary: 'Operations will perform scheduled hardware maintenance this Saturday between 1:00 AM and 4:00 AM EST.',
    content: `Please be advised that Operations & Facilities will conduct routine data center server maintenance this weekend.

#### Impacted Services:
- On-premise network file shares (S:\\ Drive)
- Legacy VPN Gateway (GlobalProtect VPN remains active)

No downtime is expected for Microsoft 365 services (Exchange Online, SharePoint, Teams).`,
    department: 'Operations',
    category: 'System Maintenance',
    priority: 'normal',
    author: {
      name: 'Priya Sharma',
      title: 'Director of Infrastructure',
      avatar: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=250&q=80',
      email: 'priya.sharma@contoso.com',
      department: 'Operations',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(),
    pinned: false,
    targetAudience: ['All Employees'],
    tags: ['Maintenance', 'Operations', 'Infrastructure'],
    reactions: { like: 18, celebrate: 1, important: 24 },
    viewsCount: 295,
    comments: [],
  },
  {
    id: 'ann-6',
    title: 'Contoso Surpasses Q2 Revenue Target & Wins Enterprise Innovation Award',
    summary: 'Executive Leadership thanks all teams for an outstanding quarter achieving 124% of growth goals.',
    content: `Dear Team,

On behalf of the Executive Leadership Team, we want to express our deepest gratitude for your hard work and dedication throughout Q2.

Thanks to the cross-functional collaboration between Sales, Engineering, Customer Success, and Operations, Contoso has officially won the **2026 Enterprise Innovation Excellence Award**!

To celebrate, all regional offices will host a Friday Social Gathering at 4:00 PM local time.`,
    department: 'Executive Leadership',
    category: 'Milestone & Achievement',
    priority: 'high',
    author: {
      name: 'Victoria Sterling',
      title: 'Chief Executive Officer',
      avatar: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?auto=format&fit=crop&w=250&q=80',
      email: 'victoria.sterling@contoso.com',
      department: 'Executive Leadership',
    },
    createdAt: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(),
    pinned: true,
    targetAudience: ['All Employees'],
    tags: ['Celebration', 'Award', 'Executive', 'Q2 Growth'],
    bannerImageUrl: 'https://images.unsplash.com/photo-1511578314322-379afb476865?auto=format&fit=crop&w=1200&q=80',
    reactions: { like: 145, celebrate: 188, important: 40 },
    viewsCount: 1420,
    comments: [],
  },
];
