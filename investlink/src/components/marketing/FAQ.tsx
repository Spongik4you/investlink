"use client";

import { useState } from "react";

export default function FAQ({
  items,
}: {
  items: { q: string; a: string }[];
}) {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <div className="mx-auto mt-10 max-w-3xl space-y-3">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        return (
          <button
            key={it.q}
            type="button"
            onClick={() => setOpen(isOpen ? null : idx)}
            className="w-full rounded-xl border border-slate-200 bg-white px-5 py-4 text-left shadow-sm"
          >
            <div className="flex items-center justify-between gap-4">
              <div className="text-sm font-semibold">{it.q}</div>
              <div className="text-slate-500">{isOpen ? "▴" : "▾"}</div>
            </div>
            {isOpen ? (
              <div className="mt-3 text-sm text-slate-600">{it.a}</div>
            ) : null}
          </button>
        );
      })}
    </div>
  );
}
