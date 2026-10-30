"use client";

import { useHydrated, useStoredMemos } from "@/lib/memoStore";
import { MemoArticle } from "./MemoArticle";

/** 이 브라우저에 저장한 메모를 찾아 상세 카드로 보여 준다 */
export function StoredMemoArticle({ id }: { id: string }) {
  const hydrated = useHydrated();
  const memo = useStoredMemos().find((m) => m.id === id);

  if (!hydrated) return <div className="flex-1 rounded-xl bg-surface-card" />;

  if (!memo) {
    return (
      <div className="flex flex-col gap-8 rounded-xl bg-surface-card px-20 py-24">
        <h1 className="text-title-lg text-text-primary">메모를 찾을 수 없어요</h1>
        <p className="text-body-md text-text-secondary">지워졌거나 다른 브라우저에서 쓴 메모예요.</p>
      </div>
    );
  }

  return <MemoArticle memo={memo} />;
}
