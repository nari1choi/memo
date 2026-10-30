import { ViewTransition, type ReactNode } from "react";

/** 링크의 transitionTypes에 쓰는 화면 전환 종류. 모션은 globals.css에 있다. */
export type NavTransition = "nav-forward" | "nav-back" | "nav-up" | "nav-down";

const BY_TYPE = {
  "nav-forward": "nav-forward",
  "nav-back": "nav-back",
  "nav-up": "nav-up",
  "nav-down": "nav-down",
  // 브라우저 뒤로가기처럼 종류가 없는 전환은 움직이지 않는다
  default: "none",
};

/** 화면(page.tsx) 전체를 감싸서 들어오고 나갈 때 모션을 준다 */
export function PageTransition({ children }: { children: ReactNode }) {
  return (
    <ViewTransition enter={BY_TYPE} exit={BY_TYPE} default="none">
      {children}
    </ViewTransition>
  );
}
