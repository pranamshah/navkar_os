"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface Option {
  id: string;
  label: string;
  sub?: string;
}

interface TypeAheadInputProps {
  label?: string;
  placeholder?: string;
  options: Option[];
  value: string;
  onChange: (value: string, option?: Option) => void;
  required?: boolean;
  autoFocus?: boolean;
  className?: string;
}

export function TypeAheadInput({
  label,
  placeholder = "Type to search...",
  options,
  value,
  onChange,
  required,
  autoFocus,
  className = "",
}: TypeAheadInputProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const filtered = query
    ? options.filter((o) => o.label.toLowerCase().includes(query.toLowerCase()))
    : options;

  // Sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const select = useCallback(
    (opt: Option) => {
      setQuery(opt.label);
      onChange(opt.label, opt);
      setOpen(false);
      setHighlighted(0);
    },
    [onChange]
  );

  const handleKey = (e: React.KeyboardEvent) => {
    if (!open && (e.key === "ArrowDown" || e.key === "ArrowUp")) {
      setOpen(true);
      return;
    }
    if (!open) return;
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      if (filtered[highlighted]) select(filtered[highlighted]);
    } else if (e.key === "Escape") {
      setOpen(false);
    }
  };

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  // Scroll highlighted into view
  useEffect(() => {
    if (listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  return (
    <div ref={containerRef} className={`relative ${className}`} style={{ fontFamily: "Inter, sans-serif" }}>
      {label && (
        <label className="block text-[11px] font-semibold uppercase tracking-wide mb-1" style={{ color: "#6B7280" }}>
          {label}
          {required && <span style={{ color: "#DC2626" }}> *</span>}
        </label>
      )}
      <div
        className="relative flex items-center border rounded-md overflow-hidden transition-all"
        style={{ borderColor: open ? "#0E7490" : "#E5E7EB", background: "#fff", boxShadow: open ? "0 0 0 2px rgba(14,116,144,0.12)" : "none" }}
      >
        <input
          ref={inputRef}
          autoFocus={autoFocus}
          required={required}
          type="text"
          placeholder={placeholder}
          value={query}
          onChange={(e) => {
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setHighlighted(0);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          className="flex-1 px-3 py-2 text-[13px] outline-none bg-transparent"
          style={{ color: "#111827" }}
          autoComplete="off"
        />
        <span
          className="material-symbols-outlined px-2 flex-shrink-0"
          style={{ fontSize: 15, color: "#9CA3AF" }}
        >
          {open ? "expand_less" : "expand_more"}
        </span>
      </div>

      {open && filtered.length > 0 && (
        <ul
          ref={listRef}
          className="absolute z-50 w-full mt-1 rounded-md border overflow-y-auto"
          style={{
            background: "#fff",
            borderColor: "#E5E7EB",
            boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            maxHeight: 220,
          }}
        >
          {filtered.map((opt, i) => (
            <li
              key={opt.id}
              onMouseDown={(e) => { e.preventDefault(); select(opt); }}
              onMouseEnter={() => setHighlighted(i)}
              className="flex items-center justify-between px-3 py-2 cursor-pointer text-[13px]"
              style={{
                background: i === highlighted ? "#ECFEFF" : "transparent",
                color: i === highlighted ? "#0E7490" : "#111827",
                borderBottom: i < filtered.length - 1 ? "1px solid #F3F4F6" : "none",
              }}
            >
              <span className="font-medium">{opt.label}</span>
              {opt.sub && (
                <span className="text-[11px]" style={{ color: "#9CA3AF" }}>{opt.sub}</span>
              )}
            </li>
          ))}
        </ul>
      )}

      {open && filtered.length === 0 && query && (
        <div
          className="absolute z-50 w-full mt-1 rounded-md border px-3 py-2 text-[13px]"
          style={{ background: "#fff", borderColor: "#E5E7EB", color: "#9CA3AF" }}
        >
          No ledger found for &quot;{query}&quot;
        </div>
      )}
    </div>
  );
}
