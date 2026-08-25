import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

/**
 * Apple quote tiles: white `.tile`s on a frost canvas, 1–3 columns. Quote in
 * the 21/400 subheading voice, name 14px carbon, role/company caption.
 */
export default function TestimonialBlock({ block }: BlockProps<"testimonialBlock">) {
  const testimonials = (block.testimonials ?? []).filter(Boolean);
  if (testimonials.length === 0) return null;

  const single = testimonials.length === 1;
  const cols = single ? "mx-auto max-w-[46rem]" : testimonials.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 lg:grid-cols-3";

  return (
    <section className="canvas-frost section-space page-gutter">
      <div className="container-site">
        <SectionHeader eyebrow={block.eyebrow} headline={block.headline} />

        <ul className={`grid gap-4 ${block.headline ? "mt-12 md:mt-16" : ""} ${cols}`} role="list">
          {testimonials.map((testimonial, index) => {
            const meta = [testimonial.role, testimonial.company].filter(Boolean).join(" · ");
            return (
              <Reveal as="li" key={testimonial._id} delay={(index % 3) * 60} className="flex">
                <figure className="tile flex h-full w-full flex-col justify-between gap-6">
                  <blockquote className="subheading text-fg">{testimonial.quote}</blockquote>
                  <figcaption>
                    <span className="body-sm block text-fg">{testimonial.name}</span>
                    {meta ? <span className="caption mt-1 block">{meta}</span> : null}
                  </figcaption>
                </figure>
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
