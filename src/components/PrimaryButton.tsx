import Link from "next/link";
import { Icon } from "./Icon";
import type { NavTransition } from "./PageTransition";

type PrimaryButtonProps = {
  label: string;
  icon?: boolean;
  /** 있으면 다른 화면으로 가는 링크로 쓴다 */
  href?: string;
  /** href로 갈 때의 화면 전환 모션 */
  transitionTypes?: NavTransition[];
  onClick?: () => void;
};

const CLASS_NAME =
  "flex w-full items-center justify-center gap-8 rounded-md bg-primary px-24 py-16 text-button-md whitespace-nowrap text-text-on-primary";

export function PrimaryButton({ label, icon = false, href, transitionTypes, onClick }: PrimaryButtonProps) {
  const content = (
    <>
      {icon && <Icon name="plus" />}
      {label}
    </>
  );

  if (href) {
    return (
      <Link href={href} transitionTypes={transitionTypes} className={CLASS_NAME}>
        {content}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={CLASS_NAME}>
      {content}
    </button>
  );
}
