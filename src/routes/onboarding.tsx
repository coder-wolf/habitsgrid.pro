import { createFileRoute } from "@tanstack/react-router";
import { OnboardingFlow } from "@/components/onboarding-flow";

export const Route = createFileRoute("/onboarding")({
  component: OnboardingFlow,
});
