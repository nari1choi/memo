import type { MemoLabel } from "@/data/memos";
import { LABEL_CLASS } from "./labelClass";

/** 메모의 분류 배지. 색은 메모의 색 라벨을 따른다. */
export function Badge({ label, color }: { label: string; color: MemoLabel }) {
  return (
    <span
      className={`flex shrink-0 items-center rounded-full px-8 py-4 text-caption-sm whitespace-nowrap ${LABEL_CLASS[color]}`}
    >
      {label}
    </span>
  );
}
