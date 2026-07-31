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
    <main className="min-h-screen bg-slate-900 p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              👨‍🎓 Student Management
            </h1>

            <p className="text-slate-400">
              Manage all students
            </p>
          </div>


          <Link
            href="/admin/students/register"
            className="bg-green-600 text-white px-5 py-3 rounded-xl"
          >
            ➕ Register Student
          </Link>

        </div>


        <input
          placeholder="Search name or student ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full mb-8 bg-slate-800 text-white p-4 rounded-xl"
        />


        <div className="grid md:grid-cols-2 gap-6">

          {filteredStudents.map((student) => (

            <div
              key={student.id}
              className="bg-slate-800 rounded-2xl p-6"
            >

              <h2 className="text-xl font-bold text-white">
                {student.fullName}
              </h2>


              <p className="text-blue-400 mt-1">
                🆔 {student.studentId}
              </p>


              <p className="text-slate-300 mt-4">
                🌐 {student.languages || "-"}
              </p>


              <div className="mt-4 space-y-1 text-sm">

                <p className="text-slate-300">
                  📦 Package: {student.packageHours} Hours
                </p>


                <p className="text-yellow-400">
                  ⏱ Used: {student.usedHours} Hours
                </p>


                <p className="text-green-400 font-semibold">
                  ✅ Remaining: {student.remainingHours} Hours
                </p>

              </div>


              <div className="flex gap-3 mt-6">

                <Link
                  href={`/admin/students/${student.studentId}`}
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg"
                >
                  View
                </Link>


                <Link
                  href={`/admin/students/${student.studentId}/edit`}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg"
                >
                  Edit
                </Link>


                <button
                  onClick={() =>
                    deleteStudent(student.studentId)
                  }
                  className="bg-red-600 text-white px-4 py-2 rounded-lg"
                >
                  Delete
                </button>

              </div>

            </div>

          ))}

        </div>

      </div>
    </main>
  );
}