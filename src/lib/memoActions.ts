"use server";

import { revalidatePath } from "next/cache";
import { CATEGORIES, type MemoBlock, type MemoCategory, type MemoLabel } from "@/data/memos";
import { supabase } from "./supabase";

export type NewMemo = {
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
};

const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

/** 새 메모를 Supabase에 저장한다. 홈과 전체 메모 목록은 다음에 열 때 새로 읽는다. */
export async function createMemo(memo: NewMemo) {
  if (!CATEGORIES.includes(memo.category) || !LABELS.includes(memo.label)) {
    throw new Error("분류나 색이 올바르지 않아요");
  }
  const { error } = await supabase.from("memos").insert({
    title: memo.title.trim() || "제목 없음",
    category: memo.category,
    label: memo.label,
    body: memo.body,
  });
  if (error) throw new Error(`메모를 저장하지 못했어요: ${error.message}`);
  revalidatePath("/");
  revalidatePath("/memos");
}
