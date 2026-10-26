"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  ArrowLeft,
  UploadCloud,
  X,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { createBook } from "@/lib/api";
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

export default function CreateBookPage() {
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (file: File | null) => {
    setError(null);
    if (!file) {
      setCoverFile(null);
      setPreviewUrl(null);
      return;
    }

    const validTypes = ["image/jpeg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      setError("รองรับเฉพาะไฟล์รูปภาพ .jpg, .jpeg, .png, .webp เท่านั้น");
      return;
    }

    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      setError("ขนาดไฟล์ต้องไม่เกิน 5 MB");
      return;
    }

    setCoverFile(file);
    const objectUrl = URL.createObjectURL(file);
    setPreviewUrl(objectUrl);
  };

  const handleRemoveFile = () => {
    setCoverFile(null);
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
      setPreviewUrl(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("กรุณากรอกชื่อหนังสือและชื่อผู้แต่ง");
      return;
    }

    setSubmitting(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append("title", title.trim());
      formData.append("author", author.trim());

      if (coverFile) {
        formData.append("cover", coverFile);
      }

      await createBook(formData);

      router.push("/");
      router.refresh();
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "เกิดข้อผิดพลาดในการสร้างหนังสือ"
      );
      setSubmitting(false);
    }
  };

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

      <Card className="border-slate-200 dark:border-slate-800 shadow-sm">
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <span>เพิ่มหนังสือใหม่</span>
            <span className="text-xs px-2.5 py-1 rounded bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 font-mono font-medium">
              POST /books
            </span>
          </CardTitle>
          <CardDescription>
            กรอกรายละเอียดหนังสือและอัปโหลดรูปภาพหน้าปก (ไฟล์ .jpg, .png, .webp ไม่เกิน 5MB)
          </CardDescription>
        </CardHeader>

        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-5">
            {error && (
              <div className="p-3.5 rounded-lg border border-red-200 dark:border-red-900 bg-red-50 dark:bg-red-950/40 text-red-700 dark:text-red-300 flex items-start gap-2.5 text-sm">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="title">
                ชื่อหนังสือ <span className="text-red-500">*</span>
              </Label>
              <Input
                id="title"
                placeholder="เช่น Clean Code, Pragmatic Programmer"
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
                placeholder="เช่น Robert C. Martin"
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                required
                disabled={submitting}
              />
            </div>

            <div className="space-y-2">
              <Label>รูปภาพหน้าปก (Cover Image)</Label>

              {!previewUrl ? (
                <label className="border-2 border-dashed border-slate-300 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer transition-colors bg-slate-50/50 dark:bg-slate-900/50">
                  <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center">
                    <UploadCloud className="w-6 h-6" />
                  </div>
                  <div className="text-center">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200">
                      คลิกเพื่อเลือกรูปภาพหน้าปก หรือลากไฟล์มาวาง
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                      PNG, JPG, JPEG, WEBP (ขนาดไม่เกิน 5MB)
                    </p>
                  </div>
                  <input
                    type="file"
                    accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
                    className="hidden"
                    disabled={submitting}
                    onChange={(e) => {
                      const file = e.target.files?.[0] || null;
                      handleFileChange(file);
                    }}
                  />
                </label>
              ) : (
                <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center gap-4">
                  <div className="w-20 h-28 rounded-lg overflow-hidden bg-slate-200 dark:bg-slate-800 shrink-0 border border-slate-200 dark:border-slate-700">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-medium mb-1">
                      <CheckCircle className="w-3.5 h-3.5" />
                      <span>เลือกรูปภาพเรียบร้อย</span>
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                      {coverFile?.name}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                      {coverFile ? (coverFile.size / (1024 * 1024)).toFixed(2) : 0} MB
                    </p>
                  </div>

                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleRemoveFile}
                    disabled={submitting}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/50"
                  >
                    <X className="w-4 h-4 mr-1" />
                    <span>ลบรูป</span>
                  </Button>
                </div>
              )}
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
              className="bg-blue-600 hover:bg-blue-700 text-white min-w-[130px]"
            >
              {submitting ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                  <span>กำลังบันทึก...</span>
                </>
              ) : (
                <span>บันทึกหนังสือ (POST)</span>
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
