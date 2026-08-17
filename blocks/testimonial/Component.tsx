import Reveal from "@/components/motion/Reveal";
import SectionHeader from "@/components/SectionHeader";
import type { BlockProps } from "@/blocks/types";

export default function TestimonialBlock({ block }: BlockProps<"testimonialBlock">) {
  const testimonials = (block.testimonials ?? []).filter(Boolean);
  if (testimonials.length === 0) return null;

  const single = testimonials.length === 1;
  const cols = single ? "" : testimonials.length === 2 ? "md:grid-cols-2" : "md:grid-cols-2 xl:grid-cols-3";

  return (
    <section className="section-space page-gutter bg-paper">
      <div className="container-site">
        <SectionHeader headline={block.headline} />

        <ul className={`grid gap-6 ${block.headline ? "mt-12 md:mt-16" : ""} ${cols}`} role="list">
          {testimonials.map((testimonial, index) => {
            const meta = [testimonial.role, testimonial.company].filter(Boolean).join(" · ");
            return (
              <Reveal as="li" key={testimonial._id} delay={index * 60} className="flex">
                <figure className="card flex h-full w-full flex-col justify-between gap-8 p-7 md:p-8">
                  <blockquote className={`text-ink ${single ? "text-2xl md:text-3xl md:leading-snug" : "text-xl leading-snug"}`}>
                    {testimonial.quote}
                  </blockquote>
                  <figcaption>
                    <span className="label block text-ink">{testimonial.name}</span>
                    {meta ? <span className="label mt-0.5 block">{meta}</span> : null}
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
