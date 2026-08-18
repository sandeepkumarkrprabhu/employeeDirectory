import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { INITIAL_ANNOUNCEMENTS } from './src/data/seedData.js';
import { INITIAL_EMPLOYEES } from './src/data/employeeData.js';
import { Announcement, Employee, AIDraftRequest } from './src/types.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // In-memory data storage
  let announcementsStore: Announcement[] = [...INITIAL_ANNOUNCEMENTS];
  let employeesStore: Employee[] = [...INITIAL_EMPLOYEES];

  // --- API ROUTES ---

  // Health check
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // Get all announcements (with optional filters)
  app.get('/api/announcements', (req, res) => {
    const { department, category, search, priority, pinnedOnly } = req.query;

    let filtered = [...announcementsStore];

    if (department && department !== 'All') {
      filtered = filtered.filter(
        (a) => a.department.toLowerCase() === (department as string).toLowerCase()
      );
    }

    if (category && category !== 'All') {
      filtered = filtered.filter(
        (a) => a.category.toLowerCase() === (category as string).toLowerCase()
      );
    }

    if (priority && priority !== 'All') {
      filtered = filtered.filter(
        (a) => a.priority.toLowerCase() === (priority as string).toLowerCase()
      );
    }

    if (pinnedOnly === 'true') {
      filtered = filtered.filter((a) => a.pinned);
    }

    if (search) {
      const query = (search as string).toLowerCase();
      filtered = filtered.filter(
        (a) =>
          a.title.toLowerCase().includes(query) ||
          a.summary.toLowerCase().includes(query) ||
          a.content.toLowerCase().includes(query) ||
          a.tags.some((t) => t.toLowerCase().includes(query)) ||
          a.author.name.toLowerCase().includes(query)
      );
    }

    // Sort pinned first, then by date descending
    filtered.sort((a, b) => {
      if (a.pinned && !b.pinned) return -1;
      if (!a.pinned && b.pinned) return 1;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

    res.json(filtered);
  });

  // Create new announcement (Admin)
  app.post('/api/announcements', (req, res) => {
    const newAnnouncement: Announcement = {
      id: `ann-${Date.now()}`,
      createdAt: new Date().toISOString(),
      viewsCount: 0,
      reactions: { like: 0, celebrate: 0, important: 0 },
      comments: [],
      ...req.body,
    };

    if (newAnnouncement.pinned) {
      // Pinned items stay at top
    }

    announcementsStore.unshift(newAnnouncement);
    res.status(201).json(newAnnouncement);
  });

  // Update announcement
  app.put('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    const index = announcementsStore.findIndex((a) => a.id === id);

    if (index === -1) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    announcementsStore[index] = {
      ...announcementsStore[index],
      ...req.body,
      updatedAt: new Date().toISOString(),
    };

    res.json(announcementsStore[index]);
  });

  // Delete announcement
  app.delete('/api/announcements/:id', (req, res) => {
    const { id } = req.params;
    announcementsStore = announcementsStore.filter((a) => a.id !== id);
    res.json({ success: true, id });
  });

  // Toggle reaction
  app.post('/api/announcements/:id/reaction', (req, res) => {
    const { id } = req.params;
    const { type } = req.body; // 'like' | 'celebrate' | 'important'

    const item = announcementsStore.find((a) => a.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    if (type === 'like' || type === 'celebrate' || type === 'important') {
      item.reactions[type] = (item.reactions[type] || 0) + 1;
    }

    res.json(item.reactions);
  });

  // Add comment
  app.post('/api/announcements/:id/comment', (req, res) => {
    const { id } = req.params;
    const { authorName, authorAvatar, text } = req.body;

    const item = announcementsStore.find((a) => a.id === id);
    if (!item) {
      return res.status(404).json({ error: 'Announcement not found' });
    }

    const newComment = {
      id: `c-${Date.now()}`,
      authorName: authorName || 'M365 User',
      authorAvatar:
        authorAvatar ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80',
      text,
      createdAt: new Date().toISOString(),
    };

    item.comments.push(newComment);
    res.status(201).json(newComment);
  });

  // Increment view count
  app.post('/api/announcements/:id/view', (req, res) => {
    const { id } = req.params;
    const item = announcementsStore.find((a) => a.id === id);
    if (item) {
      item.viewsCount = (item.viewsCount || 0) + 1;
      return res.json({ viewsCount: item.viewsCount });
    }
    res.status(404).json({ error: 'Not found' });
  });

  // --- EMPLOYEE DIRECTORY API ROUTES ---
  app.get('/api/employees', (req, res) => {
    const { department, search, availability } = req.query;

    let filtered = [...employeesStore];

    if (department && department !== 'All') {
      filtered = filtered.filter(
        (e) => e.department.toLowerCase() === (department as string).toLowerCase()
      );
    }

    if (availability && availability !== 'All') {
      filtered = filtered.filter(
        (e) => e.availability.toLowerCase() === (availability as string).toLowerCase()
      );
    }

    if (search) {
      const q = (search as string).toLowerCase();
      filtered = filtered.filter(
        (e) =>
          e.name.toLowerCase().includes(q) ||
          e.title.toLowerCase().includes(q) ||
          e.email.toLowerCase().includes(q) ||
          e.officeLocation.toLowerCase().includes(q) ||
          e.skills.some((s) => s.toLowerCase().includes(q))
      );
    }

    res.json(filtered);
  });

  app.post('/api/employees', (req, res) => {
    const newEmp: Employee = {
      id: `emp-${Date.now()}`,
      availability: 'Available',
      joinedDate: new Date().toISOString().split('T')[0],
      ...req.body,
    };
    employeesStore.unshift(newEmp);
    res.status(201).json(newEmp);
  });


  // Smart Draft Generator endpoint
  app.post('/api/ai/draft', async (req, res) => {
    const { topic, department, category, tone, keyPoints }: AIDraftRequest = req.body;

    try {
      const formattedPoints = keyPoints && keyPoints.length > 0 
        ? keyPoints.map((kp) => `- ${kp}`).join('\n')
        : '- Please review updated intranet documentation for full timelines.\n- Direct any immediate questions to your department lead.';

      return res.json({
        title: `[${category}] ${topic}`,
        summary: `Official update regarding ${topic} for the ${department} team. Please review the action items and guidelines below.`,
        content: `### Executive Briefing: ${topic}\n\nThis update provides essential information regarding **${topic}** for the **${department}** department.\n\n#### Key Highlights & Action Items:\n${formattedPoints}\n\n#### Next Steps:\nFor questions or support, please contact your **${department}** representative or submit a ticket via the IT Helpdesk.`,
        tags: [department, category.replace(/\s+/g, ''), 'M365', 'PumexHub'],
        suggestedPriority: category === 'Urgent Alert' ? 'urgent' : 'normal',
      });
    } catch (err: any) {
      console.error('Draft Generation Error:', err);
      res.status(500).json({
        error: 'Failed to generate draft',
        details: err?.message || 'Unknown error',
      });
    }
  });

  // SPFx Manifest & Yeoman config export endpoint
  app.get('/api/spfx-manifest', (req, res) => {
    res.json({
      componentType: 'WebPart',
      id: 'd9e034a1-87b2-4f11-91a3-a712130e9d22',
      alias: 'DepartmentUpdatesWebPart',
      manifestVersion: 2,
      version: '1.0.0',
      title: { default: 'Department Updates & Announcements' },
      description: { default: 'Real-time department news, alerts, and announcements web part.' },
      officeFabricIconFontName: 'News',
      properties: {
        title: 'Department Updates',
        selectedDepartment: 'All',
        displayMode: 'cards',
        itemsPerPage: 6,
        showSearch: true,
        showReactions: true,
        showComments: true,
      },
    });
  });

  // Vite middleware setup (development vs production)
  if (process.env.NODE_ENV !== 'production') {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`SPFx Web Part Dev Server running on http://localhost:${PORT}`);
  });
}

startServer();
