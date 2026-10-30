"use client";

import { Suspense, use, useState } from "react";
import { CATEGORIES, type Memo, type MemoCategory } from "@/data/memos";
import { Chip } from "./Chip";
import { MemoCard } from "./MemoCard";
import { PrimaryButton } from "./PrimaryButton";
import { Screen } from "./Screen";

type Filter = "전체" | MemoCategory;

function MemoCount({ memos }: { memos: Promise<Memo[]> }) {
  return <>{use(memos).length}</>;
}

function HomeMemoCards({ memos, filter }: { memos: Promise<Memo[]>; filter: Filter }) {
  const visible = use(memos).filter((memo) => filter === "전체" || memo.category === filter);
  const pinned = visible.filter((memo) => memo.pinned);
  const recent = visible.filter((memo) => !memo.pinned);

  return (
    <>
      {pinned.length > 0 && <MemoCard title="고정한 메모" memos={pinned} pin />}
      {recent.length > 0 && (
        <MemoCard title="최근 메모" memos={recent.slice(0, 3)} actionHref="/memos" />
      )}
    </>
  );
}

export function HomeScreen({ memos }: { memos: Promise<Memo[]> }) {
  const [filter, setFilter] = useState<Filter>("전체");

  return (
    <Screen
      topClassName="pt-64"
      bottomAction={<PrimaryButton label="새 메모 쓰기" icon href="/memos/new" transitionTypes={["nav-up"]} />}
    >
      <main className="flex flex-1 flex-col gap-16">
        <header className="flex flex-col gap-8 px-8">
          <p className="text-caption-md text-text-muted">10월 30일 금요일</p>
          <h1 className="text-heading-xl text-text-primary">
            오늘까지 메모를
            <br />
            <span className="text-primary">
              <Suspense fallback="…">
                <MemoCount memos={memos} />
              </Suspense>
              개
            </span>{" "}
            남겼어요
          </h1>
        </header>

        <div className="flex gap-8 overflow-x-auto px-4">
          {(["전체", ...CATEGORIES] as Filter[]).map((label) => (
            <Chip
              key={label}
              label={label}
              selected={filter === label}
              onClick={() => setFilter(label)}
            />
          ))}
        </div>

        <Suspense fallback={<div className="flex-1 rounded-xl bg-surface-card" />}>
          <HomeMemoCards memos={memos} filter={filter} />
        </Suspense>
      </main>
    </Screen>
  );
}
