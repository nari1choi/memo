import type { Metadata } from "next";
import { ComposeScreen } from "@/components/ComposeScreen";
import { PageTransition } from "@/components/PageTransition";

export const metadata: Metadata = {
  title: "새 메모 - 메모",
};

export default function NewMemoPage() {
  return (
    <PageTransition>
      <ComposeScreen />
    </PageTransition>
  );
}
