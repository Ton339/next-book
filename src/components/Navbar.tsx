import Link from "next/link";
import { BookOpen, PlusCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-10 h-10 rounded-lg bg-blue-600 text-white flex items-center justify-center shadow-md shadow-blue-500/20 group-hover:bg-blue-700 transition-colors">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <h1 className="font-bold text-lg text-slate-900 dark:text-slate-100 leading-tight">
              Book Manager
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              CRUD & Cover Upload
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <Link href="/books/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white gap-1.5 shadow-sm">
              <PlusCircle className="w-4 h-4" />
              <span>เพิ่มหนังสือใหม่ (POST)</span>
            </Button>
          </Link>
        </div>
      </div>
    </header>
  );
}
