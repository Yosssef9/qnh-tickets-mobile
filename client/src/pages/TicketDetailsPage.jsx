import { useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  CalendarDays,
  CircleAlert,
  Download,
  FileText,
  Image as ImageIcon,
  Paperclip,
  Ticket,
  UserRound,
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import Loader from "../components/Loader";
import useScrollToTopButton from "../hooks/useScrollToTopButton";
import ScrollToTopButton from "../components/ScrollToTopButton";

import {
  getTicketById,
  getTicketAttachmentDownloadUrl,
} from "../services/ticketsApi";
import TicketsPageSkeleton from "../components/TicketsPageSkeleton";

function isImageFile(fileName = "") {
  return /\.(jpg|jpeg|png|gif|webp)$/i.test(fileName);
}

function getStatusClasses(status) {
  switch (status) {
    case "Open":
      return "bg-amber-100 text-amber-700";
    case "Assigned":
      return "bg-sky-100 text-sky-700";
    case "In Progress":
      return "bg-blue-100 text-blue-700";
    case "Closed":
      return "bg-emerald-100 text-emerald-700";
    case "Cancelled":
      return "bg-rose-100 text-rose-700";
    default:
      return "bg-slate-100 text-slate-700";
  }
}
function getPriorityClasses(priority) {
  switch (String(priority || "").toLowerCase()) {
    case "critical":
      return "bg-rose-100 text-rose-700 ring-1 ring-rose-200";
    case "high":
      return "bg-orange-100 text-orange-700 ring-1 ring-orange-200";
    case "medium":
      return "bg-amber-100 text-amber-700 ring-1 ring-amber-200";
    case "low":
      return "bg-emerald-100 text-emerald-700 ring-1 ring-emerald-200";
    default:
      return "bg-slate-100 text-slate-700 ring-1 ring-slate-200";
  }
}
export default function TicketDetailsPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showScrollTop, scrollToTop } = useScrollToTopButton();

  const [ticket, setTicket] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTicket = async () => {
      try {
        setLoading(true);
        const res = await getTicketById(id);
        setTicket(res?.ticket || null);
      } catch (error) {
        console.error("Failed to load ticket:", error);
        setTicket(null);
      } finally {
        setLoading(false);
      }
    };

    loadTicket();
  }, [id]);

  const imageAttachments = useMemo(() => {
    return (ticket?.attachments || []).filter((att) =>
      isImageFile(att.file_name),
    );
  }, [ticket]);

  const fileAttachments = useMemo(() => {
    return (ticket?.attachments || []).filter(
      (att) => !isImageFile(att.file_name),
    );
  }, [ticket]);

  if (loading) {
    return (
      <TicketsPageSkeleton
        title="Ticket Details"
        subtitle="Loading ticket details..."
        activeLabel="Images"
        allLabel="Attachments"
      />
    );
  }

  if (!ticket) {
    return (
      <div className="min-h-screen bg-slate-100">
        <div className="relative overflow-hidden bg-[rgb(21,98,160)] pb-16">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(255,255,255,0.20),transparent_28%)]" />
          <div className="absolute -left-10 top-8 h-32 w-32 rounded-full bg-white/10 blur-3xl" />
          <div className="absolute right-0 top-20 h-36 w-36 rounded-full bg-cyan-300/10 blur-3xl" />

          <div className="relative z-10 px-4 pt-8">
            <div className="flex items-center justify-between gap-3 text-white">
              <button
                onClick={() => navigate("/")}
                className="flex items-center gap-2 rounded-2xl border border-white/20 bg-white/10 px-3 py-2 text-sm font-medium text-white backdrop-blur-md transition hover:bg-white/20"
              >
                <ArrowLeft size={16} />
                <span>Back</span>
              </button>

              <div className="text-right">
                <p className="text-xs font-medium uppercase tracking-[0.25em] text-white/75">
                  QNH Portal
                </p>
                <h1 className="mt-2 text-2xl font-extrabold">Ticket Details</h1>
              </div>
            </div>

            <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
              <div className="rounded-[28px] bg-white p-6 text-center shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
                <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)]">
                  <CircleAlert size={26} />
                </div>
                <h2 className="mt-4 text-lg font-bold text-slate-800">
                  Ticket not found
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  This ticket may have been removed or is unavailable.
                </p>
              </div>
            </div>
          </div>
        </div>

        <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
      </div>
    );
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
              <h1 className="mt-2 text-2xl font-extrabold">Ticket Details</h1>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              {/* Header Card */}
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-xl bg-white/15 px-2.5 py-1 text-xs font-semibold text-white">
                        {ticket.ticket_number || `#${ticket.id}`}
                      </span>

                      <span
                        className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${getStatusClasses(
                          ticket.status,
                        )}`}
                      >
                        {ticket.status || "-"}
                      </span>
                    </div>

                    <h2 className="mt-3 text-lg font-bold leading-7">
                      {ticket.title || "Untitled Ticket"}
                    </h2>

                    <p className="mt-2 text-sm leading-6 text-white/85">
                      {ticket.description || "-"}
                    </p>
                  </div>

                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/15">
                    <Ticket size={22} />
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="mt-6 grid grid-cols-1 gap-4">
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <FileText size={16} />
                    Ticket Information
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Category</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.category || "-"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Type</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.ticket_type_description || "-"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Priority</span>
                      <span
                        className={`rounded-xl px-2.5 py-1 text-xs font-semibold ${getPriorityClasses(
                          ticket.priority,
                        )}`}
                      >
                        {ticket.priority || "-"}
                      </span>
                    </div>
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Subcategory</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.subcategory_name || "-"}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRound size={16} />
                    People
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Requester</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.created_by_name || ticket.created_by || "-"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Assigned To</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.assigned_to_name || ticket.assigned_to || "-"}
                      </span>
                    </div>

                    {ticket.closed_by_name || ticket.closed_by ? (
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Closed By</span>
                        <span className="text-right text-sm font-semibold text-slate-700">
                          {" "}
                          {ticket.closed_by_name || ticket.closed_by}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <CalendarDays size={16} />
                    Dates
                  </div>

                  <div className="space-y-3 text-sm">
                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Created</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.created_at || "-"}
                      </span>
                    </div>

                    <div className="flex items-start justify-between gap-4">
                      <span className="text-slate-500">Due Date</span>
                      <span className="text-right text-sm font-semibold text-slate-700">
                        {" "}
                        {ticket.due_date || "-"}
                      </span>
                    </div>

                    {ticket.closed_at ? (
                      <div className="flex items-start justify-between gap-4">
                        <span className="text-slate-500">Closed At</span>
                        <span className="text-right text-sm font-semibold text-slate-700">
                          {" "}
                          {ticket.closed_at}
                        </span>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              {/* Image Attachments */}
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <ImageIcon size={16} />
                  Images
                </div>

                {imageAttachments.length ? (
                  <div className="space-y-4">
                    {imageAttachments.map((att, index) => {
                      const downloadUrl = getTicketAttachmentDownloadUrl(
                        att.file_url || att.file_path,
                      );

                      return (
                        <motion.a
                          key={att.id}
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(index, 4) * 0.03,
                          }}
                          className="block overflow-hidden rounded-[22px] border border-slate-200 bg-slate-50"
                        >
                          <img
                            src={downloadUrl}
                            alt={att.file_name}
                            className="h-48 w-full object-cover"
                          />

                          <div className="flex items-center justify-between gap-3 p-3">
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {att.file_name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Uploaded by {att.uploaded_by_name || "-"}
                              </p>
                            </div>

                            <div className="rounded-xl bg-[rgb(21,98,160)]/10 px-3 py-2 text-xs font-semibold text-[rgb(21,98,160)]">
                              View
                            </div>
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No images attached</p>
                )}
              </div>

              {/* Other Attachments */}
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <Paperclip size={16} />
                  Other Attachments
                </div>

                {fileAttachments.length ? (
                  <div className="space-y-3">
                    {fileAttachments.map((att, index) => {
                      const downloadUrl = getTicketAttachmentDownloadUrl(
                        att.file_url || att.file_path,
                      );

                      return (
                        <motion.a
                          key={att.id}
                          href={downloadUrl}
                          target="_blank"
                          rel="noreferrer"
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{
                            duration: 0.2,
                            delay: Math.min(index, 4) * 0.03,
                          }}
                          className="flex items-center justify-between gap-3 rounded-[22px] border border-slate-200 bg-slate-50 p-3"
                        >
                          <div className="min-w-0 flex items-center gap-3">
                            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)]">
                              <FileText size={18} />
                            </div>

                            <div className="min-w-0">
                              <p className="truncate text-sm font-medium text-slate-800">
                                {att.file_name}
                              </p>
                              <p className="mt-1 text-xs text-slate-500">
                                Uploaded by {att.uploaded_by_name || "-"}
                              </p>
                            </div>
                          </div>

                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-slate-100 text-slate-500">
                            <Download size={18} />
                          </div>
                        </motion.a>
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No other attachments</p>
                )}
              </div>

              {/* Notes */}
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} />
                  Notes
                </div>

                {ticket.notes?.length ? (
                  <div className="space-y-3">
                    {ticket.notes.map((note, index) => (
                      <motion.div
                        key={note.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(index, 4) * 0.03,
                        }}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-slate-800">
                            {note.created_by_name || note.created_by || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {note.created_at || "-"}
                          </p>
                        </div>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                          {note.note_text || "-"}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No notes available</p>
                )}
              </div>

              {/* History */}
              <div className="mt-6 rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                <div className="mb-3 flex items-center gap-2 text-sm font-semibold text-slate-700">
                  <FileText size={16} />
                  History
                </div>

                {ticket.history?.length ? (
                  <div className="space-y-3">
                    {ticket.history.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.2,
                          delay: Math.min(index, 4) * 0.03,
                        }}
                        className="rounded-[22px] border border-slate-200 bg-slate-50 p-3"
                      >
                        <div className="flex items-center justify-between gap-3">
                          <p className="text-sm font-medium text-slate-800">
                            {item.change_type || "-"}
                          </p>
                          <p className="text-xs text-slate-500">
                            {item.changed_at || "-"}
                          </p>
                        </div>

                        <p className="mt-1 text-xs text-slate-500">
                          By {item.changed_by_name || item.changed_by || "-"}
                        </p>

                        {(item.old_value || item.new_value) && (
                          <div className="mt-2 text-sm text-slate-600">
                            {item.old_value ? (
                              <p>
                                <span className="font-medium text-slate-700">
                                  From:
                                </span>{" "}
                                {item.old_value}
                              </p>
                            ) : null}
                            {item.new_value ? (
                              <p className="mt-1">
                                <span className="font-medium text-slate-700">
                                  To:
                                </span>{" "}
                                {item.new_value}
                              </p>
                            ) : null}
                          </div>
                        )}
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-slate-500">No history available</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <ScrollToTopButton show={showScrollTop} onClick={scrollToTop} />
    </div>
  );
}
