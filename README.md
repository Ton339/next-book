# 📚 Next-Book (Frontend)

ระบบหน้าบ้านสำหรับจัดการคลังหนังสือ (**Book Management Frontend**) พัฒนาด้วย **Next.js 16 (App Router)**, **React 19**, **Tailwind CSS v4** และ **shadcn/ui** เชื่อมต่อกับ Backend **books-observer** (NestJS + Prisma SQLite)

---

## 📌 ฟังก์ชันการทำงานหลัก (Key Features)

* **📖 ระบบคลังหนังสือ (Read):**
  * แสดงรายการหนังสือทั้งหมดในระบบในรูปแบบ Card Grid สวยงาม ทันสมัย
  * ค้นหาหนังสือแบบ Real-time ตามชื่อหนังสือ หรือ ชื่อผู้แต่ง
  * แสดงภาพหน้าปกหนังสือ (Cover Image) พร้อม Placeholder กรณีหนังสือไม่มีรูปปก
  * ป้องกันปัญหา Hydration Warning จาก Browser Extension อัตโนมัติ

* **➕ เพิ่มหนังสือใหม่ & อัปโหลดรูปภาพ (Create / POST):**
  * แยกหน้าทำงานเฉพาะที่ [`/books/new`](src/app/books/new/page.tsx)
  * รองรับการอัปโหลดไฟล์รูปภาพหน้าปก (`cover`) นามสกุล `.jpg`, `.jpeg`, `.png`, `.webp` (ขนาดไม่เกิน 5MB)
  * มีระบบ **Live Image Preview** แสดงตัวอย่างรูปภาพทันทีที่เลือก พร้อมปุ่มลบ/เปลี่ยนรูป
  * ตรวจสอบชนิดและขนาดไฟล์ก่อนส่ง Request ไปยัง Backend
  * *(ตัดระบบรีวิวออกตามเงื่อนไข)*

* **✏️ แก้ไขข้อมูลหนังสือ (Update / PATCH):**
  * แยกหน้าทำงานเฉพาะที่ [`/books/[id]/edit`](src/app/books/[id]/edit/page.tsx)
  * โหลดข้อมูลเดิมของหนังสือ (ชื่อหนังสือ, ชื่อผู้แต่ง, รูปภาพปัจจุบัน) อัตโนมัติ
  * ส่งคำสั่งอัปเดตผ่าน `PATCH /books/:id`

* **🗑️ ลบหนังสือ (Delete):**
  * ปุ่มลบหนังสือในหน้ารายการ พร้อมกล่องข้อความยืนยันการลบ (Confirmation)
  * อัปเดตรายการหนังสือบนหน้าจอทันทีเมื่อลบสำเร็จ

* **⚡ Reverse Proxy (No CORS):**
  * ใช้ Next.js Rewrites เป็นตัวกลางเชื่อมต่อกับ Backend (Port 3001) ทำให้หมดปัญหาเรื่อง **CORS (Cross-Origin Resource Sharing)** โดยสมบูรณ์

---

## 🧭 โครงสร้างหน้าเว็บ (Page Routes)

| Path | วิธีการ (Method) | คำอธิบาย |
| :--- | :--- | :--- |
| `/` | `GET /books`<br>`DELETE /books/:id` | หน้ารายการหนังสือทั้งหมด, ช่องค้นหา และปุ่มลบหนังสือ |
| `/books/new` | `POST /books` | หน้าสำหรับสร้างหนังสือใหม่พร้อมอัปโหลดรูปภาพหน้าปก |
| `/books/[id]/edit` | `PATCH /books/:id` | หน้าสำหรับแก้ไขชื่อหนังสือและชื่อผู้แต่ง |

---

## 🛠️ เทคโนโลยีที่ใช้ (Tech Stack)

* **Framework:** Next.js 16 (App Router, Turbopack)
* **Library:** React 19
* **Language:** TypeScript 5
* **Styling:** Tailwind CSS v4
* **UI Components:** shadcn/ui (`Button`, `Card`, `Input`, `Badge`, `Label`)
* **Icons:** Lucide React

---

## ⚙️ การติดตั้งและเริ่มใช้งาน (Installation & Setup)

### 1. ติดตั้ง Dependencies
```bash
npm install
```

### 2. ตั้งค่า Environment Variables (`.env`)
ตรวจสอบหรือสร้างไฟล์ `.env` ที่ Root ของโปรเจกต์:
```env
FRONT_PORT=3000
BOOK_PORT=3001
NEXT_PUBLIC_BOOK_URL=http://localhost:3001
```

> **หมายเหตุ:** Next.js มีการตั้งค่า Reverse Proxy ใน `next.config.ts` ให้ส่งต่อไปยัง Backend Port 3001 อัตโนมัติ ทำให้หมดปัญหา CORS

### 3. สั่งรันโปรเจกต์ (Development Mode)
```bash
npm run dev
```

เปิดเบราว์เซอร์แล้วเข้าใช้งานที่: [http://localhost:3000](http://localhost:3000)

### 4. Build สำหรับ Production
```bash
npm run build
npm run start
```
