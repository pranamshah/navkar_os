import Link from "next/link";

interface Props {
  href?      : string;
  className? : string;
  /** Rendered height in px; width scales from 550:130 aspect ratio */
  height?    : number;
  /** Use white version for dark sidebars / dark panels */
  onDark?    : boolean;
}

/**
 * NavkarOS logo — fully inline SVG, transparent background.
 * No PNG, no white rectangle, works on any surface.
 */
export default function LogoBrand({
  href      = "/",
  className = "",
  height    = 36,
  onDark    = false,
}: Props) {
  const VW    = 550;
  const VH    = 130;
  const width = Math.round(height * (VW / VH));

  /* ─── colour tokens ─────────────────────────────── */
  const nFill    = onDark ? "#FFFFFF" : "#1A6AAA";   // N letterform
  const arrow    = onDark ? "rgba(255,255,255,0.85)" : "#3AABD8"; // swoosh
  const wm       = onDark ? "#FFFFFF" : "#3D3D3D";   // wordmark

  return (
    <Link href={href} className={`inline-flex items-center ${className}`}>
      <svg
        width={width}
        height={height}
        viewBox={`0 0 ${VW} ${VH}`}
        xmlns="http://www.w3.org/2000/svg"
        aria-label="NavkarOS"
        role="img"
      >
        {/* ── N letterform ─────────────────────────────────
            Three shapes; all same fill → seamless solid letter.

            Left pillar   (x 14-42,  full height)
            Right pillar  (x 80-108, full height)
            Diagonal band (top-right of left leg → bottom-left of right leg)
            Band corners calculated from stroke-width ≈ 28px along diagonal.
        ──────────────────────────────────────────────────── */}
        <polygon points="14,8  42,8  42,122 14,122" fill={nFill} />
        <polygon points="80,8 108,8 108,122 80,122" fill={nFill} />
        {/* diagonal: (42,8)→(80,122) with band half-width 14 */}
        <polygon points="55,4 29,12 67,126 93,118"  fill={nFill} />

        {/* ── Curved swoosh / arrow ──────────────────────
            Cubic Bézier from lower-center of N sweeping
            left-and-up, ending at an arrowhead in the upper-right.
            Arc stops just before the tip so the polygon arrowhead sits flush.
        ──────────────────────────────────────────────────── */}
        <path
          d="M 50 104 C 14 100, 50 40, 67 32"
          stroke={arrow}
          strokeWidth="11"
          strokeLinecap="round"
          fill="none"
        />
        {/* Arrowhead polygon — tip (80,26), pointing ≈ NE 25° above horizontal */}
        <polygon points="80,26 70,37 65,27" fill={arrow} />

        {/* ── Wordmark ──────────────────────────────────── */}

        {/* NAVKAR */}
        <text
          x="128" y="92"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="72"
          fontWeight="800"
          textLength="305"
          lengthAdjust="spacingAndGlyphs"
          fill={wm}
        >NAVKAR</text>

        {/* Power-button "O":
            Arc from 305° to 235° (large arc, clockwise) = full circle with 70° gap at top.
            Vertical stem from center-top through the gap.
            Sized to match cap-height (radius 27, center-y 65). */}
        <path
          d="M 474,43 A 27,27 0 1 1 443,43"
          stroke={wm}
          strokeWidth="6.5"
          strokeLinecap="round"
          fill="none"
        />
        <line
          x1="458" y1="38"
          x2="458" y2="65"
          stroke={wm}
          strokeWidth="6.5"
          strokeLinecap="round"
        />

        {/* S */}
        <text
          x="488" y="92"
          fontFamily="'Helvetica Neue', Helvetica, Arial, sans-serif"
          fontSize="72"
          fontWeight="800"
          textLength="42"
          lengthAdjust="spacingAndGlyphs"
          fill={wm}
        >S</text>
      </svg>
    </Link>
  );
}
