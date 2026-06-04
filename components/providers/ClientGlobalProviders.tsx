"use client";

import dynamic from "next/dynamic";

// Dynamically import so it never runs on SSR — cursor is purely client-side
const CustomCursor = dynamic(() => import("@/components/home/CustomCursor"), {
  ssr: false,
});

export default function ClientGlobalProviders() {
  return <CustomCursor />;
}
