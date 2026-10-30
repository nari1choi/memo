import type { Memo } from "@/data/memos";
import { plainText } from "./memoText";

export type SortOrder = "newest" | "oldest";

export type MemoGroup = { label: string; memos: Memo[] };

const DAY = 86_400_000;

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate()).getTime();
}

/** 월요일을 한 주의 시작으로 본다 */
function startOfWeek(date: Date) {
  const day = (date.getDay() + 6) % 7;
  return startOfDay(date) - day * DAY;
}

function groupLabel(saved: Date, now: Date) {
  const days = Math.round((startOfDay(now) - startOfDay(saved)) / DAY);
  if (days <= 0) return "오늘";
  if (days === 1) return "어제";
  if (startOfDay(saved) >= startOfWeek(now)) return "이번 주";
  return "지난 메모";
}

export function sortMemos(memos: Memo[], order: SortOrder) {
  const sign = order === "newest" ? -1 : 1;
  return [...memos].sort((a, b) => sign * (Date.parse(a.savedAt) - Date.parse(b.savedAt)));
}

/** 정렬된 순서를 지키면서 오늘·어제·이번 주·지난 메모로 묶는다 */
export function groupByDay(memos: Memo[], now: Date): MemoGroup[] {
  const groups: MemoGroup[] = [];
  for (const memo of memos) {
    const label = groupLabel(new Date(memo.savedAt), now);
    const last = groups.at(-1);
    if (last?.label === label) last.memos.push(memo);
    else groups.push({ label, memos: [memo] });
  }
  return groups;
}

/** 제목이나 본문에 검색어가 들어 있는지 */
export function matchesQuery(memo: Memo, query: string) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const body = memo.body
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .map(plainText)
    .join(" ");
  return `${memo.title} ${body}`.toLowerCase().includes(q);
}
