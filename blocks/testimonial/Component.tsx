import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

export default function TestimonialBlock({ block }: BlockProps<"testimonialBlock">) {
  const testimonials = (block.testimonials ?? []).filter(Boolean);
  if (testimonials.length === 0) return null;

  const single = testimonials.length === 1;

  return (
    <section className="on-dark section-space page-gutter bg-ink text-paper">
      <div className="container-site">
        {(block.eyebrow || block.headline) && (
          <Reveal>
            <SectionHeader eyebrow={block.eyebrow} headline={block.headline} className="[&_h2]:text-paper [&_.eyebrow]:text-lime" />
          </Reveal>
        )}

        <ul
          className={`grid gap-6 ${block.eyebrow || block.headline ? "mt-12" : ""} ${single ? "" : "md:grid-cols-2 xl:grid-cols-3"}`}
          role="list"
        >
          {testimonials.map((testimonial, index) => {
            const meta = [testimonial.role, testimonial.company].filter(Boolean).join(" · ");
            return (
              <Reveal as="li" key={testimonial._id} delay={index * 0.08} className="flex">
                <figure className="relative flex h-full w-full flex-col justify-between gap-8 rounded-2xl border border-paper/10 bg-ink-soft p-8">
                  <span
                    className="pointer-events-none absolute -top-3 left-6 font-display text-7xl leading-none text-lime"
                    aria-hidden="true"
                  >
                    “
                  </span>
                  <blockquote className={`pt-6 leading-relaxed text-paper/90 ${single ? "text-2xl md:text-3xl" : "text-lg"}`}>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption className="flex items-center gap-4 border-t border-paper/10 pt-5">
                    <span className="h-px w-8 bg-lime" aria-hidden="true" />
                    <span>
                      <span className="block font-display text-sm uppercase tracking-[0.15em] text-paper">{testimonial.name}</span>
                      {meta ? <span className="mt-1 block text-sm text-paper/60">{meta}</span> : null}
                    </span>
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
