type FormatButtonProps = {
  label: string;
  ariaLabel?: string;
  active?: boolean;
  onPress: () => void;
};

/** 서식 버튼. 커서가 있는 글자의 서식은 active로 보인다. */
export function FormatButton({ label, ariaLabel, active = false, onPress }: FormatButtonProps) {
  return (
    <button
      type="button"
      aria-label={ariaLabel}
      aria-pressed={active}
      // 누를 때 편집기의 선택 영역을 잃지 않게 한다
      onMouseDown={(e) => e.preventDefault()}
      onClick={onPress}
      className={`flex h-[36px] shrink-0 items-center justify-center rounded-sm px-12 text-label-md whitespace-nowrap ${
        active ? "bg-label-blue-soft text-primary" : "text-text-secondary"
      }`}
    >
      {label}
    </button>
  );
}
