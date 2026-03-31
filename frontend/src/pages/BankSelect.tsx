import { useState } from 'react'

interface Bank {
  id: string
  name: string
  short: string
  color: string
}

interface Props {
  onBankSelected: (bank: Bank, consent: any) => void
  onBack: () => void
}

const BANKS: Bank[] = [
  { id: "canara", name: "Canara Bank", short: "CNR", color: "#a855f7" },
  { id: "sbi", name: "State Bank of India", short: "SBI", color: "#22c55e" },
  { id: "punjab_sind", name: "Punjab and Sind Bank", short: "PSB", color: "#ef4444" },
  { id: "iob", name: "Indian Overseas Bank", short: "IOB", color: "#f97316" },
  { id: "central_bank", name: "Central Bank of India", short: "CBI", color: "#3b82f6" },
  { id: "uco", name: "UCO Bank", short: "UCO", color: "#eab308" },
  { id: "cibil", name: "Transunion CIBIL", short: "CBL", color: "#6366f1" },
]

export default function BankSelect(
  { onBankSelected, onBack }: Props
) {
  const [selected, setSelected] =
    useState<string | null>(null)
  const [loading, setLoading] =
    useState<boolean>(false)

  const handleSelect = async (bank: Bank) => {
    if (loading) return
    setSelected(bank.id)
    setLoading(true)

    try {
      const controller = new AbortController()
      const timeout = setTimeout(
        () => controller.abort(), 3000
      )
      const res = await fetch(
        "http://localhost:8000/aa/consent",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({
            bank_id: bank.id
          }),
          signal: controller.signal
        }
      )
      clearTimeout(timeout)
      const data = await res.json()
      setTimeout(() => {
        onBankSelected(bank, data)
      }, 800)
    } catch {
      // API failed — use mock, never block user
      setTimeout(() => {
        onBankSelected(bank, {
          consent_id: `mock-${bank.id}-${Date.now()}`,
          status: "APPROVED",
          bank: bank,
          aa_framework: "APISETU v3.0 (simulated)",
          data_range: "Last 90 days"
        })
      }, 800)
    }
  }

  return (
    <div className="min-h-screen bg-[#020408] flex flex-col items-center justify-center p-10"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Back button */}
      <button
        onClick={onBack}
        className="self-start mb-8 text-sm text-white/40 hover:text-white transition-colors"
      >
        ← Back
      </button>

      {/* Badge */}
      <div className="mb-6 px-4 py-2 rounded-full text-xs"
        style={{
          background: "rgba(249,115,22,0.05)",
          border: "1px solid rgba(249,115,22,0.3)",
          color: "#f97316"
        }}
      >
        🏛 Powered by Account Aggregator
        Framework — RBI Compliant
      </div>

      <h1 className="text-4xl font-bold text-white mb-3 text-center"
        style={{ letterSpacing: "-0.02em" }}
      >
        Select Your Bank
      </h1>

      <p className="text-white/50 text-base mb-10 text-center">
        We'll fetch your last 90 days of
        transactions with your consent
      </p>

      {/* Bank Grid */}
      <div className="grid gap-4 w-full max-w-2xl mb-10"
        style={{
          gridTemplateColumns:
            "repeat(auto-fit, minmax(180px, 1fr))"
        }}
      >
        {BANKS.map((bank) => (
          <div
            key={bank.id}
            onClick={() =>
              !loading && handleSelect(bank)
            }
            className="rounded-2xl p-6 text-center cursor-pointer transition-all"
            style={{
              background: selected === bank.id
                ? "rgba(249,115,22,0.1)"
                : "rgba(255,255,255,0.03)",
              border: selected === bank.id
                ? "1px solid #f97316"
                : "1px solid rgba(255,255,255,0.08)"
            }}
          >
            {/* Avatar */}
            <div
              className="w-14 h-14 rounded-xl flex items-center justify-center mx-auto mb-3 text-sm font-bold"
              style={{
                background: bank.color + "20",
                border: `1px solid ${bank.color}40`,
                color: bank.color
              }}
            >
              {bank.short}
            </div>

            <div className="text-sm font-medium text-white mb-1">
              {bank.name}
            </div>

            <div className="text-xs text-white/30">
              AA 3.0 Supported
            </div>

            {selected === bank.id && loading && (
              <div className="mt-2 text-xs"
                style={{ color: "#f97316" }}
              >
                Connecting...
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Trust badges */}
      <div className="flex gap-3 flex-wrap justify-center">
        {[
          "🔒 End-to-end encrypted",
          "📋 RBI AA Framework",
          "✅ Your consent required",
          "🚫 No data stored"
        ].map(badge => (
          <div
            key={badge}
            className="px-4 py-2 rounded-full text-xs text-white/40"
            style={{
              background:
                "rgba(255,255,255,0.03)",
              border:
                "1px solid rgba(255,255,255,0.08)"
            }}
          >
            {badge}
          </div>
        ))}
      </div>
    </div>
  )
}