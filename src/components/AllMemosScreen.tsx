"use client";

import { useState } from "react";
import { CATEGORIES, type MemoCategory } from "@/data/memos";
import { groupByDay, matchesQuery, sortMemos, type SortOrder } from "@/lib/memoGroups";
import { useAllMemos, useHydrated } from "@/lib/memoStore";
import { Chip } from "./Chip";
import { Icon } from "./Icon";
import { IconButton } from "./IconButton";
import { MemoCard } from "./MemoCard";
import { Screen } from "./Screen";
import { ScrollTopButton } from "./ScrollTopButton";

type Filter = "전체" | MemoCategory;

const SORT_LABEL: Record<SortOrder, string> = { newest: "최신순", oldest: "오래된순" };

/** 전체 메모 목록. 검색·분류·정렬로 거르고, 날짜별로 묶어 한꺼번에 보여 준다. */
export function AllMemosScreen() {
  const hydrated = useHydrated();
  const allMemos = useAllMemos();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<Filter>("전체");
  const [order, setOrder] = useState<SortOrder>("newest");

  const matched = sortMemos(
    allMemos.filter(
      (memo) => (filter === "전체" || memo.category === filter) && matchesQuery(memo, query),
    ),
    order,
  );
  // 날짜 묶음은 브라우저의 오늘 날짜를 기준으로 하므로, 화면이 준비된 뒤에 만든다
  const groups = hydrated ? groupByDay(matched, new Date()) : [];

  return (
    <Screen topClassName="pt-48">
      <nav className="flex items-center">
        <IconButton icon="chevron-left" label="홈으로" href="/" transitionTypes={["nav-back"]} />
        <h1 className="flex min-w-0 flex-1 items-baseline gap-8 px-4 whitespace-nowrap">
          <span className="text-title-lg text-text-primary">전체 메모</span>
          <span className="text-caption-md text-text-muted">{allMemos.length}</span>
        </h1>
        <button
          type="button"
          onClick={() => setOrder(order === "newest" ? "oldest" : "newest")}
          className="flex shrink-0 items-center gap-4 text-caption-md whitespace-nowrap text-text-muted"
        >
          {SORT_LABEL[order]}
          <Icon name="chevron-down" />
        </button>
      </nav>

      <main className="flex flex-1 flex-col gap-16">
        <label className="flex h-[48px] items-center gap-8 rounded-md bg-surface-card px-16 text-text-muted focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
          <Icon name="search" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="제목이나 내용으로 찾기"
            aria-label="메모 찾기"
            className="min-w-0 flex-1 bg-transparent text-body-md text-text-primary outline-none placeholder:text-text-muted"
          />
        </label>

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

        {hydrated && matched.length === 0 && (
          <p className="py-48 text-center text-body-md text-text-muted">찾는 메모가 없어요</p>
        )}

        <div className="flex flex-col gap-20">
          {groups.map((group) => (
            <section key={group.label} className="flex flex-col gap-8">
              {/* 날짜 머리글은 스크롤해도 화면 위쪽에 붙어 있다 */}
              <h2 className="sticky top-0 z-10 bg-surface-page px-8 text-caption-md text-text-muted">
                {group.label}
              </h2>
              <MemoCard memos={group.memos} />
            </section>
          ))}
        </div>
      </main>

      <ScrollTopButton />
    </Screen>
  );
}
