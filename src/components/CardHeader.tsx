import Link from "next/link";
import { Icon } from "./Icon";

type CardHeaderProps = {
  title: string;
  pin?: boolean;
  /** 있으면 오른쪽에 "전체 보기"가 붙고 이 주소로 간다 */
  actionHref?: string;
};

export function CardHeader({ title, pin = false, actionHref }: CardHeaderProps) {
  return (
    <div className="flex h-[40px] items-center gap-4 pt-12 pb-4 pl-20 pr-16">
      {pin && (
        <span className="text-primary">
          <Icon name="pin" />
        </span>
      )}
      <h2 className="min-w-0 flex-1 text-label-md text-text-primary">{title}</h2>
      {actionHref && (
        <Link
          href={actionHref}
          transitionTypes={["nav-forward"]}
          className="flex shrink-0 items-center gap-4 text-caption-md whitespace-nowrap text-text-muted"
        >
          전체 보기
          <Icon name="chevron-right" />
        </Link>
      )}
    </div>
  );
}
