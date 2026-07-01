"use client";

import { useEffect } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";

/**
 * Smooth-scroll (Lenis) + animations de scroll (GSAP ScrollTrigger).
 * GSAP et Lenis sont importés depuis npm (versions épinglées) — aucune dépendance CDN.
 *
 * Conventions data-attributes lues ici :
 *  - [data-reveal]            : apparition au scroll. Variante via data-reveal="up|left|right|scale".
 *  - [data-reveal-delay="n"]  : délai (ms) avant l'apparition.
 *  - [data-stagger]           : anime ses enfants directs en cascade.
 *  - [data-parallax="n"]      : translation parallaxe (yPercent) pilotée par le scroll.
 *  - [data-counter="n"]       : compte de 0 jusqu'à n quand l'élément entre dans l'écran.
 */
export function SmoothScroll() {
  useEffect(() => {
    const root = document.documentElement;
    root.classList.add("has-gsap");

    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    // Sécurité : si quelque chose échoue, on révèle tout le contenu.
    const reveal = () => root.classList.remove("has-gsap");
    const safety = window.setTimeout(reveal, 2600);

    if (prefersReduced) {
      window.clearTimeout(safety);
      reveal();
      return;
    }

    gsap.registerPlugin(ScrollTrigger);

    const lenis = new Lenis({ lerp: 0.09, smoothWheel: true });
    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.lagSmoothing(0);

    window.clearTimeout(safety);
    reveal();

    const easeOut = "power3.out";

    const ctx = gsap.context(() => {
      // --- Apparitions simples ---
      const reveals = gsap.utils.toArray<HTMLElement>("[data-reveal]");
      reveals.forEach((el) => {
        const variant = el.dataset.reveal || "up";
        const delay = Number(el.dataset.revealDelay || 0) / 1000;
        const from: gsap.TweenVars = { opacity: 0 };
        if (variant === "left") from.x = -48;
        else if (variant === "right") from.x = 48;
        else if (variant === "scale") {
          from.scale = 0.92;
          from.y = 30;
        } else from.y = 44;

        gsap.fromTo(el, from, {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          duration: 1.05,
          delay,
          ease: easeOut,
          scrollTrigger: { trigger: el, start: "top 88%" },
        });
      });

      // --- Cascades (stagger sur les enfants directs) ---
      const groups = gsap.utils.toArray<HTMLElement>("[data-stagger]");
      groups.forEach((group) => {
        const children = Array.from(group.children) as HTMLElement[];
        gsap.fromTo(
          children,
          { opacity: 0, y: 46 },
          {
            opacity: 1,
            y: 0,
            duration: 0.9,
            ease: easeOut,
            stagger: 0.12,
            scrollTrigger: { trigger: group, start: "top 82%" },
          },
        );
      });

      // --- Parallaxe ---
      const layers = gsap.utils.toArray<HTMLElement>("[data-parallax]");
      layers.forEach((el) => {
        const amount = Number(el.dataset.parallax) || 16;
        gsap.to(el, {
          yPercent: amount,
          ease: "none",
          scrollTrigger: {
            trigger: el.closest("section") || el,
            start: "top bottom",
            end: "bottom top",
            scrub: true,
          },
        });
      });

      // --- Compteurs animés ---
      const counters = gsap.utils.toArray<HTMLElement>("[data-counter]");
      counters.forEach((el) => {
        const target = Number(el.dataset.counter) || 0;
        const decimals = Number(el.dataset.counterDecimals || 0);
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 1.8,
          ease: "power2.out",
          scrollTrigger: { trigger: el, start: "top 90%", once: true },
          onUpdate: () => {
            el.textContent = obj.val.toLocaleString("fr-FR", {
              minimumFractionDigits: decimals,
              maximumFractionDigits: decimals,
            });
          },
        });
      });
    });

    ScrollTrigger.refresh();

    return () => {
      window.clearTimeout(safety);
      ctx.revert();
      lenis.destroy();
      cancelAnimationFrame(rafId);
    };
  }, []);

  return null;
}
