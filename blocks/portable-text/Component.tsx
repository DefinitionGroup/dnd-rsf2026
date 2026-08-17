import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

export default function PortableTextBlock({
  block,
  promoteFirstHeading = false,
}: BlockProps<"portableTextBlock"> & { promoteFirstHeading?: boolean }) {
  if (!block.body?.length) return null;
  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <RichText value={block.body} promoteFirstHeading={promoteFirstHeading} className="prose-site mx-auto max-w-[68ch]" />
      </div>
    </section>
  );
}
