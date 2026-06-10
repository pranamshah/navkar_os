"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Send, Bot, Minimize2, Loader2 } from "lucide-react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

const SUGGESTED = [
  "What is NavkarOS?",
  "Which product is right for me?",
  "How much does it cost?",
  "Is there a free trial?",
];

export default function ChatWidget() {
  const [open, setOpen]           = useState(false);
  const [hasOpened, setHasOpened] = useState(false);
  const [messages, setMessages]   = useState<Message[]>([]);
  const [input, setInput]         = useState("");
  const [loading, setLoading]     = useState(false);
  const bottomRef  = useRef<HTMLDivElement>(null);
  const inputRef   = useRef<HTMLInputElement>(null);
  const abortRef   = useRef<AbortController | null>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 180);
      setHasOpened(true);
    } else {
      abortRef.current?.abort();
    }
  }, [open]);

  const sendMessage = useCallback(async (text: string) => {
    if (!text.trim() || loading) return;

    const userMsg: Message = { id: Date.now().toString(), role: "user", content: text };
    const assistantId = (Date.now() + 1).toString();
    const assistantMsg: Message = { id: assistantId, role: "assistant", content: "" };

    setMessages((prev) => [...prev, userMsg, assistantMsg]);
    setInput("");
    setLoading(true);
    abortRef.current = new AbortController();

    try {
      const history = [...messages, userMsg].map((m) => ({ role: m.role, content: m.content }));
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: history }),
        signal: abortRef.current.signal,
      });

      if (!res.ok || !res.body) throw new Error("API error");

      const reader  = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        accumulated += decoder.decode(value, { stream: true });
        setMessages((prev) =>
          prev.map((m) => m.id === assistantId ? { ...m, content: accumulated } : m)
        );
      }
    } catch (err: unknown) {
      if (err instanceof Error && err.name === "AbortError") return;
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? { ...m, content: "Sorry, I ran into an issue. Please try again." }
            : m
        )
      );
    } finally {
      setLoading(false);
    }
  }, [loading, messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const sendSuggestion = (text: string) => sendMessage(text);

  return (
    <>
      {/* ── Floating button ────────────────────────────── */}
      <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
        {/* Pulse ring */}
        {!open && !hasOpened && (
          <motion.div
            className="absolute bottom-0 right-0 w-14 h-14 rounded-full"
            style={{ background: "rgba(212,175,55,0.25)" }}
            animate={{ scale: [1, 1.6, 1], opacity: [0.6, 0, 0.6] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
          />
        )}

        {/* Tooltip */}
        <AnimatePresence>
          {!open && !hasOpened && (
            <motion.div
              initial={{ opacity: 0, x: 10, scale: 0.92 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 10, scale: 0.92 }}
              transition={{ delay: 1.8, duration: 0.3 }}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white shadow-md whitespace-nowrap"
              style={{ background: "#1a1c1c", border: "1px solid rgba(212,175,55,0.2)" }}
            >
              Ask NavkarBot ✦
            </motion.div>
          )}
        </AnimatePresence>

        <button
          onClick={() => setOpen((v) => !v)}
          className="relative w-14 h-14 rounded-full flex items-center justify-center shadow-xl transition-transform duration-200 hover:scale-105 active:scale-95"
          style={{ background: open ? "#1a1c1c" : "#D4AF37" }}
          aria-label="Open NavkarBot"
          type="button"
        >
          <AnimatePresence mode="wait">
            {open ? (
              <motion.span key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Minimize2 className="h-5 w-5 text-[#D4AF37]" />
              </motion.span>
            ) : (
              <motion.span key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }} transition={{ duration: 0.15 }}>
                <Bot className="h-6 w-6 text-[#1a1c1c]" />
              </motion.span>
            )}
          </AnimatePresence>
        </button>
      </div>

      {/* ── Chat panel ─────────────────────────────────── */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="fixed bottom-24 right-6 z-50 flex flex-col rounded-2xl shadow-2xl overflow-hidden"
            style={{
              width: "min(380px, calc(100vw - 2rem))",
              height: "520px",
              background: "#ffffff",
              border: "1.5px solid rgba(212,175,55,0.25)",
            }}
          >
            {/* Header */}
            <div
              className="flex items-center gap-3 px-4 py-3 flex-shrink-0"
              style={{ background: "#1a1c1c", borderBottom: "1px solid rgba(212,175,55,0.12)" }}
            >
              <div
                className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                style={{ background: "rgba(212,175,55,0.15)", border: "1px solid rgba(212,175,55,0.3)" }}
              >
                <Bot className="h-4 w-4" style={{ color: "#D4AF37" }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-bold leading-tight">NavkarBot</p>
                <p className="text-xs leading-tight" style={{ color: "rgba(255,255,255,0.38)" }}>
                  Powered by Groq · Always free
                </p>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-7 h-7 rounded-lg flex items-center justify-center transition-colors hover:bg-white/10"
              >
                <X className="h-4 w-4" style={{ color: "rgba(255,255,255,0.45)" }} />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto px-4 py-4 flex flex-col gap-3" style={{ background: "#f9f9f9" }}>

              {/* Welcome + suggestions */}
              {messages.length === 0 && (
                <div className="flex flex-col gap-3">
                  <div className="flex gap-2.5 items-start">
                    <BotAvatar />
                    <Bubble role="assistant">
                      👋 Hi! I&apos;m <strong style={{ color: "#D4AF37" }}>NavkarBot</strong>. Ask me about products, pricing, or how NavkarOS can help your logistics business.
                    </Bubble>
                  </div>
                  <div className="flex flex-col gap-2 pl-9">
                    {SUGGESTED.map((s) => (
                      <button
                        key={s}
                        onClick={() => sendSuggestion(s)}
                        disabled={loading}
                        type="button"
                        className="text-left text-xs px-3 py-2 rounded-xl border transition-all duration-150 hover:border-[#D4AF37] hover:text-[#1a1c1c] font-medium disabled:opacity-50"
                        style={{ background: "#fff", borderColor: "#e5e7eb", color: "#4b5563" }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Chat history */}
              {messages.map((m) => (
                <div key={m.id} className={`flex gap-2.5 items-start ${m.role === "user" ? "flex-row-reverse" : ""}`}>
                  {m.role === "assistant" && <BotAvatar />}
                  <Bubble role={m.role}>
                    {m.content || (loading && m.role === "assistant" ? <TypingDots /> : "")}
                  </Bubble>
                </div>
              ))}

              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="flex items-center gap-2 px-3 py-3 flex-shrink-0 border-t"
              style={{ background: "#fff", borderColor: "rgba(212,175,55,0.12)" }}
            >
              <input
                ref={inputRef}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask anything..."
                disabled={loading}
                className="flex-1 text-sm px-3.5 py-2.5 rounded-xl outline-none transition-all disabled:opacity-60"
                style={{
                  background: "#f9f9f9",
                  border: "1.5px solid #e5e7eb",
                  color: "#1a1c1c",
                }}
                onFocus={(e) => (e.target.style.borderColor = "rgba(212,175,55,0.5)")}
                onBlur={(e)  => (e.target.style.borderColor = "#e5e7eb")}
              />
              <button
                type="submit"
                disabled={loading || !input.trim()}
                className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 transition-all duration-150 disabled:opacity-40"
                style={{ background: "#D4AF37" }}
              >
                {loading
                  ? <Loader2 className="h-4 w-4 text-[#1a1c1c] animate-spin" />
                  : <Send className="h-4 w-4 text-[#1a1c1c]" />
                }
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

/* ── Sub-components ──────────────────────────────────── */
function BotAvatar() {
  return (
    <div
      className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
      style={{ background: "#1a1c1c" }}
    >
      <Bot className="h-3.5 w-3.5" style={{ color: "#D4AF37" }} />
    </div>
  );
}

function Bubble({ role, children }: { role: "user" | "assistant"; children: React.ReactNode }) {
  const isUser = role === "user";
  return (
    <div
      className="text-sm leading-relaxed whitespace-pre-wrap px-3.5 py-2.5"
      style={{
        maxWidth: "82%",
        background: isUser ? "#D4AF37" : "#1a1c1c",
        color: isUser ? "#1a1c1c" : "rgba(255,255,255,0.85)",
        borderRadius: isUser ? "16px 16px 4px 16px" : "16px 16px 16px 4px",
        fontWeight: isUser ? 600 : 400,
      }}
    >
      {children}
    </div>
  );
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="inline-block w-1.5 h-1.5 rounded-full"
          style={{ background: "#D4AF37" }}
          animate={{ opacity: [0.3, 1, 0.3], y: [0, -3, 0] }}
          transition={{ duration: 0.9, repeat: Infinity, delay: i * 0.18 }}
        />
      ))}
    </span>
  );
}
