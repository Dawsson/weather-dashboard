import { AccountView } from '@daveyplate/better-auth-ui';
import { accountViewPaths } from '@daveyplate/better-auth-ui/server';

export function generateStaticParams() {
  return Object.values(accountViewPaths).map((accountView) => ({
    accountView,
  }));
}

export default async function AccountPage({
  params,
}: {
  params: Promise<{ accountView: string }>;
}) {
  const { accountView } = await params;
  return (
    <div className="container mx-auto p-4">
      <AccountView
        classNames={{
          card: {
            footer: '!bg-background',
          },
        }}
        hideNav={true}
        pathname={accountView}
      />
    </div>
  );
}
