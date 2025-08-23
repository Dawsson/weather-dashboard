import { AuthView } from '@daveyplate/better-auth-ui';
import { authViewPaths } from '@daveyplate/better-auth-ui/server';
import { cn } from '@repo/ui/lib/utils';
// import { AuthView } from '@/app/(auth)/auth/[pathname]/view';

export function generateStaticParams() {
  return Object.values(authViewPaths).map((pathname) => ({ pathname }));
}

export default async function AuthPage({
  params,
}: {
  params: Promise<{ authView: string }>;
}) {
  const { authView } = await params;

  const small = ['sign-in', 'sign-up', 'forgot-password'];

  const isSignUp = authView === 'sign-up';
  const isSettings = ['security', 'settings'].includes(authView);

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
      <AuthView cardHeader={cardHeader()} pathname={authView} />
    </main>
  );
}
