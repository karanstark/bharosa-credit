import { useState } from 'react'

interface Bank {
  id: string
  name: string
  short: string
  color: string
}

interface Props {
  bank: Bank | null
  consent: any
  onAllow: () => void
  onDeny: () => void
}

const DATA_ITEMS = [
  {
    label: "Account Statement",
    desc: "Last 90 days of transactions",
    icon: "📊"
  },
  {
    label: "Transaction History",
    desc: "Credits, debits, UPI payments",
    icon: "💳"
  },
  {
    label: "Balance Information",
    desc: "Current and average balance",
    icon: "💰"
  },
]

export default function ConsentFlow(
  { bank, consent, onAllow, onDeny }: Props
) {
  const [loading, setLoading] =
    useState<boolean>(false)

  const handleAllow = async () => {
    setLoading(true)
    try {
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(), 3000
      )
      await fetch(
        "http://localhost:8000/aa/fetch",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            consent_id: consent?.consent_id
              || "mock-consent",
            profile: "good"
          }),
          signal: controller.signal
        }
      )
      clearTimeout(timeout)
    } catch {
      // Silent fail — always proceed
    }
    setTimeout(() => onAllow(), 800)
  }

  return (
    <div className="min-h-screen bg-[#020408] flex items-center justify-center p-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      <div
        className="rounded-3xl p-10 w-full max-w-md"
        style={{
          background: "rgba(255,255,255,0.03)",
          border: "1px solid rgba(255,255,255,0.08)",
          backdropFilter: "blur(20px)"
        }}
      >
        {/* Bank badge */}
        <div className="flex items-center gap-3 mb-6">
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold"
            style={{
              background: "rgba(249,115,22,0.1)",
              border:
                "1px solid rgba(249,115,22,0.3)",
              color: "#f97316"
            }}
          >
            {bank?.short || "IOB"}
          </div>
          <div>
            <div className="text-sm font-semibold text-white">
              {bank?.name ||
                "Indian Overseas Bank"}
            </div>
            <div className="text-xs text-white/30">
              Account Aggregator v3.0
            </div>
          </div>
        </div>

        <h2 className="text-2xl font-bold text-white mb-2"
          style={{ letterSpacing: "-0.02em" }}
        >
          Allow Data Access
        </h2>

        <p className="text-sm text-white/50 mb-7 leading-relaxed">
          BharosaCredit wants to access the
          following data to calculate your
          Bharosa Score
        </p>

        {/* Data items */}
        <div className="flex flex-col gap-3 mb-7">
          {DATA_ITEMS.map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-4 rounded-xl p-4"
              style={{
                background:
                  "rgba(34,197,94,0.05)",
                border:
                  "1px solid rgba(34,197,94,0.15)"
              }}
            >
              <span className="text-xl">
                {item.icon}
              </span>
              <div className="flex-1">
                <div className="text-sm font-medium text-white">
                  {item.label}
                </div>
                <div className="text-xs text-white/40">
                  {item.desc}
                </div>
              </div>
              <span className="text-green-400">
                ✓
              </span>
            </div>
          ))}
        </div>

        {/* Consent ID */}
        <div
          className="rounded-lg p-3 mb-6 text-xs text-white/25 font-mono"
          style={{
            background: "rgba(255,255,255,0.02)",
            border:
              "1px solid rgba(255,255,255,0.05)"
          }}
        >
          Consent ID:{" "}
          {consent?.consent_id
            ?.slice(0, 18) ||
            "mock-consent"}
          ...
          <br />
          Framework: RBI AA | APISETU v3.0
        </div>

        {/* Buttons */}
        <div className="flex gap-3">
          <button
            onClick={onDeny}
            className="flex-1 py-4 rounded-xl text-sm font-medium text-white/60 hover:text-white transition-all"
            style={{
              background: "transparent",
              border:
                "1px solid rgba(255,255,255,0.15)"
            }}
          >
            Deny
          </button>

          <button
            onClick={handleAllow}
            disabled={loading}
            className="flex-[2] py-4 rounded-xl text-sm font-semibold text-white transition-all"
            style={{
              background: loading
                ? "rgba(249,115,22,0.5)"
                : "#f97316",
              border: "none",
              boxShadow: loading
                ? "none"
                : "0 0 20px rgba(249,115,22,0.4)",
              cursor: loading
                ? "wait" : "pointer"
            }}
          >
            {loading
              ? "Connecting..."
              : "Allow Access →"}
          </button>
        </div>

        <p className="text-xs text-white/20 text-center mt-4">
          You can revoke this consent anytime.
          Data used only for credit scoring.
        </p>
      </div>
    </div>
  )
}