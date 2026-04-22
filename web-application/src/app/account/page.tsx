import { redirect } from 'next/navigation';
import { auth } from '@/app/api/auth/[...nextauth]/route';
import { findUserById, getFullName } from '@/lib/users';
import UserAccount from '@/components/user-account/UserAccount';
import Header from '@/components/Header';

export default async function AccountPage() {
  const session = await auth();

  // Redirect to sign-in if not authenticated
  if (!session?.user?.id) {
    redirect('/sign-in');
  }

  const dbUser = await findUserById(session.user.id);

  if (!dbUser) {
    redirect('/sign-in');
  }

  const user = {
    id: dbUser.id,
    firstName: dbUser.firstName,
    lastName: dbUser.lastName,
    name: getFullName(dbUser),
    username: dbUser.username || '',
    email: dbUser.email,
    image: dbUser.image || null,
    location: dbUser.location || '',
    bio: dbUser.bio || '',
    website: dbUser.website || '',
    skillLevel: dbUser.skillLevel || '',
    measurementSystem: dbUser.measurementSystem || '',
    language: dbUser.language || '',
    profileVisibility: dbUser.profileVisibility || '',
    showEmail: dbUser.showEmail,
    showLocation: dbUser.showLocation,
    joinedDate: dbUser.createdAt.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
  };

  return (
    <>
      <Header />
      <UserAccount user={user} />
    </>
  );
}
