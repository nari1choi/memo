import type { Metadata } from "next";
import { Suspense } from "react";
import { IconButton } from "@/components/IconButton";
import { MemoArticle } from "@/components/MemoArticle";
import { PageTransition } from "@/components/PageTransition";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { StoredMemoArticle } from "@/components/StoredMemoArticle";
import { MEMOS, getMemo } from "@/data/memos";

type Params = PageProps<"/memos/[id]">["params"];

export function generateStaticParams() {
  return MEMOS.map((memo) => ({ id: memo.id }));
}

export async function generateMetadata({ params }: PageProps<"/memos/[id]">): Promise<Metadata> {
  const memo = getMemo((await params).id);
  return { title: memo ? `${memo.title} - 메모` : "메모" };
}

async function PinButton({ params }: { params: Params }) {
  const pinned = getMemo((await params).id)?.pinned ?? false;
  return (
    <IconButton
      icon="pin-24"
      label="고정"
      pressed={pinned}
      className={pinned ? "text-primary" : "text-text-primary"}
    />
  );
}

async function MemoContent({ params }: { params: Params }) {
  const { id } = await params;
  const memo = getMemo(id);
  // 예시 메모가 아니면 이 브라우저에 저장한 메모에서 찾는다
  return memo ? <MemoArticle memo={memo} /> : <StoredMemoArticle id={id} />;
}

// 주소에 따라 달라지는 부분(고정 상태, 본문)만 Suspense 안에서 읽는다
export default function MemoDetailPage({ params }: PageProps<"/memos/[id]">) {
  return (
    <PageTransition>
      <Screen topClassName="pt-48" bottomAction={<PrimaryButton label="수정하기" />}>
        <nav className="flex items-center justify-between">
          <IconButton icon="chevron-left" label="홈으로" href="/" transitionTypes={["nav-back"]} />
          <div className="flex">
            <Suspense fallback={<IconButton icon="pin-24" label="고정" />}>
              <PinButton params={params} />
            </Suspense>
            <IconButton icon="share" label="공유" />
            <IconButton icon="more" label="더보기" />
          </div>
        </nav>

        <main className="flex flex-1 flex-col">
          <Suspense fallback={<div className="flex-1 rounded-xl bg-surface-card" />}>
            <MemoContent params={params} />
          </Suspense>
        </main>
      </Screen>
    </PageTransition>
  );
}
