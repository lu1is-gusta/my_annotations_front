export type Category = {
  id: number;
  name: string;
  color: string; // hex color
};

export type Note = {
  id: number;
  title: string;
  content: string; // markdown
  category: Category;
  is_favorite: boolean;
  is_archived: boolean;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
};

export type CreateNotePayload = {
  title: string;
  content: string;
  category_id: number;
};

export type UpdateNotePayload = Partial<CreateNotePayload> & {
  is_favorite?: boolean;
  is_archived?: boolean;
};

export type User = {
  id: number;
  name: string;
  email: string;
  avatar?: string;
};

export type NoteFilter = 'all' | 'favorites' | 'archived' | 'trash';
