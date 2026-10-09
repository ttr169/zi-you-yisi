import { redirect } from 'next/navigation';
import { getEmailUser } from '../email-auth';
import LoginForm from './login-form';
import './login.css';

export const dynamic = 'force-dynamic';

export default async function LoginPage() {
  if (await getEmailUser()) redirect('/');
  return <LoginForm />;
}
