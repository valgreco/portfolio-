import { Fragment } from "react";

// Renders ValerIA's replies with clickable links and **bold**.
// Deliberately tiny: handles paragraphs, bold, and URLs only. If replies ever
// start using lists or headings, swap this for react-markdown instead of
// growing this parser.
export default function RichText({ content }: { content: string }) {
  const paragraphs = content.split(/\n{2,}/);
  return (
    <>
      {paragraphs.map((para, pi) => (
        <p key={pi} className={`whitespace-pre-line${pi > 0 ? " mt-3" : ""}`}>
          {renderInline(para)}
        </p>
      ))}
    </>
  );
}

function renderInline(text: string) {
  // Split on bold spans and URLs, keeping the delimiters.
  const parts = text.split(/(\*\*[^*]+\*\*|https?:\/\/[^\s]+)/g);

  return parts.map((part, i) => {
    if (!part) return null;

    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (/^https?:\/\//.test(part)) {
      // Keep trailing punctuation out of the link target.
      const trail = part.match(/[.,;:)]+$/)?.[0] ?? "";
      const url = trail ? part.slice(0, -trail.length) : part;
      return (
        <Fragment key={i}>
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="underline underline-offset-2 text-white hover:text-neutral-300 transition-colors"
          >
            {url}
          </a>
          {trail}
        </Fragment>
      );
    }

    return <Fragment key={i}>{part}</Fragment>;
  });
}
