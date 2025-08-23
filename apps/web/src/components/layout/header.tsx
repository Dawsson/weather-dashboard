'use client';

import { UserButton } from '@daveyplate/better-auth-ui';
import { Button } from '@repo/ui/components/button';
import { Cloud, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';
import { ThemeSwitcher } from '@/components/theme-switcher';
import { env } from '@/env';

const links = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
];

export default function Header({
  isAuthenticated,
}: {
  isAuthenticated: boolean;
}) {
  return (
    <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto flex h-14 items-center justify-between px-4 sm:container">
        {/* Left: Brand mark */}
        <Link className="group flex items-center gap-3" href="/">
          <div className="relative flex size-9 items-center justify-center rounded-lg bg-gradient-to-br from-sky-400 via-blue-500 to-blue-600 shadow-lg ring-1 ring-white/20 transition-all group-hover:scale-105 group-hover:shadow-xl dark:from-sky-300 dark:via-blue-400 dark:to-blue-500">
            <Cloud
              className="h-5 w-5 text-white drop-shadow-sm"
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 rounded-lg bg-gradient-to-t from-black/10 to-transparent" />
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground text-sm leading-none">
              Weather
            </span>
            <span className="text-muted-foreground text-xs leading-none">
              Dashboard
            </span>
          </div>
        </Link>

        {/* Right: Controls (minimal) */}
        <div className="flex items-center gap-2">
          <ThemeSwitcher />
          {isAuthenticated ? (
            <UserButton
              additionalLinks={[
                {
                  href: '/dashboard',
                  label: 'Dashboard',
                  icon: <LayoutDashboard className="h-4 w-4" />,
                },
              ]}
              align="end"
              size={'icon'}
            />
          ) : (
            <Button asChild size="sm" variant="outline">
              <Link href="/auth/sign-in">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
