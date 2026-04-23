import { useEffect, useState, useRef } from "react";
import useClickOutside from "../hooks/useClickOutside";
import {
  ArrowLeft,
  ImagePlus,
  LoaderCircle,
  MessageSquareText,
  UserRoundSearch,
  PlusCircle,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  createAndAssignTicket,
  getAvailableTechnicians,
} from "../services/ticketsApi";
import CreateTicketSkeleton from "../components/CreateTicketSkeleton";

export default function CreateTicketPage() {
  const navigate = useNavigate();
  const [openDropdown, setOpenDropdown] = useState(false);
  const dropdownRef = useRef(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [technician, setTechnician] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [priority, setPriority] = useState("Medium");
  const [openPriority, setOpenPriority] = useState(false);
  const priorityRef = useRef(null);
  const [technicians, setTechnicians] = useState([]);
  const [loadingTechs, setLoadingTechs] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  useClickOutside(dropdownRef, () => setOpenDropdown(false));
  useClickOutside(priorityRef, () => setOpenPriority(false));
  useEffect(() => {
    const loadTechnicians = async () => {
      try {
        setLoadingTechs(true);
        const res = await getAvailableTechnicians("IT Support");
        const techs = res?.data?.technicians || [];
        setTechnicians(Array.isArray(techs) ? techs : []);
      } catch (error) {
        console.error("Failed to load technicians:", error);
        setTechnicians([]);
      } finally {
        setLoadingTechs(false);
      }
    };

    loadTechnicians();
  }, []);

  const handleFileChange = (e) => {
    const file = e.target.files?.[0] || null;
    setImageFile(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    setMessage("");
    setMessageType("");

    if (!title.trim()) {
      setMessage("Title is required");
      setMessageType("error");
      return;
    }

    try {
      setSubmitting(true);

      const data = await createAndAssignTicket({
        title,
        description,
        technicianCode: technician,
        imageFile,
        priority,
      });

      if (!data?.success) {
        throw new Error(data?.message || "Failed to create ticket");
      }

      setMessage(data.message || "Ticket created successfully");
      setMessageType("success");
      setTitle("");
      setDescription("");
      setTechnician("");
      setImageFile(null);

      setTimeout(() => {
        navigate("/tickets/my");
      }, 900);
    } catch (error) {
      setMessage(
        error?.response?.data?.message ||
          error.message ||
          "Failed to create ticket",
      );
      setMessageType("error");
    } finally {
      setSubmitting(false);
    }
  };
  const priorities = ["Low", "Medium", "High", "Critical"];
  const getPriorityStyle = (p) => {
    switch (p) {
      case "Low":
        return "bg-slate-100 text-slate-600";
      case "Medium":
        return "bg-amber-100 text-amber-700";
      case "High":
        return "bg-orange-100 text-orange-700";
      case "Critical":
        return "bg-red-100 text-red-700";
      default:
        return "bg-slate-100 text-slate-600";
    }
  };
  const getPriorityIcon = (p) => {
    switch (p) {
      case "Low":
        return "🟢";
      case "Medium":
        return "🟡";
      case "High":
        return "🟠";
      case "Critical":
        return "🚨";
      default:
        return "";
    }
  };
  if (loadingTechs) {
    return <CreateTicketSkeleton />;
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
              <h1 className="mt-2 text-2xl font-extrabold">Create Ticket</h1>
            </div>
          </div>

          <div className="mt-6 rounded-[32px] border border-white/20 bg-white/12 p-3 shadow-[0_20px_60px_rgba(15,23,42,0.18)] backdrop-blur-xl">
            <div className="rounded-[28px] bg-white p-4 shadow-[0_12px_30px_rgba(15,23,42,0.08)]">
              {/* Top intro */}
              <div className="rounded-[28px] bg-gradient-to-br from-[rgb(21,98,160)] to-[rgb(15,75,125)] p-5 text-white shadow-[0_18px_40px_rgba(21,98,160,0.28)]">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-sm text-white/75">New Request</p>
                    <h2 className="mt-1 text-lg font-bold">
                      Submit your issue quickly
                    </h2>
                    <p className="mt-1 text-sm text-white/80">
                      Fill the title, optionally add details, and attach an
                      image if needed.
                    </p>
                  </div>

                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15">
                    <MessageSquareText size={22} />
                  </div>
                </div>
              </div>

              {/* Form header */}
              <div className="mt-6 mb-4 px-1">
                <p className="text-[11px] font-semibold uppercase tracking-[0.25em] text-[rgb(21,98,160)]/70">
                  Ticket Form
                </p>
                <h2 className="mt-1 text-xl font-semibold text-slate-800">
                  Create Ticket
                </h2>
                <p className="mt-1 text-sm text-slate-500">
                  Title is required. Description and technician are optional
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Title */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MessageSquareText size={16} />
                    Title
                  </label>

                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter short title..."
                    className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[rgb(21,98,160)] focus:bg-white focus:ring-4 focus:ring-[rgb(21,98,160)]/10"
                    required
                  />
                </div>
                {/* Description */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <MessageSquareText size={16} />
                    Description
                  </label>

                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Optional: add more details..."
                    rows={5}
                    className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-[rgb(21,98,160)] focus:bg-white focus:ring-4 focus:ring-[rgb(21,98,160)]/10"
                  />
                </div>

                {/* Technician */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <UserRoundSearch size={16} />
                    Technician (Optional)
                  </label>
                  <div ref={dropdownRef} className="relative">
                    {" "}
                    {/* Selected value */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenDropdown((prev) => !prev);
                      }}
                      disabled={loadingTechs}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800 transition focus:border-[rgb(21,98,160)] focus:ring-4 focus:ring-[rgb(21,98,160)]/10 disabled:opacity-70"
                    >
                      <span className={technician ? "" : "text-slate-400"}>
                        {loadingTechs
                          ? "Loading technicians..."
                          : technician
                            ? technicians.find(
                                (t) =>
                                  (t.USER_CODE || t.username) === technician,
                              )?.USER_NAME || technician
                            : "Assign technician (optional)"}
                      </span>

                      <ChevronRight
                        size={18}
                        className={`transition ${openDropdown ? "rotate-90" : ""}`}
                      />
                    </button>
                    {/* Dropdown list */}
                    {openDropdown && !loadingTechs && (
                      <div className="absolute z-50 mt-2 max-h-60 w-full overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                        {technicians.length === 0 ? (
                          <div className="px-4 py-3 text-sm text-slate-500">
                            No technicians found
                          </div>
                        ) : (
                          technicians.map((tech) => {
                            const value = tech.USER_CODE || tech.username;

                            return (
                              <button
                                key={value}
                                type="button"
                                onClick={() => {
                                  setTechnician(value);
                                  setOpenDropdown(false);
                                }}
                                className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-slate-50 ${
                                  technician === value
                                    ? "bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)] font-semibold"
                                    : "text-slate-700"
                                }`}
                              >
                                <span>{tech.USER_NAME}</span>

                                {technician === value && (
                                  <span className="text-xs">✓</span>
                                )}
                              </button>
                            );
                          })
                        )}
                      </div>
                    )}
                  </div>
                </div>
                {/* Priority */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    Priority (Optional)
                  </label>

                  <div ref={priorityRef} className="relative">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setOpenPriority((prev) => !prev);
                      }}
                      className="flex w-full items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-left text-sm text-slate-800 transition focus:border-[rgb(21,98,160)] focus:ring-4 focus:ring-[rgb(21,98,160)]/10"
                    >
                      <span
                        className={`px-2.5 py-1 rounded-lg text-xs font-semibold ${getPriorityStyle(priority)}`}
                      >
                        {priority}
                      </span>
                      <ChevronRight
                        size={18}
                        className={`transition ${openPriority ? "rotate-90" : ""}`}
                      />
                    </button>

                    {openPriority && (
                      <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-[0_20px_40px_rgba(15,23,42,0.12)]">
                        {priorities.map((p) => (
                          <button
                            key={p}
                            type="button"
                            onClick={() => {
                              setPriority(p);
                              setOpenPriority(false);
                            }}
                            className={`flex w-full items-center justify-between px-4 py-3 text-sm transition hover:bg-slate-50 ${
                              priority === p
                                ? "bg-[rgb(21,98,160)]/10 text-[rgb(21,98,160)] font-semibold"
                                : "text-slate-700"
                            }`}
                          >
                            <div className="flex items-center gap-2">
                              <span>{getPriorityIcon(p)}</span>

                              <span
                                className={`px-2 py-1 rounded-md text-xs font-semibold ${getPriorityStyle(p)}`}
                              >
                                {p}
                              </span>
                            </div>

                            {priority === p && (
                              <span className="text-xs">✓</span>
                            )}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                {/* Optional image */}
                <div className="rounded-[24px] border border-slate-200 bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)]">
                  <label className="mb-2 flex items-center gap-2 text-sm font-semibold text-slate-700">
                    <ImagePlus size={16} />
                    Optional Image
                  </label>

                  <label className="flex cursor-pointer items-center justify-between rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-4 py-4 transition hover:border-[rgb(21,98,160)] hover:bg-slate-50">
                    <div>
                      <p className="text-sm font-medium text-slate-700">
                        {imageFile ? imageFile.name : "Choose image"}
                      </p>
                      <p className="mt-1 text-xs text-slate-500">
                        JPG, PNG, or other image file
                      </p>
                    </div>

                    <div className="rounded-xl bg-[rgb(21,98,160)]/10 px-3 py-2 text-xs font-semibold text-[rgb(21,98,160)]">
                      Browse
                    </div>

                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleFileChange}
                      capture="environment"
                      className="hidden"
                    />
                  </label>
                </div>

                {/* Message */}
                {message && (
                  <div
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium ${
                      messageType === "success"
                        ? "border-green-200 bg-green-50 text-green-700"
                        : "border-red-200 bg-red-50 text-red-700"
                    }`}
                  >
                    {message}
                  </div>
                )}

                {/* Submit */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex w-full items-center justify-center gap-2 rounded-[24px] bg-[rgb(21,98,160)] px-4 py-4 text-sm font-bold text-white shadow-[0_18px_40px_rgba(21,98,160,0.22)] transition hover:bg-[rgb(15,75,125)] disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {submitting ? (
                    <>
                      <LoaderCircle size={18} className="animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <PlusCircle size={18} />
                      Create Ticket
                    </>
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
