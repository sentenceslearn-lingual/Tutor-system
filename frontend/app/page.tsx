import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import TutorList from "@/components/Tutors/TutorList";
import RegistrationForm from "@/components/RegistrationForm";
import StudentHours from "@/components/StudentHours/StudentHours";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-gray-900">
      <Navbar />
      <Hero />
      <TutorList />
      <StudentHours />
      <RegistrationForm />
    </main>
  );
}
