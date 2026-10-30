import type { MemoBlock } from "@/data/memos";

/** "**굵게**" 표시를 굵은 글자로 바꾸고, 줄바꿈은 그대로 둔다. */
function RichText({ text }: { text: string }) {
  return text.split(/(\*\*[^*]+\*\*)/).map((part, i) =>
    part.startsWith("**") ? (
      <strong key={i} className="font-bold text-text-primary">
        {part.slice(2, -2)}
      </strong>
    ) : (
      part
    ),
  );
}

export function MemoBody({ blocks }: { blocks: MemoBlock[] }) {
  return (
    <div className="flex flex-col gap-12">
      {blocks.map((block, i) => {
        switch (block.type) {
          case "heading":
            return (
              <h2 key={i} className="text-title-lg text-text-primary">
                {block.text}
              </h2>
            );
          case "subheading":
            return (
              <h3 key={i} className="text-title-md text-text-primary">
                {block.text}
              </h3>
            );
          case "paragraph":
            return (
              <p key={i} className="text-body-md whitespace-pre-line text-text-secondary">
                <RichText text={block.text} />
              </p>
            );
          case "list":
            return (
              <ul key={i} className="flex flex-col gap-4 text-body-md text-text-secondary">
                {block.items.map((item) => (
                  <li key={item} className="flex items-start gap-8">
                    <span aria-hidden="true">•</span>
                    <span className="min-w-0 flex-1">
                      <RichText text={item} />
                    </span>
                  </li>
                ))}
              </ul>
            );
        }
      })}
    </div>
  );
}
