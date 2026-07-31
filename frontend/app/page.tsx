import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import RegistrationForm from "@/components/RegistrationForm";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <RegistrationForm />
    </main>
  );
}