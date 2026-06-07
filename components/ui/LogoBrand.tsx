import Image from "next/image";
import Link from "next/link";

interface Props {
  href?      : string;
  className? : string;
  /** Height of the logo in px (width scales automatically ~3.08:1 ratio) */
  height?    : number;
  /**
   * Set to true when the logo sits on a DARK background (sidebars, dark panels).
   * Wraps image in a white pill so the logo reads clearly.
   * On light backgrounds leave this false — mix-blend-mode:multiply
   * removes the white logo background seamlessly.
   */
  onDark?    : boolean;
}

/**
 * Official NavkarOS logo — Gemini-generated combined mark + wordmark.
 */
export default function LogoBrand({
  href      = "/",
  className = "",
  height    = 36,
  onDark    = false,
}: Props) {
  const width = Math.round(height * 3.08);

  if (onDark) {
    // Dark background: wrap in white pill so logo is readable
    return (
      <Link href={href} className={`inline-flex items-center ${className}`}>
        <span style={{
          display: "inline-flex",
          alignItems: "center",
          background: "#ffffff",
          borderRadius: 6,
          padding: "3px 10px",
        }}>
          <Image
            src="/navkaros-logo.png"
            alt="NavkarOS"
            width={width}
            height={height}
            style={{ width, height, objectFit: "contain" }}
            priority
          />
        </span>
      </Link>
    );
  }

  // Light background: mix-blend-mode:multiply makes the white logo
  // background transparent — blends perfectly with any off-white surface
  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <Image
        src="/navkaros-logo.png"
        alt="NavkarOS"
        width={width}
        height={height}
        style={{
          width,
          height,
          objectFit: "contain",
          mixBlendMode: "multiply",
        }}
        priority
      />
    </Link>
  );
}
