import React, { useState } from 'react';
import {
  X,
  ThumbsUp,
  PartyPopper,
  AlertCircle,
  MessageSquare,
  Eye,
  Calendar,
  Tag,
  Paperclip,
  Share2,
  Bookmark,
  Send,
  User,
  Check,
  Building2,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { Announcement } from '../../types';
import {
  getDepartmentBadgeColor,
  getPriorityBadge,
  formatRelativeTime,
} from '../../utils/spfxHelpers';

interface AnnouncementDetailModalProps {
  announcement: Announcement | null;
  onClose: () => void;
  onAddReaction: (id: string, type: 'like' | 'celebrate' | 'important') => void;
  onAddComment: (id: string, text: string) => void;
}

export const AnnouncementDetailModal: React.FC<AnnouncementDetailModalProps> = ({
  announcement,
  onClose,
  onAddReaction,
  onAddComment,
}) => {
  const [commentText, setCommentText] = useState('');
  const [copiedLink, setCopiedLink] = useState(false);
  const [isBookmarked, setIsBookmarked] = useState(false);

  if (!announcement) return null;

  const priorityInfo = getPriorityBadge(announcement.priority);
  const deptBadgeColor = getDepartmentBadgeColor(announcement.department);

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;
    onAddComment(announcement.id, commentText.trim());
    setCommentText('');
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-2xl w-full max-w-3xl flex flex-col max-h-[90vh] overflow-hidden">
        {/* Banner Image Header (if exists) */}
        {announcement.bannerImageUrl ? (
          <div className="relative h-48 sm:h-56 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
            <img
              src={announcement.bannerImageUrl}
              alt={announcement.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/40 to-transparent" />
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-900/60 hover:bg-slate-900 text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <span
                  className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${deptBadgeColor}`}
                >
                  {announcement.department}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${priorityInfo.className}`}
                >
                  {priorityInfo.label}
                </span>
                <span className="text-[11px] bg-slate-800/80 text-slate-200 px-2 py-0.5 rounded font-medium">
                  {announcement.category}
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-bold leading-tight drop-shadow-md">
                {announcement.title}
              </h2>
            </div>
          </div>
        ) : (
          <div className="p-4 sm:p-6 bg-[#0078d4] text-white flex items-start justify-between border-b border-[#005a9e]">
            <div className="space-y-2 max-w-2xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                  {announcement.department}
                </span>
                <span
                  className={`text-[11px] font-semibold px-2 py-0.5 rounded ${priorityInfo.className}`}
                >
                  {priorityInfo.label}
                </span>
                <span className="text-[11px] bg-sky-900/40 text-sky-100 px-2 py-0.5 rounded">
                  {announcement.category}
                </span>
              </div>
              <h2 className="text-xl font-bold leading-snug">{announcement.title}</h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/20 transition-colors text-white"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        )}

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
          {/* Author Persona & Metadata Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-3">
              <img
                src={announcement.author.avatar}
                alt={announcement.author.name}
                className="w-10 h-10 rounded-full object-cover border border-slate-300 dark:border-slate-700"
              />
              <div>
                <h4 className="font-semibold text-slate-900 dark:text-slate-100 text-sm">
                  {announcement.author.name}
                </h4>
                <p className="text-slate-500">{announcement.author.title}</p>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-500 text-xs">
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" />
                {formatRelativeTime(announcement.createdAt)}
              </span>
              <span className="flex items-center gap-1">
                <Eye className="w-3.5 h-3.5" />
                {announcement.viewsCount} views
              </span>
            </div>
          </div>

          {/* Executive Summary Callout */}
          <div className="p-3.5 bg-sky-50 dark:bg-sky-950/30 border-l-4 border-[#0078d4] text-slate-800 dark:text-slate-200 text-xs sm:text-sm font-medium leading-relaxed rounded-r-lg">
            <span className="font-semibold text-[#0078d4] block mb-1">Executive Summary:</span>
            {announcement.summary}
          </div>

          {/* Main Body Content */}
          <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm text-slate-800 dark:text-slate-200 whitespace-pre-line leading-relaxed">
            {announcement.content}
          </div>

          {/* Attachments Section (if present) */}
          {announcement.attachments && announcement.attachments.length > 0 && (
            <div className="pt-3 border-t border-slate-200 dark:border-slate-800">
              <h4 className="text-xs font-semibold text-slate-900 dark:text-slate-100 mb-2 flex items-center gap-1.5">
                <Paperclip className="w-3.5 h-3.5 text-[#0078d4]" />
                Attached Documents ({announcement.attachments.length})
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {announcement.attachments.map((att) => (
                  <a
                    key={att.id}
                    href={att.url}
                    onClick={(e) => e.preventDefault()}
                    className="p-2.5 bg-slate-50 dark:bg-slate-800/80 hover:bg-slate-100 rounded-lg border border-slate-200 dark:border-slate-700 flex items-center justify-between text-xs transition-colors group"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <div className="w-7 h-7 rounded bg-red-100 dark:bg-red-950 text-red-600 font-bold flex items-center justify-center text-[10px]">
                        PDF
                      </div>
                      <div className="truncate">
                        <p className="font-medium text-slate-900 dark:text-slate-100 truncate group-hover:text-[#0078d4]">
                          {att.name}
                        </p>
                        <p className="text-[10px] text-slate-500">{att.size}</p>
                      </div>
                    </div>
                    <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-[#0078d4]" />
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Tags */}
          <div className="flex flex-wrap items-center gap-1.5 pt-2">
            <Tag className="w-3.5 h-3.5 text-slate-400" />
            {announcement.tags.map((tag) => (
              <span
                key={tag}
                className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded text-[11px] font-mono"
              >
                #{tag}
              </span>
            ))}
          </div>

          {/* Reactions & Sharing Bar */}
          <div className="p-3 bg-slate-50 dark:bg-slate-800/80 rounded-lg border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <button
                onClick={() => onAddReaction(announcement.id, 'like')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-sky-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                <span>Like</span>
                <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {announcement.reactions.like}
                </span>
              </button>

              <button
                onClick={() => onAddReaction(announcement.id, 'celebrate')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-purple-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                <PartyPopper className="w-3.5 h-3.5 text-purple-600" />
                <span>Celebrate</span>
                <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {announcement.reactions.celebrate}
                </span>
              </button>

              <button
                onClick={() => onAddReaction(announcement.id, 'important')}
                className="flex items-center gap-1.5 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-amber-50 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-full text-xs font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                <span>Important</span>
                <span className="bg-slate-100 dark:bg-slate-700 px-1.5 py-0.5 rounded-full text-[10px] font-bold">
                  {announcement.reactions.important}
                </span>
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={`p-2 rounded-full border transition-colors ${
                  isBookmarked
                    ? 'bg-amber-100 border-amber-300 text-amber-800'
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600'
                }`}
                title="Bookmark for Later"
              >
                <Bookmark className="w-4 h-4" />
              </button>

              <button
                onClick={handleCopyLink}
                className="flex items-center gap-1 px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-slate-100 border border-slate-200 dark:border-slate-700 rounded-md font-medium text-slate-700 dark:text-slate-200 transition-colors"
              >
                {copiedLink ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Share2 className="w-3.5 h-3.5" />}
                <span>{copiedLink ? 'Link Copied' : 'Share'}</span>
              </button>
            </div>
          </div>

          {/* Comments Section */}
          <div className="space-y-4 pt-2">
            <h4 className="font-semibold text-sm text-slate-900 dark:text-slate-100 flex items-center gap-2">
              <MessageSquare className="w-4 h-4 text-[#0078d4]" />
              Employee Comments ({announcement.comments.length})
            </h4>

            {/* Comments List */}
            <div className="space-y-3">
              {announcement.comments.length === 0 ? (
                <p className="text-xs text-slate-500 italic bg-slate-50 dark:bg-slate-800/40 p-3 rounded text-center">
                  No comments yet. Be the first to start the discussion!
                </p>
              ) : (
                announcement.comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-800 text-xs space-y-1"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <img
                          src={comment.authorAvatar}
                          alt={comment.authorName}
                          className="w-5 h-5 rounded-full object-cover"
                        />
                        <span className="font-semibold text-slate-900 dark:text-slate-100">
                          {comment.authorName}
                        </span>
                      </div>
                      <span className="text-[10px] text-slate-500">
                        {formatRelativeTime(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-slate-700 dark:text-slate-300 pl-7">{comment.text}</p>
                  </div>
                ))
              )}
            </div>

            {/* Comment Form */}
            <form onSubmit={handleCommentSubmit} className="flex gap-2">
              <input
                type="text"
                placeholder="Write a comment or reply to team..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                className="flex-1 px-3 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-lg text-xs focus:ring-1 focus:ring-[#0078d4] focus:outline-none"
              />
              <button
                type="submit"
                disabled={!commentText.trim()}
                className="px-4 py-2 bg-[#0078d4] hover:bg-[#106ebe] disabled:opacity-50 text-white rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                Post
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
