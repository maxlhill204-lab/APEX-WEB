import Image from "next/image";

type LogoProps = {
  variant?: "full" | "icon";
  className?: string;
};

export function Logo({ variant = "full", className = "" }: LogoProps) {
  const src = variant === "icon" ? "/apex-web-profile.png" : "/apex-web-logo.svg";
  const width = variant === "icon" ? 64 : 188;
  const height = variant === "icon" ? 64 : 52;

  return (
    <Image
      src={src}
      alt="APEX WEB"
      width={width}
      height={height}
      priority
      className={className}
    />
  );
}
