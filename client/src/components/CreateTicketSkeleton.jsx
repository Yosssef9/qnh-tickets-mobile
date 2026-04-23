export default function CreateTicketSkeleton() {
  return (
    <div className="min-h-screen bg-slate-100 animate-pulse">
      {/* Header */}
      <div className="bg-[rgb(21,98,160)] px-4 pt-8 pb-16">
        <div className="h-6 w-32 rounded bg-white/30" />
        <div className="mt-4 h-8 w-48 rounded bg-white/40" />
      </div>

      {/* Card */}
      <div className="px-4 -mt-10">
        <div className="rounded-[28px] bg-white p-4 shadow space-y-4">
          {/* Title input */}
          <div className="space-y-2">
            <div className="h-4 w-24 rounded bg-slate-200" />
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>

          {/* Description */}
          <div className="space-y-2">
            <div className="h-4 w-32 rounded bg-slate-200" />
            <div className="h-24 rounded-2xl bg-slate-200" />
          </div>

          {/* Technician */}
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-12 rounded-2xl bg-slate-200" />
          </div>

          {/* Image */}
          <div className="space-y-2">
            <div className="h-4 w-28 rounded bg-slate-200" />
            <div className="h-14 rounded-2xl bg-slate-200" />
          </div>

          {/* Button */}
          <div className="h-14 rounded-2xl bg-slate-200" />
        </div>
      </div>
    </div>
  );
}
