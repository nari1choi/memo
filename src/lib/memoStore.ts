"use client";

import { useSyncExternalStore } from "react";
import type { NewMemo } from "./memoActions";

// 쓰는 중인 임시 글은 이 브라우저(로컬 스토리지)에 둔다. 저장한 메모는 Supabase에 있다.
const DRAFT_KEY = "memo-app:draft";

export type Draft = NewMemo;

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

/** 브라우저에서 화면이 준비됐는지. 로컬 스토리지를 읽기 전에 확인한다. */
export function useHydrated() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function readDraft(): Draft | null {
  return parse<Draft | null>(read(DRAFT_KEY), null);
}

export function saveDraft(draft: Draft) {
  write(DRAFT_KEY, JSON.stringify(draft));
}

export function clearDraft() {
  write(DRAFT_KEY, null);
}
