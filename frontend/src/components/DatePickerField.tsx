import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { CalendarBlank, CaretLeft, CaretRight } from "@phosphor-icons/react";

const MONTH_LABELS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

const WEEKDAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function parseIsoDate(value: string) {
  if (!value) return null;

  const [year, month, day] = value.split("-").map(Number);
  if (!year || !month || !day) return null;

  const date = new Date(year, month - 1, day);
  date.setHours(0, 0, 0, 0);
  return Number.isNaN(date.getTime()) ? null : date;
}

function toIsoDate(date: Date) {
  const year = date.getFullYear();
  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function formatDateDisplay(value: string) {
  const date = parseIsoDate(value);
  if (!date) return "mm/dd/yyyy";

  const month = `${date.getMonth() + 1}`.padStart(2, "0");
  const day = `${date.getDate()}`.padStart(2, "0");
  const year = date.getFullYear();
  return `${month}/${day}/${year}`;
}

function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function getCalendarDays(viewDate: Date) {
  const monthStart = new Date(viewDate.getFullYear(), viewDate.getMonth(), 1);
  monthStart.setHours(0, 0, 0, 0);

  const calendarStart = new Date(monthStart);
  calendarStart.setDate(monthStart.getDate() - monthStart.getDay());

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(calendarStart);
    date.setDate(calendarStart.getDate() + index);
    date.setHours(0, 0, 0, 0);

    return {
      date,
      inCurrentMonth: date.getMonth() === viewDate.getMonth(),
    };
  });
}

interface DatePickerFieldProps {
  value: string;
  onChange: (value: string) => void;
  isDark: boolean;
}

export function DatePickerField({
  value,
  onChange,
  isDark,
}: DatePickerFieldProps) {
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const panelRef = useRef<HTMLDivElement | null>(null);
  const selectedDate = parseIsoDate(value);
  const [isOpen, setIsOpen] = useState(false);
  const [panelPosition, setPanelPosition] = useState<{
    top: number;
    left: number;
    width: number;
  } | null>(null);
  const [viewDate, setViewDate] = useState(selectedDate ?? new Date());

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  useEffect(() => {
    if (!isOpen) return;
    setViewDate(selectedDate ?? new Date());
  }, [isOpen, selectedDate]);

  useLayoutEffect(() => {
    if (!isOpen || !triggerRef.current) {
      setPanelPosition(null);
      return;
    }

    const updatePosition = () => {
      if (!triggerRef.current) return;
      const rect = triggerRef.current.getBoundingClientRect();
      const width = Math.max(rect.width, 320);
      const left = Math.min(
        Math.max(16, rect.left),
        window.innerWidth - width - 16,
      );

      setPanelPosition({
        top: rect.bottom + 8,
        left,
        width,
      });
    };

    const handlePointerDown = (event: MouseEvent) => {
      const target = event.target as Node;
      if (
        !panelRef.current?.contains(target) &&
        !triggerRef.current?.contains(target)
      ) {
        setIsOpen(false);
      }
    };

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsOpen(false);
      }
    };

    updatePosition();
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition, true);
    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleEscape);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition, true);
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  const years = Array.from(
    { length: 81 },
    (_, index) => today.getFullYear() - index,
  );
  const days = getCalendarDays(viewDate);

  return (
    <>
      <button
        type="button"
        ref={triggerRef}
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((open) => !open)}
        className={`flex h-11 w-full items-center justify-between gap-3 rounded-xl border px-4 text-left transition-colors ${
          isDark
            ? `border-white/10 bg-white/5 text-white ${
                isOpen
                  ? "border-violet-500/40 ring-1 ring-violet-500/40"
                  : "hover:bg-white/[0.07]"
              }`
            : `border-slate-200 bg-slate-50 text-slate-900 ${
                isOpen
                  ? "border-violet-400 ring-1 ring-violet-200"
                  : "hover:bg-white"
              }`
        }`}
      >
        <span
          className={`truncate ${
            value
              ? isDark
                ? "text-white"
                : "text-slate-900"
              : isDark
                ? "text-slate-500"
                : "text-slate-400"
          }`}
        >
          {formatDateDisplay(value)}
        </span>
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${
            isDark ? "bg-white/5 text-slate-400" : "bg-white text-slate-500"
          }`}
        >
          <CalendarBlank size={16} />
        </span>
      </button>

      {isOpen &&
        panelPosition &&
        typeof document !== "undefined" &&
        createPortal(
          <div
            ref={panelRef}
            style={{
              position: "fixed",
              top: panelPosition.top,
              left: panelPosition.left,
              width: panelPosition.width,
            }}
            className={`z-[80] overflow-hidden rounded-2xl border shadow-2xl ${
              isDark
                ? "border-white/10 bg-slate-950 text-white"
                : "border-slate-200 bg-white text-slate-900"
            }`}
          >
            <div
              className={`flex items-center justify-between gap-3 border-b px-3 py-3 ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}
            >
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() - 1,
                        1,
                      ),
                    )
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CaretLeft size={14} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        viewDate.getMonth() + 1,
                        1,
                      ),
                    )
                  }
                  className={`flex h-8 w-8 items-center justify-center rounded-full transition-colors ${
                    isDark
                      ? "bg-white/5 text-slate-300 hover:bg-white/10"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  <CaretRight size={14} weight="bold" />
                </button>
              </div>

              <div className="flex items-center gap-2">
                <select
                  value={viewDate.getMonth()}
                  onChange={(event) =>
                    setViewDate(
                      new Date(
                        viewDate.getFullYear(),
                        parseInt(event.target.value, 10),
                        1,
                      ),
                    )
                  }
                  className={`h-9 rounded-xl border px-3 text-sm outline-none ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {MONTH_LABELS.map((month, index) => (
                    <option key={month} value={index}>
                      {month}
                    </option>
                  ))}
                </select>
                <select
                  value={viewDate.getFullYear()}
                  onChange={(event) =>
                    setViewDate(
                      new Date(
                        parseInt(event.target.value, 10),
                        viewDate.getMonth(),
                        1,
                      ),
                    )
                  }
                  className={`h-9 rounded-xl border px-3 text-sm outline-none ${
                    isDark
                      ? "border-white/10 bg-white/5 text-white"
                      : "border-slate-200 bg-slate-50 text-slate-900"
                  }`}
                >
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="px-3 py-3">
              <div
                className={`mb-2 grid grid-cols-7 gap-1 text-center text-[11px] font-semibold uppercase ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {WEEKDAY_LABELS.map((label) => (
                  <span key={label} className="py-1">
                    {label}
                  </span>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1">
                {days.map(({ date, inCurrentMonth }) => {
                  const isSelected = selectedDate
                    ? isSameDay(date, selectedDate)
                    : false;
                  const isToday = isSameDay(date, today);
                  const isFuture = date > today;

                  return (
                    <button
                      key={toIsoDate(date)}
                      type="button"
                      disabled={isFuture}
                      onClick={() => {
                        onChange(toIsoDate(date));
                        setIsOpen(false);
                      }}
                      className={`flex h-10 items-center justify-center rounded-xl text-sm transition-colors ${
                        isSelected
                          ? "bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-500/20"
                          : isDark
                            ? "text-slate-200 hover:bg-white/6"
                            : "text-slate-700 hover:bg-slate-100"
                      } ${
                        !inCurrentMonth && !isSelected
                          ? isDark
                            ? "text-slate-600"
                            : "text-slate-400"
                          : ""
                      } ${
                        isToday && !isSelected
                          ? isDark
                            ? "ring-1 ring-violet-500/40"
                            : "ring-1 ring-violet-300"
                          : ""
                      } ${isFuture ? "cursor-not-allowed opacity-35 hover:bg-transparent" : ""}`}
                    >
                      {date.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>

            <div
              className={`flex items-center justify-between gap-3 border-t px-3 py-3 ${
                isDark ? "border-white/10" : "border-slate-100"
              }`}
            >
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setIsOpen(false);
                }}
                className={`rounded-full px-3 py-1.5 text-sm font-medium transition-colors ${
                  isDark
                    ? "bg-white/5 text-slate-300 hover:bg-white/10"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                }`}
              >
                Clear
              </button>
              <span
                className={`text-xs font-medium ${
                  isDark ? "text-slate-500" : "text-slate-400"
                }`}
              >
                {formatDateDisplay(value)}
              </span>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
