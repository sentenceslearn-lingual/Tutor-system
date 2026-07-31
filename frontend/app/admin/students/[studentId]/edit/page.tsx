"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();

  const studentId = String(params.studentId);

  const [form, setForm] = useState<any>({
    fullName: "",
    certificateName: "",
    email: "",
    phone: "",
    languages: "",
    packageHours: "",
    packagePrice: "",
  });

  const [loading, setLoading] = useState(true);


  useEffect(() => {
    loadStudent();
  }, []);


  async function loadStudent() {
    try {
      const res = await fetch(
        `${API_URL}/students`,
        {
          cache: "no-store",
        }
      );

      const students = await res.json();


      const student = students.find(
        (s: any) =>
          s.studentId === studentId
      );


      if (student) {
        setForm({
          fullName: student.fullName || "",
          certificateName:
            student.certificateName || "",
          email: student.email || "",
          phone: student.phone || "",
          languages:
            student.languages || "",
          packageHours:
            student.packageHours || "",
          packagePrice:
            student.packagePrice || "",
        });
      }

    } catch (error) {
      console.log(error);
      alert("Cannot load student");
    }
    finally {
      setLoading(false);
    }
  }



  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]:
        e.target.value,
    });
  }



  async function saveStudent() {

    try {

      const res = await fetch(
        `${API_URL}/students/${studentId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body:
            JSON.stringify(form),
        }
      );


      if(!res.ok){
        throw new Error(
          "Update failed"
        );
      }


      alert(
        "Student updated successfully"
      );


      router.push(
        `/admin/students/${studentId}`
      );


    } catch(error){

      console.log(error);

      alert(
        "Cannot update student"
      );

    }

  }



  if (loading) {
    return (
      <main className="bg-slate-900 min-h-screen p-10">
        <p className="text-white">
          Loading...
        </p>
      </main>
    );
  }



  return (
    <main className="min-h-screen bg-slate-900 p-10">

      <div className="max-w-3xl mx-auto">


        <h1 className="text-4xl font-bold text-white mb-8">
          ✏️ Edit Student
        </h1>


        <div className="bg-slate-800 rounded-2xl p-8 space-y-5">


          <Input
            label="👤 Full Name"
            name="fullName"
            value={form.fullName}
            onChange={handleChange}
          />


          <Input
            label="📜 Certificate Name"
            name="certificateName"
            value={form.certificateName}
            onChange={handleChange}
          />


          <Input
            label="📧 Email"
            name="email"
            value={form.email}
            onChange={handleChange}
          />


          <Input
            label="📱 Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />


          <Input
            label="🌐 Languages"
            name="languages"
            value={form.languages}
            onChange={handleChange}
          />


          <Input
            label="📦 Package Hours"
            name="packageHours"
            value={form.packageHours}
            onChange={handleChange}
          />


          <Input
            label="💰 Package Price"
            name="packagePrice"
            value={form.packagePrice}
            onChange={handleChange}
          />



          <button
            onClick={saveStudent}
            className="
            bg-blue-600
            hover:bg-blue-700
            text-white
            font-bold
            p-4
            rounded-xl
            w-full
            "
          >
            💾 Save Changes
          </button>


        </div>

      </div>

    </main>
  );
}



function Input({
  label,
  name,
  value,
  onChange,
}: any) {

  return (
    <div>

      <label className="text-white block mb-2">
        {label}
      </label>


      <input
        name={name}
        value={value}
        onChange={onChange}
        className="
        w-full
        bg-slate-700
        text-white
        p-3
        rounded-lg
        "
      />

    </div>
  );
}