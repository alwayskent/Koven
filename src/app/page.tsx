import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Footer from "@/components/Footer";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-white">
      <div className="relative">
        <Navbar />
        <Hero />
      </div>
      <Footer />
    </main>
  );
}
