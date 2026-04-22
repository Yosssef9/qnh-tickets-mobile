import { motion } from "framer-motion";

function SkeletonBlock({ className = "" }) {
  return (
    <div className={`animate-pulse rounded-2xl bg-slate-200/80 ${className}`} />
  );
}

function SkeletonTicketCard() {
  return (
    <div className="w-full rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <SkeletonBlock className="h-6 w-28 rounded-xl" />
            <SkeletonBlock className="h-6 w-20 rounded-xl" />
          </div>

          <div className="mt-3 flex items-center justify-between gap-2">
            <SkeletonBlock className="h-4 w-40" />
            <SkeletonBlock className="h-6 w-14 rounded-lg" />
          </div>

          <div className="mt-2 space-y-2">
            <SkeletonBlock className="h-3 w-full" />
            <SkeletonBlock className="h-3 w-4/5" />
          </div>

          <div className="mt-4 space-y-2">
            <SkeletonBlock className="h-3 w-2/3" />
            <SkeletonBlock className="h-3 w-1/2" />
            <SkeletonBlock className="h-3 w-3/5" />
          </div>
        </div>

        <SkeletonBlock className="h-10 w-10 shrink-0 rounded-2xl" />
      </div>
    </div>
  );
}

export default function TicketsPageSkeleton({
  title = "Tickets",
  subtitle = "Loading tickets overview...",
  activeLabel = "Active Tickets",
  allLabel = "All Tickets",
}) {
  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative overflow-hidden bg-[rgb(21,98,160)] pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_28%)]" />
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 px-4 pt-8">
          <div className="flex items-center justify-between gap-3 text-white">
            <SkeletonBlock className="h-10 w-24 rounded-2xl bg-white/20" />

            <div className="text-right">
              <SkeletonBlock className="ml-auto h-3 w-24 rounded bg-white/20" />
              <SkeletonBlock className="mt-2 ml-auto h-7 w-32 rounded bg-white/20" />
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-white/75">{title}</p>
                    <h2 className="mt-1 text-lg font-bold">{subtitle}</h2>
                    <p className="mt-1 text-sm text-white/80">
                      Please wait while we load the latest data.
                    </p>
                  </div>

                  <div className="h-12 w-12 rounded-2xl bg-white/15" />
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">{activeLabel}</p>
                    <SkeletonBlock className="mt-2 h-8 w-16 rounded bg-white/20" />
                  </div>

                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">{allLabel}</p>
                    <SkeletonBlock className="mt-2 h-8 w-16 rounded bg-white/20" />
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="rounded-[24px] bg-slate-100 p-1">
                  <div className="grid grid-cols-2 gap-1">
                    <SkeletonBlock className="h-12 rounded-[20px]" />
                    <SkeletonBlock className="h-12 rounded-[20px]" />
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3">
                  <SkeletonBlock className="h-5 w-full rounded-xl" />
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0.7 }}
                animate={{ opacity: 1 }}
                transition={{
                  duration: 0.8,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
                className="mt-6 space-y-3"
              >
                {Array.from({ length: 5 }).map((_, index) => (
                  <SkeletonTicketCard key={index} />
                ))}
              </motion.div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <SkeletonBlock className="mx-auto h-4 w-52 rounded-xl" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
