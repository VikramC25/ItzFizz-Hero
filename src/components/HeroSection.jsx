import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import StatCard from "./StatCard";

gsap.registerPlugin(ScrollTrigger);

const HEADLINE = "WELCOME ITZFIZZ";

const STATS = [
  { id: "box1", value: "58%", label: "Increase in pick up point use", variant: "lime", style: { top: "4%", right: "5%" } },
  { id: "box2", value: "23%", label: "Decreased in customer phone calls", variant: "sky", style: { bottom: "4%", left: "5%" } },
  { id: "box3", value: "27%", label: "Increase in pick up point use", variant: "dark", style: { top: "4%", right: "35%" } },
  { id: "box4", value: "40%", label: "Decreased in customer phone calls", variant: "orange", style: { bottom: "4%", right: "5%" } },
];

export default function HeroSection() {
  const sectionRef = useRef(null);
  const carRef = useRef(null);
  const trailRef = useRef(null);
  const lettersRef = useRef([]);

  useEffect(() => {
    const car = carRef.current;
    const trail = trailRef.current;
    const letters = lettersRef.current.filter(Boolean);
    const section = sectionRef.current;

    // Measure after a frame so layout is stable
    const headlineContainer = letters[0]?.parentElement;
    const containerRect = headlineContainer?.getBoundingClientRect();
    const letterOffsets = letters.map((l) => l.offsetLeft);

    const roadWidth = window.innerWidth;
    const carRect = car.getBoundingClientRect();
    const carWidth = carRect.width;
    const endX = roadWidth - carWidth;

    const ctx = gsap.context(() => {
      // ── Main car scroll animation ─────────────────
      gsap.to(car, {
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "bottom top",
          scrub: true,
        },
        x: endX,
        ease: "none",
        onUpdate() {
          const carX = gsap.getProperty(car, "x") + carWidth / 2;

          // Reveal letters as car passes
          letters.forEach((letter, i) => {
            const letterX = (containerRect?.left || 0) + letterOffsets[i];
            letter.style.opacity = carX >= letterX ? "1" : "0";
          });

          // Trail follows car
          gsap.set(trail, { width: carX });
        },
      });

      // ── Stat cards fade in at staggered scroll positions ──
      const offsets = [300, 500, 700, 900];
      STATS.forEach((stat, i) => {
        gsap.set(`#${stat.id}`, { opacity: 0, y: 20 });

        gsap.to(`#${stat.id}`, {
          scrollTrigger: {
            trigger: section,
            start: `top+=${offsets[i]} top`,
            end: `top+=${offsets[i] + 200} top`,
            scrub: true,
          },
          opacity: 1,
          y: 0,
          ease: "power2.out",
        });
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Split headline into individual letter spans
  const headlineLetters = HEADLINE.split("").map((char, i) => (
    <span
      key={i}
      ref={(el) => (lettersRef.current[i] = el)}
      className="headline-letter"
    >
      {char === " " ? "\u00A0" : char}
    </span>
  ));

  return (
    <div className="hero-section" ref={sectionRef}>
      <div className="hero-track">
        {/* Road with car, trail, and headline */}
        <div className="road">
          <img
            ref={carRef}
            src="/car.svg"
            alt="Sports car top view"
            className="car"
          />
          <div ref={trailRef} className="trail" />
          <div className="headline-container">{headlineLetters}</div>
        </div>

        {/* Stat cards */}
        {STATS.map((stat) => (
          <StatCard key={stat.id} {...stat} />
        ))}

        {/* Scroll indicator */}
        <div className="scroll-indicator">
          <span>Scroll</span>
          <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 16l-6-6h12l-6 6z" />
          </svg>
        </div>
      </div>
    </div>
  );
}
