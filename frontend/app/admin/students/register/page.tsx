
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { API_URL } from "@/lib/api";

export default function RegisterStudentPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    fullName: "",
    certificateName: "",
    email: "",
    phone: "",
    packageHours: "",
    packagePrice: "",
  });

  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [otherLanguage, setOtherLanguage] = useState("");

  const languages = [
    "English",
    "Korean",
    "Japanese",
    "Chinese",
    "Thai",
    "Other",
  ];

  function handleChange(e: any) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  function handleLanguageChange(language: string) {
    setSelectedLanguages((current) => {
      if (current.includes(language)) {
        return current.filter((item) => item !== language);
      }

      return [...current, language];
    });

    if (
      language === "Other" &&
      selectedLanguages.includes("Other")
    ) {
      setOtherLanguage("");
    }
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

    if (selectedLanguages.length === 0) {
      alert("Please select at least one language");
      return;
    }

    if (
      selectedLanguages.includes("Other") &&
      !otherLanguage.trim()
    ) {
      alert("Please specify the other language");
      return;
    }

    const languageValues = selectedLanguages.map((language) => {
      if (language === "Other") {
        return `Other: ${otherLanguage.trim()}`;
      }

      return language;
    });

    const payload = {
      ...form,
      languages: languageValues.join(", "),
    };

    try {
      const res = await fetch(
        `${API_URL}/students/register`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
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
    <main className="min-h-screen bg-slate-900 px-4 py-6 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-xl">

        <h1 className="mb-6 text-2xl font-bold text-white sm:mb-8 sm:text-4xl">
          Register Student
        </h1>

        <div className="space-y-4 rounded-2xl bg-slate-800 p-4 sm:p-6">

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
          ].map((field) => (
            <input
              key={field.name}
              name={field.name}
              placeholder={field.placeholder}
              value={(form as any)[field.name]}
              onChange={handleChange}
              className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
            />
          ))}

          <div>
            <label className="mb-3 block font-semibold text-white">
              Languages
            </label>

            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">

              {languages.map((language) => (
                <label
                  key={language}
                  className="flex cursor-pointer items-center gap-3 rounded-lg bg-slate-700 p-3 text-white transition hover:bg-slate-600"
                >
                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(language)}
                    onChange={() =>
                      handleLanguageChange(language)
                    }
                    className="h-4 w-4"
                  />

                  <span>{language}</span>
                </label>
              ))}

            </div>

            {selectedLanguages.includes("Other") && (
              <input
                type="text"
                placeholder="Please specify"
                value={otherLanguage}
                onChange={(e) =>
                  setOtherLanguage(e.target.value)
                }
                className="mt-3 w-full min-w-0 rounded-lg bg-slate-700 p-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
              />
            )}
          </div>

          <input
            name="packageHours"
            type="number"
            min="0"
            placeholder="Package Hours *"
            value={form.packageHours}
            onChange={handleChange}
            className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <input
            name="packagePrice"
            type="number"
            min="0"
            placeholder="Package Price THB *"
            value={form.packagePrice}
            onChange={handleChange}
            className="w-full min-w-0 rounded-lg bg-slate-700 p-3 text-white placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-500"
          />

          <button
            onClick={registerStudent}
            className="w-full rounded-lg bg-green-600 p-3 font-bold text-white transition hover:bg-green-700"
          >
            Register Student
          </button>

        </div>
      </div>
    </main>
  );
}

