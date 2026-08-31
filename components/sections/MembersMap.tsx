import { cn } from "@/lib/utils";

/*
 * Sieť členov. Mestá sú umiestnené podľa skutočných zemepisných súradníc
 * a lineárne premietnuté do viewBoxu — charakteristický pretiahnutý tvar
 * Slovenska vznikne z rozloženia bodov, bez obkresľovania hraníc.
 */

type City = { name: string; lat: number; lon: number; size: number };

const cities: City[] = [
  { name: "Bratislava", lat: 48.15, lon: 17.11, size: 3 },
  { name: "Pezinok", lat: 48.29, lon: 17.27, size: 2 },
  { name: "Trnava", lat: 48.38, lon: 17.59, size: 2 },
  { name: "Piešťany", lat: 48.59, lon: 17.83, size: 1 },
  { name: "Nitra", lat: 48.31, lon: 18.09, size: 2 },
  { name: "Nové Zámky", lat: 47.99, lon: 18.16, size: 1 },
  { name: "Komárno", lat: 47.76, lon: 18.13, size: 1 },
  { name: "Trenčín", lat: 48.89, lon: 18.04, size: 2 },
  { name: "Žilina", lat: 49.22, lon: 18.74, size: 3 },
  { name: "Martin", lat: 49.07, lon: 18.92, size: 1 },
  { name: "Ružomberok", lat: 49.08, lon: 19.31, size: 1 },
  { name: "Liptovský Mikuláš", lat: 49.08, lon: 19.62, size: 1 },
  { name: "Banská Bystrica", lat: 48.74, lon: 19.15, size: 3 },
  { name: "Zvolen", lat: 48.58, lon: 19.13, size: 1 },
  { name: "Lučenec", lat: 48.33, lon: 19.67, size: 1 },
  { name: "Poprad", lat: 49.06, lon: 20.3, size: 2 },
  { name: "Bardejov", lat: 49.29, lon: 21.28, size: 1 },
  { name: "Prešov", lat: 49.0, lon: 21.24, size: 2 },
  { name: "Košice", lat: 48.72, lon: 21.26, size: 3 },
  { name: "Humenné", lat: 48.93, lon: 21.91, size: 1 },
  { name: "Michalovce", lat: 48.75, lon: 21.92, size: 1 },
];

const BOUNDS = { minLon: 16.7, maxLon: 22.7, minLat: 47.6, maxLat: 49.7 };
const W = 760;
const H = 340;

function project({ lat, lon }: { lat: number; lon: number }) {
  const x = ((lon - BOUNDS.minLon) / (BOUNDS.maxLon - BOUNDS.minLon)) * W;
  // Zemepisná šírka rastie nahor, os y v SVG nadol.
  const y = ((BOUNDS.maxLat - lat) / (BOUNDS.maxLat - BOUNDS.minLat)) * H;
  return { x, y };
}

/** Dvojice miest, medzi ktorými vykreslíme spojnicu zdieľania. */
const links: Array<[string, string]> = [
  ["Pezinok", "Bratislava"],
  ["Bratislava", "Trnava"],
  ["Trnava", "Nitra"],
  ["Nitra", "Banská Bystrica"],
  ["Trenčín", "Žilina"],
  ["Žilina", "Poprad"],
  ["Banská Bystrica", "Poprad"],
  ["Poprad", "Košice"],
  ["Prešov", "Košice"],
  ["Košice", "Michalovce"],
  ["Bratislava", "Košice"],
];

export function MembersMap({ className }: { className?: string }) {
  const byName = new Map(cities.map((c) => [c.name, project(c)]));

  return (
    <div className={cn("rounded-card border border-ink-200 bg-white p-6 md:p-8", className)}>
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="h-auto w-full"
        role="img"
        aria-label="Sieť členov PRUUD naprieč Slovenskom — od Bratislavy po Michalovce."
      >
        {links.map(([a, b]) => {
          const pa = byName.get(a);
          const pb = byName.get(b);
          if (!pa || !pb) return null;
          return (
            <line
              key={`${a}-${b}`}
              x1={pa.x}
              y1={pa.y}
              x2={pb.x}
              y2={pb.y}
              stroke="#ead6ac"
              strokeWidth="1.5"
            />
          );
        })}

        {cities.map((city) => {
          const { x, y } = project(city);
          const r = 3 + city.size * 1.8;
          return (
            <g key={city.name}>
              {city.size === 3 && (
                <circle cx={x} cy={y} r={r + 6} fill="#a1762f" opacity="0.12" />
              )}
              <circle cx={x} cy={y} r={r} fill="#a1762f" />
              {city.size >= 2 && (
                <text
                  x={x}
                  y={y - r - 7}
                  textAnchor="middle"
                  fontSize="12"
                  fill="#4a4f5c"
                >
                  {city.name}
                </text>
              )}
            </g>
          );
        })}
      </svg>

      <p className="mt-6 border-t border-ink-200 pt-5 text-xs leading-relaxed text-ink-500">
        Ilustračné zobrazenie siete. Zdieľať sa dá naprieč celým Slovenskom —
        vzdialenosť medzi výrobcom a spotrebiteľom nehrá rolu, pretože
        elektrina fyzicky nikam necestuje.
      </p>
    </div>
  );
}
