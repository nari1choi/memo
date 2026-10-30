import type { Metadata } from "next";
import { AllMemosScreen } from "@/components/AllMemosScreen";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "전체 메모 - 메모",
};

export default function AllMemosPage() {
  return (
    <PageTransition>
      <AllMemosScreen />
    </PageTransition>
  );
}
