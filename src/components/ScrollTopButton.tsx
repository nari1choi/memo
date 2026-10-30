"use client";

import { useEffect, useState } from "react";
import { Icon } from "./Icon";

/** 스크롤이 이만큼 멈춰 있으면 버튼을 띄운다 */
const IDLE_MS = 200;

/** 화면 맨 위로 올라간다. 움직임 줄이기를 켠 사용자에게는 바로 이동한다. */
function scrollToTop() {
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
}

/**
 * 맨 위로 가기 플로팅 버튼.
 * 스크롤하는 동안에는 숨고, 스크롤이 멈추면 화면 오른쪽 아래에 뜬다.
 * 화면 높이의 절반도 안 내려왔을 때는 띄우지 않는다.
 */
export function ScrollTopButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout> | undefined;
    const onScroll = () => {
      setVisible(false);
      clearTimeout(timer);
      timer = setTimeout(() => setVisible(window.scrollY > window.innerHeight / 2), IDLE_MS);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      clearTimeout(timer);
    };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-34 z-20 mx-auto flex max-w-md justify-end px-16">
      <button
        type="button"
        aria-label="맨 위로 가기"
        aria-hidden={!visible}
        tabIndex={visible ? 0 : -1}
        onClick={scrollToTop}
        className={`flex items-center justify-center rounded-full bg-primary p-16 text-text-on-primary transition-[opacity,translate,visibility] duration-(--motion-enter) ease-out motion-reduce:transition-none ${
          visible ? "pointer-events-auto visible translate-y-0 opacity-100" : "invisible translate-y-8 opacity-0"
        }`}
      >
        {/* 위쪽 화살표: 아래 화살표 아이콘을 뒤집어 쓴다 */}
        <span className="rotate-180">
          <Icon name="chevron-down" />
        </span>
      </button>
    </div>
  );
}
