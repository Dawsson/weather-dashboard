'use client';

import { AuthView } from '@daveyplate/better-auth-ui';
import { cn } from '@repo/ui/lib/utils';
import { useParams } from 'next/navigation';

export default function AuthPage() {
  const { authView } = useParams<{ authView: string }>();

  const small = ['sign-in', 'sign-up', 'forgot-password'];

  const isSignUp = authView === 'sign-up';
  const _isSettings = ['security', 'settings'].includes(authView);

  const cardHeader = () => {
    if (['sign-in', 'sign-up'].includes(authView)) {
      return (
        <div className="space-y-1 text-center">
          <p className="font-bold text-2xl text-white">
            {isSignUp ? 'Create Account' : 'Welcome Back'}
          </p>
          <p className="mt-1 text-muted-foreground">
            {isSignUp
              ? 'Create a new account to get started'
              : 'Sign in to your account to continue'}
          </p>
        </div>
      );
    }

    return;
  };

  return (
    <main
      className={cn(
        'container mx-auto flex min-h-[80vh] flex-col items-center justify-center p-4',
        small.includes(authView) && 'w-full max-w-xl'
      )}
    >
      <AuthView cardHeader={cardHeader()} pathname={authView} searchp />
    </main>
  );
}
