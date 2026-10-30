"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { CATEGORIES, type MemoLabel } from "@/data/memos";
import { readDraft, saveDraft, saveMemo, useHydrated, type Draft } from "@/lib/memoStore";
import { Chip } from "./Chip";
import { IconButton } from "./IconButton";
import { LabelDot } from "./LabelDot";
import { MemoEditor } from "./MemoEditor";
import { PrimaryButton } from "./PrimaryButton";
import { Screen } from "./Screen";

const LABELS: MemoLabel[] = ["blue", "green", "orange", "pink"];

const EMPTY_DRAFT: Draft = { title: "", category: "업무", label: "blue", body: [] };

/** 메모 작성 화면. 쓰는 동안 이 브라우저에 자동 저장하고, 저장하면 홈으로 간다. */
export function ComposeScreen() {
  const router = useRouter();
  const hydrated = useHydrated();
  const [draft, setDraft] = useState<Draft | null>(null);
  const current = draft ?? (hydrated ? (readDraft() ?? EMPTY_DRAFT) : null);
  const [autoSaved, setAutoSaved] = useState(false);

  // 바뀐 내용은 잠시 뒤 임시 저장한다
  useEffect(() => {
    if (!draft) return;
    const timer = setTimeout(() => {
      saveDraft(draft);
      setAutoSaved(true);
    }, 500);
    return () => clearTimeout(timer);
  }, [draft]);

  const update = (patch: Partial<Draft>) => {
    if (!current) return;
    setDraft({ ...current, ...patch });
    setAutoSaved(false);
  };

  const save = () => {
    if (!current) return;
    saveMemo({ ...current, title: current.title.trim() || "제목 없음" });
    router.push("/", { transitionTypes: ["nav-down"] });
  };

  return (
    <Screen topClassName="pt-48" bottomAction={<PrimaryButton label="저장하기" onClick={save} />}>
      <nav className="flex items-center justify-between">
        <IconButton icon="chevron-left" label="홈으로" href="/" transitionTypes={["nav-down"]} />
        <p aria-live="polite" className="text-caption-sm whitespace-nowrap text-text-muted">
          {autoSaved ? "자동 저장됨" : ""}
        </p>
      </nav>

      {current && (
        <main className="flex flex-1 flex-col gap-12">
          <label className="flex flex-col gap-4 rounded-lg bg-surface-card px-20 py-16 focus-within:ring-2 focus-within:ring-primary focus-within:ring-inset">
            <span className="text-caption-sm text-text-muted">제목</span>
            <input
              value={current.title}
              onChange={(e) => update({ title: e.target.value })}
              placeholder="제목을 입력하세요"
              className="bg-transparent text-title-md text-text-primary outline-none placeholder:text-text-muted"
            />
          </label>

          <div className="flex flex-col gap-12 px-8 py-4">
            <div role="group" aria-label="분류" className="flex items-center gap-8">
              <span className="text-caption-sm whitespace-nowrap text-text-muted">분류</span>
              {CATEGORIES.map((category) => (
                <Chip
                  key={category}
                  label={category}
                  selected={current.category === category}
                  onClick={() => update({ category })}
                />
              ))}
            </div>
            <div role="group" aria-label="색" className="flex items-center gap-8">
              <span className="text-caption-sm whitespace-nowrap text-text-muted">색</span>
              {LABELS.map((label) => (
                <LabelDot
                  key={label}
                  color={label}
                  selected={current.label === label}
                  onClick={() => update({ label })}
                />
              ))}
            </div>
          </div>

          <MemoEditor initialBody={current.body} onChange={(body) => update({ body })} />
        </main>
      )}
    </Screen>
  );
}
