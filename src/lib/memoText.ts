import type { MemoBlock } from "@/data/memos";

/** 굵게 표시(**)를 뺀 글자만 */
export function plainText(text: string) {
  return text.replace(/\*\*/g, "");
}

/** 목록에서 보일 미리보기: 제목 묶음을 건너뛴 첫 내용 */
export function previewOf(blocks: MemoBlock[]) {
  const block = blocks.find((b) => b.type === "paragraph" || b.type === "list") ?? blocks[0];
  if (!block) return "";
  const text = block.type === "list" ? block.items.join(", ") : block.text;
  return plainText(text).replace(/\n/g, " ");
}

function escapeHtml(text: string) {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;");
}

function inlineHtml(text: string) {
  return escapeHtml(text)
    .replace(/\*\*([^*]+)\*\*/g, "<b>$1</b>")
    .replace(/\n/g, "<br>");
}

/** 본문 묶음 → 편집기 HTML (글자는 모두 이스케이프한다) */
export function blocksToHtml(blocks: MemoBlock[]) {
  return blocks
    .map((block) => {
      switch (block.type) {
        case "heading":
          return `<h2>${escapeHtml(block.text)}</h2>`;
        case "subheading":
          return `<h3>${escapeHtml(block.text)}</h3>`;
        case "paragraph":
          return `<p>${inlineHtml(block.text)}</p>`;
        case "list":
          return `<ul>${block.items.map((item) => `<li>${inlineHtml(item)}</li>`).join("")}</ul>`;
      }
    })
    .join("");
}

function inlineText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) return node.textContent ?? "";
  if (!(node instanceof HTMLElement)) return "";
  if (node.tagName === "BR") return "\n";
  const inner = Array.from(node.childNodes).map(inlineText).join("");
  if ((node.tagName === "B" || node.tagName === "STRONG") && inner.trim()) return `**${inner}**`;
  return inner;
}

const BLOCK_TAGS = new Set(["H2", "H3", "UL", "OL", "P", "DIV"]);

const isBlock = (node: Node): node is HTMLElement =>
  node instanceof HTMLElement && BLOCK_TAGS.has(node.tagName);

/**
 * 편집기 DOM → 본문 묶음.
 * 브라우저가 문단 안에 목록을 넣는 경우(<p><ul>…</ul></p>)도 있어서,
 * 묶음이 들어 있는 문단은 안쪽을 다시 나눠 읽는다.
 */
export function htmlToBlocks(root: HTMLElement): MemoBlock[] {
  const blocks: MemoBlock[] = [];
  let inline: Node[] = [];

  const flushInline = () => {
    const text = inline.map(inlineText).join("").replace(/\n+$/, "").trim();
    if (text) blocks.push({ type: "paragraph", text });
    inline = [];
  };

  const walk = (nodes: Node[]) => {
    for (const node of nodes) {
      if (!isBlock(node)) {
        inline.push(node);
        continue;
      }
      flushInline();
      const tag = node.tagName;
      if (tag === "H2" || tag === "H3") {
        const text = node.textContent?.trim() ?? "";
        if (text) blocks.push({ type: tag === "H2" ? "heading" : "subheading", text });
      } else if (tag === "UL" || tag === "OL") {
        const items = Array.from(node.children)
          .map((li) => inlineText(li).trim())
          .filter(Boolean);
        if (items.length) blocks.push({ type: "list", items });
      } else {
        walk(Array.from(node.childNodes));
        flushInline();
      }
    }
  };

  walk(Array.from(root.childNodes));
  flushInline();
  return blocks;
}
