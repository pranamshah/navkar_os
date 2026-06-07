import Image from "next/image";
import Link from "next/link";

interface Props {
  href?      : string;
  className? : string;
  /** Height of the logo in px (width scales automatically) */
  height?    : number;
  /**
   * Set to true when the logo sits on a dark/coloured background.
   * This wraps the image in a white rounded pill so the white logo
   * background blends cleanly with the container instead of the page.
   */
  onDark?    : boolean;
}

/**
 * Official NavkarOS logo — Gemini-generated combined mark + wordmark.
 * White background; use `onDark` prop when placing on dark sidebars/headers.
 */
export default function LogoBrand({
  href      = "/",
  className = "",
  height    = 36,
  onDark    = false,
}: Props) {
  // natural aspect ratio of the image is ~600×195 ≈ 3.08 : 1
  const width = Math.round(height * 3.08);

  const img = (
    <Image
      src="/navkaros-logo.png"
      alt="NavkarOS"
      width={width}
      height={height}
      style={{ width, height, objectFit: "contain" }}
      priority
    />
  );

  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      {onDark ? (
        <span
          style={{
            display       : "inline-flex",
            alignItems    : "center",
            background    : "#ffffff",
            borderRadius  : 6,
            padding       : "3px 8px",
          }}
        >
          {img}
        </span>
      ) : (
        img
      )}
    </Link>
  );
}
