"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { Bell, Check, Loader2 } from "lucide-react";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
};

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "just now";
  if (min < 60) return `${min}m ago`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d ago`;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(iso));
}

export function NotificationBell() {
  const router = useRouter();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rolul din URL, pentru linkul "See all": /dashboard/<rol>/notifications
  const role = pathname?.split("/")[2] ?? "startup";

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=8");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
    } catch {
      // Notificările nu trebuie să rupă pagina — eșecul e silențios.
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  // Închide dropdown-ul la click în afară.
  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  async function markAllRead() {
    setUnread(0);
    setItems((prev) => prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })));
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {
      load();
    }
  }

  async function openNotification(n: NotificationItem) {
    setOpen(false);
    if (!n.readAt) {
      setUnread((u) => Math.max(0, u - 1));
      setItems((prev) =>
        prev.map((x) => (x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x)),
      );
      fetch(`/api/notifications/${n.id}`, { method: "PATCH" }).catch(() => {});
    }
    if (n.linkPath) router.push(n.linkPath);
  }

  return (
    <div className="relative" ref={containerRef}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="relative flex h-9 w-9 items-center justify-center rounded-[8px] border border-[#E5E7EB] bg-[#F9FAFB] transition hover:bg-[#F3F4F6]"
        aria-label="Notifications"
      >
        <Bell className="h-4 w-4 text-[#4B5563]" />
        {/* Badge DOAR dacă există necitite — fără punct decorativ permanent. */}
        {unread > 0 && (
          <span className="absolute -right-[3px] -top-[3px] flex h-[17px] min-w-[17px] items-center justify-center rounded-full border-2 border-white bg-[#2563EB] px-[3px] text-[10px] font-bold leading-none text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-[44px] z-50 w-[340px] overflow-hidden rounded-[10px] border border-[#E5E7EB] bg-white shadow-xl">
          <div className="flex items-center justify-between border-b border-[#F1F3F5] px-4 py-[10px]">
            <div className="text-[13px] font-bold text-[#111827]">
              Notifications
            </div>
            {unread > 0 && (
              <button
                onClick={markAllRead}
                className="flex items-center gap-1 text-[11.5px] font-semibold text-[#2563EB] hover:underline"
              >
                <Check className="h-3 w-3" />
                Mark all read
              </button>
            )}
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <Loader2 className="h-4 w-4 animate-spin text-[#9CA3AF]" />
              </div>
            ) : items.length === 0 ? (
              <div className="px-4 py-8 text-center text-[12.5px] text-[#9CA3AF]">
                No notifications yet.
              </div>
            ) : (
              items.map((n) => (
                <button
                  key={n.id}
                  onClick={() => openNotification(n)}
                  className={`flex w-full gap-[10px] border-b border-[#F1F3F5] px-4 py-3 text-left transition last:border-0 hover:bg-[#F9FAFB] ${
                    n.readAt ? "" : "bg-[#F5F8FF]"
                  }`}
                >
                  <span
                    className={`mt-[6px] h-[7px] w-[7px] shrink-0 rounded-full ${
                      n.readAt ? "bg-transparent" : "bg-[#2563EB]"
                    }`}
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[12.5px] font-semibold leading-snug text-[#111827]">
                      {n.title}
                    </span>
                    {n.body && (
                      <span className="mt-[2px] block text-[11.5px] leading-snug text-[#6B7280]">
                        {n.body}
                      </span>
                    )}
                    <span className="mt-[3px] block text-[10.5px] text-[#9CA3AF]">
                      {timeAgo(n.createdAt)}
                    </span>
                  </span>
                </button>
              ))
            )}
          </div>

          <Link
            href={`/dashboard/${role}/notifications`}
            onClick={() => setOpen(false)}
            className="block border-t border-[#F1F3F5] px-4 py-[10px] text-center text-[12px] font-semibold text-[#2563EB] hover:bg-[#F9FAFB]"
          >
            See all notifications
          </Link>
        </div>
      )}
    </div>
  );
}
