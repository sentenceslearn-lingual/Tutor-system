"use client";

import { useState } from "react";
import { API_URL } from "@/lib/api";

export default function StudentHours() {
  const [studentId, setStudentId] = useState("");
  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function checkHours() {
    if (!studentId.trim()) {
      setError("Please enter your Student ID");
      return;
    }

    setLoading(true);
    setError("");
    setStudent(null);
    setLessons([]);

    try {
      const studentsRes = await fetch(
        `${API_URL}/students`,
        { cache: "no-store" }
      );

      const students = await studentsRes.json();

      const foundStudent = students.find(
        (s: any) =>
          s.studentId.toLowerCase() ===
          studentId.trim().toLowerCase()
      );

      if (!foundStudent) {
        setError("Student ID not found");
        return;
      }

      const lessonsRes = await fetch(
        `${API_URL}/lessons/student/${foundStudent.studentId}`,
        { cache: "no-store" }
      );

      const lessonData = await lessonsRes.json();

      setStudent(foundStudent);
      setLessons(
        Array.isArray(lessonData) ? lessonData : []
      );
    } catch (err) {
      console.error(err);
      setError("Cannot connect to server");
    } finally {
      setLoading(false);
    }
  }

  const usedHours = lessons.reduce(
    (sum, lesson) =>
      sum + Number(lesson.hours || 0),
    0
  );

  const packageHours =
    Number(student?.packageHours || 0);

  const remainingHours =
    packageHours - usedHours;

  return (
    <section
      id="hours"
      className="bg-slate-50 px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">

        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Student Portal
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Check My Hours
          </h2>

          <p className="mt-4 text-gray-600">
            Enter your Student ID to check your
            remaining lesson hours.
          </p>
        </div>

        <div className="mt-10 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">

          <div className="flex flex-col gap-4 sm:flex-row">
            <input
              value={studentId}
              onChange={(e) =>
                setStudentId(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  checkHours();
                }
              }}
              placeholder="Student ID (e.g. ST2026001)"
              className="flex-1 rounded-xl border border-gray-300 px-4 py-3"
            />

            <button
              type="button"
              onClick={checkHours}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
            >
              {loading ? "Checking..." : "Check Hours"}
            </button>
          </div>

          {error && (
            <p className="mt-4 text-red-600">
              {error}
            </p>
          )}

          {student && (
            <div className="mt-8">

              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900">
                  {student.fullName}
                </h3>

                <p className="text-blue-600">
                  {student.studentId}
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-3">

                <div className="rounded-2xl bg-blue-50 p-5">
                  <p className="text-sm text-gray-500">
                    Package
                  </p>

                  <p className="mt-2 text-3xl font-bold text-blue-700">
                    {packageHours}h
                  </p>
                </div>

                <div className="rounded-2xl bg-yellow-50 p-5">
                  <p className="text-sm text-gray-500">
                    Used
                  </p>

                  <p className="mt-2 text-3xl font-bold text-yellow-600">
                    {usedHours}h
                  </p>
                </div>

                <div className="rounded-2xl bg-green-50 p-5">
                  <p className="text-sm text-gray-500">
                    Remaining
                  </p>

                  <p className="mt-2 text-3xl font-bold text-green-600">
                    {remainingHours}h
                  </p>
                </div>

              </div>

              <div className="mt-8">
                <h4 className="text-xl font-bold text-gray-900">
                  Lesson History
                </h4>

                {lessons.length === 0 ? (
                  <p className="mt-3 text-gray-500">
                    No lessons recorded yet.
                  </p>
                ) : (
                  <div className="mt-4 space-y-3">
                    {lessons.map((lesson) => (
                      <div
                        key={lesson.id}
                        className="rounded-xl border border-gray-200 p-4"
                      >
                        <div className="flex justify-between">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {lesson.title}
                            </p>

                            <p className="text-sm text-gray-500">
                              Teacher: {lesson.teacher}
                            </p>
                          </div>

                          <p className="font-bold text-blue-600">
                            {lesson.hours}h
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}

        </div>
      </div>
    </section>
  );
}
