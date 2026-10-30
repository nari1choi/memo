import type { Memo } from "@/data/memos";
import { CardHeader } from "./CardHeader";
import { MemoItem } from "./MemoItem";

type MemoCardProps = {
  memos: Memo[];
  /** 없으면 머리글 없이 메모 줄만 보인다 */
  title?: string;
  pin?: boolean;
  actionHref?: string;
};

export function MemoCard({ memos, title, pin, actionHref }: MemoCardProps) {
  return (
    <section className="flex flex-col overflow-clip rounded-xl bg-surface-card py-8">
      {title && <CardHeader title={title} pin={pin} actionHref={actionHref} />}
      <ul>
        {memos.map((memo) => (
          <MemoItem key={memo.id} memo={memo} />
        ))}
      </ul>
    </section>
  );
}
