import Link from "next/link";
import type { Memo } from "@/data/memos";
import { Icon } from "./Icon";
import { LABEL_CLASS } from "./labelClass";

export function MemoItem({ memo }: { memo: Memo }) {
  return (
    <li>
      <Link
        href={`/memos/${memo.id}`}
        transitionTypes={["nav-forward"]}
        className="flex items-center gap-16 px-20 py-12">
        <span
          className={`flex size-[44px] shrink-0 items-center justify-center rounded-sm ${LABEL_CLASS[memo.label]}`}
        >
          <Icon name="note" />
        </span>
        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <p className="text-title-md text-text-primary">{memo.title}</p>
          <p className="truncate text-body-sm text-text-secondary">{memo.preview}</p>
        </div>
        <p className="shrink-0 text-caption-sm whitespace-nowrap text-text-muted">
          {memo.date}
        </p>
      </Link>
    </li>
  );
}
