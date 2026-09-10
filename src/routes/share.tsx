import { createFileRoute } from "@tanstack/react-router";
import { TabPage } from "@/components/tab-page";
import { ShareView } from "@/components/share-view";

function SharePage() {
  return (
    <TabPage title="Share your progress" subtitle="Pick a day, pick a style, then copy it anywhere.">
      <ShareView />
    </TabPage>
  );
}

export const Route = createFileRoute("/share")({
  head: () => ({
    meta: [
      { name: "robots", content: "noindex, nofollow" },
      { title: "Share — HabitsGrid" },
    ],
    links: [{ rel: "canonical", href: "https://habitsgrid.pro/share" }],
  }),
  component: SharePage,
});
