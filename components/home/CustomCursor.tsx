"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    const cursor = document.getElementById("navkar-cursor");
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const enter = () => cursor.classList.add("hovering");
    const leave = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", move);

    const targets = document.querySelectorAll("button, a, [data-cursor]");
    targets.forEach((el) => {
      el.addEventListener("mouseenter", enter);
      el.addEventListener("mouseleave", leave);
    });

    return () => {
      document.removeEventListener("mousemove", move);
      targets.forEach((el) => {
        el.removeEventListener("mouseenter", enter);
        el.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return <div id="navkar-cursor" />;
}
