"use client";
import { useEffect } from "react";
import { motion, useReducedMotion } from "framer-motion";

export function HeroMotion({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      initial={reduced ? false : { opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.55, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}
export function RevealGrid({
  children,
  className,
}: {
  children: React.ReactNode;
  className: string;
}) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={false}
      whileInView={reduced ? undefined : "visible"}
      viewport={{ once: true, amount: 0.08 }}
      variants={{ visible: { transition: { staggerChildren: 0.06 } } }}
    >
      {children}
    </motion.div>
  );
}
export function RevealItem({ children }: { children: React.ReactNode }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className="h-full"
      initial={reduced ? false : { opacity: 0.6, y: 12 }}
      variants={{
        visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
      }}
    >
      {children}
    </motion.div>
  );
}
export function ScrollEffects() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let ctx: { revert: () => void } | undefined;
    let cancelled = false;
    void Promise.all([import("gsap"), import("gsap/ScrollTrigger")]).then(
      ([g, st]) => {
        if (cancelled) return;
        const gsap = g.gsap;
        gsap.registerPlugin(st.ScrollTrigger);
        ctx = gsap.context(() => {
          document
            .querySelectorAll("[data-step-group]")
            .forEach((group) =>
              gsap.fromTo(
                group.querySelectorAll("[data-step]"),
                { opacity: 0.6, x: -12 },
                {
                  opacity: 1,
                  x: 0,
                  duration: 0.5,
                  stagger: 0.14,
                  scrollTrigger: {
                    trigger: group,
                    start: "top 88%",
                    once: true,
                  },
                },
              ),
            );
          document
            .querySelectorAll("[data-timeline]")
            .forEach((group) =>
              gsap.fromTo(
                group.querySelectorAll("[data-timeline-step]"),
                { opacity: 0.6, y: 8 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.12,
                  scrollTrigger: {
                    trigger: group,
                    start: "top 90%",
                    once: true,
                  },
                },
              ),
            );
        });
      },
    );
    return () => {
      cancelled = true;
      ctx?.revert();
    };
  }, []);
  return null;
}
