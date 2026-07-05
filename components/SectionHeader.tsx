import { Reveal } from "./Reveal";

type SectionHeaderProps = {
  eyebrow: string;
  title: string;
  description?: string;
  align?: "left" | "center";
};

export function SectionHeader({
  eyebrow,
  title,
  description,
  align = "center",
}: SectionHeaderProps) {
  return (
    <Reveal
      className={`mx-auto mb-14 max-w-3xl ${
        align === "center" ? "text-center" : "text-left"
      }`}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h2 className="mt-4 text-4xl font-black leading-tight text-white md:text-6xl">
        {title}
      </h2>
      {description ? (
        <p className="mt-5 text-lg leading-8 text-neutral-300">{description}</p>
      ) : null}
    </Reveal>
  );
}
