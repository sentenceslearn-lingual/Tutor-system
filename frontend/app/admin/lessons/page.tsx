"use client";

import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { API_URL } from "@/lib/api";

function LessonsPageContent() {
  const searchParams = useSearchParams();

  const studentIdFromUrl = searchParams.get("studentId");

  const [students, setStudents] = useState<any[]>([]);
  const [tutors, setTutors] = useState<any[]>([]);

  const [studentId, setStudentId] = useState("");
  const [tutorId, setTutorId] = useState("");

  const [lessons, setLessons] = useState<any[]>([]);

  const [title, setTitle] = useState("");
  const [teacher, setTeacher] = useState("");
  const [hours, setHours] = useState("");

  const [editId, setEditId] = useState<number | null>(null);

  const [loadingStudents, setLoadingStudents] = useState(true);
  const [loadingTutors, setLoadingTutors] = useState(true);

  useEffect(() => {
    loadStudents();
    loadTutors();
  }, []);

  useEffect(() => {
    if (studentIdFromUrl) {
      setStudentId(studentIdFromUrl);
      loadLessons(studentIdFromUrl);
    }
  }, [studentIdFromUrl]);

  async function loadStudents() {
    try {
      setLoadingStudents(true);

      const res = await fetch(`${API_URL}/students`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load students");
      }

      const data = await res.json();

      setStudents(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Cannot load students:", error);
      setStudents([]);
    } finally {
      setLoadingStudents(false);
    }
  }

  async function loadTutors() {
    try {
      setLoadingTutors(true);

      const res = await fetch(`${API_URL}/tutors`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Failed to load tutors");
      }

      const data = await res.json();

      setTutors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Cannot load tutors:", error);
      setTutors([]);
    } finally {
      setLoadingTutors(false);
    }
  }

  async function loadLessons(id: string) {
    if (!id) {
      setLessons([]);
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/lessons/student/${id}`,
        {
          cache: "no-store",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to load lessons");
      }

      const data = await res.json();

      setLessons(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Cannot load lessons:", error);
      setLessons([]);
    }
  }

  async function saveLesson() {
    if (!studentId) {
      alert("Please select a student.");
      return;
    }

    if (!title.trim()) {
      alert("Please enter a lesson title.");
      return;
    }

    if (!teacher.trim()) {
      alert("Please enter the teacher name.");
      return;
    }

    if (!hours || Number(hours) <= 0) {
      alert("Please enter valid lesson hours.");
      return;
    }

    if (!tutorId) {
      alert("Please select a tutor.");
      return;
    }

    const url = editId
      ? `${API_URL}/lessons/${editId}`
      : `${API_URL}/lessons`;

    const method = editId ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title: title.trim(),
          teacher: teacher.trim(),
          hours: Number(hours),
          studentId,
          tutorId: Number(tutorId),
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to save lesson");
      }

      clearForm();

      await loadLessons(studentId);
    } catch (error) {
      console.error("Cannot save lesson:", error);
      alert("Cannot save lesson.");
    }
  }

  function editLesson(lesson: any) {
    setEditId(lesson.id);
    setTitle(lesson.title || "");
    setTeacher(lesson.teacher || "");
    setHours(String(lesson.hours || ""));

    setTutorId(
      lesson.tutorId
        ? String(lesson.tutorId)
        : lesson.tutor?.id
          ? String(lesson.tutor.id)
          : ""
    );
  }

  function clearForm() {
    setTitle("");
    setTeacher("");
    setHours("");
    setTutorId("");
    setEditId(null);
  }

  async function deleteLesson(id: number) {
    const ok = confirm(
      "Are you sure you want to delete this lesson?"
    );

    if (!ok) {
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/lessons/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!res.ok) {
        throw new Error("Failed to delete lesson");
      }

      await loadLessons(studentId);
    } catch (error) {
      console.error("Cannot delete lesson:", error);
      alert("Cannot delete lesson.");
    }
  }

  const selectedStudent = students.find(
    (student) => student.studentId === studentId
  );

  return (
    <main className="min-h-screen bg-slate-900 px-4 py-6 sm:px-6 sm:py-8 md:p-10">
      <div className="mx-auto w-full max-w-5xl">

        {/* Page Header */}
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl font-bold leading-tight text-white sm:text-3xl md:text-4xl">
            Lesson Management
          </h1>

          <p className="mt-2 text-sm leading-relaxed text-slate-400 sm:text-base">
            Manage student lessons and tutor assignments.
          </p>
        </div>

        {/* Student Selection */}
        <div className="mb-6 rounded-2xl bg-slate-800 p-4 sm:mb-8 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-white sm:mb-5 sm:text-xl">
            Student
          </h2>

          <select
            value={studentId}
            onChange={(e) => {
              const value = e.target.value;

              setStudentId(value);
              clearForm();

              if (value) {
                loadLessons(value);
              } else {
                setLessons([]);
              }
            }}
            disabled={loadingStudents}
            className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
          >
            <option value="">
              {loadingStudents
                ? "Loading students..."
                : "Select a student"}
            </option>

            {students.map((student) => (
              <option
                key={student.id}
                value={student.studentId}
              >
                {student.fullName} ({student.studentId})
              </option>
            ))}
          </select>

          {selectedStudent && (
            <div className="mt-4 rounded-xl bg-slate-700 p-4">
              <p className="break-words text-sm text-slate-300 sm:text-base">
                Name:
                <span className="ml-2 font-bold text-white">
                  {selectedStudent.fullName}
                </span>
              </p>

              <p className="mt-2 break-all text-sm text-slate-300 sm:text-base">
                Student ID:
                <span className="ml-2 font-bold text-blue-400">
                  {selectedStudent.studentId}
                </span>
              </p>
            </div>
          )}
        </div>

        {/* Add / Edit Lesson */}
        <div className="mb-6 rounded-2xl bg-slate-800 p-4 sm:mb-8 sm:p-6">
          <h2 className="mb-4 text-lg font-bold text-white sm:mb-5 sm:text-xl">
            {editId ? "Edit Lesson" : "Add New Lesson"}
          </h2>

          <div className="grid gap-3 sm:gap-4">

            <input
              placeholder="Lesson title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 sm:text-base"
            />

            <input
              placeholder="Teacher"
              value={teacher}
              onChange={(e) => setTeacher(e.target.value)}
              className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 sm:text-base"
            />

            <select
              value={tutorId}
              onChange={(e) => setTutorId(e.target.value)}
              disabled={loadingTutors}
              className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-sm text-white outline-none focus:ring-2 focus:ring-blue-500 sm:text-base"
            >
              <option value="">
                {loadingTutors
                  ? "Loading tutors..."
                  : "Select a tutor"}
              </option>

              {tutors.map((tutor) => (
                <option
                  key={tutor.id}
                  value={tutor.id}
                >
                  {tutor.name}
                  {tutor.languages
                    ? ` — ${tutor.languages}`
                    : ""}
                </option>
              ))}
            </select>

            <input
              placeholder="Hours"
              type="number"
              min="0.5"
              step="0.5"
              value={hours}
              onChange={(e) => setHours(e.target.value)}
              className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-sm text-white outline-none placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 sm:text-base"
            />

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">

              <button
                type="button"
                onClick={saveLesson}
                className="w-full rounded-lg bg-blue-600 p-3 text-sm font-bold text-white transition hover:bg-blue-700 sm:text-base"
              >
                {editId ? "Save Changes" : "Add Lesson"}
              </button>

              {editId && (
                <button
                  type="button"
                  onClick={clearForm}
                  className="w-full rounded-lg bg-slate-600 p-3 text-sm font-bold text-white transition hover:bg-slate-500 sm:text-base"
                >
                  Cancel
                </button>
              )}

            </div>
          </div>
        </div>

        {/* Lesson History */}
        <div className="rounded-2xl bg-slate-800 p-4 sm:p-6">

          <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

            <h2 className="text-lg font-bold text-white sm:text-xl">
              Lesson History ({lessons.length})
            </h2>

            <button
              type="button"
              onClick={() => loadLessons(studentId)}
              className="w-full rounded-lg bg-green-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-green-700 sm:w-auto"
            >
              Refresh
            </button>

          </div>

          {!studentId ? (
            <p className="text-sm text-slate-400 sm:text-base">
              Select a student to view lessons.
            </p>
          ) : lessons.length === 0 ? (
            <p className="text-sm text-slate-400 sm:text-base">
              No lessons found for this student.
            </p>
          ) : (
            <div className="grid gap-3 sm:gap-4">

              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="min-w-0 rounded-xl border border-slate-600 bg-slate-700 p-4 sm:p-5"
                >

                  <div className="flex min-w-0 flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div className="min-w-0">

                      <h3 className="break-words text-lg font-bold text-white sm:text-xl">
                        {lesson.title}
                      </h3>

                      <p className="mt-2 break-words text-sm text-slate-300 sm:text-base">
                        Teacher:{" "}
                        <span className="text-white">
                          {lesson.teacher || "-"}
                        </span>
                      </p>

                      <p className="mt-1 break-words text-sm text-slate-300 sm:text-base">
                        Tutor:{" "}
                        <span className="font-semibold text-blue-400">
                          {lesson.tutor?.name || "-"}
                        </span>
                      </p>

                      <p className="mt-1 text-sm text-slate-300 sm:text-base">
                        Hours:{" "}
                        <span className="text-white">
                          {lesson.hours}
                        </span>
                      </p>

                      <p className="mt-2 text-xs text-slate-400 sm:text-sm">
                        Date:{" "}
                        {lesson.date
                          ? new Date(
                              lesson.date
                            ).toLocaleDateString("en-GB")
                          : "-"}
                      </p>

                    </div>

                    <div className="grid grid-cols-2 gap-2 md:flex md:shrink-0">

                      <button
                        type="button"
                        onClick={() => editLesson(lesson)}
                        className="w-full rounded-lg bg-yellow-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-yellow-600 md:w-auto"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteLesson(lesson.id)}
                        className="w-full rounded-lg bg-red-600 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-700 md:w-auto"
                      >
                        Delete
                      </button>

                    </div>

                  </div>

                </div>
              ))}

            </div>
          )}

        </div>
      </div>
    </main>
  );
}

export default function LessonsPage() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-900 px-4 py-6 sm:px-6 sm:py-10">
          <p className="text-white">
            Loading lessons...
          </p>
        </main>
      }
    >
      <LessonsPageContent />
    </Suspense>
  );
}
