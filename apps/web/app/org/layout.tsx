"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useSession } from "next-auth/react";
import { cn } from "../../lib/utils";
import { ThemeToggle } from "../../components/theme-toggle";

const NAV_ITEMS = [
  {
    label: "Dashboard",
    href: "/org/dashboard",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="2" width="7" height="7" rx="1" />
        <rect x="11" y="2" width="7" height="7" rx="1" />
        <rect x="2" y="11" width="7" height="7" rx="1" />
        <rect x="11" y="11" width="7" height="7" rx="1" />
      </svg>
    ),
  },
  {
    label: "Eventos",
    href: "/org/events",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="2" y="3" width="16" height="14" rx="2" />
        <path d="M2 7h16" />
        <path d="M6 1v4M14 1v4" />
      </svg>
    ),
  },
  {
    label: "Órdenes",
    href: "/org/orders",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M4 2h12l2 4H2l2-4z" />
        <rect x="2" y="6" width="16" height="12" rx="1" />
        <path d="M8 10h4" />
      </svg>
    ),
  },
  {
    label: "Ajustes",
    href: "/org/settings",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="10" cy="10" r="3" />
        <path d="M10 1v3M10 16v3M1 10h3M16 10h3M3.5 3.5l2.1 2.1M14.4 14.4l2.1 2.1M3.5 16.5l2.1-2.1M14.4 5.6l2.1-2.1" />
      </svg>
    ),
  },
];

export default function OrgLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session } = useSession();

  return (
    <div className="flex min-h-screen bg-bg text-fg">
      {/* Sidebar */}
      <aside className="sticky top-0 flex h-screen w-[240px] shrink-0 flex-col border-r border-border bg-surface">
        {/* Logo */}
        <div className="flex h-16 items-center px-5">
          <Link href="/" className="font-display text-[22px] font-[850] tracking-[-0.04em] text-fg">
            boletify
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-2">
          {NAV_ITEMS.map((item) => {
            const isActive =
              pathname === item.href || pathname.startsWith(item.href + "/");
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "mb-0.5 flex items-center gap-3 rounded-lg px-3 py-2.5 text-[13px] font-medium uppercase tracking-[0.04em] transition-colors",
                  isActive
                    ? "bg-primary/10 text-primary"
                    : "text-fg-muted hover:bg-surface-raised hover:text-fg"
                )}
              >
                <span className="shrink-0">{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="border-t border-border px-4 py-3">
          <div className="flex items-center justify-between">
            <div className="min-w-0">
              <div className="truncate text-[13px] font-medium text-fg">
                {session?.user?.name || "Organizador"}
              </div>
              <div className="truncate text-[11px] text-fg-muted">
                {session?.user?.email}
              </div>
            </div>
            <ThemeToggle className="ml-2" />
          </div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
