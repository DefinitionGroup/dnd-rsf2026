import { PortableText, type PortableTextBlock } from "@portabletext/react";
import type { RichText as RichTextValue } from "@/sanity.types";

export default function RichText({
  value,
  promoteFirstHeading = false,
  className,
}: {
  value?: RichTextValue | null;
  promoteFirstHeading?: boolean;
  className?: string;
}) {
  if (!value?.length) return null;

  let promoted = false;
  const renderedValue = (promoteFirstHeading
    ? value.map((block) => {
        if (!promoted && block._type === "block" && block.style === "h2") {
          promoted = true;
          return { ...block, style: "h1" as const };
        }
        return block;
      })
    : value) as PortableTextBlock[];

  return (
    <div className={className ?? "prose-site"}>
      <PortableText
        value={renderedValue}
        components={{
          block: {
            normal: ({ children }) => <p>{children}</p>,
            h1: ({ children }) => <h1>{children}</h1>,
            h2: ({ children }) => <h2>{children}</h2>,
            h3: ({ children }) => <h3>{children}</h3>,
            h4: ({ children }) => <h4>{children}</h4>,
            blockquote: ({ children }) => <blockquote>{children}</blockquote>,
          },
          list: {
            bullet: ({ children }) => <ul>{children}</ul>,
            number: ({ children }) => <ol>{children}</ol>,
          },
          listItem: {
            bullet: ({ children }) => <li>{children}</li>,
            number: ({ children }) => <li>{children}</li>,
          },
          marks: {
            link: ({ children, value }) => {
              const href = typeof value?.href === "string" ? value.href : undefined;
              const external = href ? /^(https?:|mailto:|tel:)/.test(href) : false;
              return (
                <a href={href} rel={external ? "noopener" : undefined} target={external ? "_blank" : undefined}>
                  {children}
                </a>
              );
            },
          },
        }}
      />
    </div>
  );
}
