import type { ReactNode } from "react";

type ScreenProps = {
  /** 화면 위쪽 여백 클래스 (예: "pt-64") */
  topClassName: string;
  /** 화면 아래에 붙는 주 버튼. 없으면 아래 여백만 둔다. */
  bottomAction?: ReactNode;
  children: ReactNode;
};

/** 모바일 화면 틀. 주 버튼은 스크롤해도 화면 아래에 붙어 있다. */
export function Screen({ topClassName, bottomAction, children }: ScreenProps) {
  return (
    <div
      className={`mx-auto flex min-h-full w-full max-w-md flex-1 flex-col gap-16 bg-surface-page px-16 ${topClassName} ${
        bottomAction ? "" : "pb-34"
      }`}
    >
      {children}
      {bottomAction && (
        <div className="sticky bottom-0 bg-surface-page pb-34">{bottomAction}</div>
      )}
    </div>
  );
}
