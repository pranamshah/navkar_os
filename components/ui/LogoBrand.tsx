import Image from "next/image";
import Link from "next/link";

interface Props {
  href?     : string;
  className?: string;
  /** Height of the wordmark in px */
  height?   : number;
}

/**
 * Official logo mark + wordmark.
 * Use only on LIGHT backgrounds (#f9f9f9 / white) — both source images
 * have white backgrounds that blend naturally with light pages.
 */
export default function LogoBrand({ href = "/", className = "", height = 28 }: Props) {
  const markPx = Math.round(height * 1.9);
  return (
    <Link href={href} className={`flex items-center gap-2.5 ${className}`}>
      <Image
        src="/logo-mark.jpg"
        alt=""
        width={markPx}
        height={markPx}
        style={{ width: markPx, height: markPx, objectFit: "contain", borderRadius: 3 }}
        priority
      />
      <Image
        src="/brandname.png"
        alt="NavkarOS"
        width={130}
        height={height}
        style={{ height: height, width: "auto", objectFit: "contain" }}
        priority
      />
    </Link>
  );
}
