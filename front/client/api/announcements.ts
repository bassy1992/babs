const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

export interface Announcement {
  id: number;
  title: string;
  message: string;
  announcement_type: 'promotion' | 'sale' | 'new_arrival' | 'info' | 'warning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  is_active: boolean;
  is_currently_active: boolean;
  show_on_homepage: boolean;
  show_on_shop: boolean;
  show_on_all_pages: boolean;
  background_color: string;
  text_color: string;
  link_url?: string;
  link_text?: string;
  start_date: string;
  end_date?: string;
  created_at: string;
}

export interface AnnouncementsResponse {
  announcements: Announcement[];
  count: number;
}

export const announcementsApi = {
  // Get all active announcements
  getAll: async (pageType?: string): Promise<Announcement[]> => {
    const url = pageType 
      ? `${API_BASE_URL}/api/announcements/?page=${pageType}`
      : `${API_BASE_URL}/api/announcements/`;
    
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error('Failed to fetch announcements');
    }
    return response.json();
  },

  // Get announcements for specific page type
  getByPage: async (pageType: 'homepage' | 'shop' | 'all'): Promise<AnnouncementsResponse> => {
    const response = await fetch(`${API_BASE_URL}/api/announcements/${pageType}/`);
    if (!response.ok) {
      throw new Error(`Failed to fetch announcements for ${pageType}`);
    }
    return response.json();
  }
};