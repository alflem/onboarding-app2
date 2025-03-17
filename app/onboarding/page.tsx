import { OnboardingAccordion } from "@/components/onboarding-accordion";
import Header from "@/components/Header";

export default function OnboardingPage() {
  return (
    <div>
      <Header />
      <div className="container max-w-md mx-auto py-10">
        <h1 className="text-2xl font-bold mb-6">Complete Your Onboarding</h1>
        <OnboardingAccordion />
      </div>
    </div>
  );
}
