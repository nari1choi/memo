"use client";

import { useEffect, useRef, useState } from "react";
import type { MemoBlock } from "@/data/memos";
import { blocksToHtml, htmlToBlocks } from "@/lib/memoText";
import { FormatButton } from "./FormatButton";

type BlockFormat = "heading" | "subheading" | "list" | null;

type MemoEditorProps = {
  initialBody: MemoBlock[];
  onChange: (body: MemoBlock[]) => void;
};

// 본문 안의 제목·소제목·목록·굵게를 상세 화면과 같은 토큰으로 보여 준다
const CONTENT_CLASS = [
  "flex flex-col gap-8 px-20 py-16 text-body-md text-text-secondary outline-none",
  "[&_h2]:text-title-lg [&_h2]:text-text-primary",
  "[&_h3]:text-title-md [&_h3]:text-text-primary",
  "[&_b]:font-bold [&_b]:text-text-primary [&_strong]:font-bold [&_strong]:text-text-primary",
  "[&_ul]:flex [&_ul]:flex-col [&_ul]:gap-4",
  "[&_li]:flex [&_li]:gap-8 [&_li]:before:content-['•']",
].join(" ");

function currentBlockFormat(root: HTMLElement): BlockFormat {
  const node = document.getSelection()?.anchorNode;
  const el = node instanceof HTMLElement ? node : node?.parentElement;
  if (!el || !root.contains(el)) return null;
  const block = el.closest("h2, h3, li");
  if (!block || !root.contains(block)) return null;
  return block.tagName === "H2" ? "heading" : block.tagName === "H3" ? "subheading" : "list";
}

/** 본문 편집기. 굵게(B), 제목, 소제목, 목록 서식을 쓸 수 있다. */
export function MemoEditor({ initialBody, onChange }: MemoEditorProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [initialHtml] = useState(() => blocksToHtml(initialBody));
  const [empty, setEmpty] = useState(initialBody.length === 0);
  const [bold, setBold] = useState(false);
  const [block, setBlock] = useState<BlockFormat>(null);

  // 커서가 움직일 때마다 서식 버튼의 상태를 맞춘다
  useEffect(() => {
    const update = () => {
      const root = ref.current;
      if (!root || !root.contains(document.getSelection()?.anchorNode ?? null)) return;
      setBold(document.queryCommandState("bold"));
      setBlock(currentBlockFormat(root));
    };
    document.addEventListener("selectionchange", update);
    return () => document.removeEventListener("selectionchange", update);
  }, []);

  const emit = () => {
    const root = ref.current;
    if (!root) return;
    const body = htmlToBlocks(root);
    setEmpty(body.length === 0);
    onChange(body);
  };

  const run = (command: string, value?: string) => {
    ref.current?.focus();
    document.execCommand(command, false, value);
    const root = ref.current;
    if (root) {
      setBold(document.queryCommandState("bold"));
      setBlock(currentBlockFormat(root));
    }
    emit();
  };

  const toggleBlock = (format: "heading" | "subheading") => {
    const tag = format === "heading" ? "h2" : "h3";
    run("formatBlock", block === format ? "<p>" : `<${tag}>`);
  };

  return (
    <div className="flex flex-col overflow-clip rounded-lg bg-surface-card focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
      <div role="toolbar" aria-label="서식" className="flex items-center gap-4 px-12 py-8">
        <FormatButton label="B" ariaLabel="굵게" active={bold} onPress={() => run("bold")} />
        <FormatButton label="제목" active={block === "heading"} onPress={() => toggleBlock("heading")} />
        <FormatButton label="소제목" active={block === "subheading"} onPress={() => toggleBlock("subheading")} />
        <FormatButton label="목록" active={block === "list"} onPress={() => run("insertUnorderedList")} />
      </div>
      <hr className="h-px border-0 bg-border-default" />
      <div className="relative">
        {empty && (
          <p className="pointer-events-none absolute top-16 left-20 text-body-md text-text-muted">
            내용을 입력하세요
          </p>
        )}
        <div
          ref={ref}
          role="textbox"
          aria-multiline="true"
          aria-label="본문"
          contentEditable
          suppressContentEditableWarning
          className={CONTENT_CLASS}
          dangerouslySetInnerHTML={{ __html: initialHtml }}
          onFocus={() => document.execCommand("defaultParagraphSeparator", false, "p")}
          onInput={emit}
          // 붙여 넣은 글은 서식 없이 글자만 넣는다
          onPaste={(e) => {
            e.preventDefault();
            document.execCommand("insertText", false, e.clipboardData.getData("text/plain"));
          }}
        />
      </div>
    </div>
  );
}
