import Link from "next/link";
import { Icon, type IconName } from "./Icon";
import type { NavTransition } from "./PageTransition";

type IconButtonProps = {
  icon: IconName;
  label: string;
  href?: string;
  /** href로 갈 때의 화면 전환 모션 */
  transitionTypes?: NavTransition[];
  pressed?: boolean;
  className?: string;
};

/** 40×40 누르는 영역 가운데에 아이콘을 둔다. href가 있으면 링크로 쓴다. */
export function IconButton({
  icon,
  label,
  href,
  transitionTypes,
  pressed,
  className = "text-text-primary",
}: IconButtonProps) {
  const classes = `flex shrink-0 items-center justify-center rounded-sm p-8 ${className}`;

  if (href) {
    return (
      <Link href={href} transitionTypes={transitionTypes} aria-label={label} className={classes}>
        <Icon name={icon} />
      </Link>
    );
  }

  return (
    <button type="button" aria-label={label} aria-pressed={pressed} className={classes}>
      <Icon name={icon} />
    </button>
  );
}
