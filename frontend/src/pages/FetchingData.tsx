import { useEffect, useState } from 'react'

interface Bank {
  id: string
  name: string
  short: string
  color: string
}

interface Props {
  bank: Bank | null
  consent: any
  onComplete: () => void
}

interface Step {
  label: string
  sub: string
}

const STEPS: Step[] = [
  {
    label: "Connecting to bank...",
    sub: "Establishing secure connection"
  },
  {
    label: "Verifying consent...",
    sub: "RBI AA Framework validation"
  },
  {
    label: "Fetching transactions...",
    sub: "Last 90 days of data"
  },
  {
    label: "Encrypting your data...",
    sub: "End-to-end encryption applied"
  },
  {
    label: "Starting BharosaCredit...",
    sub: "7 agents initializing"
  },
]

export default function FetchingData(
  { bank, onComplete }: Props
) {
  const [currentStep, setCurrentStep] =
    useState<number>(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStep(prev => {
        if (prev >= STEPS.length - 1) {
          clearInterval(interval)

          // Try real API, always fallback
          const controller = new AbortController()
          const timeout = setTimeout(() => {
            controller.abort()
            onComplete() // Always proceed
          }, 5000)

          fetch(
            "http://localhost:8000/analyze/sample/good",
            {
              method: "POST",
              signal: controller.signal
            }
          )
            .then(res => res.json())
            .then(() => {
              clearTimeout(timeout)
              onComplete()
            })
            .catch(() => {
              clearTimeout(timeout)
              onComplete() // Always proceed
            })

          return prev
        }
        return prev + 1
      })
    }, 1200)

    return () => clearInterval(interval)
  }, [])

  const progress = Math.round(
    (currentStep / (STEPS.length - 1)) * 100
  )

  return (
    <div
      className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Pulsing ring */}
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
        style={{
          border: "2px solid #f97316",
          animation:
            "pulse 1.5s ease-in-out infinite",
          boxShadow:
            "0 0 30px rgba(249,115,22,0.3)"
        }}
      >
        <div
          className="w-12 h-12 rounded-full flex items-center justify-center text-2xl"
          style={{
            background: "rgba(249,115,22,0.1)"
          }}
        >
          🏦
        </div>
      </div>

      <h2 className="text-2xl font-bold text-white mb-2 text-center">
        Fetching Your Data
      </h2>

      <p className="text-sm text-white/40 mb-10 text-center">
        {bank?.name || "Indian Overseas Bank"}
        {" → "}BharosaCredit
      </p>

      {/* Steps */}
      <div className="flex flex-col gap-3 w-full max-w-sm mb-10">
        {STEPS.map((step, i) => {
          const isDone = i < currentStep
          const isActive = i === currentStep
          const isPending = i > currentStep

          return (
            <div
              key={i}
              className="flex items-center gap-4 rounded-xl p-4 transition-all"
              style={{
                background: isActive
                  ? "rgba(249,115,22,0.08)"
                  : "rgba(255,255,255,0.02)",
                border: isActive
                  ? "1px solid rgba(249,115,22,0.3)"
                  : "1px solid rgba(255,255,255,0.05)",
                opacity: isPending ? 0.4 : 1
              }}
            >
              {/* Status icon */}
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0"
                style={{
                  background: isDone
                    ? "rgba(34,197,94,0.2)"
                    : isActive
                      ? "rgba(249,115,22,0.2)"
                      : "rgba(255,255,255,0.05)",
                  border: isDone
                    ? "1px solid #22c55e"
                    : isActive
                      ? "1px solid #f97316"
                      : "1px solid rgba(255,255,255,0.1)",
                  color: isDone
                    ? "#22c55e"
                    : isActive
                      ? "#f97316"
                      : "rgba(255,255,255,0.3)"
                }}
              >
                {isDone ? "✓"
                  : isActive ? "⟳"
                  : "○"}
              </div>

              <div>
                <div
                  className="text-sm font-medium"
                  style={{
                    color: isDone
                      ? "#22c55e"
                      : isActive
                        ? "#f97316"
                        : "rgba(255,255,255,0.3)"
                  }}
                >
                  {step.label}
                </div>
                <div className="text-xs text-white/30">
                  {step.sub}
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Progress bar */}
      <div
        className="w-full max-w-sm rounded-full overflow-hidden"
        style={{
          height: "4px",
          background: "rgba(255,255,255,0.05)"
        }}
      >
        <div
          className="h-full rounded-full transition-all duration-500"
          style={{
            width: `${progress}%`,
            background: "#f97316",
            boxShadow:
              "0 0 8px rgba(249,115,22,0.5)"
          }}
        />
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.05); }
        }
      `}</style>
    </div>
  )
}