"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function RegisterStudentPage() {
  const router = useRouter();

  const API_URL =
    process.env.NEXT_PUBLIC_API_URL || "http://localhost:3002";

  const [form, setForm] = useState({
    fullName: "",
    certificateName: "",
    email: "",
    phone: "",
    languages: "",
    packageHours: "",
    packagePrice: "",
  });

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function registerStudent() {
    if (
      !form.fullName ||
      !form.packageHours ||
      !form.packagePrice
    ) {
      alert("Please fill required fields");
      return;
    }

    try {
      const res = await fetch(
        `${API_URL}/students/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );

      if (!res.ok) {
        throw new Error("Register failed");
      }

      const data = await res.json();

      alert(
        `Student created: ${data.studentId}`
      );

      router.push("/admin/students");
    } catch (error) {
      console.log(error);
      alert("Cannot connect to server");
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 p-10">
      <div className="max-w-xl mx-auto">

        <h1 className="text-4xl font-bold text-white mb-8">
          ➕ Register Student
        </h1>

        <div className="bg-slate-800 rounded-2xl p-6 space-y-4">

          {[
            {
              name: "fullName",
              placeholder: "Full Name *",
            },
            {
              name: "certificateName",
              placeholder: "Certificate Name",
            },
            {
              name: "email",
              placeholder: "Email",
            },
            {
              name: "phone",
              placeholder: "Phone",
            },
            {
              name: "languages",
              placeholder: "Languages",
            },
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={(form as any)[field.name]}
              onChange={handleChange}
              className="
              w-full
              bg-slate-700
              text-white
              p-3
              rounded-lg
              "
            />
          ))}


          <input
            name="packageHours"
            type="number"
            placeholder="Package Hours *"
            value={form.packageHours}
            onChange={handleChange}
            className="
            w-full
            bg-slate-700
            text-white
            p-3
            rounded-lg
            "
          />


          <input
            name="packagePrice"
            type="number"
            placeholder="Package Price THB *"
            value={form.packagePrice}
            onChange={handleChange}
            className="
            w-full
            bg-slate-700
            text-white
            p-3
            rounded-lg
            "
          />


          <button
            onClick={registerStudent}
            className="
            w-full
            bg-green-600
            hover:bg-green-700
            text-white
            font-bold
            p-3
            rounded-lg
            "
          >
            Register Student
          </button>

        </div>

      </div>
    </main>
  );
}