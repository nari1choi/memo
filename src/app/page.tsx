import { HomeScreen } from "@/components/HomeScreen";
import { PageTransition } from "@/components/PageTransition";

export default function Home() {
  return (
    <PageTransition>
      <HomeScreen />
    </PageTransition>
  );
}
