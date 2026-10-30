import type { Metadata } from "next";
import { Suspense } from "react";
import { IconButton } from "@/components/IconButton";
import { MemoArticle } from "@/components/MemoArticle";
import { PageTransition } from "@/components/PageTransition";
import { PrimaryButton } from "@/components/PrimaryButton";
import { Screen } from "@/components/Screen";
import { getMemo } from "@/lib/memos";

type Params = PageProps<"/memos/[id]">["params"];

export async function generateMetadata({ params }: PageProps<"/memos/[id]">): Promise<Metadata> {
  const memo = await getMemo((await params).id);
  return { title: memo ? `${memo.title} - 메모` : "메모" };
}

async function PinButton({ params }: { params: Params }) {
  const pinned = (await getMemo((await params).id))?.pinned ?? false;
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
  const memo = await getMemo((await params).id);

  if (!memo) {
    return (
      <div className="flex flex-col gap-8 rounded-xl bg-surface-card px-20 py-24">
        <h1 className="text-title-lg text-text-primary">메모를 찾을 수 없어요</h1>
        <p className="text-body-md text-text-secondary">지워졌거나 주소가 잘못된 메모예요.</p>
      </div>
    );
  }

  return <MemoArticle memo={memo} />;
}

// 주소에 따라 달라지는 부분(고정 상태, 본문)만 Suspense 안에서 Supabase에서 읽는다
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
