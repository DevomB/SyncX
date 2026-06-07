import Image from "next/image";

export function CoconutAsset() {
  return (
    <Image
      src="/coconut.png"
      alt=""
      width={1}
      height={1}
      aria-hidden
      style={{ position: "absolute", width: 1, height: 1, opacity: 0, pointerEvents: "none" }}
      priority
    />
  );
}
