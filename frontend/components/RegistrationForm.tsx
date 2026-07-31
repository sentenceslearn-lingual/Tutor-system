'use client';

import { useState } from 'react';

const packageData = {
  '1': { hours: 1, price: 200, discount: 0 },
  '10': { hours: 10, price: 1900, discount: 5 },
  '20': { hours: 20, price: 3600, discount: 10 },
  '30': { hours: 30, price: 5100, discount: 15 },
};

export default function RegistrationForm() {
  const [selectedPackage, setSelectedPackage] = useState<'1' | '10' | '20' | '30'>('1');

  const [fullName, setFullName] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  const currentPackage = packageData[selectedPackage];

  return (
    <section id="apply" className="bg-white px-6 py-24">
      <div className="mx-auto max-w-3xl">
        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Apply for Lessons
          </span>

          <h3 className="mt-3 text-4xl font-bold text-gray-900">
            Start Your Learning Journey
          </h3>
        </div>

        <form className="mt-12 space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg">
          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h4>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Full Name (Thai)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              value={certificateName}
              onChange={(e) => setCertificateName(e.target.value)}
              placeholder="Name for Certificate (English)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-2">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Phone Number"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            </div>
          </div>

          {/* Languages */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">
              Languages
            </h4>

            <div className="grid gap-3 sm:grid-cols-2">
              {[
                'English',
                'Chinese',
                'Korean',
                'Japanese',
                'Thai',
              ].map((language) => (
                <label
                  key={language}
                  className="flex items-center gap-3 rounded-xl border border-gray-200 p-4"
                >
                  <input
                    type="checkbox"
                    className="h-5 w-5"
                    checked={selectedLanguages.includes(language)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setSelectedLanguages([
                          ...selectedLanguages,
                          language,
                        ]);
                      } else {
                        setSelectedLanguages(
                          selectedLanguages.filter(
                            (l) => l !== language
                          )
                        );
                      }
                    }}
                  />

                  <span>{language}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Package */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">
              Learning Package
            </h4>

            <select
              value={selectedPackage}
              onChange={(e) =>
                setSelectedPackage(
                  e.target.value as '1' | '10' | '20' | '30'
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >
              <option value="1">1 Hour - 200 THB</option>
              <option value="10">10 Hours - 1,900 THB</option>
              <option value="20">20 Hours - 3,600 THB</option>
              <option value="30">30 Hours - 5,100 THB</option>
            </select>
          </div>

          {/* Package Summary */}
          <div className="rounded-2xl bg-blue-50 p-6">
            <h4 className="text-xl font-semibold text-blue-700">
              Package Summary
            </h4>

            <div className="mt-4 space-y-2 text-gray-700">
              <div className="flex justify-between">
                <span>Total Hours</span>
                <span className="font-semibold">
                  {currentPackage.hours} Hours
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>
                <span className="font-semibold">
                  {currentPackage.discount}%
                </span>
              </div>

              <div className="flex justify-between border-t border-blue-200 pt-3 text-lg font-bold text-blue-700">
                <span>Final Price</span>
                <span>
                  {currentPackage.price.toLocaleString()} THB
                </span>
              </div>
            </div>
          </div>

          {/* Submit */}
<button
  type="button"
  onClick={async () => {
    const studentData = {
      fullName,
      certificateName,
      email,
      phone,
      languages: selectedLanguages,
      package: selectedPackage,
      hours: currentPackage.hours,
      price: currentPackage.price,
    };

    try {
      const response = await fetch(
        "http://localhost:3002/students/register",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(studentData),
        }
      );

      const result = await response.json();

      console.log(result);

      alert(
        `Registration submitted! Your Student ID is ${result.studentId}`
      );

    } catch (error) {
      console.error(error);

      alert(
        "Cannot connect to server. Please try again."
      );
    }
  }}
  className="w-full rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700"
>
  Continue to Payment
</button>
        </form>
      </div>
    </section>
  );
}