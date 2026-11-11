import Comparison from "@/components/Comparison";
import Faq from "@/components/Faq";
import Footer from "@/components/Footer";
import FundingBlock from "@/components/FundingBlock";
import Hero from "@/components/Hero";
import HowItWorks from "@/components/HowItWorks";
import Marquee from "@/components/Marquee";
import Nav from "@/components/Nav";
import Pricing from "@/components/Pricing";
import Testimonials from "@/components/Testimonials";
import WaitlistSection from "@/components/WaitlistSection";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Marquee />
        <HowItWorks />
        <Pricing />
        <Comparison />
        <Testimonials />
        <Faq />
        <WaitlistSection />
        <FundingBlock url={process.env.NEXT_PUBLIC_FUNDING_URL} />
      </main>
      <Footer />
    </>
  );
}
