import { NetworkField } from "@/components/ui/network-field"

export function HeroEmblem() {
  return (
    <div className="relative flex size-[340px] items-center justify-center sm:size-[380px]">
      <NetworkField
        className="inset-[-14%] mask-[radial-gradient(circle_at_center,transparent_18%,black_54%,transparent_96%)] opacity-70"
        connectionDistance={78}
        particleCount={54}
        speed={0.2}
      />
      <div className="absolute inset-0 animate-[spin_25s_linear_infinite] rounded-full border border-(--app-accent-border)" />
      <div className="absolute inset-[11%] animate-[spin_18s_linear_infinite_reverse] rounded-full border border-(--app-accent-border)" />
      <div className="absolute inset-[21%] animate-[spin_12s_linear_infinite] rounded-full border border-(--app-accent-border)" />
      <div className="absolute size-[200px] animate-[pulse_3s_ease-in-out_infinite] rounded-full bg-[radial-gradient(circle,var(--app-accent-glow)_0%,transparent_70%)]" />

      <svg
        className="relative z-10 size-[180px] drop-shadow-[0_0_20px_var(--app-accent-primary)]"
        viewBox="0 0 180 180"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id="embGrad1"
            x1="0"
            y1="0"
            x2="180"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--app-accent-secondary)" />
            <stop offset="100%" stopColor="var(--app-accent-primary)" />
          </linearGradient>
          <linearGradient
            id="embGrad2"
            x1="90"
            y1="0"
            x2="90"
            y2="180"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--app-silver)" stopOpacity="0.9" />
            <stop
              offset="100%"
              stopColor="var(--app-silver-dim)"
              stopOpacity="0.3"
            />
          </linearGradient>
          <filter id="glow-filter">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>

        <polygon
          points="90,8 162,48 162,132 90,172 18,132 18,48"
          stroke="url(#embGrad1)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.4"
        />
        <polygon
          points="90,22 148,57 148,123 90,158 32,123 32,57"
          stroke="url(#embGrad1)"
          strokeWidth="1"
          fill="none"
          opacity="0.3"
        />
        <path
          d="M90 35 L70 60 L72 80 L85 74 L90 78 L95 74 L108 80 L110 60 Z"
          fill="url(#embGrad1)"
          opacity="0.85"
          filter="url(#glow-filter)"
        />
        <path
          d="M72 80 L60 105 L75 120 L90 112 L105 120 L120 105 L108 80 L95 86 L90 82 L85 86 Z"
          fill="url(#embGrad1)"
          opacity="0.7"
        />
        <line
          x1="90"
          y1="30"
          x2="90"
          y2="50"
          stroke="url(#embGrad2)"
          strokeWidth="2"
          opacity="0.8"
        />
        <line
          x1="58"
          y1="48"
          x2="72"
          y2="62"
          stroke="url(#embGrad2)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <line
          x1="122"
          y1="48"
          x2="108"
          y2="62"
          stroke="url(#embGrad2)"
          strokeWidth="1.5"
          opacity="0.6"
        />
        <path
          d="M75 120 L65 140 L90 132 L115 140 L105 120"
          stroke="url(#embGrad2)"
          strokeWidth="1.5"
          fill="none"
          opacity="0.5"
        />
        <circle cx="90" cy="155" r="3" fill="url(#embGrad1)" opacity="0.8" />
        <circle cx="55" cy="138" r="2" fill="url(#embGrad1)" opacity="0.5" />
        <circle cx="125" cy="138" r="2" fill="url(#embGrad1)" opacity="0.5" />
        <circle cx="35" cy="90" r="2" fill="url(#embGrad1)" opacity="0.4" />
        <circle cx="145" cy="90" r="2" fill="url(#embGrad1)" opacity="0.4" />
        <circle cx="90" cy="90" r="5" fill="url(#embGrad2)" opacity="0.9" />
        <circle
          cx="90"
          cy="90"
          r="9"
          fill="none"
          stroke="url(#embGrad1)"
          strokeWidth="1"
          opacity="0.5"
        />
      </svg>
    </div>
  )
}
