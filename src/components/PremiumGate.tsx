import { useState } from "react";
import { Card } from "@/components/ui";
import { confetti, toast } from "@/components/effects";
import { formatExpiry, premiumActive, type PremiumLicense } from "@/lib/billing";
import { hexToRgba } from "@/lib/accents";
import { cn } from "@/utils/cn";

export default function PremiumGate({
  accent,
  premium,
  onUnlock,
  onReset,
  validate,
}: {
  accent: string;
  premium: PremiumLicense | null;
  onUnlock: (buyerId: string, code: string) => boolean;
  onReset: () => void;
  validate: (buyerId: string, code: string) => PremiumLicense | null;
}) {
  const [buyerId, setBuyerId] = useState("");
  const [code, setCode] = useState("");
  const [shake, setShake] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  const tryUnlock = () => {
    const valid = validate(buyerId, code);
    if (!valid) {
      setShake(true);
      setTimeout(() => setShake(false), 500);
      toast("Invalid ID or access code", "🚫");
      return;
    }
    onUnlock(buyerId, code);
    confetti(180, [accent, "#ffffff", "#ffc247"]);
    toast(valid.tier === "lifetime" ? "Lifetime premium unlocked" : "Monthly premium unlocked", "🔓");
  };

  return (
    <div className="h-full w-full overflow-y-auto app-scroll no-scrollbar px-4 pb-10 pt-2">
      <div className="mx-auto w-full max-w-[560px]">
        <header className="px-1 pt-4">
          <div
            className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold"
            style={{ borderColor: hexToRgba(accent, 0.45), background: hexToRgba(accent, 0.12), color: accent }}
          >
            <span className="text-sm">💎</span>
            Premium access required
          </div>
          <h1 className="mt-4 text-[30px] font-bold leading-tight">Premium Habit Tracker</h1>
          <p className="mt-2 text-sm leading-relaxed" style={{ color: "var(--muted)" }}>
            Enter the <b>ID</b> and <b>PASS</b> you received after your purchase to unlock the app.
          </p>
        </header>

        <Card className={cn("mt-5 !py-4", shake && "wiggle")} style={{ borderColor: hexToRgba(accent, 0.32) }}>
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
                Unlock premium
              </p>
              <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
                Type your <b>ID</b> and <b>PASS</b> below.
              </p>
            </div>
            <span className="text-2xl">🔓</span>
          </div>
          <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
            <input
              value={buyerId}
              onChange={(e) => setBuyerId(e.target.value)}
              placeholder="Member ID"
              className="h-12 rounded-2xl border px-4 text-[15px] outline-none"
              style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
            />
            <input
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Access PASS"
              className="h-12 rounded-2xl border px-4 text-[15px] outline-none"
              style={{ background: "var(--surface-2)", borderColor: "var(--line)", color: "var(--text)" }}
            />
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              onClick={tryUnlock}
              className="press rounded-full px-5 py-3 text-sm font-semibold text-white"
              style={{ background: accent }}
            >
              Unlock premium
            </button>
            <button
              onClick={() => setShowHelp((s) => !s)}
              className="press rounded-full border px-5 py-3 text-sm font-semibold"
              style={{ borderColor: "var(--line)" }}
            >
              {showHelp ? "Hide format" : "See code format"}
            </button>
          </div>
          {showHelp && (
            <p className="mt-3 text-xs leading-relaxed" style={{ color: "var(--muted)" }}>
              Use the ID and PASS exactly as you received them. PASS looks like{" "}
              <span style={{ color: "var(--text)" }}>MHP-L-LIFE-XXXXXXXXXXXX</span> or{" "}
              <span style={{ color: "var(--text)" }}>MHP-M-YYYYMMDD-XXXXXXXXXXXX</span>.
            </p>
          )}
        </Card>

        {premium && (
          <Card className="mt-4 !py-4">
            <p className="text-[11px] font-bold uppercase tracking-[0.16em]" style={{ color: accent }}>
              Current status
            </p>
            <p className="mt-2 text-sm font-semibold">
              {premiumActive(premium) ? "Premium active" : "Premium expired"}
            </p>
            <p className="mt-1 text-sm" style={{ color: "var(--muted)" }}>
              {formatExpiry(premium)} · {premium.tier === "lifetime" ? "Lifetime" : "Monthly"}
            </p>
            <button
              onClick={onReset}
              className="press mt-3 rounded-full border px-4 py-2 text-xs font-semibold"
              style={{ borderColor: "var(--line)" }}
            >
              Reset saved license
            </button>
          </Card>
        )}
      </div>
    </div>
  );
}
