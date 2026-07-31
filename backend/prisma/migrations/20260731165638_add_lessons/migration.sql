/*
  Warnings:

  - You are about to drop the column `date` on the `Lesson` table. All the data in the column will be lost.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Lesson" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "hours" INTEGER NOT NULL,
    "teacher" TEXT NOT NULL,
    "studentId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Lesson_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "Student" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_Lesson" ("hours", "id", "studentId", "teacher", "title") SELECT "hours", "id", "studentId", "teacher", "title" FROM "Lesson";
DROP TABLE "Lesson";
ALTER TABLE "new_Lesson" RENAME TO "Lesson";
CREATE TABLE "new_Student" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "certificateName" TEXT,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "languages" TEXT NOT NULL,
    "packageHours" INTEGER NOT NULL,
    "packagePrice" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_Student" ("certificateName", "createdAt", "email", "fullName", "id", "languages", "packageHours", "packagePrice", "phone", "studentId") SELECT "certificateName", "createdAt", "email", "fullName", "id", "languages", "packageHours", "packagePrice", "phone", "studentId" FROM "Student";
DROP TABLE "Student";
ALTER TABLE "new_Student" RENAME TO "Student";
CREATE UNIQUE INDEX "Student_studentId_key" ON "Student"("studentId");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
