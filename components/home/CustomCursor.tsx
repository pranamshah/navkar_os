"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Only run on true pointer devices
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const cursor = document.getElementById("navkar-cursor");
    if (!cursor) return;

    let rafId = 0;
    let mx = -100, my = -100;
    let px = -100, py = -100;
    let dirty = false;

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

    // Attach hover listeners to all interactive elements on mount
    const attach = () => {
      const targets = document.querySelectorAll("button, a, [data-cursor], input[type=submit], input[type=button]");
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };
    attach();

    // Re-attach when DOM changes (new buttons/links added dynamically)
    const observer = new MutationObserver(attach);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      document.removeEventListener("mousemove", move);
      cancelAnimationFrame(rafId);
      observer.disconnect();
    };
  }, []);

  return <div id="navkar-cursor" />;
}
