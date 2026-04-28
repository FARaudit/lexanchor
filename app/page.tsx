import type { Metadata } from "next";
import LexAnchorLanding from "./_components/lexanchor-landing";

export const metadata: Metadata = {
  title: "LexAnchor — Legal Intelligence",
  description:
    "AI contract review with P0/P1/P2 risk prioritization. NDAs, MSAs, employment, IP assignment, vendor agreements. First contract free."
};

export const dynamic = "force-dynamic";

export default function HomePage() {
  return <LexAnchorLanding />;
}
