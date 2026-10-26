import { Book, UpdateBookInput } from "@/types/book";

// ใช้ /api/backend เมื่ออยู่บน Client Browser เพื่อแก้ปัญหา CORS ผ่าน Next.js Proxy อัตโนมัติ
export const API_BASE_URL =
  typeof window !== "undefined"
    ? "/api/backend"
    : (process.env.BOOK_URL || "http://localhost:3001").replace(/\/$/, "");

export function getCoverImageUrl(coverUrl: string | null): string | null {
  if (!coverUrl) return null;
  if (coverUrl.startsWith("http://") || coverUrl.startsWith("https://")) {
    return coverUrl;
  }
  // รูปภาพ /uploads/... จะถูกส่งต่อไปยัง Backend ผ่าน Next.js Proxy อัตโนมัติ
  return coverUrl.startsWith("/") ? coverUrl : `/${coverUrl}`;
}

export async function fetchBooks(): Promise<Book[]> {
  const res = await fetch(`${API_BASE_URL}/books`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch books: ${res.statusText}`);
  }
  return res.json();
}

export async function fetchBook(id: number | string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    cache: "no-store",
  });
  if (!res.ok) {
    throw new Error(`Failed to fetch book #${id}: ${res.statusText}`);
  }
  return res.json();
}

export async function createBook(formData: FormData): Promise<unknown> {
  const res = await fetch(`${API_BASE_URL}/books`, {
    method: "POST",
    body: formData,
  });

  if (!res.ok) {
    let errorMsg = `Create book failed: ${res.statusText}`;
    try {
      const err = await res.json();
      if (Array.isArray(err.message)) {
        errorMsg = err.message.join(", ");
      } else if (err.message) {
        errorMsg = err.message;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function updateBook(
  id: number | string,
  data: UpdateBookInput
): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    let errorMsg = `Update book failed: ${res.statusText}`;
    try {
      const err = await res.json();
      if (Array.isArray(err.message)) {
        errorMsg = err.message.join(", ");
      } else if (err.message) {
        errorMsg = err.message;
      }
    } catch {}
    throw new Error(errorMsg);
  }

  return res.json();
}

export async function deleteBook(id: number | string): Promise<Book> {
  const res = await fetch(`${API_BASE_URL}/books/${id}`, {
    method: "DELETE",
  });

  if (!res.ok) {
    throw new Error(`Delete book failed: ${res.statusText}`);
  }

  return res.json();
}
