import type { SVGProps } from "react";

/*
 * Ikonografia prevzatá z PRUUD design manuálu.
 * Päť symbolov, ktoré spolu opisujú celý produkt:
 *   U  = výrobca (energia vzniká)
 *   ⚡︎ medzi bodmi = zdieľanie (tok energie)
 *   ∩  = spotrebiteľ (energia sa využíva)
 *   ∞  = nekonečný tok (udržateľná energia)
 *   ⚡ = elektrina
 */

type IconProps = SVGProps<SVGSVGElement>;

const base = {
  viewBox: "0 0 48 48",
  fill: "none",
  stroke: "currentColor",
  strokeWidth: 3.5,
  strokeLinecap: "round" as const,
  strokeLinejoin: "round" as const,
};

/** Výrobca — písmeno „U", energia vzniká. */
export function IconProducer(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 9v17a11 11 0 0 0 22 0V9" />
    </svg>
  );
}

/** Spotrebiteľ — obrátené „U", energia sa využíva. */
export function IconConsumer(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M13 39V22a11 11 0 0 1 22 0v17" />
    </svg>
  );
}

/** Zdieľanie — blesk medzi dvoma uzlami, tok energie. Signature znak značky. */
export function IconSharing(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <circle cx="6" cy="24" r="3" fill="currentColor" stroke="none" />
      <circle cx="42" cy="24" r="3" fill="currentColor" stroke="none" />
      <path d="M9 24h9M30 24h9" />
      <path
        d="M26 11 18 26h6l-2 11 8-15h-6l2-11Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}

/** Nekonečný tok — udržateľná energia. */
export function IconInfiniteFlow(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path d="M24 24c-3.5-5.5-6.5-8-10.5-8a8 8 0 0 0 0 16c4 0 7-2.5 10.5-8Zm0 0c3.5-5.5 6.5-8 10.5-8a8 8 0 0 1 0 16c-4 0-7-2.5-10.5-8Z" />
    </svg>
  );
}

/** Elektrina — sila, prúdenie, život. */
export function IconBolt(props: IconProps) {
  return (
    <svg {...base} {...props}>
      <path
        d="M27 5 13 27h9l-3 16 15-23h-10l3-15Z"
        fill="currentColor"
        stroke="none"
      />
    </svg>
  );
}
