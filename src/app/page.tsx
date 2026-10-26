"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  Book as BookIcon,
  PlusCircle,
  Pencil,
  Trash2,
  Calendar,
  User,
  Search,
  RefreshCw,
  AlertCircle,
  Image as ImageIcon,
} from "lucide-react";
import { Book } from "@/types/book";
import { fetchBooks, deleteBook, getCoverImageUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Card, CardFooter, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";

export default function HomePage() {
  const [books, setBooks] = useState<Book[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const loadBooks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchBooks();
      setBooks(data);
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "ไม่สามารถเชื่อมต่อกับ Backend ได้ (ตรวจสอบว่ารันพอร์ต 3001 แล้วหรือยัง)"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;
    fetchBooks()
      .then((data) => {
        if (isMounted) {
          setBooks(data);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : "ไม่สามารถเชื่อมต่อกับ Backend ได้ (ตรวจสอบว่ารันพอร์ต 3001 แล้วหรือยัง)"
          );
        }
      })
      .finally(() => {
        if (isMounted) {
          setLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (book: Book) => {
    const confirmed = window.confirm(
      `คุณแน่ใจหรือไม่ว่าต้องการลบหนังสือ "${book.title}"?`
    );
    if (!confirmed) return;

    setDeletingId(book.id);
    try {
      await deleteBook(book.id);
      setBooks((prev) => prev.filter((b) => b.id !== book.id));
    } catch (err: unknown) {
      alert(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการลบหนังสือ"
      );
    } finally {
      setDeletingId(null);
    }
  };

  const filteredBooks = books.filter(
    (b) =>
      b.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              คลังหนังสือ (Books)
            </h2>
            <Badge variant="secondary" className="font-semibold text-xs">
              {books.length} เล่ม
            </Badge>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            รายการหนังสือทั้งหมดในระบบ (Read, Update, Delete)
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={loadBooks}
            disabled={loading}
            className="gap-1.5"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? "animate-spin" : ""}`} />
            <span>รีเฟรช</span>
          </Button>

          <Link href="/books/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มหนังสือใหม่ (POST)</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <Input
          placeholder="ค้นหาตามชื่อหนังสือ หรือ ชื่อผู้แต่ง..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white dark:bg-slate-900"
        />
      </div>

      {/* Error Alert */}
      {error && (
        <div className="p-4 rounded-xl border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-3">
          <AlertCircle className="w-5 h-5 shrink-0 mt-0.5" />
          <div className="flex-1">
            <h4 className="font-semibold text-sm">เกิดข้อผิดพลาดในการโหลดข้อมูล</h4>
            <p className="text-sm opacity-90">{error}</p>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={loadBooks}
            className="border-red-300 dark:border-red-800 text-red-700 dark:text-red-300"
          >
            ลองใหม่
          </Button>
        </div>
      )}

      {/* Loading Skeleton */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <Card key={i} className="animate-pulse overflow-hidden">
              <div className="h-56 bg-slate-200 dark:bg-slate-800 w-full" />
              <CardHeader className="p-4 space-y-2">
                <div className="h-5 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
              </CardHeader>
            </Card>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && !error && filteredBooks.length === 0 && (
        <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800">
          <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 mx-auto flex items-center justify-center mb-4">
            <BookIcon className="w-8 h-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
            {searchTerm ? "ไม่พบหนังสือที่ตรงกับคำค้นหา" : "ยังไม่มีหนังสือในระบบ"}
          </h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto mb-6">
            {searchTerm
              ? "ลองค้นหาด้วยคำอื่น หรือล้างช่องค้นหา"
              : "เริ่มต้นเพิ่มหนังสือเล่มแรกพร้อมอัปโหลดรูปภาพหน้าปกได้เลย"}
          </p>
          {!searchTerm && (
            <Link href="/books/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-2">
                <PlusCircle className="w-4 h-4" />
                <span>เพิ่มหนังสือใหม่ (POST)</span>
              </Button>
            </Link>
          )}
        </div>
      )}

      {/* Books Grid */}
      {!loading && !error && filteredBooks.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBooks.map((book) => {
            const coverSrc = getCoverImageUrl(book.coverUrl);
            return (
              <Card
                key={book.id}
                className="overflow-hidden flex flex-col hover:shadow-lg transition-shadow border-slate-200 dark:border-slate-800"
              >
                {/* Book Cover */}
                <div className="relative h-56 w-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800">
                  {coverSrc ? (
                    /* eslint-disable-next-line @next/next/no-img-element */
                    <img
                      src={coverSrc}
                      alt={book.title}
                      className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src =
                          "https://placehold.co/400x560/e2e8f0/64748b?text=Cover+Not+Found";
                      }}
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-2 text-slate-400">
                      <ImageIcon className="w-10 h-10" />
                      <span className="text-xs">ไม่มีรูปปก</span>
                    </div>
                  )}

                  <div className="absolute top-2 right-2">
                    <Badge variant="secondary" className="text-[10px] bg-white/90 dark:bg-slate-900/90 shadow-sm backdrop-blur">
                      ID #{book.id}
                    </Badge>
                  </div>
                </div>

                {/* Book Details */}
                <CardHeader className="p-4 flex-1">
                  <h3
                    className="font-bold text-base text-slate-900 dark:text-slate-100 line-clamp-2 leading-snug mb-2"
                    title={book.title}
                  >
                    {book.title}
                  </h3>
                  <div className="space-y-1 text-xs text-slate-500 dark:text-slate-400">
                    <div className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate font-medium text-slate-700 dark:text-slate-300">
                        {book.author}
                      </span>
                    </div>
                    {book.publishedAt && (
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span>
                          {new Date(book.publishedAt).toLocaleDateString("th-TH", {
                            year: "numeric",
                            month: "short",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                {/* Actions: Edit (PATCH) & Delete */}
                <CardFooter className="p-4 pt-0 flex items-center gap-2">
                  <Link href={`/books/${book.id}/edit`} className="flex-1">
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full gap-1.5 text-xs text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/50 border-slate-200 dark:border-slate-800"
                    >
                      <Pencil className="w-3.5 h-3.5" />
                      <span>แก้ไข (PATCH)</span>
                    </Button>
                  </Link>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDelete(book)}
                    disabled={deletingId === book.id}
                    className="text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/50 border-slate-200 dark:border-slate-800 px-2.5"
                    title="ลบหนังสือ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
