import Header from "../components/layout/Header";
import Hero from "../components/sections/Hero";
import LogoMarquee from "../components/sections/LogoMarquee";
import Position from "../components/sections/Position";
import Capabilities from "../components/sections/Capabilities";
import SelectedWork from "../components/sections/SelectedWork";
import Process from "../components/sections/Process";
import People from "../components/sections/People";
import ContactBanner from "../components/sections/ContactBanner";
import Footer from "../components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col selection:bg-brand/20 selection:text-brand">
      {/* Header section */}
      <Header />

      {/* Main hero section content */}
      <main className="flex-1 flex flex-col justify-start items-stretch">
        <Hero />
        <LogoMarquee />
        <Position />
        <Capabilities />
        <SelectedWork />
        <Process />
        <People />
        <ContactBanner />
      </main>

      {/* Footer layout */}
      <Footer />
    </div>
  );
}





