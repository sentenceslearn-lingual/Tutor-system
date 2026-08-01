"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

export default function TutorList() {
  const [tutors, setTutors] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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

    loadTutors();
  }, []);

  if (loading) {
    return (
      <section className="bg-white px-6 py-24">
        <div className="mx-auto max-w-6xl text-center">
          <p className="text-gray-500">Loading tutors...</p>
        </div>
      </section>
    );
  }

  return (
    <section id="tutors" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-6xl">

        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Our Tutors
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Meet Your Tutors
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Learn with experienced tutors who can help you reach your language goals.
          </p>
        </div>

        {tutors.length === 0 ? (
          <div className="mt-10 rounded-2xl border border-gray-200 p-8 text-center">
            <p className="text-gray-500">
              Tutors will be available soon.
            </p>
          </div>
        ) : (
          <div className="mt-12 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {tutors.map((tutor) => (
              <div
                key={tutor.id}
                className="rounded-2xl border border-gray-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-2xl font-bold text-gray-900">
                  {tutor.name}
                </h3>

                <p className="mt-3 text-sm font-semibold text-blue-600">
                  {tutor.languages}
                </p>

                <p className="mt-3 text-sm text-gray-500">
                  {tutor.expertise}
                </p>

                <p className="mt-4 leading-7 text-gray-600">
                  {tutor.bio}
                </p>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
