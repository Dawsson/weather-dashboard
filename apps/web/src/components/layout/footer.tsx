import Link from 'next/link';
import { env } from '@/env';

export const Footer = () => {
  return (
    <section className="relative z-10 px-4 py-6 text-center">
      <p className="text-sm text-white/30">
        © {new Date().getFullYear()} {env.NEXT_PUBLIC_HOSTNAME}. A{' '}
        <Link
          className="underline underline-offset-4 hover:no-underline"
          href="https://wip.group"
          target="_blank"
        >
          WIP Group, LLC
        </Link>{' '}
        company.
      </p>
      <div className="mt-2 flex justify-center gap-6 text-white/30">
        <Link
          className="px-2 text-sm text-white/30 underline underline-offset-4 hover:no-underline"
          href="/privacy"
        >
          Privacy Policy
        </Link>
        <Link
          className="px-2 text-sm underline underline-offset-4 hover:no-underline"
          href="/terms"
        >
          Terms of Service
        </Link>
        <Link
          className="px-2 text-sm underline underline-offset-4 hover:no-underline"
          href={"https://wip.group/contact"}
        >
          Contact Us
        </Link>
      </div>
    </section>
  );
};
