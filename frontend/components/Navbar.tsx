export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <h1 className="text-xl font-bold text-blue-700">Sentences</h1>

        <nav className="hidden gap-6 text-sm font-medium md:flex">
          <a href="#languages" className="hover:text-blue-600">
            Languages
          </a>
          <a href="#packages" className="hover:text-blue-600">
            Packages
          </a>
          <a href="#contact" className="hover:text-blue-600">
            Contact
          </a>
        </nav>
      </div>
    </header>
  );
}