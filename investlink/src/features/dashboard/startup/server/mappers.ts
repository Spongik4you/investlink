import { Prisma } from "@prisma/client";

export const money = (val: Prisma.Decimal | number | null) => {
  const v = val ? Number(val) : 0;
  return "$" + v.toLocaleString();
};

export const initials = (name: string) =>
  name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase();

export function mapKpis(total: number, investors: number, experts: number) {
  return [
    {
      label: "Total Raised",
      value: money(total),
      badge: "+12%",
    },
    {
      label: "Investors",
      value: investors.toString(),
      badge: "+3",
    },
    {
      label: "Experts",
      value: experts.toString(),
      badge: "Active",
    },
  ];
}