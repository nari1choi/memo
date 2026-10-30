type SecondaryButtonProps = {
  label: string;
  onClick?: () => void;
};

/** 보조 버튼. 목록 끝의 더 보기처럼 주 버튼보다 약한 동작에 쓴다. */
export function SecondaryButton({ label, onClick }: SecondaryButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-[52px] w-full items-center justify-center rounded-md bg-surface-card px-24 text-label-md whitespace-nowrap text-primary"
    >
      {label}
    </button>
  );
}
