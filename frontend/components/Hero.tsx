export default function Hero() {
  return (
    <section className="relative flex min-h-[85vh] items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-indigo-100" />

      <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl" />
      <div className="absolute -right-20 bottom-0 h-80 w-80 rounded-full bg-indigo-200/40 blur-3xl" />

      <div className="relative z-10 max-w-4xl px-6 text-center">
        <span className="rounded-full border border-blue-200 bg-white px-4 py-2 text-sm font-medium text-blue-700 shadow-sm">
          Personalized Language Learning
        </span>

        <h2 className="mt-8 text-5xl font-extrabold leading-tight text-gray-900 md:text-7xl">
          Learn Languages <br />
          <span className="text-blue-700">with Confidence</span>
        </h2>

        <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-gray-600 md:text-xl">
          Private tutoring designed for real progress in English, Chinese,
          Korean, Japanese, and Thai.
        </p>

        <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
          <a
            href="#apply"
            className="rounded-2xl bg-blue-600 px-8 py-4 text-lg font-semibold text-white shadow-lg transition hover:-translate-y-1 hover:bg-blue-700 hover:shadow-xl"
          >
            Apply for Lessons
          </a>

          <a
            href="#hours"
            className="rounded-2xl border border-blue-300 bg-white px-8 py-4 text-lg font-semibold text-blue-700 shadow-sm transition hover:-translate-y-1 hover:bg-blue-50 hover:shadow-lg"
          >
            Check My Hours
          </a>
        </div>
      </div>
    </section>
  );
}