"use client";

import { useMemo, useSyncExternalStore } from "react";
import { MEMOS, type Memo, type MemoBlock, type MemoCategory, type MemoLabel } from "@/data/memos";
import { previewOf } from "./memoText";

// 이 브라우저(로컬 스토리지)에 저장하는 메모
const MEMOS_KEY = "memo-app:memos";
const DRAFT_KEY = "memo-app:draft";
const CHANGE_EVENT = "memo-app:change";

export type StoredMemo = {
  id: string;
  title: string;
  category: MemoCategory;
  label: MemoLabel;
  body: MemoBlock[];
  savedAt: string; // ISO 시각
};

export type Draft = Pick<StoredMemo, "title" | "category" | "label" | "body">;

function read(key: string) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

function write(key: string, value: string | null) {
  try {
    if (value === null) localStorage.removeItem(key);
    else localStorage.setItem(key, value);
  } catch {
    // 저장할 수 없는 환경(사생활 보호 모드 등)에서는 조용히 넘어간다
  }
}

function parse<T>(raw: string | null, fallback: T): T {
  if (!raw) return fallback;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function subscribe(onChange: () => void) {
  window.addEventListener("storage", onChange);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onChange);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}

const timeFormat = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit" });
const dateFormat = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric" });

function dayLabel(date: Date, now: Date) {
  const days = Math.round(
    (new Date(now.toDateString()).getTime() - new Date(date.toDateString()).getTime()) / 86_400_000,
  );
  if (days === 0) return "오늘";
  if (days === 1) return "어제";
  return dateFormat.format(date);
}

/** 저장한 메모를 화면에서 쓰는 Memo 모양으로 바꾼다. 날짜 문구는 볼 때마다 다시 계산한다. */
export function toMemo(stored: StoredMemo, now = new Date()): Memo {
  const saved = new Date(stored.savedAt);
  const time = timeFormat.format(saved);
  return {
    id: stored.id,
    title: stored.title,
    preview: previewOf(stored.body),
    date: dayLabel(saved, now),
    label: stored.label,
    category: stored.category,
    pinned: false,
    createdAt: `${dateFormat.format(saved)} ${time}`,
    updatedAt: `${dayLabel(saved, now)} ${time}`,
    savedAt: stored.savedAt,
    body: stored.body,
  };
}

/** 저장한 메모 목록 (최근 것부터). 서버와 첫 렌더에서는 빈 목록이다. */
export function useStoredMemos(): Memo[] {
  const raw = useSyncExternalStore(subscribe, () => read(MEMOS_KEY), () => null);
  return useMemo(() => parse<StoredMemo[]>(raw, []).map((memo) => toMemo(memo)), [raw]);
}

/** 이 브라우저에 저장한 메모 + 예시 메모. 저장한 메모가 앞에 온다. */
export function useAllMemos(): Memo[] {
  const stored = useStoredMemos();
  return useMemo(() => [...stored, ...MEMOS], [stored]);
}

/** 브라우저에서 화면이 준비됐는지. 로컬 스토리지를 읽기 전에 확인한다. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function saveMemo(draft: Draft) {
  const memos = parse<StoredMemo[]>(read(MEMOS_KEY), []);
  const memo: StoredMemo = { ...draft, id: crypto.randomUUID(), savedAt: new Date().toISOString() };
  write(MEMOS_KEY, JSON.stringify([memo, ...memos]));
  write(DRAFT_KEY, null);
  window.dispatchEvent(new Event(CHANGE_EVENT));
  return memo;
}

export function readDraft(): Draft | null {
  return parse<Draft | null>(read(DRAFT_KEY), null);
}

export function saveDraft(draft: Draft) {
  write(DRAFT_KEY, JSON.stringify(draft));
}
