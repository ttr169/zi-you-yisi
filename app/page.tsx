import LearningApp from './learning-app';
import { getEmailUser } from './email-auth';
import { redirect } from 'next/navigation';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const user = await getEmailUser();
  if (!user) redirect('/login');
  return <LearningApp userId={user.userId} />;
}
