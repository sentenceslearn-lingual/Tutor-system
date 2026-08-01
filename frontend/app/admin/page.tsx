"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { API_URL } from "@/lib/api";

export default function AdminDashboardPage() {
  const router = useRouter();

  const [students, setStudents] = useState<any[]>([]);
  const [totalLessons, setTotalLessons] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loggedIn = localStorage.getItem("adminLoggedIn");

    if (loggedIn !== "true") {
      router.replace("/admin/login");
      return;
    }

    loadDashboard();
  }, [router]);

  async function loadDashboard() {
    try {
      const studentsRes = await fetch(`${API_URL}/students`, {
        cache: "no-store",
      });

      const studentsData = await studentsRes.json();

      if (!Array.isArray(studentsData)) {
        console.error("Invalid students response:", studentsData);
        setStudents([]);
        return;
      }

      const studentsWithHours = await Promise.all(
        studentsData.map(async (student: any) => {
          const lessonRes = await fetch(
            `${API_URL}/lessons/student/${student.studentId}`,
            {
              cache: "no-store",
            }
          );

          const lessons = await lessonRes.json();

          const usedHours = Array.isArray(lessons)
            ? lessons.reduce(
                (sum: number, lesson: any) =>
                  sum + Number(lesson.hours || 0),
                0
              )
            : 0;

          return {
            ...student,
            usedHours,
            remainingHours:
              Number(student.packageHours || 0) - usedHours,
            lessonCount: Array.isArray(lessons)
              ? lessons.length
              : 0,
          };
        })
      );

      setStudents(studentsWithHours);

      const lessonCount = studentsWithHours.reduce(
        (sum: number, student: any) =>
          sum + Number(student.lessonCount || 0),
        0
      );

      setTotalLessons(lessonCount);
    } catch (error) {
      console.error("Dashboard error:", error);
    } finally {
      setLoading(false);
    }
  }

  async function updatePaymentStatus(
    studentId: string,
    currentStatus: string
  ) {
    const newStatus =
      currentStatus === "paid"
        ? "pending"
        : "paid";

    try {
      const response = await fetch(
        `${API_URL}/students/${studentId}/payment`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentStatus: newStatus,
          }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update payment status");
      }

      await loadDashboard();
    } catch (error) {
      console.error("Payment update error:", error);
      alert("Cannot update payment status.");
    }
  }

  const totalPackageHours = students.reduce(
    (sum, student) =>
      sum + Number(student.packageHours || 0),
    0
  );

  const totalUsedHours = students.reduce(
    (sum, student) =>
      sum + Number(student.usedHours || 0),
    0
  );

  const totalRemainingHours =
    totalPackageHours - totalUsedHours;

  const paidStudents = students.filter(
    (student) =>
      student.paymentStatus === "paid"
  ).length;

  const pendingStudents = students.filter(
    (student) =>
      student.paymentStatus !== "paid"
  ).length;

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 flex items-center justify-center">
        <p className="text-white text-xl">
          Loading dashboard...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 p-6 md:p-10">
      <div className="max-w-6xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              Admin Dashboard
            </h1>

            <p className="text-slate-400 mt-2">
              Tutor system overview
            </p>
          </div>

          <div className="flex gap-3">

            <Link
              href="/admin/students"
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-3 rounded-xl"
            >
              Students
            </Link>

            <Link
              href="/admin/lessons"
              className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-3 rounded-xl"
            >
              Lessons
            </Link>

            <Link
              href="/admin/tutors"
              className="bg-green-600 hover:bg-green-700 text-white px-5 py-3 rounded-xl"
            >
              Tutors
            </Link>

          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Students
            </p>

            <p className="text-4xl font-bold text-white mt-2">
              {students.length}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Package Hours
            </p>

            <p className="text-4xl font-bold text-blue-400 mt-2">
              {totalPackageHours}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Used Hours
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {totalUsedHours}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Remaining Hours
            </p>

            <p className="text-4xl font-bold text-green-400 mt-2">
              {totalRemainingHours}
            </p>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Total Lessons
            </p>

            <p className="text-4xl font-bold text-purple-400 mt-2">
              {totalLessons}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Paid
            </p>

            <p className="text-4xl font-bold text-green-400 mt-2">
              {paidStudents}
            </p>
          </div>

          <div className="bg-slate-800 rounded-2xl p-6">
            <p className="text-slate-400">
              Pending Payment
            </p>

            <p className="text-4xl font-bold text-yellow-400 mt-2">
              {pendingStudents}
            </p>
          </div>

        </div>

        <div className="bg-slate-800 rounded-2xl p-6">

          <div className="flex justify-between items-center mb-6">

            <div>
              <h2 className="text-2xl font-bold text-white">
                Students Overview
              </h2>

              <p className="text-slate-400 mt-1">
                Current package, payment and lesson usage
              </p>
            </div>

            <Link
              href="/admin/students"
              className="text-blue-400 hover:text-blue-300"
            >
              View all
            </Link>

          </div>

          {students.length === 0 ? (
            <p className="text-slate-400">
              No students registered yet.
            </p>
          ) : (
            <div className="space-y-4">

              {students.slice(0, 5).map((student) => {

                const isPaid =
                  student.paymentStatus === "paid";

                return (
                  <div
                    key={student.id}
                    className="bg-slate-700 rounded-xl p-4"
                  >

                    <div className="flex flex-col gap-4">

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">

                        <div>
                          <h3 className="text-lg font-semibold text-white">
                            {student.fullName}
                          </h3>

                          <p className="text-blue-400 text-sm">
                            {student.studentId}
                          </p>
                        </div>

                        <div className="flex gap-5 text-sm">

                          <div>
                            <p className="text-slate-400">
                              Package
                            </p>

                            <p className="text-white font-semibold">
                              {student.packageHours || 0}h
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-400">
                              Used
                            </p>

                            <p className="text-yellow-400 font-semibold">
                              {student.usedHours || 0}h
                            </p>
                          </div>

                          <div>
                            <p className="text-slate-400">
                              Remaining
                            </p>

                            <p className="text-green-400 font-semibold">
                              {student.remainingHours || 0}h
                            </p>
                          </div>

                        </div>

                      </div>

                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-t border-slate-600 pt-4">

                        <div>
                          <p className="text-slate-400 text-sm">
                            Payment Status
                          </p>

                          <p
                            className={
                              isPaid
                                ? "text-green-400 font-bold"
                                : "text-yellow-400 font-bold"
                            }
                          >
                            {isPaid
                              ? "✓ Paid"
                              : "○ Pending"}
                          </p>
                        </div>

                        <div className="flex gap-3">

                          <button
                            onClick={() =>
                              updatePaymentStatus(
                                student.studentId,
                                student.paymentStatus
                              )
                            }
                            className={
                              isPaid
                                ? "bg-yellow-600 hover:bg-yellow-700 text-white px-4 py-2 rounded-lg"
                                : "bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg"
                            }
                          >
                            {isPaid
                              ? "Mark as Pending"
                              : "Mark as Paid"}
                          </button>

                          <Link
                            href={`/admin/students/${student.studentId}`}
                            className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-center"
                          >
                            View
                          </Link>

                        </div>

                      </div>

                    </div>

                  </div>
                );
              })}

            </div>
          )}

        </div>

      </div>
    </main>
  );
}