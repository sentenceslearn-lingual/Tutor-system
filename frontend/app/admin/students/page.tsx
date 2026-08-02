```tsx
"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    loadStudents();
  }, []);

  async function loadStudents() {
    const studentRes = await fetch(`${API_URL}/students`, {
      cache: "no-store",
    });

    const studentData = await studentRes.json();

    const studentsWithHours = await Promise.all(
      studentData.map(async (student: any) => {
        const lessonRes = await fetch(
          `${API_URL}/lessons/student/${student.studentId}`,
          {
            cache: "no-store",
          },
        );

        const lessonData = await lessonRes.json();

        const usedHours = Array.isArray(lessonData)
          ? lessonData.reduce(
              (sum: number, lesson: any) =>
                sum + Number(lesson.hours || 0),
              0,
            )
          : 0;

        return {
          ...student,
          usedHours,
          remainingHours:
            Number(student.packageHours || 0) - usedHours,
        };
      }),
    );

    setStudents(studentsWithHours);
  }

  async function deleteStudent(id: string) {
    const ok = confirm("Delete this student?");

    if (!ok) return;

    await fetch(`${API_URL}/students/${id}`, {
      method: "DELETE",
    });

    loadStudents();
  }

  const filteredStudents = students.filter(
    (student) =>
      student.fullName
        .toLowerCase()
        .includes(search.toLowerCase()) ||
      student.studentId.includes(search),
  );

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-6 sm:px-6 sm:py-8 md:p-10">
      <div className="mx-auto w-full max-w-6xl">

        {/* Header */}
        <div className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-center sm:justify-between">
          <div className="min-w-0">
            <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
              👨‍🎓 Student Management
            </h1>

            <p className="mt-1 text-sm text-slate-400 sm:text-base">
              Manage all students
            </p>
          </div>

          <Link
            href="/admin/students/register"
            className="inline-flex w-full items-center justify-center rounded-xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
          >
            ➕ Register Student
          </Link>
        </div>

        {/* Search */}
        <input
          type="text"
          placeholder="Search name or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-6 w-full rounded-xl bg-slate-800 p-3.5 text-sm text-white outline-none placeholder:text-slate-500 focus:ring-2 focus:ring-blue-500 sm:mb-8 sm:p-4 sm:text-base"
        />

        {/* Students */}
        <div className="grid grid-cols-1 gap-4 sm:gap-5 md:grid-cols-2 md:gap-6">
          {filteredStudents.map((student) => (
            <div
              key={student.id}
              className="min-w-0 rounded-2xl bg-slate-800 p-5 sm:p-6"
            >
              <h2 className="break-words text-lg font-bold text-white sm:text-xl">
                {student.fullName}
              </h2>

              <p className="mt-1 break-all text-sm text-blue-400 sm:text-base">
                🆔 {student.studentId}
              </p>

              <p className="mt-4 break-words text-sm text-slate-300 sm:text-base">
                🌐 {student.languages || "-"}
              </p>

              <div className="mt-4 space-y-1 text-sm">
                <p className="text-slate-300">
                  📦 Package: {student.packageHours} Hours
                </p>

                <p className="text-yellow-400">
                  ⏱ Used: {student.usedHours} Hours
                </p>

                <p className="font-semibold text-green-400">
                  ✅ Remaining: {student.remainingHours} Hours
                </p>
              </div>

              {/* Actions */}
              <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-3 sm:gap-3">
                <Link
                  href={`/admin/students/${student.studentId}`}
                  className="inline-flex items-center justify-center rounded-lg bg-purple-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-purple-700"
                >
                  View
                </Link>

                <Link
                  href={`/admin/students/${student.studentId}/edit`}
                  className="inline-flex items-center justify-center rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700"
                >
                  Edit
                </Link>

                <button
                  onClick={() =>
                    deleteStudent(student.studentId)
                  }
                  className="inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white transition hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredStudents.length === 0 && (
          <div className="rounded-2xl bg-slate-800 p-8 text-center text-sm text-slate-400">
            No students found.
          </div>
        )}
      </div>
    </main>
  );
}
```
