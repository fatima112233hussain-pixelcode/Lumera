import { Hero } from "@/components/marketing/hero";
import {
  Features,
  FreeForever,
  HowItWorks,
} from "@/components/marketing/marketing-sections";

export default function HomePage() {
  return (
    <>
      <Hero />
      <HowItWorks />
      <Features />
      <FreeForever />
    </>
  );
}
