
'use client';

import { useState } from 'react';
import { API_URL } from '@/lib/api';

const packageData = {
  '1': { hours: 1, price: 200, discount: 0 },
  '10': { hours: 10, price: 1900, discount: 5 },
  '20': { hours: 20, price: 3600, discount: 10 },
  '30': { hours: 30, price: 5100, discount: 15 },
};

const languageOptions = [
  'English',
  'Chinese',
  'Korean',
  'Japanese',
  'Thai',
  'Other',
];

export default function RegistrationForm() {
  const [selectedPackage, setSelectedPackage] =
    useState<'1' | '10' | '20' | '30'>('1');

  const [fullName, setFullName] = useState('');
  const [certificateName, setCertificateName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const [selectedLanguages, setSelectedLanguages] =
    useState<string[]>([]);

  const [otherLanguage, setOtherLanguage] = useState('');

  const [loading, setLoading] = useState(false);

  const currentPackage = packageData[selectedPackage];

  function toggleLanguage(language: string) {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(
        selectedLanguages.filter((l) => l !== language)
      );

      if (language === 'Other') {
        setOtherLanguage('');
      }
    } else {
      setSelectedLanguages([
        ...selectedLanguages,
        language,
      ]);
    }
  }

  async function handleSubmit() {
    if (loading) return;

    if (!fullName.trim()) {
      alert('Please enter your full name.');
      return;
    }

    if (!email.trim()) {
      alert('Please enter your email.');
      return;
    }

    if (!phone.trim()) {
      alert('Please enter your phone number.');
      return;
    }

    if (selectedLanguages.length === 0) {
      alert('Please select at least one language.');
      return;
    }

    if (
      selectedLanguages.includes('Other') &&
      !otherLanguage.trim()
    ) {
      alert('Please specify the other language.');
      return;
    }

    setLoading(true);

    const languageList = selectedLanguages.map(
      (language) =>
        language === 'Other'
          ? otherLanguage.trim()
          : language
    );

    const studentData = {
      fullName: fullName.trim(),
      certificateName: certificateName.trim(),
      email: email.trim(),
      phone: phone.trim(),
      languages: languageList.join(', '),
      packageHours: currentPackage.hours,
      packagePrice: currentPackage.price,
    };

    try {
      const response = await fetch(
        `${API_URL}/students/register`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(studentData),
        }
      );

      const result = await response.json();

      console.log(result);

      if (!response.ok) {
        alert(
          result.message ||
            'Registration failed. Please try again.'
        );
        return;
      }

      alert(
        `Registration successful!\n\nYour Student ID is: ${result.studentId}`
      );

      setFullName('');
      setCertificateName('');
      setEmail('');
      setPhone('');
      setSelectedLanguages([]);
      setOtherLanguage('');
      setSelectedPackage('1');
    } catch (error) {
      console.error(error);

      alert(
        'Cannot connect to server. Please try again.'
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      id="apply"
      className="bg-white px-6 py-24"
    >
      <div className="mx-auto max-w-3xl">

        <div className="text-center">
          <span className="text-sm font-semibold uppercase tracking-wider text-blue-600">
            Apply for Lessons
          </span>

          <h3 className="mt-3 text-4xl font-bold text-gray-900">
            Start Your Learning Journey
          </h3>
        </div>

        <form
          className="mt-12 space-y-8 rounded-3xl border border-gray-200 bg-white p-8 shadow-lg"
          onSubmit={(e) => {
            e.preventDefault();
            handleSubmit();
          }}
        >

          {/* Personal Information */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">
              Personal Information
            </h4>

            <input
              type="text"
              value={fullName}
              onChange={(e) =>
                setFullName(e.target.value)
              }
              placeholder="Full Name (Thai)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <input
              type="text"
              value={certificateName}
              onChange={(e) =>
                setCertificateName(e.target.value)
              }
              placeholder="Name for Certificate (English)"
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            />

            <div className="grid gap-4 md:grid-cols-2">

              <input
                type="email"
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                placeholder="Email"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />

              <input
                type="tel"
                value={phone}
                onChange={(e) =>
                  setPhone(e.target.value)
                }
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

              {languageOptions.map((language) => (

                <label
                  key={language}
                  className="flex cursor-pointer items-center gap-3 rounded-xl border border-gray-200 p-4"
                >

                  <input
                    type="checkbox"
                    checked={selectedLanguages.includes(
                      language
                    )}
                    onChange={() =>
                      toggleLanguage(language)
                    }
                    className="h-5 w-5"
                  />

                  <span>
                    {language}
                  </span>

                </label>

              ))}

            </div>

            {selectedLanguages.includes('Other') && (
              <input
                type="text"
                value={otherLanguage}
                onChange={(e) =>
                  setOtherLanguage(e.target.value)
                }
                placeholder="Please specify"
                className="w-full rounded-xl border border-gray-300 px-4 py-3"
              />
            )}
          </div>

          {/* Learning Package */}
          <div className="space-y-4">
            <h4 className="text-xl font-semibold text-gray-900">
              Learning Package
            </h4>

            <select
              value={selectedPackage}
              onChange={(e) =>
                setSelectedPackage(
                  e.target.value as
                    | '1'
                    | '10'
                    | '20'
                    | '30'
                )
              }
              className="w-full rounded-xl border border-gray-300 px-4 py-3"
            >

              <option value="1">
                1 Hour - 200 THB
              </option>

              <option value="10">
                10 Hours - 1,900 THB
              </option>

              <option value="20">
                20 Hours - 3,600 THB
              </option>

              <option value="30">
                30 Hours - 5,100 THB
              </option>

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

                <span>
                  {currentPackage.hours} Hours
                </span>
              </div>

              <div className="flex justify-between">
                <span>Discount</span>

                <span>
                  {currentPackage.discount}%
                </span>
              </div>

              <div className="flex justify-between border-t pt-3 text-lg font-bold text-blue-700">

                <span>
                  Final Price
                </span>

                <span>
                  {currentPackage.price.toLocaleString()} THB
                </span>

              </div>

            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-400"
          >
            {loading
              ? 'Submitting...'
              : 'Continue to Payment'}
          </button>

        </form>
      </div>
    </section>
  );
}

