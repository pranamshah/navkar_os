"use client";

import dynamic from "next/dynamic";

const ChatWidget = dynamic(() => import("@/components/home/ChatWidget"), { ssr: false });

export default function ChatWidgetLoader() {
  return <ChatWidget />;
}
