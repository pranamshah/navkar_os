"use client";

import { useEffect } from "react";

export default function CustomCursor() {
  useEffect(() => {
    // Apply custom cursor only on this page
    document.body.classList.add("custom-cursor");

    const cursor = document.getElementById("navkar-cursor");
    if (!cursor) return;

    const move = (e: MouseEvent) => {
      cursor.style.left = e.clientX + "px";
      cursor.style.top = e.clientY + "px";
    };

    const enter = () => cursor.classList.add("hovering");
    const leave = () => cursor.classList.remove("hovering");

    document.addEventListener("mousemove", move);

    const addListeners = () => {
      const targets = document.querySelectorAll("button, a, [data-cursor]");
      targets.forEach((el) => {
        el.addEventListener("mouseenter", enter);
        el.addEventListener("mouseleave", leave);
      });
    };
    addListeners();

    return () => {
      document.body.classList.remove("custom-cursor");
      document.removeEventListener("mousemove", move);
    };
  }, []);

  return <div id="navkar-cursor" />;
}
