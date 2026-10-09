import LearningApp from './learning-app';
import { getChatGPTUser } from './chatgpt-auth';
export const dynamic = 'force-dynamic';
export default async function Home() {
  const user = await getChatGPTUser();
  return <LearningApp userId={user?.userId ?? null} />;
}
