import Navbar from "@/components/layout/Navbar";
import Hero from "@/components/home/Hero";
import ExploreServices from "@/components/home/ExploreServices";
import FeaturedProperties from "@/components/home/FeaturedProperties";
import FeaturedAgents from "@/components/home/FeaturedAgents";
import Statistics from "@/components/home/Statistics";
import Testimonials from "@/components/home/Testimonials";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <ExploreServices />
      <FeaturedProperties />
      <FeaturedAgents />
      <Statistics />
      <Testimonials />
      <Footer />
    </>
  );
}