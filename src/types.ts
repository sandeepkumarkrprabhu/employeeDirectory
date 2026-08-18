export type Department =
  | 'All'
  | 'Engineering'
  | 'HR & Culture'
  | 'IT & Security'
  | 'Marketing'
  | 'Operations'
  | 'Finance'
  | 'Executive Leadership';

export type Category =
  | 'News'
  | 'Urgent Alert'
  | 'Policy Update'
  | 'Event'
  | 'System Maintenance'
  | 'Milestone & Achievement';

export type Priority = 'normal' | 'high' | 'urgent';

export interface Author {
  name: string;
  title: string;
  avatar: string;
  email: string;
  department: Department;
}

export interface Attachment {
  id: string;
  name: string;
  size: string;
  type: string;
  url: string;
}

export interface Comment {
  id: string;
  authorName: string;
  authorAvatar: string;
  text: string;
  createdAt: string;
}

export interface ReactionCounts {
  like: number;
  celebrate: number;
  important: number;
}

export interface Announcement {
  id: string;
  title: string;
  summary: string;
  content: string;
  department: Department;
  category: Category;
  priority: Priority;
  author: Author;
  createdAt: string;
  updatedAt?: string;
  pinned: boolean;
  targetAudience: string[];
  tags: string[];
  bannerImageUrl?: string;
  attachments?: Attachment[];
  reactions: ReactionCounts;
  viewsCount: number;
  comments: Comment[];
  isDraft?: boolean;
  scheduledFor?: string;
}

export interface SPFxWebPartConfig {
  title: string;
  description: string;
  displayMode: 'cards' | 'compact' | 'hero' | 'timeline' | 'carousel';
  selectedDepartment: Department;
  itemsPerPage: number;
  showSearch: boolean;
  showReactions: boolean;
  showComments: boolean;
  themeColor: 'sharepoint-blue' | 'teal' | 'indigo' | 'slate' | 'amber';
  enableUrgentBanner: boolean;
  compactHeader: boolean;
  allowUserFiltering: boolean;
}

export interface AIDraftRequest {
  topic: string;
  department: Department;
  category: Category;
  tone: 'professional' | 'urgent' | 'celebratory' | 'concise' | 'policy';
  keyPoints?: string[];
}

export interface AIDraftResponse {
  title: string;
  summary: string;
  content: string;
  tags: string[];
  suggestedPriority: Priority;
}

export type AvailabilityStatus = 'Available' | 'In a meeting' | 'Away' | 'Busy' | 'Out of office';

export interface Employee {
  id: string;
  name: string;
  title: string;
  department: Department;
  email: string;
  phone: string;
  officeLocation: string;
  avatar: string;
  skills: string[];
  manager?: string;
  availability: AvailabilityStatus;
  bio?: string;
  joinedDate?: string;
}

