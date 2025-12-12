import { useState } from 'react';
import { X, ArrowRight, Megaphone, Tag, Sparkles, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Announcement } from '@/api/announcements';

interface AnnouncementBannerProps {
  announcement: Announcement;
  onDismiss?: (id: number) => void;
  dismissible?: boolean;
  className?: string;
}

const getAnnouncementIcon = (type: Announcement['announcement_type']) => {
  switch (type) {
    case 'promotion':
      return <Megaphone className="h-5 w-5" />;
    case 'sale':
      return <Tag className="h-5 w-5" />;
    case 'new_arrival':
      return <Sparkles className="h-5 w-5" />;
    case 'warning':
      return <AlertTriangle className="h-5 w-5" />;
    default:
      return <Info className="h-5 w-5" />;
  }
};

const getPriorityAnimation = (priority: Announcement['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'animate-pulse';
    case 'high':
      return 'animate-fade-in';
    default:
      return 'animate-fade-in';
  }
};

export default function AnnouncementBanner({ 
  announcement, 
  onDismiss, 
  dismissible = true,
  className 
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  const handleDismiss = () => {
    setIsVisible(false);
    onDismiss?.(announcement.id);
  };

  if (!isVisible || !announcement.is_currently_active) {
    return null;
  }

  return (
    <div
      className={cn(
        "relative overflow-hidden transition-all duration-300",
        getPriorityAnimation(announcement.priority),
        className
      )}
      style={{
        backgroundColor: announcement.background_color,
        color: announcement.text_color,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Subtle gradient overlay */}
      <div 
        className="absolute inset-0 opacity-10"
        style={{
          background: `linear-gradient(90deg, transparent 0%, ${announcement.text_color} 50%, transparent 100%)`,
        }}
      />
      
      <div className="container relative">
        <div className="flex items-center justify-between gap-4 py-3 px-4 sm:px-0">
          {/* Icon */}
          <div className="flex-shrink-0 opacity-90">
            {getAnnouncementIcon(announcement.announcement_type)}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
            <div className="flex-1 min-w-0">
              <span className="font-semibold text-sm sm:text-base tracking-tight">
                {announcement.title}
              </span>
              {announcement.message && (
                <span className="hidden sm:inline text-sm opacity-90 ml-2">
                  {announcement.message}
                </span>
              )}
            </div>

            {/* CTA Link */}
            {announcement.link_url && announcement.link_text && (
              <a
                href={announcement.link_url}
                className={cn(
                  "inline-flex items-center gap-1.5 text-sm font-medium",
                  "px-4 py-1.5 rounded-full transition-all duration-200",
                  "hover:gap-2 whitespace-nowrap",
                  "border border-current/20 hover:border-current/40",
                  "hover:bg-white/10"
                )}
              >
                {announcement.link_text}
                <ArrowRight className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isHovered && "translate-x-0.5"
                )} />
              </a>
            )}
          </div>

          {/* Dismiss Button */}
          {dismissible && (
            <button
              onClick={handleDismiss}
              className={cn(
                "flex-shrink-0 p-1.5 rounded-full transition-all duration-200",
                "hover:bg-white/10 hover:rotate-90",
                "focus:outline-none focus:ring-2 focus:ring-white/20"
              )}
              aria-label="Dismiss announcement"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>
      </div>

      {/* Mobile message */}
      {announcement.message && (
        <div className="sm:hidden px-4 pb-3 text-xs opacity-90 line-clamp-2">
          {announcement.message}
        </div>
      )}
    </div>
  );
}