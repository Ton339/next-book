"use client";

import { Suspense, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  AlertCircle,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";
import { fetchBook, updateBook, getCoverImageUrl } from "@/lib/api";
import { Book } from "@/types/book";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

function EditBookForm() {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [book, setBook] = useState<Book | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");

  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    let isMounted = true;

    fetchBook(id)
      .then((data) => {
        if (isMounted) {
          setBook(data);
          setTitle(data.title);
          setAuthor(data.author);
          setError(null);
        }
      })
      .catch((err: unknown) => {
        if (isMounted) {
          setError(
            err instanceof Error
              ? err.message
              : `ไม่สามารถโหลดข้อมูลหนังสือ ID: ${id}`
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
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("กรุณากรอกชื่อหนังสือและชื่อผู้แต่ง");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      await updateBook(id, {
        title: title.trim(),
        author: author.trim(),
      });

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error
          ? err.message
          : "เกิดข้อผิดพลาดในการอัปเดตข้อมูลหนังสือ"
      );
      setSubmitting(false);
    }
  };

  const coverSrc = book ? getCoverImageUrl(book.coverUrl) : null;

  return (
    <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
      <CardHeader>
        <CardTitle className="text-2xl font-bold flex items-center gap-2">
          <span>แก้ไขข้อมูลหนังสือ</span>
          <span className="text-xs px-2.5 py-1 rounded bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300 font-mono font-medium">
            PATCH /books/{id}
          </span>
        </CardTitle>
        <CardDescription>
          แก้ไขชื่อเรื่องหรือชื่อผู้แต่งของหนังสือในระบบ
        </CardDescription>
      </CardHeader>

      {loading ? (
        <CardContent className="py-12 flex flex-col items-center justify-center gap-3">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
          <p className="text-sm text-slate-500">กำลังโหลดข้อมูลหนังสือ ID #{id}...</p>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-4">
              <div className="w-16 h-22 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700 flex items-center justify-center">
                {coverSrc ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={coverSrc}
                    alt={book?.title}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src =
                        "https://placehold.co/400x560/e2e8f0/64748b?text=No+Cover";
                    }}
                  />
                ) : (
                  <ImageIcon className="w-6 h-6 text-slate-400" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs text-slate-500 dark:text-slate-400">รูปภาพหน้าปกปัจจุบัน</p>
                <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {book?.coverUrl ? book.coverUrl.split("/").pop() : "ไม่มีรูปปก"}
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  ID หนังสือ: #{book?.id}
                </p>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title">
                ชื่อหนังสือ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="ชื่อหนังสือ"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="author">
                ชื่อผู้แต่ง <span className="text-red-500">*</span>
              </Label>
              <Input
                id="author"
                placeholder="ชื่อผู้แต่ง"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                disabled={submitting}
              />
            </div>
          </CardContent>

          <CardFooter className="flex items-center justify-end gap-3 border-t border-slate-100 dark:border-slate-800 pt-4">
            <Link href="/">
              <Button type="button" variant="outline" disabled={submitting}>
                ยกเลิก
              </Button>
            </Link>

            <Button
              type="submit"
              disabled={submitting}
              className="bg-amber-600 hover:bg-amber-700 text-white min-w-[130px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>กำลังอัปเดต...</span>
                </>
              ) : (
                <span>อัปเดตข้อมูล (PATCH)</span>
              )}
            </Button>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}

export default function EditBookPage() {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div>
        <Link href="/">
          <Button variant="ghost" size="sm" className="gap-2 text-slate-600 dark:text-slate-400">
            <ArrowLeft className="w-4 h-4" />
            <span>ย้อนกลับไปหน้ารายการ</span>
          </Button>
        </Link>
      </div>

      <Suspense
        fallback={
          <Card className="p-12 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
            <p className="text-sm text-slate-500">กำลังเตรียมหน้าแก้ไขข้อมูล...</p>
          </Card>
        }
      >
        <EditBookForm />
      </Suspense>
    </div>
  );
}
