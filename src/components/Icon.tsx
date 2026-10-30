const ICONS = {
  plus: { src: "/icons/plus.svg", size: 20 },
  note: { src: "/icons/note.svg", size: 22 },
  pin: { src: "/icons/pin.svg", size: 16 },
  "chevron-right": { src: "/icons/chevron-right.svg", size: 16 },
  "chevron-left": { src: "/icons/chevron-left.svg", size: 24 },
  "pin-24": { src: "/icons/pin-24.svg", size: 24 },
  share: { src: "/icons/share.svg", size: 24 },
  more: { src: "/icons/more.svg", size: 24 },
  search: { src: "/icons/search.svg", size: 20 },
  "chevron-down": { src: "/icons/chevron-down.svg", size: 16 },
} as const;

export type IconName = keyof typeof ICONS;

/**
 * Figma에서 받은 SVG를 마스크로 써서 아이콘 색이 글자색(currentColor)을 따른다.
 * 크기는 SVG 원본의 width/height를 그대로 쓴다.
 */
export function Icon({ name }: { name: IconName }) {
  const { src, size } = ICONS[name];
  return (
    <span
      aria-hidden="true"
      className="block shrink-0 bg-current"
      style={{
        width: size,
        height: size,
        mask: `url(${src}) center / 100% 100% no-repeat`,
      }}
    />
  );
}
