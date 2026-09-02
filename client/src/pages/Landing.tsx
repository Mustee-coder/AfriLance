import Navbar from "@/components/landing/Navbar";
import Hero from "@/components/landing/Hero";
import Stats from "@/components/landing/Stats";
import HowItWorks from "@/components/landing/HowItWorks";
import ForDevelopers from "@/components/landing/ForDevelopers";
import ForClients from "@/components/landing/ForClients";
import FeaturedTalent from "@/components/landing/FeaturedTalent";
import FeaturedJobs from "@/components/landing/FeaturedJobs";
import WhyAfriLance from "@/components/landing/WhyAfriLance";
import FinalCTA from "@/components/landing/FinalCTA";
import Footer from "@/components/landing/Footer";



const Landing = () => {
  return (
    <main>
      <Navbar />
      <Hero />
      <Stats />
      <HowItWorks />
      <ForDevelopers />
     <ForClients />
    <FeaturedTalent />
   <FeaturedJobs />
  <WhyAfriLance />
<FinalCTA />
    <Footer />
    </main>
  );
};

export default Landing;