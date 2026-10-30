import { previewOf } from "@/lib/memoText";

export type MemoLabel = "blue" | "green" | "orange" | "pink";

export type MemoCategory = "업무" | "개인" | "아이디어";

/** 본문 묶음. 글 안의 "**굵게**"는 굵은 글자로, 줄바꿈은 그대로 보인다. */
export type MemoBlock =
  | { type: "heading"; text: string }
  | { type: "subheading"; text: string }
  | { type: "paragraph"; text: string }
  | { type: "list"; items: string[] };

export type Memo = {
  id: string;
  title: string;
  preview: string;
  date: string;
  label: MemoLabel;
  category: MemoCategory;
  pinned: boolean;
  createdAt: string;
  updatedAt: string;
  /** 정렬과 날짜 묶음에 쓰는 시각 (ISO) */
  savedAt: string;
  body: MemoBlock[];
};

export const CATEGORIES: MemoCategory[] = ["업무", "개인", "아이디어"];

// 저장 기능을 붙이기 전까지 쓰는 예시 데이터 (Figma 시안과 같은 내용)
export const TOTAL_MEMO_COUNT = 128;

const dayFormat = new Intl.DateTimeFormat("ko-KR", { month: "long", day: "numeric", timeZone: "Asia/Seoul" });
const timeFormat = new Intl.DateTimeFormat("ko-KR", { hour: "numeric", minute: "2-digit", timeZone: "Asia/Seoul" });

/** 지난 날짜의 예시 메모. 날짜 문구와 미리보기는 저장 시각과 본문에서 만든다. */
function pastMemo(memo: Pick<Memo, "id" | "title" | "label" | "category" | "savedAt" | "body">): Memo {
  const saved = new Date(memo.savedAt);
  const day = dayFormat.format(saved);
  const at = `${day} ${timeFormat.format(saved)}`;
  return { ...memo, preview: previewOf(memo.body), date: day, pinned: false, createdAt: at, updatedAt: at };
}

// 10월 22~26일 예시 메모 (전체 메모 목록을 채우는 용도)
const PAST_MEMOS: Memo[] = [
  // 10월 26일
  pastMemo({
    id: "gym-routine",
    title: "운동 루틴",
    label: "green",
    category: "개인",
    savedAt: "2026-10-26T20:30:00+09:00",
    body: [{ type: "list", items: ["스쿼트 3세트", "플랭크 1분", "걷기 30분"] }],
  }),
  pastMemo({
    id: "widget-idea",
    title: "홈 화면 위젯 아이디어",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-26T15:40:00+09:00",
    body: [{ type: "paragraph", text: "오늘 쓴 메모 수와 **고정한 메모 하나**를 보여 주는 작은 위젯." }],
  }),
  pastMemo({
    id: "lunch-places",
    title: "점심 맛집 후보",
    label: "pink",
    category: "개인",
    savedAt: "2026-10-26T12:10:00+09:00",
    body: [{ type: "list", items: ["회사 앞 국숫집", "새로 생긴 샐러드 가게", "골목 안 돈가스집"] }],
  }),
  pastMemo({
    id: "standup-notes",
    title: "스탠드업 메모",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-26T10:15:00+09:00",
    body: [{ type: "paragraph", text: "검색 기능 일정 확인.\n**목요일 배포**는 그대로 간다." }],
  }),
  pastMemo({
    id: "weekly-plan",
    title: "주간 업무 계획",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-26T09:00:00+09:00",
    body: [{ type: "list", items: ["디자인 시스템 색 정리", "상세 화면 검수", "금요일 회고 준비"] }],
  }),
  // 10월 25일
  pastMemo({
    id: "dark-mode-idea",
    title: "다크 모드 색 실험",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-25T21:10:00+09:00",
    body: [{ type: "paragraph", text: "카드 배경을 한 단계 밝게 해서\n**경계선 없이도** 구분되게 해 본다." }],
  }),
  pastMemo({
    id: "meal-prep",
    title: "일주일 식단 준비",
    label: "green",
    category: "개인",
    savedAt: "2026-10-25T17:30:00+09:00",
    body: [{ type: "paragraph", text: "닭가슴살, 브로콜리, 현미밥으로\n다섯 끼를 미리 만든다." }],
  }),
  pastMemo({
    id: "movie-list",
    title: "보고 싶은 영화",
    label: "pink",
    category: "개인",
    savedAt: "2026-10-25T14:00:00+09:00",
    body: [{ type: "list", items: ["리틀 포레스트", "패터슨", "인사이드 아웃 2"] }],
  }),
  pastMemo({
    id: "plant-care",
    title: "화분 물 주기",
    label: "green",
    category: "개인",
    savedAt: "2026-10-25T10:20:00+09:00",
    body: [{ type: "list", items: ["몬스테라: 일주일에 한 번", "스투키: 한 달에 한 번"] }],
  }),
  // 10월 24일
  pastMemo({
    id: "bookstore",
    title: "서점에서 본 책",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-24T18:45:00+09:00",
    body: [{ type: "list", items: ["타이포그래피 기초", "좋은 문장 쓰기"] }],
  }),
  pastMemo({
    id: "birthday-gift",
    title: "엄마 생신 선물",
    label: "pink",
    category: "개인",
    savedAt: "2026-10-24T15:30:00+09:00",
    body: [{ type: "paragraph", text: "꽃바구니와 손편지.\n**다음 주 수요일**까지 주문하기." }],
  }),
  pastMemo({
    id: "cafe-work",
    title: "카페 작업 메모",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-24T13:10:00+09:00",
    body: [{ type: "paragraph", text: "작성 화면 서식 막대 위치를\n키보드 위로 옮겨 볼 것." }],
  }),
  pastMemo({
    id: "camping-list",
    title: "캠핑 장비 목록",
    label: "green",
    category: "개인",
    savedAt: "2026-10-24T11:00:00+09:00",
    body: [{ type: "list", items: ["텐트와 타프", "랜턴 두 개", "접이식 의자"] }],
  }),
  // 10월 23일
  pastMemo({
    id: "release-note",
    title: "배포 노트",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-23T19:20:00+09:00",
    body: [{ type: "list", items: ["전체 메모 검색 추가", "작성 화면 자동 저장", "버그 수정 3건"] }],
  }),
  pastMemo({
    id: "retro",
    title: "주간 회고",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-23T17:00:00+09:00",
    body: [
      { type: "subheading", text: "잘한 점" },
      { type: "list", items: ["시안 검수가 빨라졌다"] },
      { type: "subheading", text: "아쉬운 점" },
      { type: "list", items: ["회의가 길어졌다"] },
    ],
  }),
  pastMemo({
    id: "font-test",
    title: "글꼴 비교",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-23T14:30:00+09:00",
    body: [{ type: "paragraph", text: "본문 글꼴 후보 두 가지를\n**같은 크기로** 나란히 놓고 비교." }],
  }),
  pastMemo({
    id: "dinner-plan",
    title: "금요일 저녁 약속",
    label: "pink",
    category: "개인",
    savedAt: "2026-10-23T11:40:00+09:00",
    body: [{ type: "paragraph", text: "7시 강남역.\n예약자 이름으로 확인하기." }],
  }),
  pastMemo({
    id: "icon-sketch",
    title: "아이콘 스케치",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-23T09:30:00+09:00",
    body: [{ type: "list", items: ["핀: 선 굵기 1.5", "공유: 화살표를 짧게"] }],
  }),
  // 10월 22일
  pastMemo({
    id: "travel-idea",
    title: "제주 여행 아이디어",
    label: "orange",
    category: "아이디어",
    savedAt: "2026-10-22T21:30:00+09:00",
    body: [{ type: "list", items: ["오름 하나 오르기", "바닷가 카페", "시장 구경"] }],
  }),
  pastMemo({
    id: "chores",
    title: "집안일 목록",
    label: "green",
    category: "개인",
    savedAt: "2026-10-22T20:10:00+09:00",
    body: [{ type: "list", items: ["빨래 개기", "분리수거", "욕실 청소"] }],
  }),
  pastMemo({
    id: "color-tokens",
    title: "색 토큰 정리",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-22T15:00:00+09:00",
    body: [{ type: "paragraph", text: "라벨 색은 진한 색과 **연한 배경색**을\n한 쌍으로 묶는다." }],
  }),
  pastMemo({
    id: "interview",
    title: "사용자 인터뷰 질문",
    label: "blue",
    category: "업무",
    savedAt: "2026-10-22T10:00:00+09:00",
    body: [{ type: "list", items: ["메모를 언제 가장 많이 쓰나요?", "찾을 때 무엇을 먼저 떠올리나요?"] }],
  }),
  pastMemo({
    id: "podcast",
    title: "들을 팟캐스트",
    label: "pink",
    category: "개인",
    savedAt: "2026-10-22T08:20:00+09:00",
    body: [{ type: "list", items: ["디자인 이야기 42화", "일하는 사람들 10화"] }],
  }),
];

export const MEMOS: Memo[] = [
  {
    id: "design-review",
    title: "디자인 리뷰 회의록",
    preview: "검수 기준과 다음 할 일 정리",
    date: "오늘",
    label: "blue",
    category: "업무",
    pinned: true,
    createdAt: "10월 30일 오전 10:00",
    updatedAt: "오늘 오전 11:20",
    savedAt: "2026-10-30T10:00:00+09:00",
    body: [
      { type: "heading", text: "검수 기준" },
      { type: "list", items: ["레이어 이름이 역할을 말해 준다", "묶음은 오토레이아웃으로", "색과 간격은 변수로"] },
      { type: "subheading", text: "다음 할 일" },
      { type: "paragraph", text: "상세 화면 시안을 **금요일까지** 올린다." },
    ],
  },
  {
    id: "hiking",
    title: "주말 등산 준비",
    preview: "물 두 병, 간식, 바람막이 챙기기",
    date: "어제",
    label: "green",
    category: "개인",
    pinned: true,
    createdAt: "10월 29일 오후 8:40",
    updatedAt: "어제 오후 8:40",
    savedAt: "2026-10-29T20:40:00+09:00",
    body: [
      { type: "heading", text: "산행 계획" },
      { type: "paragraph", text: "**토요일 아침 7시**에 출발해서\n점심 전에 정상에 오르는 일정이다." },
      { type: "subheading", text: "챙길 것" },
      { type: "list", items: ["물 두 병과 간단한 간식", "바람막이와 여벌 양말", "보조 배터리와 상비약"] },
      { type: "subheading", text: "주의할 점" },
      { type: "paragraph", text: "오후에는 비 소식이 있으니\n**늦어도 3시 전에** 하산한다." },
      { type: "subheading", text: "다녀와서" },
      { type: "paragraph", text: "찍은 사진을 정리해서\n단톡방에 공유한다." },
    ],
  },
  {
    id: "groceries",
    title: "장보기 목록",
    preview: "우유, 계란, 사과, 커피 원두",
    date: "오늘",
    label: "pink",
    category: "개인",
    pinned: false,
    createdAt: "10월 30일 오전 9:10",
    updatedAt: "오늘 오전 9:10",
    savedAt: "2026-10-30T09:10:00+09:00",
    body: [{ type: "list", items: ["우유", "계란", "사과", "커피 원두"] }],
  },
  {
    id: "app-icon",
    title: "앱 아이콘 아이디어",
    preview: "메모지 모서리가 접힌 모양",
    date: "오늘",
    label: "orange",
    category: "아이디어",
    pinned: false,
    createdAt: "10월 30일 오전 8:30",
    updatedAt: "오늘 오전 8:30",
    savedAt: "2026-10-30T08:30:00+09:00",
    body: [{ type: "paragraph", text: "메모지 **모서리가 접힌 모양**.\n색은 주 색 하나만 쓴다." }],
  },
  {
    id: "books",
    title: "읽을 책",
    preview: "디자인 시스템 책 두 권",
    date: "어제",
    label: "green",
    category: "개인",
    pinned: false,
    createdAt: "10월 29일 오후 7:15",
    updatedAt: "어제 오후 7:15",
    savedAt: "2026-10-29T19:15:00+09:00",
    body: [{ type: "paragraph", text: "디자인 시스템 책 두 권.\n이번 달 안에 다 읽는다." }],
  },
  {
    id: "onboarding",
    title: "온보딩 화면 개선",
    preview: "첫 화면 문구는 짧게, 버튼은 하나만",
    date: "10월 28일",
    label: "blue",
    category: "업무",
    pinned: false,
    createdAt: "10월 28일 오후 2:30",
    updatedAt: "10월 28일 오후 2:30",
    savedAt: "2026-10-28T14:30:00+09:00",
    body: [
      { type: "paragraph", text: "첫 화면 문구는 짧게, 버튼은 하나만." },
      { type: "list", items: ["건너뛰기는 오른쪽 위에", "마지막 장에서 바로 첫 메모 쓰기"] },
    ],
  },
  {
    id: "brand-colors",
    title: "브랜드 색 후보",
    preview: "파랑, 초록, 주황 세 가지 비교",
    date: "10월 27일",
    label: "orange",
    category: "아이디어",
    pinned: false,
    createdAt: "10월 27일 오전 11:00",
    updatedAt: "10월 27일 오전 11:00",
    savedAt: "2026-10-27T11:00:00+09:00",
    body: [
      { type: "paragraph", text: "파랑, 초록, 주황 세 가지 비교.\n어두운 화면에서도 **글자가 잘 읽히는지** 본다." },
    ],
  },
  ...PAST_MEMOS,
];

export function getMemo(id: string) {
  return MEMOS.find((memo) => memo.id === id);
}

/** 본문 글자 수 (굵게 표시와 줄바꿈은 세지 않는다) */
export function countMemoChars(memo: Memo) {
  return memo.body
    .flatMap((block) => (block.type === "list" ? block.items : [block.text]))
    .join("")
    .replace(/\*\*|\n/g, "").length;
}
