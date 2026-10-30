import { cache } from "react";
import { connection } from "next/server";
import type { Memo, MemoBlock, MemoCategory, MemoLabel } from "@/data/memos";
import { previewOf } from "./memoText";
import { supabase } from "./supabase";

/** Supabase memos 표의 한 줄 */
export type MemoRow = {
  id: string;
  title: string;
  body: MemoBlock[];
  category: MemoCategory;
  label: MemoLabel;
  pinned: boolean;
  created_at: string;
  updated_at: string;
};

const TIME_ZONE = "Asia/Seoul";
const timeFormat = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit", timeZone: TIME_ZONE });
const dateFormat = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", timeZone: TIME_ZONE });
// 날짜끼리 비교할 때 쓰는 YYYY-MM-DD
const dayKeyFormat = new Intl.DateTimeFormat("en-CA", { timeZone: TIME_ZONE });

function dayLabel(date: Date, now: Date) {
  const days = Math.round((Date.parse(dayKeyFormat.format(now)) - Date.parse(dayKeyFormat.format(date))) / 86_400_000);
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return dateFormat.format(date);
}

/** 표의 한 줄을 화면에서 쓰는 Memo 모양으로 바꾼다. 날짜 문구는 볼 때마다 다시 계산한다. */
function toMemo(row: MemoRow, now: Date): Memo {
  const created = new Date(row.created_at);
  const updated = new Date(row.updated_at);
  return {
    id: row.id,
    title: row.title,
    preview: previewOf(row.body),
    date: dayLabel(created, now),
    label: row.label,
    category: row.category,
    pinned: row.pinned,
    createdAt: `${dateFormat.format(created)} ${timeFormat.format(created)}`,
    updatedAt: `${dayLabel(updated, now)} ${timeFormat.format(updated)}`,
    savedAt: row.created_at,
    body: row.body,
  };
}

/** 모든 메모 (최근 것부터). 어느 기기에서 열어도 같은 내용이 보이도록 요청마다 새로 읽는다. */
export const getMemos = cache(async (): Promise<Memo[]> => {
  await connection();
  const { data, error } = await supabase
    .from("memos")
    .select("*")
    .order("created_at", { ascending: false })
    .returns<MemoRow[]>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  const now = new Date();
  return data.map((row) => toMemo(row, now));
});

/** 메모 한 개. 없으면 null */
export const getMemo = cache(async (id: string): Promise<Memo | null> => {
  await connection();
  const { data, error } = await supabase.from("memos").select("*").eq("id", id).maybeSingle<MemoRow>();
  if (error) throw new Error(`메모를 불러오지 못했어요: ${error.message}`);
  return data ? toMemo(data, new Date()) : null;
});
