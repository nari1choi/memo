export type MemoLabel = "blue" | "green" | "orange" | "pink";

export type MemoCategory = "업무" | "개인" | "아이디어";

/** 본문 묶음. 글 안의 "**굵게**"는 굵은 글자로, 줄바꿈은 그대로 보인다. */
export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
  category: MemoCategory;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  /** 정렬과 날짜 묶음에 쓰는 시각 (ISO) */
  savedAt: string;
  body: MemoBlock[];
};

export const CATEGORIES: MemoCategory[] = ["업무", "개인", "아이디어"];

/** 본문 글자 수 (굵게 표시와 줄바꿈은 세지 않는다) */
export function countMemoChars(memo: Memo) {
  return memo.body
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .join("")
    .replace(/\*\*|\n/g, "").length;
}
