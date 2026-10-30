import { HomeScreen } from "@/components/HomeScreen";
import { PageTransition } from "@/components/PageTransition";
import { getMemos } from "@/lib/memos";

export default function Home() {
  // 기다리지 않고 넘겨서, 메모를 읽는 동안에도 화면 틀은 먼저 보인다
  return (
    <PageTransition>
      <HomeScreen memos={getMemos()} />
    </PageTransition>
  );
}
