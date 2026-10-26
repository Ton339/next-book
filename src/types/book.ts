export interface Book {
  id: number;
  title: string;
  author: string;
  publishedAt: string;
  coverUrl: string | null;
}

export interface CreateBookInput {
  title: string;
  author: string;
  cover?: File | null;
}

export interface UpdateBookInput {
  title?: string;
  author?: string;
}
