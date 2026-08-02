"use client";

import { useEffect, useState } from "react";
import { API_URL } from "@/lib/api";

type Tutor = {
  id: string | number;
  name: string;
  languages?: string;
  expertise?: string;
  bio?: string;
};

type BioSection = {
  title: string;
  items: string[];
};

function parseBio(bio: string): BioSection[] {
  if (!bio) return [];

  /*
   * บางครั้ง bio จาก database ถูกเก็บเป็นบรรทัดเดียว เช่น:
   *
   * English Taken in 2024 - TOEFL ITP 563 - MFU-TEP 82.53
   * - IELTS Academic Band 7.0 Taken in 2023
   * - Duolingo English Test 135 ...
   *
   * ดังนั้นเราจะเติม newline ให้กับ pattern ที่เรารู้จักก่อน
   */

  let text = bio
    .replace(/\r?\n/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  // แยก "Taken in 2024", "Taken in 2023" ออกเป็นบรรทัด
  text = text.replace(
    /\s+(Taken in \d{4})\s+/gi,
    "\n$1\n"
  );

  // แยก bullet ที่ถูกเก็บเป็นข้อความเดียว
  text = text.replace(
    /\s+-\s+/g,
    "\n- "
  );

  // แยกหัวข้อภาษาที่มี colon
  text = text.replace(
    /\s+(Korean|Japanese|French|Chinese|German|Spanish|English|Thai)\s*:/gi,
    "\n$1: "
  );

  // แยก Formal study / Self-study
  text = text.replace(
    /\s+(Formal study|Self-study)\s*:/gi,
    "\n$1: "
  );

  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  const sections: BioSection[] = [];

  let currentSection: BioSection | null = null;

  for (const line of lines) {
    /*
     * Bullet:
     * - TOEFL ITP 563
     */
    if (line.startsWith("-")) {
      if (currentSection) {
        currentSection.items.push(
          line.replace(/^-\s*/, "").trim()
        );
      }

      continue;
    }

    /*
     * Taken in 2024
     */
    if (/^Taken in \d{4}$/i.test(line)) {
      currentSection = {
        title: line,
        items: [],
      };

      sections.push(currentSection);

      continue;
    }

    /*
     * เช่น
     *
     * Korean: TOPIK I Level 2
     * Japanese: JLPT N5
     * Formal study: Pali, Thai
     * Self-study: Latin, German, ...
     */
    const colonMatch = line.match(
      /^([^:]+):\s*(.*)$/
    );

    if (colonMatch) {
      const title = colonMatch[1].trim();
      const content = colonMatch[2].trim();

      currentSection = {
        title,
        items: [],
      };

      sections.push(currentSection);

      if (content) {
        currentSection.items.push(content);
      }

      continue;
    }

    /*
     * ถ้าเป็นข้อความธรรมดา เช่น
     *
     * English
     *
     * ให้เป็นหัวข้อใหม่
     */
    currentSection = {
      title: line,
      items: [],
    };

    sections.push(currentSection);
  }

  /*
   * กรณีข้อมูลขึ้นต้นด้วย
   *
   * English Taken in 2024
   *
   * หลังจากแยกแล้วจะได้:
   *
   * English
   * Taken in 2024
   *
   * ซึ่งต้องทำให้ English เป็น section หลัก
   */
  const finalSections: BioSection[] = [];

  for (let i = 0; i < sections.length; i++) {
    const section = sections[i];

    if (
      section.title !== "Taken in 2024" &&
      section.title !== "Taken in 2023" &&
      /^Taken in \d{4}$/i.test(
        sections[i + 1]?.title || ""
      )
    ) {
      finalSections.push({
        title: section.title,
        items: [],
      });

      continue;
    }

    finalSections.push(section);
  }

  /*
   * รวม section ที่เกี่ยวข้องกัน เช่น:
   *
   * English
   * Taken in 2024
   * - TOEFL
   *
   * Taken in 2023
   * - IELTS
   *
   * ให้แสดงเป็น:
   *
   * English
   *   Taken in 2024
   *   - TOEFL
   *
   *   Taken in 2023
   *   - IELTS
   */

  const result: BioSection[] = [];

  let mainLanguage: BioSection | null = null;

  for (const section of finalSections) {
    if (/^Taken in \d{4}$/i.test(section.title)) {
      if (mainLanguage) {
        mainLanguage.items.push(
          `__YEAR__${section.title}`
        );

        mainLanguage.items.push(
          ...section.items
        );
      } else {
        result.push(section);
      }

      continue;
    }

    mainLanguage = section;
    result.push(section);
  }

  return result;
}

function BioDisplay({
  bio,
}: {
  bio?: string;
}) {
  const sections = parseBio(bio || "");

  if (sections.length === 0) {
    return null;
  }

  return (
    <div className="mt-5 space-y-4">

      {sections.map((section, index) => {

        const normalItems: string[] = [];

        let currentYear = "";

        return (
          <div
            key={`${section.title}-${index}`}
            className="rounded-xl bg-gray-50 p-4"
          >

            <h4 className="font-semibold text-gray-900">
              {section.title}
            </h4>

            <div className="mt-3 space-y-3">

              {section.items.map(
                (item, itemIndex) => {

                  if (
                    item.startsWith(
                      "__YEAR__"
                    )
                  ) {
                    currentYear =
                      item.replace(
                        "__YEAR__",
                        ""
                      );

                    return (
                      <div
                        key={`${item}-${itemIndex}`}
                        className="pt-1"
                      >
                        <p className="text-sm font-semibold text-gray-700">
                          {currentYear}
                        </p>
                      </div>
                    );
                  }

                  return (
                    <div
                      key={`${item}-${itemIndex}`}
                      className="flex gap-2 text-sm leading-6 text-gray-600"
                    >
                      <span className="shrink-0 text-blue-600">
                        •
                      </span>

                      <span>
                        {item}
                      </span>
                    </div>
                  );
                }
              )}

            </div>
          </div>
        );
      })}

    </div>
  );
}

export default function TutorList() {
  const [tutors, setTutors] =
    useState<Tutor[]>([]);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadTutors() {
      try {
        const response =
          await fetch(
            `${API_URL}/tutors`,
            {
              cache: "no-store",
            }
          );

        const data =
          await response.json();

        setTutors(
          Array.isArray(data)
            ? data
            : []
        );

      } catch (error) {
        console.error(
          "Cannot load tutors:",
          error
        );
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
          <p className="text-gray-500">
            Loading tutors...
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      id="tutors"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-6xl">

        <div className="text-center">

          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Our Tutors
          </span>

          <h2 className="mt-3 text-4xl font-bold text-gray-900">
            Meet Your Tutors
          </h2>

          <p className="mx-auto mt-4 max-w-2xl text-gray-600">
            Learn with experienced tutors who
            can help you reach your language goals.
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

                {tutor.languages && (
                  <p className="mt-3 text-sm font-semibold leading-6 text-blue-600">
                    {tutor.languages}
                  </p>
                )}

                {tutor.expertise && (
                  <p className="mt-3 text-sm text-gray-500">
                    {tutor.expertise}
                  </p>
                )}

                <BioDisplay
                  bio={tutor.bio}
                />

              </div>

            ))}

          </div>

        )}

      </div>
    </section>
  );
}