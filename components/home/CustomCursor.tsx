"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    document.body.classList.add("custom-cursor");

    const cursor = document.getElementById("navkar-cursor");
    if (!cursor) return;

    let rafId = 0;
    let mx = -100, my = -100;
    let px = -100, py = -100;   // last painted position
    let dirty = false;          // only repaint when the mouse actually moved

    // Throttle via rAF — only one DOM write per frame, and only when needed
    const move = (e: MouseEvent) => {
      mx = e.clientX;
      my = e.clientY;
      dirty = true;
    };

    const tick = () => {
      if (dirty && (mx !== px || my !== py)) {
        cursor.style.transform = `translate(${mx}px, ${my}px)`;
        px = mx; py = my;
        dirty = false;
      }
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
