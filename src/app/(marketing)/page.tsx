import { Benefits } from "@/components/landing/benefits";
import { Features } from "@/components/landing/features";
import { FinalCta } from "@/components/landing/final-cta";
import { Hero } from "@/components/landing/hero";
import { HowItWorks } from "@/components/landing/how-it-works";
import { SampleRoadmap } from "@/components/landing/sample-roadmap";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <SampleRoadmap />
      <Benefits />
      <FinalCta />
    </>
  );
}
