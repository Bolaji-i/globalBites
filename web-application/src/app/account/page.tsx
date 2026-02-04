import { redirect } from 'next/navigation';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import UserAccount from '@/components/user-account/UserAccount';

export default async function AccountPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session) {
    redirect('/sign-in');
  }

  return <UserAccount />;
}
