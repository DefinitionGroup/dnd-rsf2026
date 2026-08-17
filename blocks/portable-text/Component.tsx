import RichText from "@/components/RichText";
import type { BlockProps } from "@/blocks/types";

/** Reading block: left-aligned prose in the 720px column on a white canvas. */
export default function PortableTextBlock({
  block,
  promoteFirstHeading = false,
}: BlockProps<"portableTextBlock"> & { promoteFirstHeading?: boolean }) {
  if (!block.body?.length) return null;
  return (
    <section className="canvas-white section-space page-gutter">
      <div className="container-prose">
        <RichText value={block.body} promoteFirstHeading={promoteFirstHeading} className="prose-site" />
      </div>
    </section>
  );
}
