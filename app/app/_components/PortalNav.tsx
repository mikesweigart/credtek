"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const ITEMS: { label: string; href: string; icon: string; section?: string }[] = [
  { label: "Dashboard", href: "/app", icon: "▣" },
  { label: "Providers", href: "/app/providers", icon: "◯" },
  { label: "Facilities", href: "/app/facilities", icon: "▢" },
  { label: "Coverage", href: "/app/coverage", icon: "▦" },
  { label: "Expirables", href: "/app/expirables", icon: "⏳" },
  { label: "Follow-ups", href: "/app/followups", icon: "✉" },
  { label: "Templates", href: "/app/templates", icon: "✎", section: "Platform" },
  { label: "Integrations", href: "/app/integrations", icon: "⇄", section: "Platform" },
  { label: "Team", href: "/app/team", icon: "⚇", section: "Workspace admin" },
];

export function PortalNav() {
  const pathname = usePathname() ?? "/app";
  let lastSection: string | undefined;
  return (
    <>
      {ITEMS.map((item) => {
        const active =
          item.href === "/app"
            ? pathname === "/app"
            : pathname.startsWith(item.href);
        const showSection = item.section && item.section !== lastSection;
        if (item.section) lastSection = item.section;
        return (
          <span key={item.href}>
            {showSection && (
              <div className="shell-sb-section shell-sb-section-mid">{item.section}</div>
            )}
            <Link
              href={item.href}
              className={active ? "shell-sb-item active" : "shell-sb-item"}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          </span>
        );
      })}
    </>
  );
}
