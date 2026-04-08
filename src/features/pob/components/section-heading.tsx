import { Badge } from "@/components/ui/badge";

export function SectionHeading({
  eyebrow,
  title,
  description,
}: {
  eyebrow: string;
  title: string;
  description: string;
}) {
  return (
    <div className="space-y-3">
      <Badge>{eyebrow}</Badge>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight text-white">{title}</h2>
        <p className="max-w-3xl text-sm leading-7 text-muted">{description}</p>
      </div>
    </div>
  );
}
