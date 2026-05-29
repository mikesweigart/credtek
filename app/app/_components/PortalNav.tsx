"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { label: string; href: string; icon: string }[] = [
  { label: "Dashboard", href: "/app", icon: "▣" },
  { label: "Providers", href: "/app/providers", icon: "◯" },
  { label: "Expirables", href: "/app/expirables", icon: "⏳" },
  { label: "Follow-ups", href: "/app/followups", icon: "✉" },
];

export function PortalNav() {
  const pathname = usePathname() ?? "/app";
  return (
    <>
      {ITEMS.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={active ? "shell-sb-item active" : "shell-sb-item"}
          >
            <span>{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        );
      })}
    </>
  );
}
