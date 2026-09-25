import ToolDetail from "@/components/ToolDetail";

export const metadata = {
  title: "Product Request Form, Valeria Greco",
};

export default function ProductRequestPage() {
  return (
    <ToolDetail
      eyebrow="Building with AI"
      title="Product Request Form"
      intro="Structured intake that turns messy stakeholder asks into scoped, prioritized product requests."
      stat={{ value: "60%", label: "less time spent on poorly framed requests" }}
      problem="Feature requests arrived as solutions looking for a problem, in any language and any shape, so product couldn't tell what actually hurt or who it affected."
      solution="A Claude assistant interrogates the request until it stands on its own: the problem, who it affects, what they need. Then it files one clean ticket and sends status back in Slack. It won't write the request for you, on purpose. It makes the person think, rather than thinking for them."
      outcome="60% less time spent on poorly framed requests."
    />
  );
}
