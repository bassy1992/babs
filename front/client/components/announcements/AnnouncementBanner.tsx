import { useState } from 'react';
import { X, ExternalLink, Megaphone, Tag, Sparkles, Info, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
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
      return <Megaphone className="h-4 w-4" />;
    case 'sale':
      return <Tag className="h-4 w-4" />;
    case 'new_arrival':
      return <Sparkles className="h-4 w-4" />;
    case 'warning':
      return <AlertTriangle className="h-4 w-4" />;
    default:
      return <Info className="h-4 w-4" />;
  }
};

const getPriorityStyles = (priority: Announcement['priority']) => {
  switch (priority) {
    case 'urgent':
      return 'animate-pulse';
    case 'high':
      return 'font-bold';
    default:
      return '';
  }
};

export default function AnnouncementBanner({ 
  announcement, 
  onDismiss, 
  dismissible = true,
  className 
}: AnnouncementBannerProps) {
  const [isVisible, setIsVisible] = useState(true);

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
        "relative flex items-center justify-between px-4 py-3 text-sm",
        getPriorityStyles(announcement.priority),
        className
      )}
      style={{
        backgroundColor: announcement.background_color,
        color: announcement.text_color,
      }}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {getAnnouncementIcon(announcement.announcement_type)}
        
        <div className="flex-1 min-w-0">
          <div className="font-medium truncate">
            {announcement.title}
          </div>
          {announcement.message && (
            <div className="text-xs opacity-90 mt-1 line-clamp-2">
              {announcement.message}
            </div>
          )}
        </div>

        {announcement.link_url && announcement.link_text && (
          <Button
            variant="ghost"
            size="sm"
            asChild
            className="text-current hover:bg-white/10 shrink-0"
          >
            <a
              href={announcement.link_url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1"
            >
              {announcement.link_text}
              <ExternalLink className="h-3 w-3" />
            </a>
          </Button>
        )}
      </div>

      {dismissible && (
        <Button
          variant="ghost"
          size="sm"
          onClick={handleDismiss}
          className="text-current hover:bg-white/10 p-1 h-auto shrink-0 ml-2"
          aria-label="Dismiss announcement"
        >
          <X className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}