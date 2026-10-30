import type { MemoLabel } from "@/data/memos";

/** 색 라벨별 연한 배경 + 진한 글자색. 메모 칸과 배지가 함께 쓴다. */
export const LABEL_CLASS: Record<MemoLabel, string> = {
  blue: "bg-label-blue-soft text-label-blue",
  green: "bg-label-green-soft text-label-green",
  orange: "bg-label-orange-soft text-label-orange",
  pink: "bg-label-pink-soft text-label-pink",
};
