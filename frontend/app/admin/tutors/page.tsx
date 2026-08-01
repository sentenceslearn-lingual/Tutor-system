"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function AdminTutorsPage() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [name, setName] = useState("");
  const [languages, setLanguages] = useState("");
  const [expertise, setExpertise] = useState("");
  const [bio, setBio] = useState("");
  const [editingId, setEditingId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  async function loadTutors() {
    try {
      const response = await fetch(`${API_URL}/tutors`, {
        cache: "no-store",
      });

      const data = await response.json();
      setTutors(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Cannot load tutors:", error);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadTutors();
  }, []);

  function clearForm() {
    setName("");
    setLanguages("");
    setExpertise("");
    setBio("");
    setEditingId(null);
  }

  async function saveTutor() {
    if (!name.trim()) {
      alert("Please enter tutor name");
      return;
    }

    const tutorData = {
      name,
      languages,
      expertise,
      bio,
    };

    try {
      const url = editingId
        ? `${API_URL}/tutors/${editingId}`
        : `${API_URL}/tutors`;

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(tutorData),
      });

      if (!response.ok) {
        throw new Error("Failed to save tutor");
      }

      clearForm();
      await loadTutors();
    } catch (error) {
      console.error(error);
      alert("Cannot save tutor");
    }
  }

  function startEdit(tutor: any) {
    setEditingId(tutor.id);
    setName(tutor.name || "");
    setLanguages(tutor.languages || "");
    setExpertise(tutor.expertise || "");
    setBio(tutor.bio || "");
  }

  async function deleteTutor(id: number) {
    const confirmed = confirm(
      "Are you sure you want to delete this tutor?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        `${API_URL}/tutors/${id}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete tutor");
      }

      await loadTutors();
    } catch (error) {
      console.error(error);
      alert("Cannot delete tutor");
    }
  }

  return (
    <main className="min-h-screen bg-slate-900 p-6 md:p-10">
      <div className="mx-auto max-w-6xl">

        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white">
            Manage Tutors
          </h1>

          <p className="mt-2 text-slate-400">
            Add, edit, and manage tutors shown on the homepage.
          </p>
        </div>

        <div className="mb-8 rounded-2xl bg-slate-800 p-6">

          <h2 className="mb-5 text-2xl font-bold text-white">
            {editingId ? "Edit Tutor" : "Add Tutor"}
          </h2>

          <div className="grid gap-4 md:grid-cols-2">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Tutor Name"
              className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400"
            />

            <input
              value={languages}
              onChange={(e) => setLanguages(e.target.value)}
              placeholder="Languages"
              className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400"
            />

            <input
              value={expertise}
              onChange={(e) => setExpertise(e.target.value)}
              placeholder="Expertise"
              className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 md:col-span-2"
            />

            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              placeholder="Tutor Bio"
              rows={4}
              className="rounded-xl border border-slate-600 bg-slate-700 px-4 py-3 text-white placeholder-slate-400 md:col-span-2"
            />

          </div>

          <div className="mt-5 flex gap-3">

            <button
              type="button"
              onClick={saveTutor}
              className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
            >
              {editingId ? "Update Tutor" : "Add Tutor"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={clearForm}
                className="rounded-xl bg-slate-600 px-6 py-3 font-semibold text-white hover:bg-slate-500"
              >
                Cancel
              </button>
            )}

          </div>
        </div>

        <div className="rounded-2xl bg-slate-800 p-6">

          <h2 className="mb-6 text-2xl font-bold text-white">
            Tutor List
          </h2>

          {loading ? (
            <p className="text-slate-400">
              Loading tutors...
            </p>
          ) : tutors.length === 0 ? (
            <p className="text-slate-400">
              No tutors added yet.
            </p>
          ) : (
            <div className="space-y-4">

              {tutors.map((tutor) => (
                <div
                  key={tutor.id}
                  className="rounded-xl bg-slate-700 p-5"
                >

                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {tutor.name}
                      </h3>

                      <p className="mt-1 text-blue-400">
                        {tutor.languages}
                      </p>

                      <p className="mt-2 text-sm font-semibold text-slate-300">
                        {tutor.expertise}
                      </p>

                      <p className="mt-3 text-slate-400">
                        {tutor.bio}
                      </p>
                    </div>

                    <div className="flex gap-2">

                      <button
                        type="button"
                        onClick={() => startEdit(tutor)}
                        className="rounded-lg bg-yellow-600 px-4 py-2 font-semibold text-white hover:bg-yellow-700"
                      >
                        Edit
                      </button>

                      <button
                        type="button"
                        onClick={() => deleteTutor(tutor.id)}
                        className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white hover:bg-red-700"
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
