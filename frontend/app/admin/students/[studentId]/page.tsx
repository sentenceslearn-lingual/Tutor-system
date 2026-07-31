"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

const API_URL =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

export default function StudentDetailPage() {
  const params = useParams();
  const router = useRouter();

  const studentId = params?.studentId
    ? String(params.studentId)
    : "";

  const [student, setStudent] = useState<any>(null);
  const [lessons, setLessons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (studentId) {
      loadStudent();
    }
  }, [studentId]);

  async function loadStudent() {
    try {
      setLoading(true);

      const studentRes = await fetch(
        `${API_URL}/students`,
        {
          cache: "no-store",
        }
      );

      const students = await studentRes.json();

      const found = students.find(
        (item: any) =>
          item.studentId === studentId
      );

      if (!found) {
        setStudent(null);
        return;
      }

      setStudent(found);

      const lessonRes = await fetch(
        `${API_URL}/lessons/student/${studentId}`,
        {
          cache: "no-store",
        }
      );

      const lessonData = await lessonRes.json();

      setLessons(
        Array.isArray(lessonData)
          ? lessonData
          : []
      );

    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  }


  async function deleteStudent() {

    const confirmDelete = confirm(
      `Delete ${student.fullName}?`
    );

    if (!confirmDelete) return;


    await fetch(
      `${API_URL}/students/${student.studentId}`,
      {
        method: "DELETE",
      }
    );


    alert(
      "Student deleted successfully"
    );


    router.push(
      "/admin/students"
    );

  }


  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 p-10">
        <p className="text-white text-xl">
          Loading student...
        </p>
      </main>
    );
  }


  if (!student) {
    return (
      <main className="min-h-screen bg-slate-900 p-10">
        <p className="text-red-400 text-xl">
          Student not found
        </p>
      </main>
    );
  }


  const usedHours =
    lessons.reduce(
      (sum, lesson) =>
        sum + Number(lesson.hours || 0),
      0
    );


  const totalHours =
    Number(student.packageHours || 0);


  const remainingHours =
    totalHours - usedHours;



  return (
    <main className="min-h-screen bg-slate-900 p-10">

      <div className="max-w-5xl mx-auto">


        <div className="flex justify-between items-center mb-8">

          <div>
            <h1 className="text-4xl font-bold text-white">
              👤 Student Profile
            </h1>

            <p className="text-slate-400">
              Student information and learning progress
            </p>
          </div>


          <div className="flex gap-3">


            <Link
              href="/admin/students"
              className="bg-slate-700 text-white px-5 py-3 rounded-xl"
            >
              Back
            </Link>


            <Link
              href={`/admin/students/${student.studentId}/edit`}
              className="bg-blue-600 text-white px-5 py-3 rounded-xl"
            >
              ✏️ Edit
            </Link>


            <Link
              href={`/admin/lessons?studentId=${student.studentId}`}
              className="bg-purple-600 text-white px-5 py-3 rounded-xl"
            >
              📚 Lessons
            </Link>


            <button
              onClick={deleteStudent}
              className="bg-red-600 text-white px-5 py-3 rounded-xl"
            >
              🗑 Delete
            </button>


          </div>

        </div>



        <div className="grid md:grid-cols-2 gap-6">


          <div className="bg-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-white mb-5">
              Personal Information
            </h2>


            <p className="text-slate-300 mb-3">
              👤 Name:
              <span className="text-white font-bold">
                {" "}{student.fullName}
              </span>
            </p>


            <p className="text-slate-300 mb-3">
              🆔 Student ID:
              <span className="text-blue-400 font-bold">
                {" "}{student.studentId}
              </span>
            </p>


            <p className="text-slate-300 mb-3">
              📧 Email:
              <span className="text-white">
                {" "}{student.email || "-"}
              </span>
            </p>


            <p className="text-slate-300 mb-3">
              📱 Phone:
              <span className="text-white">
                {" "}{student.phone || "-"}
              </span>
            </p>


            <p className="text-slate-300">
              🌐 Languages:
              <span className="text-white">
                {" "}{student.languages || "-"}
              </span>
            </p>


          </div>




          <div className="bg-slate-800 rounded-2xl p-6">

            <h2 className="text-xl font-bold text-white mb-5">
              📦 Course Package
            </h2>


            <p className="text-slate-300 mb-3">
              Total:
              <span className="text-blue-400 font-bold">
                {" "}{totalHours} Hours
              </span>
            </p>


            <p className="text-slate-300 mb-3">
              Used:
              <span className="text-yellow-400 font-bold">
                {" "}{usedHours} Hours
              </span>
            </p>


            <p className="text-slate-300 mb-3">
              Remaining:
              <span className="text-green-400 font-bold">
                {" "}{remainingHours} Hours
              </span>
            </p>


            <p className="text-slate-300">
              Price:
              <span className="text-purple-400 font-bold">
                {" "}
                {Number(student.packagePrice || 0).toLocaleString()}
                {" "}THB
              </span>
            </p>


          </div>


        </div>




        <div className="bg-slate-800 rounded-2xl p-6 mt-8">


          <div className="flex justify-between mb-5">

            <h2 className="text-xl font-bold text-white">
              📖 Lesson History ({lessons.length})
            </h2>


            <button
              onClick={loadStudent}
              className="bg-green-600 px-4 py-2 rounded-lg text-white"
            >
              Refresh
            </button>

          </div>



          {
            lessons.length === 0 ? (

              <p className="text-slate-400">
                No lessons yet
              </p>

            ) : (

              <div className="grid gap-4">

                {
                  lessons.map((lesson)=>(

                    <div
                      key={lesson.id}
                      className="bg-slate-700 rounded-xl p-5"
                    >

                      <h3 className="text-white font-bold text-lg">
                        {lesson.title}
                      </h3>


                      <p className="text-slate-300">
                        👨‍🏫 {lesson.teacher}
                      </p>


                      <p className="text-slate-300">
                        ⏱ {lesson.hours} Hours
                      </p>


                      <p className="text-slate-400 text-sm">
                        📅{" "}
                        {
                          lesson.date
                            ? new Date(
                                lesson.date
                              ).toLocaleDateString("en-GB")
                            : "-"
                        }
                      </p>


                    </div>

                  ))
                }

              </div>

            )
          }


        </div>


      </div>

    </main>
  );
}