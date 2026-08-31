import { cn } from "@/lib/utils";

/*
 * Schéma toku energie. Priamy prepis ikonografie z design manuálu:
 * výrobca (U) → zdieľanie (blesk medzi uzlami) → spotrebiteľ (∩),
 * so zúčtovaním cez EDC v 15-minútových intervaloch.
 */

export function EnergyFlow({
  className,
  onDark = false,
}: {
  className?: string;
  onDark?: boolean;
}) {
  const line = onDark ? "#4a4f5c" : "#d7dae1";
  const label = onDark ? "#b9bec9" : "#4a4f5c";
  const strong = onDark ? "#ffffff" : "#14151a";

  return (
    <svg
      viewBox="0 0 720 300"
      className={cn("h-auto w-full", className)}
      role="img"
      aria-label="Schéma zdieľania: výrobca posiela prebytok cez Energetické dátové centrum spotrebiteľovi, zúčtovanie prebieha v 15-minútových intervaloch."
    >
      {/* Výrobca — symbol U z manuálu */}
      <g transform="translate(40, 70)">
        <rect
          width="130"
          height="130"
          rx="24"
          fill={onDark ? "#1c1e24" : "#ffffff"}
          stroke={line}
        />
        <path
          d="M45 38v30a20 20 0 0 0 40 0V38"
          fill="none"
          stroke="#a1762f"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <text
          x="65"
          y="112"
          textAnchor="middle"
          fill={strong}
          fontSize="15"
          fontWeight="600"
        >
          Výrobca
        </text>
      </g>

      {/* Tok: výrobca → EDC */}
      <g>
        <line
          x1="176"
          y1="135"
          x2="272"
          y2="135"
          stroke={line}
          strokeWidth="3"
        />
        <line
          x1="176"
          y1="135"
          x2="272"
          y2="135"
          stroke="#a1762f"
          strokeWidth="3"
          strokeDasharray="8 16"
          strokeLinecap="round"
          className="animate-flow"
        />
        <text x="224" y="120" textAnchor="middle" fill={label} fontSize="12">
          prebytok
        </text>
      </g>

      {/* EDC — zúčtovací uzol */}
      <g transform="translate(280, 55)">
        <rect
          width="160"
          height="160"
          rx="80"
          fill={onDark ? "#0a333f" : "#eef5f7"}
          stroke={onDark ? "#2b6d80" : "#7fb0bd"}
        />
        <path
          d="M88 46 66 84h16l-6 30 24-40H84l4-28Z"
          fill="#a1762f"
          className="animate-pulse-node"
          style={{ transformOrigin: "80px 80px" }}
        />
        <text
          x="80"
          y="128"
          textAnchor="middle"
          fill={onDark ? "#ffffff" : "#0a333f"}
          fontSize="15"
          fontWeight="600"
        >
          EDC / OKTE
        </text>
      </g>

      {/* Tok: EDC → spotrebiteľ */}
      <g>
        <line
          x1="448"
          y1="135"
          x2="544"
          y2="135"
          stroke={line}
          strokeWidth="3"
        />
        <line
          x1="448"
          y1="135"
          x2="544"
          y2="135"
          stroke="#a1762f"
          strokeWidth="3"
          strokeDasharray="8 16"
          strokeLinecap="round"
          className="animate-flow"
        />
        <text x="496" y="120" textAnchor="middle" fill={label} fontSize="12">
          zdieľaná kWh
        </text>
      </g>

      {/* Spotrebiteľ — obrátené U z manuálu */}
      <g transform="translate(552, 70)">
        <rect
          width="130"
          height="130"
          rx="24"
          fill={onDark ? "#1c1e24" : "#ffffff"}
          stroke={line}
        />
        <path
          d="M45 78V48a20 20 0 0 1 40 0v30"
          fill="none"
          stroke="#a1762f"
          strokeWidth="7"
          strokeLinecap="round"
        />
        <text
          x="65"
          y="112"
          textAnchor="middle"
          fill={strong}
          fontSize="15"
          fontWeight="600"
        >
          Spotrebiteľ
        </text>
      </g>

      {/* Pätka: interval zúčtovania */}
      <g transform="translate(0, 250)">
        <line x1="105" y1="0" x2="617" y2="0" stroke={line} strokeDasharray="4 6" />
        <text x="360" y="24" textAnchor="middle" fill={label} fontSize="13">
          Zúčtovanie každých 15 minút podľa alokačného kľúča
        </text>
      </g>
    </svg>
  );
}
