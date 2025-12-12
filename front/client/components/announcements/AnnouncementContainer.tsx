import { useQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';
import { announcementsApi, type Announcement } from '@/api/announcements';
import AnnouncementBanner from './AnnouncementBanner';
import { cn } from '@/lib/utils';

interface AnnouncementContainerProps {
  pageType?: 'homepage' | 'shop' | 'all';
  className?: string;
  maxAnnouncements?: number;
  dismissible?: boolean;
}

export default function AnnouncementContainer({ 
  pageType,
  className,
  maxAnnouncements = 3,
  dismissible = true
}: AnnouncementContainerProps) {
  const [dismissedIds, setDismissedIds] = useState<Set<number>>(new Set());

  // Load dismissed announcements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('dismissedAnnouncements');
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setDismissedIds(new Set(parsed));
      } catch (error) {
        console.error('Failed to parse dismissed announcements:', error);
      }
    }
  }, []);

  const { data: announcements = [], isLoading, error } = useQuery({
    queryKey: ['announcements', pageType],
    queryFn: async () => {
      if (pageType) {
        const response = await announcementsApi.getByPage(pageType);
        return response.announcements;
      }
      return announcementsApi.getAll();
    },
    refetchInterval: 5 * 60 * 1000, // Refetch every 5 minutes
    staleTime: 2 * 60 * 1000, // Consider data stale after 2 minutes
  });

  const handleDismiss = (id: number) => {
    const newDismissedIds = new Set(dismissedIds);
    newDismissedIds.add(id);
    setDismissedIds(newDismissedIds);
    
    // Save to localStorage
    localStorage.setItem(
      'dismissedAnnouncements', 
      JSON.stringify(Array.from(newDismissedIds))
    );
  };

  if (isLoading || error || !announcements.length) {
    return null;
  }

  // Filter out dismissed announcements and limit the number shown
  const visibleAnnouncements = announcements
    .filter(announcement => !dismissedIds.has(announcement.id))
    .slice(0, maxAnnouncements);

  if (!visibleAnnouncements.length) {
    return null;
  }

  return (
    <div className={cn("space-y-0", className)}>
      {visibleAnnouncements.map((announcement) => (
        <AnnouncementBanner
          key={announcement.id}
          announcement={announcement}
          onDismiss={dismissible ? handleDismiss : undefined}
          dismissible={dismissible}
        />
      ))}
    </div>
  );
}