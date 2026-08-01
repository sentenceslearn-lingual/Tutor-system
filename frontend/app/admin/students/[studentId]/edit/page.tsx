
"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function EditStudentPage() {
  const params = useParams();
  const router = useRouter();

  const studentId = String(params.studentId);

  const [form, setForm] = useState({
    fullName: "",
    certificateName: "",
    email: "",
    phone: "",
    languages: "",
    packageHours: "",
    packagePrice: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadStudent();
  }, []);

  async function loadStudent() {
    try {
      const res = await fetch(`${API_URL}/students`, {
        cache: "no-store",
      });

      if (!res.ok) {
        throw new Error("Cannot load students");
      }

      const students = await res.json();

      const student = students.find(
        (s: any) => s.studentId === studentId
      );

      if (!student) {
        alert("Student not found");
        router.push("/admin/students");
        return;
      }

      setForm({
        fullName: student.fullName || "",
        certificateName: student.certificateName || "",
        email: student.email || "",
        phone: student.phone || "",
        languages: student.languages || "",
        packageHours:
          student.packageHours !== null &&
          student.packageHours !== undefined
            ? String(student.packageHours)
            : "",
        packagePrice:
          student.packagePrice !== null &&
          student.packagePrice !== undefined
            ? String(student.packagePrice)
            : "",
      });
    } catch (error) {
      console.error(error);
      alert("Cannot load student");
    } finally {
      setLoading(false);
    }
  }

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function saveStudent() {
    if (saving) return;

    const packageHours = Number(form.packageHours);
    const packagePrice = Number(form.packagePrice);

    // Validate Package Hours
    if (
      !Number.isInteger(packageHours) ||
      packageHours < 0
    ) {
      alert("Package Hours must be a valid number.");
      return;
    }

    // Validate Package Price
    if (
      !Number.isInteger(packagePrice) ||
      packagePrice < 0
    ) {
      alert("Package Price must be a valid number.");
      return;
    }

    const studentData = {
      fullName: form.fullName,
      certificateName: form.certificateName,
      email: form.email,
      phone: form.phone,
      languages: form.languages,
      packageHours,
      packagePrice,
    };

    try {
      setSaving(true);

      const res = await fetch(
        `${API_URL}/students/${studentId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      if (!res.ok) {
        const errorText = await res.text();

        console.error(
          "Update student failed:",
          errorText
        );

        throw new Error("Update failed");
      }

      alert("Student updated successfully");

      router.push(
        `/admin/students/${studentId}`
      );
    } catch (error) {
      console.error(error);

      alert(
        "Cannot update student. Please try again."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-900 p-10">
        <p className="text-white">
          Loading...
        </p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-900 p-10">
      <div className="mx-auto max-w-3xl">
        <h1 className="mb-8 text-4xl font-bold text-white">
          ✏️ Edit Student
        </h1>

        <div className="space-y-5 rounded-2xl bg-slate-800 p-8">
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
            type="email"
          />

          <Input
            label="📱 Phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            type="tel"
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
            type="number"
            min="0"
          />

          <Input
            label="💰 Package Price (THB)"
            name="packagePrice"
            value={form.packagePrice}
            onChange={handleChange}
            type="number"
            min="0"
          />

          <p className="text-sm text-slate-400">
            💡 You can set the price to 0 for a free
            student, or enter a custom price for this
            student.
          </p>

          <button
            onClick={saveStudent}
            disabled={saving}
            className="
              w-full
              rounded-xl
              bg-blue-600
              p-4
              font-bold
              text-white
              hover:bg-blue-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            {saving
              ? "💾 Saving..."
              : "💾 Save Changes"}
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
  type = "text",
  min,
}: {
  label: string;
  name: string;
  value: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement>
  ) => void;
  type?: string;
  min?: string;
}) {
  return (
    <div>
      <label className="mb-2 block text-white">
        {label}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        min={min}
        className="
          w-full
          rounded-lg
          bg-slate-700
          p-3
          text-white
          outline-none
          focus:ring-2
          focus:ring-blue-500
        "
      />
    </div>
  );
}

