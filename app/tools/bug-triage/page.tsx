import ToolDetail from "@/components/ToolDetail";

export const metadata = {
  title: "Bug Triage Agent — Valeria Greco",
};

export default function BugTriagePage() {
  return (
    <ToolDetail
      eyebrow="Building with AI"
      title="Bug Triage Agent"
      intro="Automated bug prioritization connected to Jira and Notion via Claude."
      stat={{ value: "~80%", label: "less time spent working out what a report meant" }}
      problem='Anyone could report something broken, but "is this a bug" is really three questions: a broken rule, a missing rule, or the product working while the merchant is still blocked. Reports arrived unclassified, and engineering lost time working out what was meant and where it belonged.'
      solution="A Claude project reads the raw report, classifies it into the right one, sets severity and SLA, and files the Jira and Notion ticket automatically."
      outcome="About 80% less time spent working out what a report meant."
    />
  );
}
