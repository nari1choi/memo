import { countMemoChars, type Memo } from "@/data/memos";
import { Badge } from "./Badge";
import { MemoBody } from "./MemoBody";

/** 메모 상세 카드 */
export function MemoArticle({ memo }: { memo: Memo }) {
  return (
    <article className="flex flex-col gap-12 rounded-xl bg-surface-card px-20 py-24">
      <div className="flex items-center gap-8">
        <Badge label={memo.category} color={memo.label} />
        <p className="text-caption-sm whitespace-nowrap text-text-muted">{memo.createdAt}</p>
      </div>
      <h1 className="text-heading-lg text-text-primary">{memo.title}</h1>
      <hr className="h-px border-0 bg-border-default" />
      <MemoBody blocks={memo.body} />
      <p className="text-caption-sm text-text-muted">
        {countMemoChars(memo)}자 · {memo.updatedAt} 수정
      </p>
    </article>
  );
}
