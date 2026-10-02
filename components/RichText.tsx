import { Fragment } from "react";

// Renders ValerIA's replies with clickable links, **bold** and *italic*.
// Deliberately tiny: handles paragraphs, bold, italic, markdown links and bare
// URLs only. If replies ever start using lists or headings, swap this for
// react-markdown instead of growing this parser.
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
  // Split on markdown links, bold spans, italic spans and bare URLs, keeping
  // the delimiters. Order matters: links and bold before italic.
  const parts = text.split(
    /(\[[^\]]+\]\(https?:\/\/[^\s)]+\)|\*\*[^*]+\*\*|\*[^*\n]+\*|https?:\/\/[^\s]+)/g
  );

  return parts.map((part, i) => {
    if (!part) return null;

    const link = part.match(/^\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)$/);
    if (link) {
      return (
        <a
          key={i}
          href={link[2]}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 text-white hover:text-neutral-300 transition-colors"
        >
          {link[1]}
        </a>
      );
    }

    if (/^\*\*[^*]+\*\*$/.test(part)) {
      return (
        <strong key={i} className="font-semibold text-white">
          {part.slice(2, -2)}
        </strong>
      );
    }

    if (/^\*[^*\n]+\*$/.test(part)) {
      return (
        <em key={i} className="italic text-neutral-200">
          {part.slice(1, -1)}
        </em>
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
