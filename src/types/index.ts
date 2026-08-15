export interface Subject {
  id: string;
  name: string;
  code?: string;
  description: string;
  icon?: string;
  color?: string;
  created_at: string;
}

export interface Assignment {
  id: string;
  subject_id: string;
  title: string;
  description?: string;
  pdf_url: string;
  file_name: string;
  file_size?: string;
  created_at: string;
}

export interface UserSession {
  isAdmin: boolean;
  email?: string;
}

export type SortOrder = 'newest' | 'oldest' | 'alphabetical';
