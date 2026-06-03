"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    document.body.classList.add("custom-cursor");

    const cursor = document.getElementById("navkar-cursor");
    if (!cursor) return;

    let rafId = 0;
    let mx = -100, my = -100;

    // Throttle via rAF — only one DOM write per frame instead of every mousemove
    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
    };

    const tick = () => {
      cursor.style.transform = `translate(${mx}px, ${my}px)`;
      rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    const enter = () => cursor.classList.add("hovering");
    const leave = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", move, { passive: true });

    const targets = document.querySelectorAll("button, a, [data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.body.classList.remove("custom-cursor");
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
    };
  }, []);

  return <div id="navkar-cursor" />;
}
