"use client";

import { useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { BellOff, Check, Loader2 } from "lucide-react";

type NotificationItem = {
  id: string;
  type: string;
  title: string;
  body: string | null;
  linkPath: string | null;
  readAt: string | null;
  createdAt: string;
};

function formatWhen(iso: string): string {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(iso));
}

export function NotificationsPageContent() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [items, setItems] = useState<NotificationItem[]>([]);
  const [unread, setUnread] = useState(0);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications?limit=50");
      if (!res.ok) return;
      const data = await res.json();
      setItems(data.notifications ?? []);
      setUnread(data.unreadCount ?? 0);
    } catch {
      // eșec silențios — pagina rămâne utilizabilă
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function markAllRead() {
    setUnread(0);
    setItems((prev) =>
      prev.map((n) => ({ ...n, readAt: n.readAt ?? new Date().toISOString() })),
    );
    try {
      await fetch("/api/notifications", { method: "PATCH" });
    } catch {
      load();
    }
  }

  async function open(n: NotificationItem) {
    if (!n.readAt) {
      setUnread((u) => Math.max(0, u - 1));
      setItems((prev) =>
        prev.map((x) =>
          x.id === n.id ? { ...x, readAt: new Date().toISOString() } : x,
        ),
      );
      fetch(`/api/notifications/${n.id}`, { method: "PATCH" }).catch(() => {});
    }
    if (n.linkPath) router.push(n.linkPath);
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="h-5 w-5 animate-spin text-[#9CA3AF]" />
      </div>
    );
  }

  return (
    <section>
      <div className="mb-4 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 text-[15px] font-bold text-[#1A1D23]">
            All notifications
            {unread > 0 && (
              <span className="rounded-full bg-[#2563EB] px-[8px] py-[1px] text-[11px] font-semibold text-white">
                {unread} new
              </span>
            )}
          </div>
          <div className="text-[12.5px] text-[#9CA3AF]">
            Activity across your collaborations and investor relationships.
          </div>
        </div>
        {unread > 0 && (
          <button
            onClick={markAllRead}
            className="flex items-center gap-[6px] rounded-[7px] border border-[#D1D5DB] px-3 py-[7px] text-[12.5px] font-semibold text-[#6B7280] hover:bg-[#F3F4F6]"
          >
            <Check className="h-[14px] w-[14px]" />
            Mark all read
          </button>
        )}
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[10px] border border-dashed border-[#D1D5DB] bg-[#F9FAFB] px-5 py-12 text-center">
          <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-[#EFF4FF]">
            <BellOff className="h-5 w-5 text-[#2563EB]" />
          </div>
          <div className="mb-1 text-[13.5px] font-semibold text-[#374151]">
            No notifications yet
          </div>
          <p className="max-w-sm text-[12.5px] text-[#9CA3AF]">
            You&apos;ll be notified here when someone sends you a request,
            responds to yours, or ends a collaboration.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[10px] border border-[#E8EBF0] bg-white">
          {items.map((n) => (
            <button
              key={n.id}
              onClick={() => open(n)}
              className={`flex w-full items-start gap-3 border-b border-[#F1F3F5] px-5 py-4 text-left transition last:border-0 hover:bg-[#F9FAFB] ${
                n.readAt ? "" : "bg-[#F5F8FF]"
              }`}
            >
              <span
                className={`mt-[7px] h-2 w-2 shrink-0 rounded-full ${
                  n.readAt ? "bg-transparent" : "bg-[#2563EB]"
                }`}
              />
              <span className="min-w-0 flex-1">
                <span className="block text-[13.5px] font-semibold text-[#111827]">
                  {n.title}
                </span>
                {n.body && (
                  <span className="mt-[2px] block text-[12.5px] text-[#6B7280]">
                    {n.body}
                  </span>
                )}
              </span>
              <span className="shrink-0 text-[11.5px] text-[#9CA3AF]">
                {formatWhen(n.createdAt)}
              </span>
            </button>
          ))}
        </div>
      )}
    </section>
  );
}
