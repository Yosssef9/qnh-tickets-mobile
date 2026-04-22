import { useEffect, useState } from "react";
import {
  ClipboardList,
  PlusCircle,
  Tickets,
  UserRound,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getAllTickets, getMyTickets } from "../services/ticketsApi";
import { useAuth } from "../context/AuthContext";
import Loader from "../components/Loader";

export default function HomePage() {
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const [myTicketsCount, setMyTicketsCount] = useState(0);
  const [allTicketsCount, setAllTicketsCount] = useState(0);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    let isMounted = true;

    const loadCounts = async () => {
      try {
        setLoading(true);

        let myCount = 0;
        let allCount = 0;

        try {
          const myTicketsRes = await getMyTickets();
          const myTickets = myTicketsRes?.data?.tickets || [];
          myCount = Array.isArray(myTickets) ? myTickets.length : 0;
        } catch (error) {
          console.error("Failed to load my tickets:", error);
        }

        try {
          const allTicketsRes = await getAllTickets();
          const allTickets = allTicketsRes?.data?.tickets || [];

          const filteredTickets = Array.isArray(allTickets)
            ? allTickets.filter(
                (t) => t.status !== "Closed" && t.status !== "Cancelled",
              )
            : [];

          allCount = filteredTickets.length;
        } catch (error) {
          console.error("Failed to load all tickets:", error);
        }

        if (isMounted) {
          setMyTicketsCount(myCount);
          setAllTicketsCount(allCount);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCounts();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  if (loading) {
    return <Loader />;
  }

  const displayName = user?.userName || user?.name || user?.userCode || "User";

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Single unified page background */}
      <div className="relative overflow-hidden bg-[rgb(21,98,160)] pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_28%)]" />
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />
        <div className="absolute bottom-16 left-1/3 h-24 w-24 rounded-full bg-white/10 blur-2xl" />

        <div className="relative z-10 px-4 pt-8">
          {/* Top bar */}
          <div className="flex items-start justify-between gap-3 text-white">
            <div className="min-w-0">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/75">
                QNH Portal
              </p>
              <h1 className="mt-2 truncate text-2xl font-extrabold">
                {displayName}
              </h1>
              <p className="mt-1 text-sm text-white/80">
                Ticket Portal Mobile Dashboard
              </p>
            </div>

            <button
              onClick={handleLogout}
              className="flex shrink-0 items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <LogOut size={16} />
              <span>Logout</span>
            </button>
          </div>

          {/* Unified main dashboard card */}
          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              {/* Intro section */}
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/75">Quick Access</p>
                    <h2 className="mt-1 text-lg font-bold">
                      Manage your tickets easily
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Create, review, and track tickets from your mobile.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <ClipboardList size={22} />
                  </div>
                </div>

                {/* Stats inside intro */}
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-white/80">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                        <UserRound size={17} />
                      </div>
                      <span className="text-sm font-medium">My Tickets</span>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold">
                      {myTicketsCount}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Tickets created by you
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <div className="flex items-center gap-2 text-white/80">
                      <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15">
                        <Tickets size={17} />
                      </div>
                      <span className="text-sm font-medium">
                        All Active Tickets
                      </span>
                    </div>
                    <p className="mt-3 text-3xl font-extrabold">
                      {allTicketsCount}
                    </p>
                    <p className="mt-1 text-xs text-white/70">
                      Available in the system
                    </p>
                  </div>
                </div>
              </div>

              {/* Quick actions header */}
              <div className="mt-6 mb-4 flex items-end justify-between gap-3 px-1">
                <div>
                  <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[rgb(21,98,160)]/70">
                    Dashboard
                  </p>
                  <h2 className="mt-1 text-xl font-normal text-slate-800">
                    Quick Actions
                  </h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Choose what you want to do
                  </p>
                </div>

                <div className="rounded-2xl bg-[rgb(21,98,160)]/8 px-3 py-2 text-xs font-medium text-[rgb(21,98,160)]">
                  3 Actions
                </div>
              </div>

              {/* Featured action */}
              <button
                onClick={() => navigate("/tickets/create")}
                className="group relative mb-4 w-full overflow-hidden rounded-[28px] bg-[rgb(21,98,160)] p-5 text-left text-white shadow-[0_18px_40px_rgba(21,98,160,0.22)] transition duration-200 hover:-translate-y-[1px]"
              >
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.22),transparent_30%)]" />
                <div className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-white/10 blur-2xl" />
                <div className="absolute bottom-0 left-1/3 h-16 w-16 rounded-full bg-white/10 blur-2xl" />

                <div className="relative z-10">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-white/15 backdrop-blur-sm shrink-0">
                      <PlusCircle size={30} />
                    </div>

                    <div className="rounded-2xl bg-white/15 px-3 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white/80">
                      Primary Action
                    </div>
                  </div>

                  {/* Text */}
                  <div className="mt-4">
                    <h3 className="text-xl font-bold leading-tight">
                      Create Ticket
                    </h3>
                    <p className="mt-2 text-sm leading-6 text-white/85">
                      Submit a new issue quickly and easily
                    </p>
                  </div>

                  {/* Bottom row */}
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm font-medium text-white/85">
                      Open ticket form
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/15 text-white transition group-hover:bg-white/20 shrink-0">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </button>

              {/* Secondary actions */}
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => navigate("/tickets/my")}
                  className="group min-h-[190px] rounded-[26px] border border-slate-200 bg-gradient-to-br from-white to-amber-50 p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-[1px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-600">
                    <UserRound size={24} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-600">
                    Show My Tickets
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    See the tickets you created
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-amber-600">
                    <span>Open</span>
                    <ChevronRight size={14} />
                  </div>
                </button>

                <button
                  onClick={() => navigate("/tickets/all")}
                  className="group min-h-[190px] rounded-[26px] border border-slate-200 bg-gradient-to-br from-white to-emerald-50 p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition duration-200 hover:-translate-y-[1px]"
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/10 text-emerald-600">
                    <Tickets size={24} />
                  </div>

                  <h3 className="mt-4 text-sm font-bold text-slate-600">
                    Show All Tickets
                  </h3>
                  <p className="mt-1 text-xs leading-5 text-slate-500">
                    Browse all tickets in the system
                  </p>

                  <div className="mt-4 flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <span>Open</span>
                    <ChevronRight size={14} />
                  </div>
                </button>
              </div>

              {/* Footer note */}
              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-medium tracking-wide text-slate-500">
                  Fast mobile access to your hospital ticket portal
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
