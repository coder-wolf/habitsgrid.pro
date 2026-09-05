import { createFileRoute } from "@tanstack/react-router";
import { OnboardingFlow } from "@/components/onboarding-flow";
import { SeoFooter } from "@/components/seo-footer";

function OnboardingPage() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <div className="flex flex-1 items-center justify-center">
        <OnboardingFlow embedded />
      </div>
      <SeoFooter />
    </div>
  );
}

export const Route = createFileRoute("/onboarding")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Onboarding — HabitsGrid" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/onboarding" }],
  }),
  component: OnboardingPage,
});
