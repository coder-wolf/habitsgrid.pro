import { createFileRoute } from "@tanstack/react-router";
import { OnboardingFlow } from "@/components/onboarding-flow";

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Onboarding — HabitsGrid" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/onboarding" }],
  }),
  component: OnboardingFlow,
});
