import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  CircleAlert,
  Search,
  Ticket,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { getMyTickets } from "../services/ticketsApi";
import Loader from "../components/Loader";
import useScrollToTopButton from "../hooks/useScrollToTopButton";
import ScrollToTopButton from "../components/ScrollToTopButton";
const PAGE_SIZE = 20;

export default function MyTicketsPage() {
  const navigate = useNavigate();
  const { showScrollTop, scrollToTop } = useScrollToTopButton();

  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState("active");
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setDebouncedSearch(search);
    }, 180);

    return () => clearTimeout(timeout);
  }, [search]);

  useEffect(() => {
    let isMounted = true;

    const loadTickets = async () => {
      try {
        setLoading(true);
        const res = await getMyTickets();
        const items = res?.data?.tickets || [];

        if (isMounted) {
          setTickets(Array.isArray(items) ? items : []);
        }
      } catch (error) {
        console.error("Failed to load my tickets:", error);
        if (isMounted) {
          setTickets([]);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadTickets();

    return () => {
      isMounted = false;
    };
  }, []);

  const activeTickets = useMemo(() => {
    return tickets.filter(
      (t) => t.status !== "Closed" && t.status !== "Cancelled",
    );
  }, [tickets]);

  const filteredTickets = useMemo(() => {
    const source = viewMode === "active" ? activeTickets : tickets;
    const q = debouncedSearch.trim().toLowerCase();

    if (!q) return source;

    return source.filter((t) => {
      return (
        String(t.ticket_number || "")
          .toLowerCase()
          .includes(q) ||
        String(t.title || "")
          .toLowerCase()
          .includes(q) ||
        String(t.description || "")
          .toLowerCase()
          .includes(q) ||
        String(t.created_by_name || "")
          .toLowerCase()
          .includes(q) ||
        String(t.category || "")
          .toLowerCase()
          .includes(q) ||
        String(t.status || "")
          .toLowerCase()
          .includes(q) ||
        String(t.ticket_type_description || "")
          .toLowerCase()
          .includes(q)
      );
    });
  }, [tickets, activeTickets, viewMode, debouncedSearch]);

  const visibleTickets = useMemo(() => {
    return filteredTickets.slice(0, visibleCount);
  }, [filteredTickets, visibleCount]);

  const hasMore = visibleCount < filteredTickets.length;

  const handleLoadMore = () => {
    setVisibleCount((prev) => prev + PAGE_SIZE);
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <div className="min-h-screen bg-slate-100">
      <div className="relative overflow-hidden bg-[rgb(21,98,160)] pb-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_28%)]" />
        <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute right-0 top-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10 px-4 pt-8">
          <div className="flex items-center justify-between gap-3 text-white">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
            >
              <ArrowLeft size={16} />
              <span>Back</span>
            </button>

            <div className="text-right">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/75">
                QNH Portal
              </p>
              <h1 className="mt-2 text-2xl font-extrabold">My Tickets</h1>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/75">My Tickets Overview</p>
                    <h2 className="mt-1 text-lg font-bold">
                      Browse your submitted tickets
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Active tickets are shown by default. You can switch to all
                      your tickets anytime.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Ticket size={22} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">Active My Tickets</p>
                    <p className="mt-2 text-3xl font-extrabold">
                      {activeTickets.length}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">All My Tickets</p>
                    <p className="mt-2 text-3xl font-extrabold">
                      {tickets.length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-6 space-y-4">
                <div className="grid grid-cols-2 gap-3 rounded-[24px] bg-slate-100 p-1.5">
                  <button
                    type="button"
                    onClick={() => setViewMode("active")}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      viewMode === "active"
                        ? "bg-white text-[rgb(21,98,160)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Active My Tickets
                  </button>

                  <button
                    type="button"
                    onClick={() => setViewMode("all")}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      viewMode === "all"
                        ? "bg-white text-[rgb(21,98,160)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    All My Tickets
                  </button>
                </div>

                <div className="flex items-center gap-3 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 transition-all duration-200 focus-within:border-[rgb(21,98,160)] focus-within:bg-white focus-within:ring-4 focus-within:ring-[rgb(21,98,160)]/10">
                  <Search size={18} className="text-slate-400" />
                  <input
                    value={search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setVisibleCount(PAGE_SIZE);
                    }}
                    placeholder="Search ticket number, title, description..."
                    className="w-full bg-transparent text-sm text-slate-800 outline-none placeholder:text-slate-400"
                  />
                </div>
              </div>

              <div className="mt-6 min-h-[420px]">
                <AnimatePresence mode="wait">
                  {filteredTickets.length === 0 ? (
                    <motion.div
                      key="empty-state"
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.2 }}
                      className="rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-8 text-center"
                    >
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)]">
                        <CircleAlert size={22} />
                      </div>
                      <p className="mt-3 text-sm font-semibold text-slate-700">
                        No tickets found
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        Try another filter or search text
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div
                      key={viewMode + debouncedSearch + visibleCount}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.18 }}
                      className="space-y-3"
                    >
                      {visibleTickets.map((ticket, index) => (
                        <motion.button
                          key={ticket.id || ticket.ticket_id}
                          type="button"
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(index, 5) * 0.03,
                          }}
                          className="w-full rounded-[24px] border border-slate-200 bg-white p-4 text-left shadow-[0_10px_24px_rgba(15,23,42,0.05)] transition hover:-translate-y-[1px]"
                        >
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center gap-2">
                                <span className="rounded-xl bg-[rgb(21,98,160)]/10 px-2.5 py-1 text-xs font-semibold text-[rgb(21,98,160)]">
                                  {ticket.ticket_number}
                                </span>

                                <span
                                  className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${
                                    ticket.status === "Open"
                                      ? "bg-amber-100 text-amber-700"
                                      : ticket.status === "Assigned"
                                        ? "bg-sky-100 text-sky-700"
                                        : ticket.status === "In Progress"
                                          ? "bg-blue-100 text-blue-700"
                                          : ticket.status === "Closed"
                                            ? "bg-emerald-100 text-emerald-700"
                                            : ticket.status === "Cancelled"
                                              ? "bg-rose-100 text-rose-700"
                                              : "bg-slate-100 text-slate-700"
                                  }`}
                                >
                                  {ticket.status}
                                </span>
                              </div>

                              <h3 className="mt-3 line-clamp-1 text-sm font-bold text-slate-800">
                                {ticket.title || "Untitled Ticket"}
                              </h3>

                              <p className="mt-1 line-clamp-2 text-xs leading-5 text-slate-500">
                                {ticket.description || "-"}
                              </p>

                              <div className="mt-3 space-y-1 text-xs text-slate-500">
                                <p>
                                  <span className="font-semibold text-slate-700">
                                    Type:
                                  </span>{" "}
                                  {ticket.ticket_type_description || "-"}
                                </p>
                                <p>
                                  <span className="font-semibold text-slate-700">
                                    Created:
                                  </span>{" "}
                                  {ticket.created_at || "-"}
                                </p>
                                <p>
                                  <span className="font-semibold text-slate-700">
                                    Category:
                                  </span>{" "}
                                  {ticket.category || "-"}
                                </p>
                              </div>
                            </div>

                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-400">
                              <ChevronRight size={18} />
                            </div>
                          </div>
                        </motion.button>
                      ))}

                      {hasMore && (
                        <motion.button
                          type="button"
                          onClick={handleLoadMore}
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.2 }}
                          className="mt-2 w-full rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-[rgb(21,98,160)] transition hover:bg-slate-100"
                        >
                          Load More
                        </motion.button>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <div className="mt-5 rounded-[24px] border border-slate-200 bg-slate-50 px-4 py-3 text-center">
                <p className="text-xs font-medium tracking-wide text-slate-500">
                  Showing {visibleTickets.length} of {filteredTickets.length}{" "}
                  ticket
                  {filteredTickets.length !== 1 ? "s" : ""} in{" "}
                  {viewMode === "active"
                    ? "Active My Tickets"
                    : "All My Tickets"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
