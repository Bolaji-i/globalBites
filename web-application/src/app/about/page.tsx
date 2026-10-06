import Header from '@/components/Header';
import AboutContent from '@/components/AboutContent';
import { auth } from '@/app/api/auth/[...nextauth]/route';

export default async function AboutPage() {
  const session = await auth();
  const isAuthenticated = !!session?.user;

  return (
    <div className="min-h-screen">
      <Header />
      <AboutContent isAuthenticated={isAuthenticated} />
    </div>
  );
}
