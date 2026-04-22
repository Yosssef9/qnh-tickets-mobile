import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ChevronRight,
  CircleAlert,
  Search,
  Ticket,
  ArrowUp,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import Loader from "../components/Loader";
import { getAllTickets } from "../services/ticketsApi";
import useScrollToTopButton from "../hooks/useScrollToTopButton";
import ScrollToTopButton from "../components/ScrollToTopButton";
const PAGE_SIZE = 20;
const DUMMY_TICKETS = [
  {
    id: 1,
    ticket_number: "TKT202600001",
    title: "Printer not working",
    description: "The printer in office 3 is not responding.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Ahmed Ali",
    ticket_type_description: "Incident",
    created_at: "2026-04-20 10:30:00",
  },
  {
    id: 2,
    ticket_number: "TKT202600002",
    title: "Network slow",
    description: "Internet is very slow in the lab.",
    category: "IT Support",
    status: "In Progress",
    created_by_name: "Sara Mohamed",
    ticket_type_description: "Incident",
    created_at: "2026-04-20 11:00:00",
  },
  {
    id: 3,
    ticket_number: "TKT202600003",
    title: "System installation",
    description: "Need Windows installation.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Yasser Hamza",
    ticket_type_description: "Service Request",
    created_at: "2026-04-21 09:00:00",
  },
  {
    id: 4,
    ticket_number: "TKT202600004",
    title: "Email issue",
    description: "Cannot send emails.",
    category: "IT Support",
    status: "Closed",
    created_by_name: "Mona Hassan",
    ticket_type_description: "Incident",
    created_at: "2026-04-21 12:00:00",
  },
  {
    id: 5,
    ticket_number: "TKT202600005",
    title: "Request software",
    description: "Need new software installed.",
    category: "IT Support",
    status: "Cancelled",
    created_by_name: "Omar Khaled",
    ticket_type_description: "Request",
    created_at: "2026-04-21 14:00:00",
  },
  {
    id: 6,
    ticket_number: "TKT202600006",
    title: "Laptop setup for new employee",
    description: "Prepare a laptop with email and system access.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Nour Salah",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 08:10:00",
  },
  {
    id: 7,
    ticket_number: "TKT202600007",
    title: "Wi-Fi access issue",
    description: "Cannot connect to hospital Wi-Fi on mobile device.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Heba Tarek",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 09:25:00",
  },
  {
    id: 8,
    ticket_number: "TKT202600008",
    title: "Outlook configuration",
    description: "Need to configure Outlook on a new PC.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Fatma Adel",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 10:15:00",
  },
  {
    id: 9,
    ticket_number: "TKT202600009",
    title: "Keyboard replacement",
    description: "Keyboard keys are not working properly.",
    category: "IT Support",
    status: "In Progress",
    created_by_name: "Ali Salem",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 10:50:00",
  },
  {
    id: 10,
    ticket_number: "TKT202600010",
    title: "Meeting room projector issue",
    description: "Projector in meeting room does not display HDMI input.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Reem Hassan",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 11:20:00",
  },
  {
    id: 11,
    ticket_number: "TKT202600011",
    title: "Password reset request",
    description: "Unable to log in after password expiration.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Tariq Nabil",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 11:40:00",
  },
  {
    id: 12,
    ticket_number: "TKT202600012",
    title: "Printer toner replacement",
    description: "Printer toner is low in administration office.",
    category: "IT Support",
    status: "Closed",
    created_by_name: "Amani Samir",
    ticket_type_description: "Request",
    created_at: "2026-04-22 12:00:00",
  },
  {
    id: 13,
    ticket_number: "TKT202600013",
    title: "Shared folder access",
    description: "Need access to the department shared folder.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Khaled Amin",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 12:15:00",
  },
  {
    id: 14,
    ticket_number: "TKT202600014",
    title: "Slow PC performance",
    description: "The computer takes too long to start and open apps.",
    category: "IT Support",
    status: "In Progress",
    created_by_name: "Laila Mostafa",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 12:35:00",
  },
  {
    id: 15,
    ticket_number: "TKT202600015",
    title: "Scanner installation",
    description: "Need scanner setup on reception desktop.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Mohamed Essam",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 13:00:00",
  },
  {
    id: 16,
    ticket_number: "TKT202600016",
    title: "VPN connection issue",
    description: "Cannot connect to VPN from home.",
    category: "IT Support",
    status: "Cancelled",
    created_by_name: "Rania Youssef",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 13:25:00",
  },
  {
    id: 17,
    ticket_number: "TKT202600017",
    title: "Software activation",
    description: "Need activation for licensed software.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Hassan Zaki",
    ticket_type_description: "Request",
    created_at: "2026-04-22 13:50:00",
  },
  {
    id: 18,
    ticket_number: "TKT202600018",
    title: "New employee account",
    description: "Create account for newly joined staff member.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Mariam Fathy",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 14:05:00",
  },
  {
    id: 19,
    ticket_number: "TKT202600019",
    title: "Desktop relocation",
    description: "Move desktop from office A to office B.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Basel Saeed",
    ticket_type_description: "Request",
    created_at: "2026-04-22 14:30:00",
  },
  {
    id: 20,
    ticket_number: "TKT202600020",
    title: "Hospital app login issue",
    description: "Cannot login to mobile hospital application.",
    category: "IT Support",
    status: "In Progress",
    created_by_name: "Noha Ibrahim",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 14:45:00",
  },
  {
    id: 21,
    ticket_number: "TKT202600021",
    title: "Monitor flickering",
    description: "Monitor screen flickers intermittently.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Sameh Adel",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 15:00:00",
  },
  {
    id: 22,
    ticket_number: "TKT202600022",
    title: "Shared printer mapping",
    description: "Need shared printer added to workstation.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Nadia Sherif",
    ticket_type_description: "Service Request",
    created_at: "2026-04-22 15:20:00",
  },
  {
    id: 23,
    ticket_number: "TKT202600023",
    title: "Laptop battery issue",
    description: "Battery drains too quickly and requires replacement.",
    category: "IT Support",
    status: "Closed",
    created_by_name: "Wael Hamed",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 15:35:00",
  },
  {
    id: 24,
    ticket_number: "TKT202600024",
    title: "Antivirus warning",
    description: "Antivirus detected suspicious file and needs review.",
    category: "IT Support",
    status: "Open",
    created_by_name: "Dina Mostafa",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 15:50:00",
  },
  {
    id: 25,
    ticket_number: "TKT202600025",
    title: "Account lockout",
    description: "User account locked after multiple attempts.",
    category: "IT Support",
    status: "Assigned",
    created_by_name: "Mahmoud Adel",
    ticket_type_description: "Incident",
    created_at: "2026-04-22 16:05:00",
  },
];

export default function AllTicketsPage() {
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
    // const loadTickets = async () => {
    //   setLoading(true);

    //   setTimeout(() => {
    //     setTickets(DUMMY_TICKETS);
    //     setLoading(false);
    //   }, 800);
    // };
    const loadTickets = async () => {
      try {
        setLoading(true);

        const res = await getAllTickets();

        const items = res?.data?.tickets || [];

        setTickets(Array.isArray(items) ? items : []);
      } catch (error) {
        console.error("Failed to load tickets:", error);
        setTickets([]);
      } finally {
        setLoading(false);
      }
    };

    loadTickets();
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
              <h1 className="mt-2 text-2xl font-extrabold">All Tickets</h1>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/75">Tickets Overview</p>
                    <h2 className="mt-1 text-lg font-bold">
                      Browse and review tickets
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Active tickets are shown by default. You can switch to all
                      tickets anytime.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <Ticket size={22} />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-3">
                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">Active Tickets</p>
                    <p className="mt-2 text-3xl font-extrabold">
                      {activeTickets.length}
                    </p>
                  </div>

                  <div className="rounded-[22px] border border-white/15 bg-white/10 p-4 backdrop-blur-md">
                    <p className="text-sm text-white/80">All Tickets</p>
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
                    onClick={() => {
                      setViewMode("active");
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      viewMode === "active"
                        ? "bg-white text-[rgb(21,98,160)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    Active Tickets
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setViewMode("all");
                      setVisibleCount(PAGE_SIZE);
                    }}
                    className={`rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                      viewMode === "all"
                        ? "bg-white text-[rgb(21,98,160)] shadow-sm"
                        : "text-slate-500"
                    }`}
                  >
                    All Tickets
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
                    placeholder="Search ticket number, title, requester..."
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
                                    Requester:
                                  </span>{" "}
                                  {ticket.created_by_name || "-"}
                                </p>
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
                  {viewMode === "active" ? "Active Tickets" : "All Tickets"}
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
