import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

export default function PortableTextBlock({
  block,
  promoteFirstHeading = false,
}: BlockProps<"portableTextBlock"> & { promoteFirstHeading?: boolean }) {
  if (!block.body?.length) return null;
  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-prose">
        <RichText value={block.body} promoteFirstHeading={promoteFirstHeading} className="prose-site" />
      </div>
    </section>
  );
}
