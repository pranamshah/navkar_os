import Image from "next/image";
import Link from "next/link";

interface Props {
  href?      : string;
  className? : string;
  /** Height in px — width auto-scales from 2816:1536 (≈1.833:1) native ratio */
  height?    : number;
  /** No longer needed — kept for API compatibility, has no effect */
  onDark?    : boolean;
}

/**
 * NavkarOS logo — exact original mark with white background removed.
 * Fully transparent PNG; works on any background colour without any hacks.
 */
export default function LogoBrand({
  href      = "/",
  className = "",
  height    = 36,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onDark    = false,
}: Props) {
  // Native image is 2816 × 1536 → ratio ≈ 1.833
  const width = Math.round(height * (2816 / 1536));

  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <Image
        src="/navkaros-logo.png"
        alt="NavkarOS"
        width={width}
        height={height}
        style={{ width, height, objectFit: "contain" }}
        priority
      />
    </Link>
  );
}
